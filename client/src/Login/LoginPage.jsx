import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom'; // Ensure you import useNavigate from react-router-dom
import axios from 'axios'; // Ensure you have axios installed and imported

const LoginPage = () => {
  const navigate = useNavigate(); // Ensure you import useNavigate from react-router-dom
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { email, password });
      localStorage.setItem("accessToken", response.data.accessToken); // Store the access token
      localStorage.setItem("username", response.data.username); // Store the username
      navigate("/dashboard"); // Redirect to the dashboard after successful login
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {/* Left side with image and branding */}
      <div className="login-brand-section">
        <div className="logo-container">

        </div>
        <h1 className="brand-title">CalmLink</h1>
        <p className="brand-description">
          Connects your body's signals to your mind's well-being.</p>
        
        {/* Doctor illustration - simplified */}
        <div className="illustration-container">
          <img src="https://cdn-icons-png.flaticon.com/512/3591/3591288.png" alt="Doctor Icon" className="doctor-icon-image" />
        </div>
        
        <p className="copyright">© 2025 CalmLink. All rights reserved.</p>
      </div>
      
      {/* Right side with login form */}
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="mobile-logo-container">
            <div className="logo">
              <span>+</span>
            </div>
          </div>
          
          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtitle">Please enter your details to sign in</p>
          
          <form onSubmit={handleLogin} className="login-form">
            {/* Email input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-container">
                <div className="input-icon">
                  <User size={18} />
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
            
            {/* Remember me and forgot password */}
            <div className="form-row">
              <div className="checkbox-container">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox"
                />
                <label htmlFor="remember-me" className="checkbox-label">
                  Remember me
                </label>
              </div>
              <div className="forgot-password">
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              </div>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              className="submit-button"
            >
              Sign In
            </button>
            
            {/* Sign up link */}
            <p className="signup-prompt">
              Don't have an account?{" "}
              <a href="/register" className="signup-link" onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}>
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;