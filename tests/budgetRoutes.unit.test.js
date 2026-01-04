const { describe, it, afterEach } = require('node:test');
const assert = require('assert');
const budgetController = require('../src/controllers/budgetController');
const budgetService = require('../src/services/budgetService');
const { NotFoundError, ValidationError } = require('../src/utils/errorClasses');

const makeRes = () => {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; }
  };
};

const user = { id: 'user-1' };
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

describe('budgetController (unit, mocked DB)', () => {
  describe('getBudget', () => {
    it('returns budgets for user', async () => {
      const res = makeRes();
      const budgets = [{ id: 'b1', category: 'Food', amount: 200 }];
      stub(budgetService, 'getBudget', async (uid) => {
        assert.strictEqual(uid, user.id);
        return budgets;
      });

      await budgetController.getBudget({ user }, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.data, budgets);
    });

    it('sends NotFoundError to next', async () => {
      const res = makeRes();
      const err = new NotFoundError('no budget');
      stub(budgetService, 'getBudget', async () => { throw err; });

      let received;
      await budgetController.getBudget({ user }, res, (e) => { received = e; });

      assert.strictEqual(received, err);
    });
  });

  describe('setBudget', () => {
    it('creates budget for user', async () => {
      const res = makeRes();
      const body = { category: 'Food', amount: 300, period: 'monthly' };
      const created = { id: 'b1', ...body };
      stub(budgetService, 'setBudget', async (uid, payload) => {
        assert.strictEqual(uid, user.id);
        assert.deepStrictEqual(payload, body);
        return created;
      });

      await budgetController.setBudget({ user, body }, res, () => {});

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.message, 'Budget set successfully');
      assert.deepStrictEqual(res.body.data, created);
    });

    it('handles validation errors', async () => {
      const res = makeRes();
      const err = new ValidationError('invalid');
      stub(budgetService, 'setBudget', async () => { throw err; });

      let received;
      await budgetController.setBudget({ user, body: {} }, res, (e) => { received = e; });

      assert.strictEqual(received, err);
    });
  });

  describe('updateBudget', () => {
    it('updates a budget', async () => {
      const res = makeRes();
      const body = { amount: 500 };
      const updated = { id: 'b1', ...body };
      stub(budgetService, 'updateBudget', async (id, uid, payload) => {
        assert.strictEqual(id, 'b1');
        assert.strictEqual(uid, user.id);
        assert.deepStrictEqual(payload, body);
        return updated;
      });

      await budgetController.updateBudget({ params: { id: 'b1' }, user, body }, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.message, 'Budget updated successfully');
      assert.deepStrictEqual(res.body.data, updated);
    });

    it('bubbles NotFoundError', async () => {
      const res = makeRes();
      const err = new NotFoundError('missing');
      stub(budgetService, 'updateBudget', async () => { throw err; });

      let received;
      await budgetController.updateBudget({ params: { id: 'none' }, user, body: {} }, res, (e) => { received = e; });

      assert.strictEqual(received, err);
    });
  });
});
