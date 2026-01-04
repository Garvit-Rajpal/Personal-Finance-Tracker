const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Type is required'],
        enum: ['income', 'expense']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be positive']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});


transactionSchema.statics.findAll = function() {
    return this.find();
};

transactionSchema.statics.findById = function(id) {
    return this.findOne({ _id: id });
};

transactionSchema.statics.create = function(transactionData) {
    const transaction = new this(transactionData);
    return transaction.save();
};

transactionSchema.statics.updateById = function(id, updates) {
    return this.findOneAndUpdate(
        { _id: id },
        { ...updates, updatedAt: Date.now() },
        { new: true }
    );
};

transactionSchema.statics.deleteById = function(id) {
    return this.findOneAndDelete({ _id: id });
};

// For summary calculation
transactionSchema.statics.readTransactions = function() {
    return this.find();
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
