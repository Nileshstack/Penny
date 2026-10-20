const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const ApiError = require('./ApiError');

const requireAuth = async (req, res, next) => {
  try {
    const authorization = req.get('authorization') || '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new ApiError(401, 'Authentication required');
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
    const user = await userModel.findById(payload.sub).select('_id');
    if (!user) {
      throw new ApiError(401, 'Authentication required');
    }

    req.user = { id: user.id };
    return next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Authentication required'));
    }
    return next(error);
  }
};

module.exports = requireAuth;
