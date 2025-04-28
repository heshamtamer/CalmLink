import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Home, User, Settings, FileText, Search, Bell, LogOut, Activity, CheckSquare } from 'lucide-react';
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
  const [completedTasks, setCompletedTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
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

  const [weeklyStressData, setWeeklyStressData] = useState([]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/patient/data`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Create an array of all days in the week
        const allDays = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          allDays.push({
            date: date.toLocaleDateString(),
            dayName: date.toLocaleDateString([], { weekday: 'short' }),
            stressLevel: 0,
            hasData: false
          });
        }
        
        // Filter and group data by day
        const weeklyData = response.data
          .filter(data => new Date(data.createdAt) >= oneWeekAgo)
          .reduce((acc, data) => {
            const date = new Date(data.createdAt).toLocaleDateString();
            if (!acc[date]) {
              acc[date] = {
                date,
                stressLevel: data.stressPrediction?.prediction || 0,
                count: 1,
                hasData: true
              };
            } else {
              // Average the stress level for the day
              acc[date].stressLevel = (acc[date].stressLevel * acc[date].count + (data.stressPrediction?.prediction || 0)) / (acc[date].count + 1);
              acc[date].count++;
            }
            return acc;
          }, {});
        
        // Merge actual data with all days
        const mergedData = allDays.map(day => {
          if (weeklyData[day.date]) {
            return {
              ...day,
              stressLevel: weeklyData[day.date].stressLevel,
              hasData: true
            };
          }
          return day;
        });
        
        setWeeklyStressData(mergedData);
      } catch (err) {
        console.error('Failed to fetch weekly stress data:', err);
      }
    };

    fetchWeeklyData();
  }, []);

  // Function to get stress status based on weekly stats
  const getStressStatus = () => {
    if (weeklyStressData.length > 0 && weeklyStressData[weeklyStressData.length - 1].stressLevel > 4) return "High Stress";
    if (weeklyStressData.length > 0 && weeklyStressData[weeklyStressData.length - 1].stressLevel > 2) return "Normal Stress";
    return "Low Stress";
  };

  // Function to get stress level color
  const getStressLevelColor = (level) => {
    switch(level) {
      case 0: return '#4CAF50'; // Green for normal
      case 1: return '#FFC107'; // Yellow for medium
      case 2: return '#F44336'; // Red for high
      default: return '#9E9E9E'; // Grey for unknown
    }
  };

  // Function to get 24-hour stress data
  const get24HourStressData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/patient/data`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      return response.data
        .filter(data => new Date(data.createdAt) >= oneDayAgo)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } catch (err) {
      console.error('Failed to fetch 24-hour stress data:', err);
      return [];
    }
  };

  const [hourlyStressData, setHourlyStressData] = useState([]);

  useEffect(() => {
    const fetchHourlyData = async () => {
      const data = await get24HourStressData();
      setHourlyStressData(data);
    };
    fetchHourlyData();
  }, []);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/patient/data/latest`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPatientData(response.data);
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
    if (patientData?.stressPrediction?.prediction === 2) {
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
    } else if (patientData?.stressPrediction?.prediction === 1) {
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
  }, [patientData?.stressPrediction?.prediction]);

  useEffect(() => {
    // Load completed tasks from localStorage
    const loadCompletedTasks = () => {
      const stressLevel = localStorage.getItem('weeklyStressLevel') || 'normal';
      const savedItems = localStorage.getItem(`completedItems_${stressLevel}`);
      const lastResetDate = localStorage.getItem('lastResetDate');
      const today = new Date().toDateString();

      // Reset tasks if it's a new day
      if (lastResetDate !== today) {
        localStorage.setItem('lastResetDate', today);
        localStorage.removeItem(`completedItems_${stressLevel}`);
        setCompletedTasks([]);
      } else if (savedItems) {
        setCompletedTasks(JSON.parse(savedItems));
      } else {
        setCompletedTasks([]);
      }
      
      // Set total tasks based on stress level
      const checklistItems = {
        normal: 4,
        medium: 5,
        high: 4
      };
      setTotalTasks(checklistItems[stressLevel]);
    };

    loadCompletedTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    window.location.href = "/"; // Redirect to login page
  };

  // Mock data with updated values from patient data
  const userData = {
    name: localStorage.getItem("username"),
    bloodPressure: "110/80",
    heartRate: patientData?.bloodVolumePulse?.value ? 
      `${Number(patientData.bloodVolumePulse.value).toFixed(2)} bpm` : "N/A",
    temperature: patientData?.bodyTemperature?.value ? 
      `${Number(patientData.bodyTemperature.value).toFixed(2)} °C` : "N/A",
    respiration: patientData?.respiration?.value ? 
      `${Number(patientData.respiration.value).toFixed(2)} rpm` : "N/A",
    stressLevel: patientData?.stressPrediction?.prediction !== undefined ? 
      (() => {
        switch(patientData.stressPrediction.prediction) {
          case 0: return "Normal";
          case 1: return "Medium";
          case 2: return "High";
          default: return "N/A";
        }
      })() : "N/A",
    bloodCount: "9,873/ml",
    appointments: [
      { type: "Mental Wellness Session", date: "April 09, 2025", time: "9:00 am" }
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
    setHasUnreadNotification(false);
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
          <button className="sidebar-menu-item" onClick={() => navigate('/checklist')}>
            <CheckSquare size={24} />
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

          {/* Stress Level Analysis */}
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

            {/* Weekly Stress Statistics */}
            <div className="weekly-stress-stats">
              <h3>Weekly Stress Statistics</h3>
              <div className="stats-container">
                <div className="stat-item">
                  <span className="stat-label">Current Status: {getStressStatus()}</span>
                </div>
                </div>
              </div>

              <div className="stress-graph-container">
                {/* Y-axis labels */}
                <div className="stress-bars-wrapper">
                  <div className="stress-level-labels">
                  <span>High</span>
                  <span>Medium</span>
                  <span>Normal</span>
                  </div>

                {/* Add vertical axis line */}
                <div className="stress-level-axis"></div>

                  {/* Stress level bars */}
                  <div className="stress-bars">
                    {activeTimePeriod === '24h' ? (
                    hourlyStressData.map((data, index) => (
                      <div 
                        key={index}
                        className="stress-bar"
                        style={{ 
                          height: `${(data.stressPrediction?.prediction + 1) * 33.33}%`,
                          backgroundColor: getStressLevelColor(data.stressPrediction?.prediction)
                        }}
                      ></div>
                    ))
                  ) : (
                    weeklyStressData.map((data, index) => (
                      <div 
                        key={index}
                        className={`stress-bar ${!data.hasData ? 'no-data' : ''}`}
                        style={{ 
                          height: data.hasData ? `${(data.stressLevel + 1) * 33.33}%` : '10%',
                          backgroundColor: data.hasData ? getStressLevelColor(data.stressLevel) : '#e5e7eb'
                        }}
                      ></div>
                    ))
                    )}
                  </div>

                {/* Add horizontal axis line */}
                <div className="stress-time-axis"></div>

                  {/* X-axis labels */}
                  <div className="stress-time-labels">
                    {activeTimePeriod === '24h' ? (
                    hourlyStressData.map((data, index) => (
                      <span key={index}>
                        {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit' })}
                      </span>
                    ))
                  ) : (
                    weeklyStressData.map((data, index) => (
                      <span key={index} className={!data.hasData ? 'no-data' : ''}>
                        {data.dayName}
                      </span>
                    ))
                  )}
                </div>
              </div>
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

        {/* Replace medications section with progress circle */}
        <div className="tasks-progress-section">
          <div className="section-header">
            <h2 className="section-title">Daily Tasks Progress</h2>
            <span className="view-all-link" onClick={() => navigate('/checklist')}>View All</span>
          </div>
          <div className="progress-circle-container">
            <div 
              className="progress-circle"
              style={{
                background: `conic-gradient(#4CAF50 ${(completedTasks.length / totalTasks) * 360}deg, #e5e7eb 0deg)`
              }}
            >
              <div className="progress-circle-inner">
                <span className="progress-text">
                  {completedTasks.length}/{totalTasks}
                </span>
                <span className="progress-label">Tasks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stress Notification (floating) */}
      {showStressNotification && (
        <div className="stress-notification" onClick={handleStressNotificationClick}>
          <div className="notification-content">
            <Bell size={20} />
            <span>
              {patientData?.stressPrediction?.prediction === 2 
                ? "High stress level detected! Click here to view stress rehabilitation techniques."
                : "Your stress level is increasing. Consider taking a break and practicing relaxation techniques."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthDashboard;