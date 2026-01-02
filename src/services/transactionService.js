const transactionModel = require('../models/transactionModel');

const getAllTransactions = async () => {
    return await transactionModel.findAll();
};

const getTransactionById = async (id) => {
    return await transactionModel.findById(id);
};

const createTransaction = async (transactionData) => {
    return await transactionModel.create(transactionData);
};

const updateTransaction = async (id, updates) => {
    return await transactionModel.updateById(id, updates);
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
    getSummary
};
