import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-canvas">

      <main className="auth-container">
        <div className="brand-section">
          <div className="brand-header">
            <div className="brand-icon-box">
          <img src="src/assets/Pictures/asiabite.png" alt="Logo" className="logo-image" />
            </div>
          </div>

          <div className="brand-content">
            <h1 className="hero-text">
              <span className="text-highlight">AsiaByte</span>
              <br /> P&L Inventory System 
            </h1>
            <p className="hero-subtext">
              Join teams building the future with AsiaByte's strong infrastructure platform.
            </p>
          </div>

        </div>

        {/* Right Section: Login Form */}
        <div className="form-section">
          <div className="auth-card">
            <div className="card-accent-bar"></div>
            
            <header className="card-header">
              <h2>Welcome</h2>
              <p>Please enter your details to sign in.</p>
            </header>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <svg className='input-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
                    <polyline points='22,6 12,13 2,6'></polyline>
                  </svg>
                  <input
                    type="email" 
                    id="email" 
                    placeholder="name@company.com" 
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <svg className='input-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                    <rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect>
                    <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
                  </svg>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="••••••••" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="visibility-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label='Toggle password visibility'
                  >
                    {showPassword ? (
                      // Eye Off Icon (Slash)
                      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
                        <line x1='1' y1='1' x2='23' y2='23'></line>
                      </svg>
                    ):(
                      // Eye Icon (Open)
                      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                        <circle cx='12' cy='12' r='3'></circle>
                      </svg>
                    )}
                    
                  </button>
                </div>
                <div className="forgot-password-link">
                  <a href="#">Forgot password?</a>
                </div>
              </div>

              <button type="submit" className="submit-btn">Sign In</button>
            </form>

            {/* <div className="divider">
              <span>or sign in with</span>
            </div>

            <div className="social-login-grid">
              <button className="social-btn">
                <svg className="social-icon" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </button>
              <button className="social-btn">
                <svg className="social-icon" fill="#1877F2" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </button>
              <button className="social-btn">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" /></svg>
              </button>
            </div> */}

            <footer className="card-footer">
              <p>Don't have an account? <a onClick={() => navigate('/Register')}>Sign up now</a></p>
            </footer>
          </div>
          
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;