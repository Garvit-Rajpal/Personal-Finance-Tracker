const transactionModel = require('../models/transactionModel');
const { NotFoundError } = require('../utils/errorClasses');

const getAllTransactions = async (userId) => {
    return await transactionModel.findAll(userId);
};

const createTransaction = async (transactionData) => {
    const transaction = {
        ...transactionData.body,
        userId: transactionData.user.id
    }
    return await transactionModel.create(transaction);
};

const getTransactionById = async (id, userId) => {
    const transaction = await transactionModel.findByIdForUser(id, userId);
    if (!transaction) throw new NotFoundError(`Transaction with id ${id} not found`);
    return transaction;
};

const updateTransaction = async (id, userId, updates) => {
    const transaction = await transactionModel.updateByIdForUser(id, userId, updates);
    if (!transaction) throw new NotFoundError(`Transaction with id ${id} not found`);
    return transaction;
};

const deleteTransaction = async (id, userId) => {
    const transaction = await transactionModel.deleteByIdForUser(id, userId);
    if (!transaction) throw new NotFoundError(`Transaction with id ${id} not found`);
    return transaction;
};

const getSummary = async (userId) => {
    
    const transactions = await transactionModel.findAll(userId);
    
    const summary = {
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        transactions: {
            income: [],
            expense: []
        }
    };

    transactions.forEach(t => {
        if (t.type === 'income') {
            summary.totalIncome += t.amount;
            summary.transactions.income.push(t);
        } else if (t.type === 'expense') {
            summary.totalExpense += t.amount;
            summary.transactions.expense.push(t);
        }
    });

    summary.netBalance = summary.totalIncome - summary.totalExpense;

    return summary;
};

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary
};
