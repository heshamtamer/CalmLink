const mongoose = require("mongoose");

const patientDataSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  bloodVolumePulse: {
    value: Number,
    timestamp: Date,
  },
  
  electrodermalActivity: {
    value: Number,
    timestamp: Date,
  },
  
  respiration: {
    value: Number,
    timestamp: Date,
  },
  
  bodyTemperature: {
    value: Number,
    timestamp: Date,
  },
  
  acceleration: {
    x: Number,
    y: Number,
    z: Number,
    timestamp: Date,
  },
  
  // Add the stress prediction data
  stressPrediction: {
    type: mongoose.Schema.Types.Mixed, // Flexible schema to store prediction result
    default: null
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("PatientData", patientDataSchema);