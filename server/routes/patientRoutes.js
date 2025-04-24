const express = require("express");
const { 
  addPatientData, 
  getPatientData, 
  getLatestPatientData 
} = require("../controllers/patientDataController");
const { validateToken }  = require("../middleware/validateTokenHandler");
const router = express.Router();

// Middleware to validate token for all routes in this file
router.use(validateToken);

// Patient data routes
router.post("/data", addPatientData);
router.get("/data", getPatientData);
router.get("/data/latest", getLatestPatientData);

module.exports = router; 