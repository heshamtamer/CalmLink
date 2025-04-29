import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './StressRehabilitation.css';

const StressRehabilitation = () => {
  const navigate = useNavigate();
  const [currentTechnique, setCurrentTechnique] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [isTimerStarted, setIsTimerStarted] = useState(false);

  const techniques = [
    {
      id: 0,
      name: "Box Breathing",
      duration: 60, // 1 minute
      videoUrl: "https://www.youtube.com/embed/G25IR0c-Hj8",
      description: "Inhale for 4 seconds → Hold 4 seconds → Exhale 4 seconds → Hold 4 seconds. Repeat for 4 full cycles to engage the parasympathetic system and lower heart-rate variability imbalances.",
      steps: [
        "Inhale for 4 seconds",
        "Hold for 4 seconds",
        "Exhale for 4 seconds",
        "Hold for 4 seconds",
        "Repeat for 4 full cycles"
      ]
    },
    {
      id: 1,
      name: "5-4-3-2-1 Grounding",
      duration: 30, // 30 seconds
      videoUrl: "https://www.youtube.com/embed/pY0Ldqwmz_Q",
      description: "This sensory redirect calms fight-or-flight activation by anchoring attention to the present.",
      steps: [
        "Name 5 things you can see",
        "Name 4 things you can feel",
        "Name 3 things you can hear",
        "Name 2 things you can smell",
        "Name 1 thing you can taste"
      ]
    },
    {
      id: 2,
      name: "Shoulder Rolls",
      duration: 10, // 10 seconds
      videoUrl: "https://www.youtube.com/embed/CvW-Zq3NlkU",
      description: "Roll your shoulders to release tension and improve mobility.",
      steps: [
        "Roll shoulders up",
        "Roll shoulders back",
        "Roll shoulders down",
        "Roll shoulders forward",
        "Repeat for 3 full cycles"
      ]
    },
    {
      id: 3,
      name: "Jaw Release",
      duration: 10, // 10 seconds
      videoUrl: "https://www.youtube.com/embed/oQsFSqDafOA",
      description: "Release tension in your jaw to reduce stress and promote relaxation.",
      steps: [
        "Open your jaw wide",
        "Hold for a moment",
        "Release and relax",
        "Repeat for 3 full cycles"
      ]
    },
    {
      id: 4,
      name: "Seal with a Positive Affirmation",
      duration: 10, // 10 seconds
      description: "Take a moment to center yourself with these empowering affirmations. Breathe deeply and repeat: 'I am strong, capable, and in control of my well-being. Each breath I take brings me peace and clarity. I choose to embrace calmness and resilience in this moment.'",
      steps: [
        "Take a deep breath in",
        "Hold the breath for a moment",
        "Exhale slowly",
        "Repeat the affirmation with each breath",
        "Feel the positive energy flowing through you"
      ]
    }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTechnique = (index) => {
    setCurrentTechnique(index);
    setTimeLeft(techniques[index].duration);
    setIsActive(false);
    setIsTimerStarted(false);
  };

  const startTimer = () => {
    setIsActive(true);
    setIsTimerStarted(true);
  };

  const retryTechnique = () => {
    setTimeLeft(techniques[currentTechnique].duration);
    setIsActive(false);
    setIsTimerStarted(false);
  };

  const nextTechnique = () => {
    setCompleted([...completed, currentTechnique]);
    if (currentTechnique < techniques.length - 1) {
      startTechnique(currentTechnique + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rehabilitation-container">
      <div className="rehabilitation-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1>Stress Rehabilitation Techniques</h1>
      </div>

      {currentTechnique === -1 ? (
        <div className="start-screen">
          <h2>Welcome to Stress Rehabilitation</h2>
          <p>This program will guide you through 5 techniques to help manage stress.</p>
          <button className="start-button" onClick={() => startTechnique(0)}>
            Start Program
          </button>
        </div>
      ) : (
        <div className="technique-screen">
          <div className="progress-indicator">
            {techniques.map((_, index) => (
              <div key={index} className={`progress-dot ${completed.includes(index) ? 'completed' : ''} ${index === currentTechnique ? 'current' : ''}`}>
                {completed.includes(index) && <CheckCircle size={16} />}
              </div>
            ))}
          </div>

          <div className="video-container">
            {currentTechnique !== -1 && techniques[currentTechnique].videoUrl && currentTechnique !== 4 ? (
              <iframe
                width="100%"
                height="100%"
                src={techniques[currentTechnique].videoUrl}
                title={techniques[currentTechnique].name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : currentTechnique === 4 ? (
              <div className="affirmation-container">
                <div className="affirmation-icon">✨</div>
                <p className="affirmation-text">
                  "I am strong, capable, and in control of my well-being. Each breath I take brings me peace and clarity. I choose to embrace calmness and resilience in this moment."
                </p>
              </div>
            ) : (
              <div className="video-placeholder">
                Video Placeholder
              </div>
            )}
          </div>

          <div className="technique-info">
            <h2>{techniques[currentTechnique].name}</h2>
            <p className="description">{techniques[currentTechnique].description}</p>
            
            <div className="timer-container">
              <Clock size={20} />
              <span className="timer">{formatTime(timeLeft)}</span>
              {!isTimerStarted && timeLeft === techniques[currentTechnique].duration && (
                <button className="start-timer-button" onClick={startTimer}>
                  <Play size={16} />
                  Start Timer
                </button>
              )}
            </div>

            <div className="steps-container">
              <h3>Steps:</h3>
              <ul>
                {techniques[currentTechnique].steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="controls">
              {!isActive && timeLeft > 0 && timeLeft < techniques[currentTechnique].duration && (
                <button className="retry-button" onClick={retryTechnique}>
                  <RotateCcw size={16} />
                  Retry
                </button>
              )}
              {timeLeft === 0 && (
                <button className="next-button" onClick={nextTechnique}>
                  {currentTechnique === techniques.length - 1 ? 'Done' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StressRehabilitation;