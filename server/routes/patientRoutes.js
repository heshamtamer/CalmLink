const express = require("express");
const { 
  addPatientData, 
  getPatientData, 
  getLatestPatientData 
} = require("../controllers/patientDataController");
const { validateToken }  = require("../middleware/validateTokenHandler");
const router = express.Router();


// Patient data routes
router.post("/data", validateToken, addPatientData);
router.get("/data", validateToken, getPatientData);
router.get("/data/latest", validateToken, getLatestPatientData);

module.exports = router; 