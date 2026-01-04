const budgetModel = require('../models/budgetModel');
const { ValidationError,NotFoundError } = require('../utils/errorClasses');

const getBudget =async(userId)=>{
    const budget = await budgetModel.findByUserId(userId);
    if(!budget){
        throw new NotFoundError('Budget not found for the user');
    }
    return budget;
}
const setBudget = async(userId,budgetData)=>{
    if(!budgetData.amount || budgetData.amount < 0||!budgetData.category||!budgetData.period || (budgetData.period !=='monthly' && budgetData.period !=='yearly')){
        throw new ValidationError('Invalid budget data');
    }
    const existingBudget = await budgetModel.findByCategoryAndUserId(budgetData.category,userId);
    if(existingBudget){
        throw new ValidationError('Budget already set for the user. Use update instead.');
    }
    
    const budget = {
        ...budgetData,
        userId
    }
    return await budgetModel.create(budget);
}

const updateBudget = async(id,userId,updates)=>{
    const budget = await budgetModel.findByIdAndUserId(id,userId);
    if(!budget){
        throw new NotFoundError('Budget not found for the user');
    }
    if(updates.amount !== undefined && updates.amount < 0){
        throw new ValidationError('Invalid amount');
    }
    return await budgetModel.updateByUserId(id,userId,updates);
}

module.exports = {
    getBudget,
    setBudget,
    updateBudget
};