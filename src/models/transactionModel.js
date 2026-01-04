const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
        ref: 'User',
        index: true
    },
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


transactionSchema.statics.findAll = function(userId) {

    return this.find({ userId });
};

transactionSchema.statics.findByIdForUser = function(id, userId) {
    return this.findOne({ _id: id, userId });
};

transactionSchema.statics.create = function(transactionData) {
    const transaction = new this(transactionData);
    return transaction.save();
};

transactionSchema.statics.updateByIdForUser = function(id,userId, updates) {
    return this.findOneAndUpdate(
        { _id: id ,userId},
        { ...updates, updatedAt: Date.now() },
        { new: true }
    );
};

transactionSchema.statics.deleteByIdForUser = function(id,userId) {
    return this.findOneAndDelete({ _id: id ,userId});
};

// For summary calculation


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
