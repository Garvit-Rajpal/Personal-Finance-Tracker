const fs = require('fs').promises;
const path = require('path');
const { NotFoundError } = require('../utils/errorClasses');
const config = require('../config');

const DB_PATH = path.join(__dirname, '../../', config.TRANSACTIONS_DB_PATH);

const readTransactions = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

const writeTransactions = async (transactions) => {
    await fs.writeFile(DB_PATH, JSON.stringify(transactions, null, 2), 'utf-8');
};

const findAll = async () => {
    return await readTransactions();
};

const findById = async (id) => {
    const transactions = await readTransactions();
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
        throw new NotFoundError(`Transaction with id ${id} not found`);
    }
    
    return transaction;
};

const create = async (transactionData) => {
    const transactions = await readTransactions();
    
    const newTransaction = {
        id: Date.now().toString(),
        ...transactionData,
        createdAt: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    await writeTransactions(transactions);
    
    return newTransaction;
};

const updateById = async (id, updates) => {
    const transactions = await readTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
        throw new NotFoundError(`Transaction with id ${id} not found`);
    }
    
    const updatedTransaction = {
        ...transactions[index],
        ...updates,
        id: transactions[index].id,
        createdAt: transactions[index].createdAt,
        updatedAt: new Date().toISOString()
    };
    
    transactions[index] = updatedTransaction;
    await writeTransactions(transactions);
    
    return updatedTransaction;
};

module.exports = { findAll, findById, create, updateById, readTransactions };
