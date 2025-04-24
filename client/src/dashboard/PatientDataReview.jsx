import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientDataReview.css';

const PatientDataReview = () => {
  const [patientData, setPatientData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const [latestResponse, historyResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/patient/data/latest`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/patient/data`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setPatientData([latestResponse.data]);
        const sortedData = historyResponse.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setHistoricalData(sortedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patient data');
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  useEffect(() => {
    const filterDataByTimeRange = () => {
      const now = new Date();
      let startDate;

      switch (selectedTimeRange) {
        case 'day':
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 7));
      }

      const filtered = historicalData.filter(data => 
        new Date(data.createdAt) >= startDate
      );
      setFilteredData(filtered);
    };

    filterDataByTimeRange();
  }, [selectedTimeRange, historicalData]);

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
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Electrodermal Activity</h3>
            <span className="metric-icon">⚡</span>
          </div>
          <div className="metric-value">
            {patientData[0]?.electrodermalActivity?.value || 'N/A'} µS
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
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Body Temperature</h3>
            <span className="metric-icon">🌡️</span>
          </div>
          <div className="metric-value">
            {patientData[0]?.bodyTemperature?.value || 'N/A'} °C
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
        </div>
      </div>

      <div className="data-history">
        <h2>Historical Data - Last {selectedTimeRange}</h2>
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
              {filteredData.map((data, index) => (
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