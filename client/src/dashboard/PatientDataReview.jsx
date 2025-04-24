import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientDataReview.css';

const PatientDataReview = () => {
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:5000/api/patient/data', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPatientData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patient data');
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="patient-data-review">
      <div className="header">
        <h1 className="page-title">Patient Health Data Review</h1>
        <div className="time-range-selector">
          <button 
            className={`time-range-btn ${selectedTimeRange === 'day' ? 'active' : ''}`}
            onClick={() => setSelectedTimeRange('day')}
          >
            Day
          </button>
          <button 
            className={`time-range-btn ${selectedTimeRange === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`time-range-btn ${selectedTimeRange === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedTimeRange('month')}
          >
            Month
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h3>Blood Volume Pulse</h3>
            <span className="metric-icon">❤️</span>
          </div>
          <div className="metric-value">
            {patientData[0]?.bloodVolumePulse?.value || 'N/A'} BPM
          </div>
          <div className="metric-timestamp">
            Last updated: {patientData[0]?.bloodVolumePulse?.timestamp ? formatDate(patientData[0].bloodVolumePulse.timestamp) : 'N/A'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Electrodermal Activity</h3>
            <span className="metric-icon">⚡</span>
          </div>
          <div className="metric-value">
            {patientData[0]?.electrodermalActivity?.value || 'N/A'} µS
          </div>
          <div className="metric-timestamp">
            Last updated: {patientData[0]?.electrodermalActivity?.timestamp ? formatDate(patientData[0].electrodermalActivity.timestamp) : 'N/A'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Respiration</h3>
            <span className="metric-icon">🌬️</span>
          </div>
          <div className="metric-value">
            {patientData[0]?.respiration?.value || 'N/A'} RPM
          </div>
          <div className="metric-timestamp">
            Last updated: {patientData[0]?.respiration?.timestamp ? formatDate(patientData[0].respiration.timestamp) : 'N/A'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Body Temperature</h3>
            <span className="metric-icon">🌡️</span>
          </div>
          <div className="metric-value">
            {patientData[0]?.bodyTemperature?.value || 'N/A'} °C
          </div>
          <div className="metric-timestamp">
            Last updated: {patientData[0]?.bodyTemperature?.timestamp ? formatDate(patientData[0].bodyTemperature.timestamp) : 'N/A'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Acceleration</h3>
            <span className="metric-icon">📱</span>
          </div>
          <div className="acceleration-values">
            <div className="acceleration-axis">
              <span>X:</span> {patientData[0]?.acceleration?.x || 'N/A'} m/s²
            </div>
            <div className="acceleration-axis">
              <span>Y:</span> {patientData[0]?.acceleration?.y || 'N/A'} m/s²
            </div>
            <div className="acceleration-axis">
              <span>Z:</span> {patientData[0]?.acceleration?.z || 'N/A'} m/s²
            </div>
          </div>
          <div className="metric-timestamp">
            Last updated: {patientData[0]?.acceleration?.timestamp ? formatDate(patientData[0].acceleration.timestamp) : 'N/A'}
          </div>
        </div>
      </div>

      <div className="data-history">
        <h2>Historical Data</h2>
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Blood Volume Pulse</th>
                <th>EDA</th>
                <th>Respiration</th>
                <th>Temperature</th>
              </tr>
            </thead>
            <tbody>
              {patientData.map((data, index) => (
                <tr key={index}>
                  <td>{formatDate(data.createdAt)}</td>
                  <td>{data.bloodVolumePulse?.value || 'N/A'}</td>
                  <td>{data.electrodermalActivity?.value || 'N/A'}</td>
                  <td>{data.respiration?.value || 'N/A'}</td>
                  <td>{data.bodyTemperature?.value || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientDataReview; 