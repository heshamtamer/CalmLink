import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Home, User, Settings, FileText, Search, Bell, LogOut, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HealthDashboard.css'; 

const HealthDashboard = () => {
  const [showStressAnalysis, setShowStressAnalysis] = useState(false);
  const [activeTrend, setActiveTrend] = useState('Heart Rate');
  const [activeTimePeriod, setActiveTimePeriod] = useState('24h');
  const [showStressNotification, setShowStressNotification] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const notificationTimeout = useRef(null);
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // Mock stress level - This will be replaced with actual model output later
  const stressLevel = "normal"; // Can be "normal" or "stressed"

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:5000/api/patient/data', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPatientData(response.data[0]); // Get the most recent data
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch patient data:', err);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  useEffect(() => {
    // Check stress level and show notification if stressed
    if (stressLevel === "stressed") {
      setShowStressNotification(true);
      setHasUnreadNotification(true);
      
      // Clear any existing timeout
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }
      
      // Set new timeout to hide notification after 5 seconds
      notificationTimeout.current = setTimeout(() => {
        setShowStressNotification(false);
      }, 5000);
    }

    // Cleanup timeout on component unmount
    return () => {
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }
    };
  }, [stressLevel]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    window.location.href = "/"; // Redirect to login page
  };

  // Mock data with updated values from patient data
  const userData = {
    name: localStorage.getItem("username"),
    bloodPressure: "110/80",
    heartRate: patientData?.bloodVolumePulse?.value ? `${patientData.bloodVolumePulse.value} bpm` : "N/A",
    temperature: patientData?.bodyTemperature?.value ? `${patientData.bodyTemperature.value} °C` : "N/A",
    respiration: patientData?.respiration?.value ? `${patientData.respiration.value} rpm` : "N/A",
    stressLevel: stressLevel,
    bloodCount: "9,873/ml",
    appointments: [
      { type: "Breathing Exercises", date: "Dec 15, 2022", time: "10:30 am" },
      { type: "Mental Wellness Session", date: "Dec 20, 2022", time: "8:30 am" }
    ],
    rehabilitationTasks: [
      { name: "Guided Breathing", frequency: "2 times per day", instruction: "Morning and evening" },
      { name: "Stretching Routine", frequency: "Daily", instruction: "After waking up" }
    ],
    aiRecommendations: [
      "Take a 5-minute break for deep breathing",
      "Consider a short walk in the garden",
      "Try the new relaxation exercise"
    ]
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = new Date(2022, 11, 0).getDate();
    const firstDay = new Date(2022, 11, 1).getDay();
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-empty-day"></div>);
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isHighlighted = i === 9;
      days.push(
        <div key={`day-${i}`} className={`calendar-day ${isHighlighted ? 'calendar-day-highlighted' : ''}`}>
          {i}
        </div>
      );
    }
    
    return days;
  };

  const handleStressLevelClick = () => {
    setShowStressAnalysis(!showStressAnalysis);
  };

  const handleTrendFilterClick = (trend) => {
    setActiveTrend(trend);
    if (trend === 'Stress Level') {
      setShowStressAnalysis(true);
    } else {
      setShowStressAnalysis(false);
    }
  };

  const handleNotificationClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    if (hasUnreadNotification) {
      setHasUnreadNotification(false);
    }
  };

  const handleStressNotificationClick = () => {
    setShowStressNotification(false);
    setShowNotificationDropdown(false);
    navigate('/stress-rehabilitation');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-text">+</span>
          </div>
        </div>
        <div className="sidebar-menu">
          <button className="sidebar-menu-item" onClick={() => navigate('/dashboard')}>
            <Home size={24} />
          </button>
          <button className="sidebar-menu-item" onClick={() => navigate('/patient-data')}>
            <Activity size={24} />
          </button>
          <button className="sidebar-menu-item" onClick={() => navigate('/stress-rehabilitation')}>
            <FileText size={24} />
          </button>
          <button className="sidebar-menu-item">
            <User size={24} />
          </button>
          <button className="sidebar-menu-item">
            <Settings size={24} />
          </button>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={24} />
        </button>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="content-panel">
          {/* Header */}
          <div className="header">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                className="search-input"
              />
              <Search size={16} className="search-icon" />
            </div>
            <div className="notification-container" onClick={handleNotificationClick}>
              <Bell size={20} className="notification-icon" />
              {hasUnreadNotification && (
                <div className="notification-badge">
                  <span className="notification-count">1</span>
                </div>
              )}
              {showNotificationDropdown && (
                <div className="notification-dropdown">
                  <div className="notification-item" onClick={handleStressNotificationClick}>
                    <Bell size={16} />
                    <span>High stress level detected! Click to view stress rehabilitation techniques.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <h1 className="page-title">Dashboard</h1>

          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <p className="welcome-greeting">Welcome back, <span className="user-name">{userData.name}</span></p>
              <p className="welcome-message">Let's focus on your recovery journey</p>
              <button className="connect-button">
                View Rehabilitation Plan
              </button>
            </div>
            <div className="doctor-illustration">
              <div className="doctor-figure">
                <div className="doctor-body"></div>
              </div>
              {/* Pills and circles decorations */}
              <div className="pill-decoration"></div>
              <div className="circle-decoration-1"></div>
              <div className="circle-decoration-2"></div>
              <div className="circle-decoration-3"></div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="health-metrics">
            <h2 className="section-title">Stress Monitoring Vitals</h2>
            <div className="metric-card">
              <div>
                <p className="metric-label">Heart Rate</p>
                <p className="metric-value">{userData.heartRate}</p>
              </div>
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </div>
            <div className="metric-card">
              <div>
                <p className="metric-label">Temperature</p>
                <p className="metric-value">{userData.temperature}</p>
              </div>
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
              </div>
            </div>
            <div className="metric-card">
              <div>
                <p className="metric-label">Stress Level</p>
                <p className="metric-value">{userData.stressLevel}</p>
              </div>
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Health Statistics */}
          <div className="health-statistics">
            <div className="statistics-header">
              <h2 className="section-title">Stress Trends Over Time</h2>
              <div className="trend-filters">
                <button 
                  className={`trend-filter ${activeTrend === 'Heart Rate' ? 'active' : ''}`}
                  onClick={() => handleTrendFilterClick('Heart Rate')}
                >
                  Heart Rate
                </button>
                <button 
                  className={`trend-filter ${activeTrend === 'SpO2' ? 'active' : ''}`}
                  onClick={() => handleTrendFilterClick('SpO2')}
                >
                  SpO2
                </button>
                <button 
                  className={`trend-filter ${activeTrend === 'Stress Level' ? 'active' : ''}`}
                  onClick={() => handleTrendFilterClick('Stress Level')}
                >
                  Stress Level
                </button>
              </div>
            </div>
            {activeTrend !== 'Stress Level' && (
              <div className="statistics-graph">
                {/* SVG for the graph */}
                <svg viewBox="0 0 400 100" className="graph-svg">
                  <path
                    d="M0,50 C20,40 40,80 60,70 C80,60 100,20 120,30 C140,40 160,90 180,80 C200,70 220,20 240,30 C260,40 280,60 300,50 C320,40 340,60 360,50 C380,40 400,50 400,50"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2"
                  />
                </svg>
                
                {/* X-axis labels */}
                <div className="x-axis-labels">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
                
                {/* Y-axis labels */}
                <div className="y-axis-labels">
                  <span>90</span>
                  <span>80</span>
                  <span>70</span>
                  <span>60</span>
                  <span>50</span>
                  <span>40</span>
                  <span>30</span>
                  <span>20</span>
                  <span>10</span>
                  <span>0</span>
                </div>
              </div>
            )}
          </div>

          {/* Stress Level Analysis - Only shown when Stress Level button is clicked */}
          {showStressAnalysis && (
            <div className={`stress-analysis ${showStressAnalysis ? 'show' : ''}`}>
              <div className="stress-header">
                <h2 className="section-title">Stress Level Analysis</h2>
                <div className="stress-tabs">
                  <button 
                    className={`stress-tab ${activeTimePeriod === '24h' ? 'active' : ''}`}
                    onClick={() => setActiveTimePeriod('24h')}
                  >
                    Last 24 Hours
                  </button>
                  <button 
                    className={`stress-tab ${activeTimePeriod === '7d' ? 'active' : ''}`}
                    onClick={() => setActiveTimePeriod('7d')}
                  >
                    Last 7 Days
                  </button>
                </div>
              </div>

              <div className="stress-graph-container">
                {/* Y-axis labels */}
                <div className="stress-bars-wrapper">
                  <div className="stress-level-labels">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>

                  {/* Stress level bars */}
                  <div className="stress-bars">
                    {activeTimePeriod === '24h' ? (
                      <>
                        {/* 24 hour view */}
                        <div className="stress-bar low" style={{ height: '30%' }}></div>
                        <div className="stress-bar low" style={{ height: '25%' }}></div>
                        <div className="stress-bar low" style={{ height: '20%' }}></div>
                        <div className="stress-bar moderate" style={{ height: '45%' }}></div>
                        <div className="stress-bar moderate" style={{ height: '50%' }}></div>
                        <div className="stress-bar moderate" style={{ height: '55%' }}></div>
                        <div className="stress-bar moderate" style={{ height: '60%' }}></div>
                        <div className="stress-bar high" style={{ height: '75%' }}></div>
                        <div className="stress-bar high" style={{ height: '80%' }}></div>
                        <div className="stress-bar high" style={{ height: '85%' }}></div>
                        <div className="stress-bar high" style={{ height: '90%' }}></div>
                        <div className="stress-bar high" style={{ height: '95%' }}></div>
                        <div className="stress-bar high" style={{ height: '90%' }}></div>
                        <div className="stress-bar high" style={{ height: '85%' }}></div>
                        <div className="stress-bar high" style={{ height: '80%' }}></div>
                        <div className="stress-bar moderate" style={{ height: '65%' }}></div>
                        <div className="stress-bar moderate" style={{ height: '60%' }}></div>
                        <div className="stress-bar moderate" style={{ height: '55%' }}></div>
                        <div className="stress-bar low" style={{ height: '40%' }}></div>
                        <div className="stress-bar low" style={{ height: '35%' }}></div>
                        <div className="stress-bar low" style={{ height: '30%' }}></div>
                        <div className="stress-bar low" style={{ height: '25%' }}></div>
                        <div className="stress-bar low" style={{ height: '20%' }}></div>
                        <div className="stress-bar low" style={{ height: '15%' }}></div>
                      </>
                    ) : (
                      <>
                        {/* 7 day view */}
                        <div className="stress-bar moderate" style={{ height: '55%' }}></div>
                        <div className="stress-bar high" style={{ height: '85%' }}></div>
                        <div className="stress-bar moderate" style={{ height: '60%' }}></div>
                        <div className="stress-bar low" style={{ height: '35%' }}></div>
                        <div className="stress-bar moderate" style={{ height: '50%' }}></div>
                        <div className="stress-bar high" style={{ height: '75%' }}></div>
                        <div className="stress-bar low" style={{ height: '30%' }}></div>
                      </>
                    )}
                  </div>

                  {/* X-axis labels */}
                  <div className="stress-time-labels">
                    {activeTimePeriod === '24h' ? (
                      <>
                        <span>6 AM</span>
                        <span>12 PM</span>
                        <span>6 PM</span>
                        <span>12 AM</span>
                      </>
                    ) : (
                      <>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity Impact Chart */}
              <div className="activity-impact">
                <div className="activity-bars">
                  <div className="activity-bar work"></div>
                  <div className="activity-bar screen"></div>
                  <div className="activity-bar mindfulness"></div>
                  <div className="activity-bar work"></div>
                  <div className="activity-bar screen"></div>
                  <div className="activity-bar mindfulness"></div>
                  <div className="activity-bar work"></div>
                  <div className="activity-bar screen"></div>
                  <div className="activity-bar mindfulness"></div>
                  <div className="activity-bar work"></div>
                  <div className="activity-bar screen"></div>
                  <div className="activity-bar mindfulness"></div>
                </div>
                <div className="activity-legend">
                  <div className="legend-item">
                    <div className="legend-color work"></div>
                    <span>Work</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color screen"></div>
                    <span>Screen Time</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color mindfulness"></div>
                    <span>Mindfulness</span>
                  </div>
                </div>
              </div>

              {/* Stress Summary */}
              <div className="stress-summary">
                <div className="summary-item">
                  <span className="summary-label">High Stress Time</span>
                  <span className="summary-value">3–5 PM</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Low Stress Time</span>
                  <span className="summary-value">8–10 AM</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          <div className="ai-recommendations">
            <h2 className="section-title">AI Recommendations</h2>
            <div className="recommendations-list">
              {userData.aiRecommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-item">
                  <div className="recommendation-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="recommendation-text">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="right-sidebar">
        {/* User profile */}
        <div className="user-profile">
          <span className="user-name-display">{userData.name}</span>
          <div className="user-avatar">
            {userData.name ? userData.name.charAt(0) : ''}
          </div>
        </div>

        {/* Calendar */}
        <div className="calendar-widget">
          <div className="calendar-header">
            <p className="calendar-month">{`${month} ${year}`}</p>
            <div className="calendar-controls">
              <button className="calendar-nav-button">
                <span>&lt;</span>
              </button>
              <button className="calendar-nav-button">
                <span>&gt;</span>
              </button>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="calendar-grid">
            <div className="calendar-day-header">S</div>
            <div className="calendar-day-header">M</div>
            <div className="calendar-day-header">T</div>
            <div className="calendar-day-header">W</div>
            <div className="calendar-day-header">T</div>
            <div className="calendar-day-header">F</div>
            <div className="calendar-day-header">S</div>
            {generateCalendarDays()}
          </div>
        </div>

        {/* Appointments */}
        {userData.appointments.map((appointment, index) => (
          <div key={index} className="appointment-item">
            <div className="appointment-icon">
              {appointment.type === "Breathing Exercises" ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon-blue">
                  <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,9C13.66,9 15,10.34 15,12C15,13.66 13.66,15 12,15C10.34,15 9,13.66 9,12C9,10.34 10.34,9 12,9M12,4.5C14.79,4.5 17.15,6.12 18.4,8.5H5.6C6.85,6.12 9.21,4.5 12,4.5M12,19.5C9.21,19.5 6.85,17.88 5.6,15.5H18.4C17.15,17.88 14.79,19.5 12,19.5Z" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon-blue">
                  <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,9C13.66,9 15,10.34 15,12C15,13.66 13.66,15 12,15C10.34,15 9,13.66 9,12C9,10.34 10.34,9 12,9M12,4.5C14.79,4.5 17.15,6.12 18.4,8.5H5.6C6.85,6.12 9.21,4.5 12,4.5M12,19.5C9.21,19.5 6.85,17.88 5.6,15.5H18.4C17.15,17.88 14.79,19.5 12,19.5Z" />
                </svg>
              )}
            </div>
            <div className="appointment-details">
              <p className="appointment-type">{appointment.type}</p>
              <p className="appointment-datetime">{`${appointment.date} | ${appointment.time}`}</p>
            </div>
          </div>
        ))}

        {/* Medications */}
        <div className="medications-section">
          <div className="section-header">
            <h2 className="section-title">Daily Rehabilitation Tasks</h2>
            <span className="view-all-link">View All</span>
          </div>

          {userData.rehabilitationTasks.map((task, index) => (
            <div key={index} className="medication-item">
              <div className="medication-icon">
                {index === 0 ? (
                  <div className="pill-icon"></div>
                ) : (
                  <div className="capsule-icon"></div>
                )}
              </div>
              <div className="medication-details">
                <p className="medication-name">{task.name}</p>
                <p className="medication-instruction">{`${task.frequency} · ${task.instruction}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stress Notification (floating) */}
      {showStressNotification && (
        <div className="stress-notification" onClick={handleStressNotificationClick}>
          <div className="notification-content">
            <Bell size={20} />
            <span>High stress level detected! Click here to view stress rehabilitation techniques.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthDashboard;