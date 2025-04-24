const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const validateToken = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Get the token from the header
    console.log('Token1:', token); // Log the token for debugging
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('Decoded:', decoded); // Log the decoded token for debugging
    req.user = await User.findById(decoded.user.id).select('-password'); // Get user without password
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized');
  }
});



module.exports = { validateToken };
