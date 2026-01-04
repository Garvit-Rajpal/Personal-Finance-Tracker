// src/services/analyticsService.js
const transactionService = require('./transactionService');
const budgetService = require('./budgetService');
const userModel = require('../models/userModel');

const buildExpenseByCategory = (expenses) => {
  return expenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});
};

const getUserAnalytics = async (userId) => {
  // 1) Transactions summary (income/expense/balance)
  const summary = await transactionService.getSummary(userId);

  // 2) Savings target progress
  const user = await userModel.findById(userId);
  const savingTarget = user?.savingTarget ?? 0;
  const savingsProgress = savingTarget > 0
    ? {
        target: savingTarget,
        balance: summary.netBalance,
        percentOfTarget: (summary.netBalance / savingTarget) * 100,
        remainingToTarget: Math.max(savingTarget - summary.netBalance, 0)
      }
    : {
        target: 0,
        balance: summary.netBalance,
        percentOfTarget: null,
        remainingToTarget: null
      };

  // 3) Budget vs expense per category
  //    - Get budgets for this user (array)
  //    - Map expenses by category
  //    - Compare spend vs budget
  let budgets = [];
  try {
    budgets = await budgetService.getBudget(userId); // returns array or throws NotFoundError
  } catch (err) {
    if (err.name !== 'NotFoundError') throw err; // propagate other errors
    budgets = []; // no budgets set, keep empty
  }

  const expenseByCategory = buildExpenseByCategory(summary.transactions.expense);

  const budgetStatus = budgets.reduce((acc, budget) => {
    const spent = expenseByCategory[budget.category] || 0;
    const exceeded = spent > budget.amount;
    acc[budget.category] = {
      budgetAmount: budget.amount,
      period: budget.period, // monthly/yearly as stored
      spent,
      remaining: Math.max(budget.amount - spent, 0),
      exceeded
    };
    return acc;
  }, {});

  return {
    summary,          // totals + lists of income/expense
    savingsProgress,  // target, percentOfTarget, remainingToTarget
    budgetStatus      // keyed by category with spent/budget/exceeded info
  };
};

module.exports = { getUserAnalytics };