// backend/routes/clearRoutes.js
const express = require('express');
const router = express.Router();
const Order = require("../models/Order");

// Route to clear orders
router.post('/clear', async (req, res) => {
  try {
    await Order.deleteMany({});
    res.status(200).send({ message: "Orders cleared successfully." });
  } catch (error) {
    res.status(500).send({ message: "Error clearing orders.", error });
  }
});

module.exports = router;
