const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    savingTarget:{
        type: Number,
        default: 0,
        min: [0, 'Saving target must be positive']
    }
});

// Static methods to maintain compatibility with existing service layer
userSchema.statics.findAll = function() {
    return this.find();
};

userSchema.statics.findById = function(id) {
    return this.findOne({ _id: id });
};

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email });
};

userSchema.statics.create = function(userData) {
    const user = new this(userData);
    return user.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
