const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const userModel = require('../models/userModel');
const ApiError = require('../middleware/ApiError');

const hashRounds = 12;
const isBcryptHash = /^\$2[aby]\$\d{2}\$/;

const createToken = (userId) => jwt.sign({}, process.env.JWT_KEY, {
  subject: userId,
  expiresIn: '7d',
});

const publicUser = (user) => {
  const result = user.toObject();
  delete result.password;
  return result;
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || !validator.isEmail(email) ||
        typeof password !== 'string' || password.length === 0) {
      throw new ApiError(400, 'Email and password are required');
    }

    const user = await userModel.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const passwordIsHashed = isBcryptHash.test(user.password);
    const passwordMatches = passwordIsHashed
      ? await bcrypt.compare(password, user.password)
      : password === user.password;
    if (!passwordMatches) {
      throw new ApiError(401, 'Invalid credentials');
    }

    if (!passwordIsHashed) {
      user.password = await bcrypt.hash(password, hashRounds);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: publicUser(user),
      token: createToken(user.id),
    });
  } catch (error) {
    next(error);
  }
};

const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 100 ||
        typeof email !== 'string' || !validator.isEmail(email) ||
        typeof password !== 'string' || password.length < 6 || password.length > 128) {
      throw new ApiError(400, 'Provide a valid name, email, and password of at least 6 characters');
    }

    const user = await userModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: await bcrypt.hash(password, hashRounds),
    });

    res.status(201).json({
      success: true,
      message: 'New user created successfully',
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginController, registerController };
