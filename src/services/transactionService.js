const transactionModel = require('../models/transactionModel');
const { NotFoundError } = require('../utils/errorClasses');

const getAllTransactions = async () => {
    return await transactionModel.findAll();
};

const getTransactionById = async (id) => {
    const transaction = await transactionModel.findById(id);
    if (!transaction) {
        throw new NotFoundError(`Transaction with id ${id} not found`);
    }
    return transaction;
};

const createTransaction = async (transactionData) => {
    return await transactionModel.create(transactionData);
};

const updateTransaction = async (id, updates) => {
    const transaction = await transactionModel.updateById(id, updates);
    if (!transaction) {
        throw new NotFoundError(`Transaction with id ${id} not found`);
    }
    return transaction;
};

const deleteTransaction = async (id) => {
    const transaction = await transactionModel.deleteById(id);
    if (!transaction) {
        throw new NotFoundError(`Transaction with id ${id} not found`);
    }
    return transaction;
};

const getSummary = async () => {
    const transactions = await transactionModel.readTransactions();
    
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
