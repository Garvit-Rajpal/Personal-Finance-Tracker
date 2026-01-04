const budgetService = require('../services/budgetService');

exports.getBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.getBudget(req.user.id);
    return res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

exports.setBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.setBudget(req.user.id, req.body);
    return res.status(201).json({
      success: true,
      message: 'Budget set successfully',
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const {id} = req.params;
    const budget = await budgetService.updateBudget(id,req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: budget
    });
  } catch (error) {
    next(error);
  }
};