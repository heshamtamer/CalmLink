const express = require("express");
const router = express.Router();
const { 
  addPatientData, 
  getPatientData, 
  getLatestPatientData 
} = require("../controllers/patientDataController");
const { validateToken } = require("../middleware/validateTokenHandler");

// Apply token validation middleware to all routes
router.use(validateToken);

// Patient data routes
router.post("/data", addPatientData);
router.get("/data", getPatientData);
router.get("/data/latest", getLatestPatientData);

module.exports = router; 