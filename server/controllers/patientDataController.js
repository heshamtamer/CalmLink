const asyncHandler = require("express-async-handler");
const PatientData = require("../models/PatientData");

// @desc Add new patient health data
// @route POST /api/patient/data
// @access private
const addPatientData = asyncHandler(async (req, res) => {
  const {
    bloodVolumePulse,
    electrodermalActivity,
    respiration,
    bodyTemperature,
    acceleration
  } = req.body;

  const patientData = await PatientData.create({
    userId: req.user.id,
    bloodVolumePulse: {
      value: bloodVolumePulse,
      timestamp: new Date()
    },
    electrodermalActivity: {
      value: electrodermalActivity,
      timestamp: new Date()
    },
    respiration: {
      value: respiration,
      timestamp: new Date()
    },
    bodyTemperature: {
      value: bodyTemperature,
      timestamp: new Date()
    },
    acceleration: {
      x: acceleration?.x || 0,
      y: acceleration?.y || 0,
      z: acceleration?.z || 0,
      timestamp: new Date()
    }
  });

  if (patientData) {
    res.status(201).json(patientData);
  } else {
    res.status(400);
    throw new Error("Invalid patient data");
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