const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const validateToken = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Get the token from the header
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded.user.id).select('-password'); // Get user without password
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized');
  }
});

// Middleware to check if user is admin
const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, proceed
  } else {
    res.status(403);
    throw new Error('Access denied, not an admin');
  }
});

module.exports = { validateToken, isAdmin };
