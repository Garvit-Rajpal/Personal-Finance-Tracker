const { describe, it, afterEach } = require('node:test');
const assert = require('assert');
const userController = require('../src/controllers/userController');
const userService = require('../src/services/userService');
const analyticsService = require('../src/services/analyticService');
const { ValidationError } = require('../src/utils/errorClasses');

const makeRes = () => ({
  statusCode: 200,
  body: null,
  status(code) { this.statusCode = code; return this; },
  json(payload) { this.body = payload; return this; }
});

const restoreFns = [];
const stub = (obj, key, impl) => {
  const original = obj[key];
  obj[key] = impl;
  restoreFns.push(() => { obj[key] = original; });
};

afterEach(() => {
  while (restoreFns.length) {
    const restore = restoreFns.pop();
    restore();
  }
});

describe('userController (unit, mocked DB)', () => {
  describe('register', () => {
    it('registers user and returns public fields', async () => {
      const res = makeRes();
      const body = { email: 'a@test.com', password: 'Passw0rd!', name: 'A' };
      const saved = { id: 'u1', email: body.email, name: body.name, savingTarget: 0 };
      stub(userService, 'registerUser', async (payload) => {
        assert.deepStrictEqual(payload, body);
        return saved;
      });

      await userController.register({ body }, res, () => {});

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.message, 'User registered successfully');
      assert.deepStrictEqual(res.body.data, saved);
    });

    it('forwards validation errors', async () => {
      const res = makeRes();
      const err = new ValidationError('bad');
      stub(userService, 'registerUser', async () => { throw err; });

      let received;
      await userController.register({ body: {} }, res, (e) => { received = e; });

      assert.strictEqual(received, err);
    });
  });

  describe('login', () => {
    it('returns token on success', async () => {
      const res = makeRes();
      const body = { email: 'a@test.com', password: 'secret' };
      const tokenResp = { token: 'jwt' };
      stub(userService, 'loginUser', async (email, password) => {
        assert.strictEqual(email, body.email);
        assert.strictEqual(password, body.password);
        return tokenResp;
      });

      await userController.login({ body }, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.message, 'Login successful');
      assert.deepStrictEqual(res.body.data, tokenResp);
    });
  });

  describe('getAllUsers', () => {
    it('returns all users', async () => {
      const res = makeRes();
      const users = [{ id: 'u1' }];
      stub(userService, 'getAllUsers', async () => users);

      await userController.getAllUsers({}, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.data, users);
    });
  });

  describe('savingTarget', () => {
    it('updates saving target for user', async () => {
      const res = makeRes();
      const req = { user: { id: 'u1' }, body: { savingTarget: 1000 } };
      const updated = { id: 'u1', email: 'a@test.com', name: 'A', savingTarget: 1000 };
      stub(userService, 'updateSavingTarget', async (uid, target) => {
        assert.strictEqual(uid, req.user.id);
        assert.strictEqual(target, 1000);
        return updated;
      });

      await userController.savingTarget(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.message, 'Saving target updated successfully');
      assert.deepStrictEqual(res.body.data, updated);
    });
  });

  describe('getAnalytics', () => {
    it('returns analytics payload', async () => {
      const res = makeRes();
      const req = { user: { id: 'u1' } };
      const analytics = { summary: {}, savingsProgress: {}, budgetStatus: {} };
      stub(analyticsService, 'getUserAnalytics', async (uid) => {
        assert.strictEqual(uid, req.user.id);
        return analytics;
      });

      await userController.getAnalytics(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.data, analytics);
    });
  });
});
