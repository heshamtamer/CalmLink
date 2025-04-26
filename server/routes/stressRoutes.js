const express = require('express');
const router = express.Router();
const { predictStress } = require('../controllers/stressController');
const { validateToken } = require('../middleware/validateTokenHandler');

// Apply token validation middleware if you want this endpoint protected
router.post('/predict', validateToken, predictStress);

module.exports = router; 