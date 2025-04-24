const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  console.log("🔐 Incoming Headers:", req.headers);

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No Bearer token found.");
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  const token = authHeader.split(" ")[1];
  console.log("📦 Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    res.status(401);
    throw new Error("Not authorized");
  }
});

module.exports = validateToken;
