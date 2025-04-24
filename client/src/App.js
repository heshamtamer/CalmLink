import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Login/LoginPage";
import HealthDashboard from "./dashboard/HealthDashboard";
import Register from "./register/register";
import StressRehabilitation from './dashboard/StressRehabilitation';
import PatientDataReview from './dashboard/PatientDataReview';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<HealthDashboard />} />
        <Route path="/stress-rehabilitation" element={<StressRehabilitation />} />
        <Route path="/patient-data" element={<PatientDataReview />} />
      </Routes>
    </Router>
  );
}

export default App;
