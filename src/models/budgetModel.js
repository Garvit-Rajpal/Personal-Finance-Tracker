const mongoose = require('mongoose');

const budgetSchema =new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User Id is required'],
        ref: 'User',
        index: true
    },
    category:{
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be positive']
    },
    period: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: [true, 'Period is required']
    }
})

budgetSchema.statics.findByUserId = function(userId) {
    return this.find({ userId });
};

budgetSchema.statics.create = function(budgetData) {
    const budget = new this(budgetData);
    return budget.save();
};
budgetSchema.statics.updateByUserId = function(id,userId, updates) {
    return this.findOneAndUpdate( { _id: id ,userId},
        { ...updates, updatedAt: Date.now() },
        { new: true }
    );
};
budgetSchema.statics.findByCategoryAndUserId = function(category,userId){
    return this.findOne({ category ,userId});
}
budgetSchema.statics.findByIdAndUserId = function(id,userId){
    return this.findOne({ _id: id ,userId});
};

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;