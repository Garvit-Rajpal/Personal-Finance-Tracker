const userModel = require('../models/userModel');
const { ValidationError, ConflictError, NotFoundError } = require('../utils/errorClasses');

const getAllUsers = async () => {
    return await userModel.findAll();
};

const registerUser = async (userData) => {
    const { email, password, name } = userData;

    if (!email || !password || !name) {
        throw new ValidationError('Email, password, and name are required');
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
        throw new ConflictError('User with this email already exists');
    }

   
    return await userModel.create({ email, password, name });
};

const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new ValidationError('Email and password are required');
    }

    const user = await userModel.findByEmail(email);
    if (!user || user.password !== password) {
        throw new ValidationError('Invalid email or password');
    }


    const mockToken = `mock-jwt-token-${Buffer.from(user.email).toString('base64')}.${Date.now()}`;
    
    return {
        user: {
            id: user._id,
            email: user.email,
            name: user.name
        },
        token: mockToken
    };
};

module.exports = {
    getAllUsers,
    registerUser,
    loginUser
};
