const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('assert');
const transactionController = require('../src/controllers/transactionController');
const transactionService = require('../src/services/transactionService');
const { NotFoundError } = require('../src/utils/errorClasses');

const makeRes = () => {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
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

describe('transactionController (unit, mocked DB)', () => {
  describe('getAllTransactions', () => {
    it('returns user scoped transactions', async () => {
      const res = makeRes();
      const fakeTx = [{ id: 't1', userId: user.id }];
      stub(transactionService, 'getAllTransactions', async (uid) => {
        assert.strictEqual(uid, user.id);
        return fakeTx;
      });

      await transactionController.getAllTransactions({ user }, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.data, fakeTx);
    });
  });

  describe('getTransactionById', () => {
    it('returns transaction when found', async () => {
      const res = makeRes();
      const tx = { id: 't123', userId: user.id };
      stub(transactionService, 'getTransactionById', async (id, uid) => {
        assert.strictEqual(id, 't123');
        assert.strictEqual(uid, user.id);
        return tx;
      });

      await transactionController.getTransactionById({ params: { id: 't123' }, user }, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.data, tx);
    });

    it('passes NotFoundError to next when missing', async () => {
      const res = makeRes();
      const err = new NotFoundError('missing');
      stub(transactionService, 'getTransactionById', async () => { throw err; });

      let received;
      await transactionController.getTransactionById({ params: { id: 'nope' }, user }, res, (e) => { received = e; });

      assert.strictEqual(received, err);
    });
  });

  describe('createTransaction', () => {
    it('creates transaction for user', async () => {
      const res = makeRes();
      const req = { user, body: { type: 'income', amount: 100 } };
      const created = { id: 'new', ...req.body, userId: user.id };
      stub(transactionService, 'createTransaction', async (r) => {
        assert.strictEqual(r.user.id, user.id);
        assert.strictEqual(r.body.type, 'income');
        return created;
      });

      await transactionController.createTransaction(req, res, () => {});

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.message, 'Transaction created successfully');
      assert.deepStrictEqual(res.body.data, created);
    });
  });

  describe('updateTransaction', () => {
    it('updates when found', async () => {
      const res = makeRes();
      const updates = { amount: 50 };
      const updated = { id: 't1', ...updates };
      stub(transactionService, 'updateTransaction', async (id, uid, body) => {
        assert.strictEqual(id, 't1');
        assert.strictEqual(uid, user.id);
        assert.strictEqual(body.amount, 50);
        return updated;
      });

      await transactionController.updateTransaction({ params: { id: 't1' }, user, body: updates }, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.message, 'Transaction updated successfully');
      assert.deepStrictEqual(res.body.data, updated);
    });

    it('bubbles NotFoundError', async () => {
      const res = makeRes();
      const err = new NotFoundError('no tx');
      stub(transactionService, 'updateTransaction', async () => { throw err; });

      let received;
      await transactionController.updateTransaction({ params: { id: 'x' }, user, body: {} }, res, (e) => { received = e; });

      assert.strictEqual(received, err);
    });
  });

  describe('deleteTransaction', () => {
    it('deletes when found', async () => {
      const res = makeRes();
      stub(transactionService, 'deleteTransaction', async (id, uid) => {
        assert.strictEqual(id, 't1');
        assert.strictEqual(uid, user.id);
        return { acknowledged: true };
      });

      await transactionController.deleteTransaction({ params: { id: 't1' }, user }, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.message, 'Transaction deleted successfully');
    });
  });

  describe('getSummary', () => {
    it('returns summary for user', async () => {
      const res = makeRes();
      const summary = { totalIncome: 10, totalExpense: 5, netBalance: 5 };
      stub(transactionService, 'getSummary', async (uid) => {
        assert.strictEqual(uid, user.id);
        return summary;
      });

      await transactionController.getSummary({ user }, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.data, summary);
    });
  });
});
