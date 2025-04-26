const asyncHandler = require("express-async-handler");
const PatientData = require("../models/PatientData");
const axios = require("axios"); // For making internal requests

// @desc Add new patient health data with stress prediction
// @route POST /api/patient/data
// @access private
const addPatientData = asyncHandler(async (req, res) => {
  const {
    // Only accept stress model input parameters
    EDA_mean, EDA_std, EDA_kurtosis,
    HR_mean, HR_std, HR_rms,
    TEMP_mean, TEMP_std, TEMP_rms,
    BVP_mean, BVP_std, BVP_rms,
    ACC_mag_mean, ACC_mag_std,
    IBI_mean, IBI_std, IBI_rmssd
  } = req.body;

  try {
    // Extract the auth token from the original request
    const authToken = req.headers.authorization;
    
    // Prepare the stress model input
    const stressModelInput = {
      EDA_mean, EDA_std, EDA_kurtosis,
      HR_mean, HR_std, HR_rms,
      TEMP_mean, TEMP_std, TEMP_rms,
      BVP_mean, BVP_std, BVP_rms,
      ACC_mag_mean, ACC_mag_std,
      IBI_mean, IBI_std, IBI_rmssd
    };

    // Make a local API call to the stress prediction endpoint with the auth token
    const stressPrediction = await axios.post(
      `${req.protocol}://${req.get('host')}/api/stress/predict`,
      stressModelInput,
      {
        headers: {
          'Authorization': authToken, // Forward the authorization token
          'Content-Type': 'application/json'
        }
      }
    );

    // Calculate acceleration magnitude components (if needed)
    const accMag = ACC_mag_mean || 0;
    const accX = accMag * 0.577; // Simple approximation, dividing magnitude by sqrt(3)
    const accY = accMag * 0.577;
    const accZ = accMag * 0.577;

    // Create patient data record using the model input parameters
    const patientData = await PatientData.create({
      userId: req.user.id,
      bloodVolumePulse: {
        value: BVP_mean, // Use the mean BVP from model input
        timestamp: new Date()
      },
      electrodermalActivity: {
        value: EDA_mean, // Use the mean EDA from model input
        timestamp: new Date()
      },
      respiration: {
        value: HR_mean, // Use HR as a proxy for respiration, adjust as needed
        timestamp: new Date()
      },
      bodyTemperature: {
        value: TEMP_mean, // Use the mean TEMP from model input
        timestamp: new Date()
      },
      acceleration: {
        x: accX,
        y: accY,
        z: accZ,
        timestamp: new Date()
      },
      // Store the stress prediction data
      stressPrediction: stressPrediction.data
    });

    if (patientData) {
      res.status(201).json({
        patientData,
        stressPrediction: stressPrediction.data
      });
    } else {
      res.status(400);
      throw new Error("Invalid patient data");
    }
  } catch (error) {
    console.error("Error in addPatientData:", error.message);
    if (error.response) {
      console.error("Response error data:", error.response.data);
      console.error("Response error status:", error.response.status);
    }
    res.status(500);
    throw new Error(`Error processing patient data: ${error.message}`);
  }
});

// @desc Get patient health data
// @route GET /api/patient/data
// @access private
const getPatientData = asyncHandler(async (req, res) => {
  const patientData = await PatientData.find({ userId: req.user.id });

  res.status(200).json(patientData);
});

// @desc Get latest patient health data
// @route GET /api/patient/data/latest
// @access private
const getLatestPatientData = asyncHandler(async (req, res) => {
  const latestData = await PatientData.findOne(
    { userId: req.user.id },
    {},
    { sort: { 'createdAt': -1 } }
  );

  if (latestData) {
    res.status(200).json(latestData);
  } else {
    res.status(404);
    throw new Error("No patient data found");
  }
});

module.exports = {
  addPatientData,
  getPatientData,
  getLatestPatientData
};