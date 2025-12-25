const userModel = require('../models/userModel');

exports.getAllUsers = async () => {
    return await userModel.findAll();
};
