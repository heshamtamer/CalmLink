import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Validate form data before submission
    if (!username || !email || !password) {
      setError('All fields are mandatory!');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, {
        username,
        email,
        password
      });
      
      if (response.status === 201) {
        // Store user data in localStorage - using name instead of username as per server response
        localStorage.setItem("username", response.data.name); // This is correct as server sends 'name'
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("userId", response.data._id);
        
        // Show success message and redirect to login
        alert('Registration successful! Please login with your credentials.');
        navigate('/');
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        // Handle specific error messages from the server
        if (error.response.status === 400) {
          setError(error.response.data.message || 'Registration failed. Please try again.');
        } else {
          setError('An error occurred during registration. Please try again.');
        }
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
    }
  };

  return (
    <div className="register-container">
      {/* Left side with image and branding */}
      <div className="register-brand-section">
        <div className="logo-container">
          <div className="logo">
            <span>+</span>
          </div>
        </div>
        <h1 className="brand-title">Healthcare Dashboard</h1>
        <p className="brand-description">
          Take control of your health data with our secure and easy-to-use healthcare platform.
        </p>
        
        {/* Doctor illustration */}
        <div className="illustration-container">
          <div className="doctor-illustration">
            <div className="doctor-body"></div>
          </div>
          <div className="decoration pill"></div>
          <div className="decoration circle circle-1"></div>
          <div className="decoration circle circle-2"></div>
          <div className="decoration circle circle-3"></div>
        </div>
        
        <p className="copyright">© 2022 Healthcare Services. All rights reserved.</p>
      </div>
      
      {/* Right side with registration form */}
      <div className="register-form-section">
        <div className="register-form-container">
          <div className="mobile-logo-container">
            <div className="logo">
              <span>+</span>
            </div>
          </div>
          
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Please enter your details to sign up</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="register-form">
            {/* Username input */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-container">
                <div className="input-icon">
                  <User size={18} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            {/* Email input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-container">
                <div className="input-icon">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>
            
            {/* Password input */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-container">
                <div className="input-icon">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              className="register-button"
            >
              Sign Up
            </button>
            
            {/* Sign in link */}
            <p className="signin-prompt">
              Already have an account?{" "}
              <a href="/" className="signin-link" onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}>
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 