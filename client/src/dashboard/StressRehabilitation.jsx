import React from 'react';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './StressRehabilitation.css';

const StressRehabilitation = () => {
  const navigate = useNavigate();

  // Ordered techniques for stress rehabilitation
  const techniques = [
    {
      id: 1,
      name: "Deep Breathing Exercise",
      duration: "5 minutes",
      steps: [
        "Find a quiet, comfortable place to sit or lie down",
        "Close your eyes and place one hand on your belly",
        "Inhale deeply through your nose for 4 seconds",
        "Hold your breath for 4 seconds",
        "Exhale slowly through your mouth for 6 seconds",
        "Repeat for 5 minutes"
      ],
      benefits: "Reduces heart rate, lowers blood pressure, and promotes relaxation"
    },
    {
      id: 2,
      name: "Progressive Muscle Relaxation",
      duration: "10 minutes",
      steps: [
        "Start with your toes and work your way up",
        "Tense each muscle group for 5 seconds",
        "Release the tension and notice the difference",
        "Move to the next muscle group",
        "Continue until you've relaxed your entire body"
      ],
      benefits: "Reduces muscle tension and overall stress levels"
    },
    {
      id: 3,
      name: "Mindfulness Meditation",
      duration: "15 minutes",
      steps: [
        "Sit in a comfortable position",
        "Focus on your breath",
        "When your mind wanders, gently bring it back",
        "Observe your thoughts without judgment",
        "Continue for 15 minutes"
      ],
      benefits: "Improves focus, reduces anxiety, and enhances emotional regulation"
    }
  ];

  return (
    <div className="rehabilitation-container">
      <div className="rehabilitation-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1>Stress Rehabilitation Techniques</h1>
        <p className="subtitle">Follow these techniques in order to manage your stress effectively</p>
      </div>

      <div className="techniques-list">
        {techniques.map((technique) => (
          <div key={technique.id} className="technique-card">
            <div className="technique-header">
              <h2>{technique.name}</h2>
              <div className="duration">
                <Clock size={16} />
                <span>{technique.duration}</span>
              </div>
            </div>
            
            <div className="technique-content">
              <div className="steps-section">
                <h3>Steps:</h3>
                <ol>
                  {technique.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              
              <div className="benefits-section">
                <h3>Benefits:</h3>
                <p>{technique.benefits}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StressRehabilitation;