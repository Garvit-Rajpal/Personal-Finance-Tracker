const userService = require('../services/userService');
const analyticsService = require('../services/analyticService');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        savingTarget: user.savingTarget
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.savingTarget = async (req, res, next) => {
  try {
    const { savingTarget } = req.body;
    const userId = req.user.id;
    const updatedUser = await userService.updateSavingTarget(userId, savingTarget);
    res.status(200).json({
      success: true,
      message: 'Saving target updated successfully',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        savingTarget: updatedUser.savingTarget
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req,res,next)=>{
  try{
    const userId=req.user.id;
    const analytics=await analyticsService.getUserAnalytics(userId);
    res.status(200).json({
      success:true,
      data:analytics
    });
  } catch (error) {
    next(error);    
  }
};
