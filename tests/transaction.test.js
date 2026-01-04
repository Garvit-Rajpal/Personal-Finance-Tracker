const assert = require('assert');
const path = require('path');
const fs = require('fs').promises;
const transactionService = require('../services/transactionService');
const transactionModel = require('../models/transactionModel');
const { ValidationError, NotFoundError } = require('../utils/errorClasses');

const TEST_DB_PATH = path.join(__dirname, '../data/test-transactions.json');

// Mock setup and teardown
async function setupTestDB() {
    await fs.writeFile(TEST_DB_PATH, JSON.stringify([]), 'utf-8');
}

async function cleanupTestDB() {
    try {
        await fs.unlink(TEST_DB_PATH);
    } catch (error) {
        // File doesn't exist, that's okay
    }
}

// Helper to override the DB path temporarily
function mockDBPath(testDbPath) {
    const originalFn = transactionModel.readTransactions;
    const config = require('../config');
    
    return {
        restore: () => {
            transactionModel.readTransactions = originalFn;
        }
    };
}

describe('Transaction Service Tests', () => {
    
    describe('createTransaction', () => {
        test('should create a new transaction with valid data', async () => {
            const transactionData = {
                type: 'income',
                category: 'Salary',
                amount: 5000,
                date: '2025-01-01'
            };
            
            const result = await transactionService.createTransaction(transactionData);
            
            assert.strictEqual(result.type, 'income');
            assert.strictEqual(result.category, 'Salary');
            assert.strictEqual(result.amount, 5000);
            assert(result.id, 'Transaction should have an id');
            assert(result.createdAt, 'Transaction should have a createdAt timestamp');
        });

        test('should reject transactions with invalid type', async () => {
            const transactionData = {
                type: 'invalid',
                category: 'Test',
                amount: 100,
                date: '2025-01-01'
            };
            
            try {
                await transactionService.createTransaction(transactionData);
                assert.fail('Should have thrown an error');
            } catch (error) {
                assert(error instanceof ValidationError || error.statusCode === 400);
            }
        });

        test('should reject negative amounts', async () => {
            const transactionData = {
                type: 'expense',
                category: 'Food',
                amount: -50,
                date: '2025-01-01'
            };
            
            try {
                await transactionService.createTransaction(transactionData);
                assert.fail('Should have thrown an error');
            } catch (error) {
                assert(error instanceof ValidationError || error.statusCode === 400);
            }
        });
    });

    describe('getTransactionById', () => {
        test('should retrieve a transaction by id', async () => {
            const transactionData = {
                type: 'expense',
                category: 'Groceries',
                amount: 150,
                date: '2025-01-01'
            };
            
            const created = await transactionService.createTransaction(transactionData);
            const retrieved = await transactionService.getTransactionById(created.id);
            
            assert.strictEqual(retrieved.id, created.id);
            assert.strictEqual(retrieved.type, 'expense');
            assert.strictEqual(retrieved.amount, 150);
        });

        test('should throw NotFoundError for non-existent transaction', async () => {
            try {
                await transactionService.getTransactionById('non-existent-id');
                assert.fail('Should have thrown NotFoundError');
            } catch (error) {
                assert(error instanceof NotFoundError || error.statusCode === 404);
            }
        });
    });

    describe('updateTransaction', () => {
        test('should update a transaction', async () => {
            const transactionData = {
                type: 'income',
                category: 'Bonus',
                amount: 1000,
                date: '2025-01-01'
            };
            
            const created = await transactionService.createTransaction(transactionData);
            const updated = await transactionService.updateTransaction(created.id, {
                amount: 1500,
                category: 'Salary Bonus'
            });
            
            assert.strictEqual(updated.amount, 1500);
            assert.strictEqual(updated.category, 'Salary Bonus');
            assert.strictEqual(updated.id, created.id);
            assert(updated.updatedAt, 'Updated transaction should have updatedAt timestamp');
        });

        test('should throw NotFoundError when updating non-existent transaction', async () => {
            try {
                await transactionService.updateTransaction('non-existent', { amount: 100 });
                assert.fail('Should have thrown NotFoundError');
            } catch (error) {
                assert(error instanceof NotFoundError || error.statusCode === 404);
            }
        });
    });

    describe('getSummary', () => {
        test('should calculate income and expense summary', async () => {
            // Create some transactions
            await transactionService.createTransaction({
                type: 'income',
                category: 'Salary',
                amount: 5000,
                date: '2025-01-01'
            });

            await transactionService.createTransaction({
                type: 'expense',
                category: 'Rent',
                amount: 1000,
                date: '2025-01-01'
            });

            await transactionService.createTransaction({
                type: 'expense',
                category: 'Food',
                amount: 300,
                date: '2025-01-01'
            });

            const summary = await transactionService.getSummary();

            assert.strictEqual(summary.totalIncome, 5000);
            assert.strictEqual(summary.totalExpense, 1300);
            assert.strictEqual(summary.netBalance, 3700);
            assert(Array.isArray(summary.transactions.income));
            assert(Array.isArray(summary.transactions.expense));
        });

        test('should return zero values for empty transactions', async () => {
            const summary = await transactionService.getSummary();

            assert.strictEqual(summary.totalIncome, 0);
            assert.strictEqual(summary.totalExpense, 0);
            assert.strictEqual(summary.netBalance, 0);
        });
    });

    describe('getAllTransactions', () => {
        test('should return all transactions', async () => {
            const transaction1 = await transactionService.createTransaction({
                type: 'income',
                category: 'Freelance',
                amount: 800,
                date: '2025-01-01'
            });

            const transaction2 = await transactionService.createTransaction({
                type: 'expense',
                category: 'Utilities',
                amount: 200,
                date: '2025-01-01'
            });

            const all = await transactionService.getAllTransactions();

            assert(Array.isArray(all));
            assert(all.length >= 2);
        });
    });
});

// Simple test runner
async function runTests() {
    console.log('Running Transaction Service Tests...\n');
    
    const tests = {
        createTransaction: [],
        getTransactionById: [],
        updateTransaction: [],
        getSummary: [],
        getAllTransactions: []
    };

    let passCount = 0;
    let failCount = 0;

    for (const [suite, suiteName] of Object.entries(tests)) {
        console.log(`\n${suiteName} Tests:`);
    }

    console.log('\n✓ Tests completed');
    console.log(`Passed: ${passCount}, Failed: ${failCount}`);
}

// Run tests if executed directly
if (require.main === module) {
    runTests().catch(error => {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = { setupTestDB, cleanupTestDB };
