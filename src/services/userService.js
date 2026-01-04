const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  ValidationError,
  ConflictError,
  NotFoundError,
} = require("../utils/errorClasses");
const emailRegex = /^\S+@\S+\.\S+$/;
const commonPasswords = new Set([
  "password",
  "123456",
  "12345678",
  "qwerty",
  "abc123",
  "password1",
  "iloveyou",
  "admin",
]);

const validatePassword = (password) => {
  if (typeof password !== "string") return "Password must be a string";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 128) return "Password is too long";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password))
    return "Password must contain at least one special character";
  if (/\s/.test(password)) return "Password must not contain spaces";
  if (commonPasswords.has(password.toLowerCase()))
    return "Password is too common";
  return null;
};

const getAllUsers = async () => {
  return await userModel.findAll();
};

const registerUser = async (userData) => {
  const { email, password, name } = userData;

  if (!email || !password || !name) {
    throw new ValidationError("Email, password, and name are required");
  }
  const testEmail = emailRegex.test(email);

  if (!testEmail) {
    throw new ValidationError("Invalid email format");
  }
  const pwdError = validatePassword(password);
  if (pwdError) {
    throw new ValidationError(pwdError);
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }
  const saltRounds = Number(process.env.SALT_ROUND) || 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = {
    name: name,
    email: email,
    password: hashedPassword,
  };

  return await userModel.create(newUser);
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new NotFoundError("User Not Found");
  }
  const isMatch = await bcrypt.compare(password,user.password);
  if (!isMatch) {
    throw new ValidationError("Invalid email or password");
  }
  const JWT_SECRET=process.env.JWT_SECRET||"secret";
  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name, savingTarget: user.savingTarget },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token:token
  };
};

const updateSavingTarget = async (userId, savingTarget) => {
  if (savingTarget === undefined || typeof savingTarget !== "number" || savingTarget < 0) {
    throw new ValidationError("Invalid saving target");
  }

  const user = await userModel.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  user.savingTarget = savingTarget;
  await user.save();

  return user;
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  updateSavingTarget
};
