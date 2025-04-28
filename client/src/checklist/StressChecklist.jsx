import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './StressChecklist.css';

const StressChecklist = () => {
  const navigate = useNavigate();
  const [weeklyStressLevel, setWeeklyStressLevel] = useState('normal');
  const [checklist, setChecklist] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);

  const checklistItems = {
    normal: [
      { id: 1, text: 'Daily exercise for 30 minutes' },
      { id: 2, text: 'Sleep duration (6-8 hours /day)' },
      { id: 3, text: 'Social connection' },
      { id: 4, text: 'Daily journaling' }
    ],
    medium: [
      { id: 1, text: 'MBSR' },
      { id: 2, text: 'Muscle stretches' },
      { id: 3, text: 'Daily box breathing' },
      { id: 4, text: 'Daily journaling' },
      { id: 5, text: 'Light resistance training' }
    ],
    high: [
      { id: 1, text: 'Book therapy session' },
      { id: 2, text: 'Guided visualization' },
      { id: 3, text: 'Mindful movement (ex:yoga)' },
      { id: 4, text: 'Sleep protocol (wind-down routine)' }
    ]
  };

  useEffect(() => {
    const fetchWeeklyStressData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/patient/data`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Filter data for the last week
        const weeklyData = response.data.filter(data => 
          new Date(data.createdAt) >= oneWeekAgo
        );

        // Group data by day and get the highest stress level for each day
        const stressDays = weeklyData.reduce((acc, data) => {
          const date = new Date(data.createdAt).toLocaleDateString();
          const stressLevel = data.stressPrediction?.prediction || 0;
          // Keep the highest stress level for each day
          if (!acc[date] || stressLevel > acc[date]) {
            acc[date] = stressLevel;
          }
          return acc;
        }, {});

        // Count days with different stress levels
        const stressLevelCounts = Object.values(stressDays).reduce((acc, level) => {
          if (level === 2) acc.highStress++;
          else if (level === 1) acc.mediumStress++;
          return acc;
        }, { highStress: 0, mediumStress: 0 });
        
        // Determine weekly stress level based on the criteria
        let currentStressLevel = 'normal';
        if (stressLevelCounts.highStress > 4) {
          currentStressLevel = 'high';
        } else if (stressLevelCounts.mediumStress > 4) {
          currentStressLevel = 'medium';
        }
        
        setWeeklyStressLevel(currentStressLevel);
        
        console.log('Stress level counts:', stressLevelCounts);
        console.log('Set stress level to:', currentStressLevel);
        
      } catch (err) {
        console.error('Failed to fetch weekly stress data:', err);
      }
    };

    fetchWeeklyStressData();
  }, []);

  useEffect(() => {
    setChecklist(checklistItems[weeklyStressLevel]);
    
    // Load completed items from localStorage based on stress level
    const savedItems = localStorage.getItem(`completedItems_${weeklyStressLevel}`);
    if (savedItems) {
      setCompletedItems(JSON.parse(savedItems));
    } else {
      setCompletedItems([]);
    }
  }, [weeklyStressLevel]);

  const handleCheckItem = (itemId) => {
    let updatedCompletedItems;
    if (completedItems.includes(itemId)) {
      updatedCompletedItems = completedItems.filter(id => id !== itemId);
    } else {
      updatedCompletedItems = [...completedItems, itemId];
    }
    
    setCompletedItems(updatedCompletedItems);
    
    // Save to localStorage
    localStorage.setItem(
      `completedItems_${weeklyStressLevel}`, 
      JSON.stringify(updatedCompletedItems)
    );
  };

  const getStressLevelColor = (level) => {
    switch(level) {
      case 'normal': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'high': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="checklist-container">
      <div className="checklist-header">
        <div className="header-left">
          <button 
            className="back-button"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1>Stress Management Checklist</h1>
        </div>
        <div 
          className="stress-level-indicator"
          style={{ backgroundColor: getStressLevelColor(weeklyStressLevel) }}
        >
          {weeklyStressLevel.charAt(0).toUpperCase() + weeklyStressLevel.slice(1)} Stress Level
        </div>
      </div>

      <div className="checklist-description">
        Based on your weekly stress analysis, here are the recommended activities to manage your stress levels:
      </div>

      <div className="checklist-items">
        {checklist.map((item) => (
          <div 
            key={item.id} 
            className={`checklist-item ${completedItems.includes(item.id) ? 'completed' : ''}`}
            onClick={() => handleCheckItem(item.id)}
          >
            <div className="checkbox">
              <CheckSquare 
                size={24} 
                className={completedItems.includes(item.id) ? 'checked' : ''} 
              />
            </div>
            <span className="item-text">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="progress-section">
        <div className="progress-header">Daily Progress</div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${checklist.length > 0 ? (completedItems.length / checklist.length) * 100 : 0}%`,
              backgroundColor: getStressLevelColor(weeklyStressLevel)
            }}
          ></div>
        </div>
        <div className="progress-text">
          {completedItems.length} of {checklist.length} tasks completed
        </div>
      </div>
    </div>
  );
};

export default StressChecklist;