import React, { useState } from 'react';
import './App.css';
import { isAdmin } from "./shared/role";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  // ✅ UPDATED: admin code field for admin registration only
  const [adminCode, setAdminCode] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // ✅ UPDATED: Removed role selection - this page is now admin-only
  // Admin registration only - no role toggle needed
  
  // Password strength validation
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const checkPasswordStrength = (pwd) => {
    setPasswordStrength({
      hasMinLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  // ✅ UPDATED: Admin-only form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    if (!agreeToTerms) {
      setErrorMessage('Please read and agree to the Privacy Policy and Terms of Service to continue.');
      setIsLoading(false);
      return;
    }
    
    if (!email || !adminCode || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }
    
    const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
    if (!isPasswordStrong) {
      setErrorMessage('Please ensure your password meets all security requirements.');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      setIsLoading(false);
      return;
    }
    
    // ✅ UPDATED: Admin registration with code validation
    setTimeout(() => {
      console.log('Admin registration submitted', { email, adminCode, password });
      
      if (adminCode.length >= 4) {
        localStorage.setItem("role", "admin");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isAdminRegistered", "true");
        setIsLoading(false);
        alert('Admin registration successful! Please login.');
        window.location.href = '/login';
      } else {
        setErrorMessage('Invalid Admin Code. Please enter a valid admin registration code.');
        setIsLoading(false);
      }
    }, 1000);
  };

  // ✅ UPDATED: Google registration as admin only
  const handleGoogleRegister = () => {
    setIsLoading(true);
    setErrorMessage('');
    
    setTimeout(() => {
      console.log('Google registration initiated as admin');
      localStorage.setItem("role", "admin");
      localStorage.setItem("userEmail", "admin@gmail.com");
      localStorage.setItem("googleRegister", "true");
      localStorage.setItem("isAdminRegistered", "true");
      setIsLoading(false);
      alert('Admin registration successful! Please login.');
      window.location.href = '/login';
    }, 1000);
  };

  // Modal component (unchanged but responsive)
  const Modal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4" onClick={onClose}>
        <div className="modal-container bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] animate-scaleIn" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h3>
            <button onClick={onClose} className="modal-close w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-slate-100 transition-all duration-200 flex items-center justify-center group flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="modal-content p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-600">{content}</div>
          <div className="modal-footer p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex justify-end rounded-b-2xl flex-shrink-0">
            <button onClick={onClose} className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm sm:text-base">Close</button>
          </div>
        </div>
      </div>
    );
  };

  const privacyPolicyContent = (/* content unchanged */) => (
    <>
      <div className="space-y-4">
        <div><h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">1. Information We Collect</h4><p className="text-xs sm:text-sm leading-relaxed">AsiaByte P&L Inventory System collects information you provide directly to us...</p></div>
        <div><h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">2. How We Use Your Information</h4><p className="text-xs sm:text-sm leading-relaxed">We use the information we collect to provide, maintain, and improve our services...</p></div>
        <p className="text-xs text-slate-400 italic mt-4">Effective Date: January 1, 2026</p>
      </div>
    </>
  );

  const termsContent = (/* content unchanged */) => (
    <>
      <div className="space-y-4">
        <div><h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">1. Acceptance of Terms</h4><p className="text-xs sm:text-sm leading-relaxed">By accessing or using AsiaByte P&L Inventory System, you agree to be bound by these Terms of Service...</p></div>
        <p className="text-xs text-slate-400 italic mt-4">Last Updated: January 1, 2026</p>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background - unchanged */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-float opacity-60"></div>
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-float animation-delay-1000 opacity-40"></div>
      </div>

      {/* ✅ RESPONSIVE FIX: Main container with better padding for mobile */}
      <main className="auth-container w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 flex flex-col lg:flex-row items-center justify-center min-h-screen relative z-10">
        
        {/* ✅ RESPONSIVE FIX: Left brand section - better text sizing for mobile */}
        <div className="brand-section w-full lg:flex-1 mb-8 lg:mb-0 lg:pr-8 xl:pr-16">
          <div className="brand-header mb-6 sm:mb-8 md:mb-10 animate-fade-in-up flex justify-center lg:justify-start">
            <div className="brand-icon-box w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-105 border border-white/30">
              <img src="/Pictures/Asiabite.png" alt="Logo" className="logo-image w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain" />
            </div>
          </div>
          <div className="brand-content text-center lg:text-left animate-fade-in-up animation-delay-200">
            {/* ✅ RESPONSIVE FIX: Responsive text sizes */}
            <h1 className="hero-text mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-white via-white to-cyan-200 bg-clip-text text-transparent block leading-tight">
                AsiaByte
              </span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white/95 block mt-2 leading-tight">
                P&L Inventory System
              </span>
            </h1>
            
            {/* ✅ RESPONSIVE FIX: Responsive card width */}
            <div className="relative mt-4 sm:mt-6 max-w-full sm:max-w-md mx-auto lg:mx-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-75"></div>
              <div className="relative bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 animate-pulse animation-delay-1000" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                </div>
                {/* ✅ RESPONSIVE FIX: Responsive text */}
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-relaxed tracking-wide">
                  Join teams building the future with 
                  <span className="inline-block ml-1">
                    <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-bold">
                      AsiaByte's
                    </span>
                  </span>
                  <br />
                  <span className="text-cyan-200/90 font-bold">strong infrastructure platform.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ RESPONSIVE FIX: Registration Form Section - better width management */}
        <div className="form-section w-full max-w-md lg:max-w-md xl:max-w-lg mx-auto lg:mx-0 animate-fade-in-up animation-delay-400">
          <div className="auth-card bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-6 sm:p-8 relative overflow-hidden">
            <div className="card-accent-bar absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
            
            <header className="card-header mb-6">
              {/* ✅ RESPONSIVE FIX: Responsive text sizes */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Admin Registration</h2>
              <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Please enter your details to create an admin account.</p>
            </header>

            {/* Error message - responsive */}
            {errorMessage && (
              <div className="error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2 animate-shake">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            <form className="auth-form space-y-5" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400 flex-shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor'><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path><polyline points='22,6 12,13 2,6'></polyline></svg>
                  </div>
                  <input type='email' id='email' placeholder='name@company.com' value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base" required />
                </div>
              </div>

              {/* Admin Code Field - Always visible for admin registration */}
              <div className="input-group">
                <label htmlFor="adminCode" className="block text-sm font-semibold text-slate-700 mb-2">Admin Code</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400 flex-shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor'><path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'></path></svg>
                  </div>
                  <input type='text' id='adminCode' placeholder='Enter admin registration code' value={adminCode} onChange={(e) => setAdminCode(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base" required />
                </div>
                <p className="text-xs text-slate-400 mt-1">*Required for admin registration. Contact your system administrator to obtain the code.</p>
              </div>

              {/* Password Field with Strength Indicator */}
              <div className="input-group">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400 flex-shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor'><rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect><path d='M7 11V7a5 5 0 0 1 10 0v4'></path></svg>
                  </div>
                  <input type={showPassword ? "text" : "password"} id='password' placeholder='Create a strong password' value={password} onChange={handlePasswordChange} className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base" required />
                  <button type='button' className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor'><path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path><line x1='1' y1='1' x2='23' y2='23'></line></svg> : <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path><circle cx='12' cy='12' r='3'></circle></svg>}
                  </button>
                </div>
                {/* ✅ RESPONSIVE FIX: Password strength indicator - responsive text */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-semibold text-slate-600 mb-1">Password Requirements:</div>
                    <div className={`text-xs flex items-center gap-1 ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-red-500'}`}>{passwordStrength.hasMinLength ? '✓' : '○'} At least 8 characters</div>
                    <div className={`text-xs flex items-center gap-1 ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-red-500'}`}>{passwordStrength.hasUpperCase ? '✓' : '○'} At least one uppercase letter</div>
                    <div className={`text-xs flex items-center gap-1 ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-red-500'}`}>{passwordStrength.hasLowerCase ? '✓' : '○'} At least one lowercase letter</div>
                    <div className={`text-xs flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-red-500'}`}>{passwordStrength.hasNumber ? '✓' : '○'} At least one number</div>
                    <div className={`text-xs flex items-center gap-1 ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>{passwordStrength.hasSpecialChar ? '✓' : '○'} At least one special character (!@#$%^&*)</div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="input-group">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400 flex-shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor'><rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect><path d='M7 11V7a5 5 0 0 1 10 0v4'></path></svg>
                  </div>
                  <input type={showConfirmPassword ? "text" : "password"} id='confirmPassword' placeholder='Confirm your password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base" required />
                  <button type='button' className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor'><path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path><line x1='1' y1='1' x2='23' y2='23'></line></svg> : <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path><circle cx='12' cy='12' r='3'></circle></svg>}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && <div className="mt-1 text-xs text-red-500">Passwords do not match</div>}
              </div>

              {/* Terms and Conditions Agreement - responsive */}
              <div className="flex items-start gap-2">
                <input type="checkbox" id="agreeToTerms" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 transition-all flex-shrink-0" required />
                <label htmlFor="agreeToTerms" className="text-xs sm:text-sm text-slate-600">
                  I have read and agree to the{' '}
                  <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Privacy Policy</button>
                  {' '}and{' '}
                  <button type="button" onClick={() => setShowTermsModal(true)} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Terms of Service</button>
                </label>
              </div>

              {/* Submit Button - responsive */}
              <button type='submit' className="submit-btn w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 text-sm sm:text-base" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Creating Admin Account...</span>
                  </>
                ) : 'Register as Admin'}
              </button>
            </form>

            {/* Divider - responsive */}
            <div className="divider relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-500 font-medium">or sign up with</span></div>
            </div>

            {/* Google button - responsive */}
            <button onClick={handleGoogleRegister} disabled={isLoading} className="social-btn w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-70 active:scale-95">
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span className="text-slate-700 font-medium text-sm sm:text-base">Continue with Google</span>
            </button>

            {/* Footer - responsive */}
            <footer className="card-footer mt-6 text-center">
              <p className="text-slate-600 font-medium text-sm sm:text-base">Already have an account? <button onClick={() => window.location.href = '/login'} className="text-blue-600 hover:text-blue-700 font-semibold ml-1 hover:underline transition-colors">Sign in</button></p>
            </footer>
          </div>
          
          {/* ✅ RESPONSIVE FIX: Legal links - responsive spacing */}
          <div className="legal-links flex justify-center gap-4 sm:gap-6 mt-6 text-xs sm:text-sm">
            <button onClick={() => setShowPrivacyModal(true)} className="text-white/80 hover:text-white font-medium transition-all duration-200 hover:scale-105">Privacy Policy</button>
            <button onClick={() => setShowTermsModal(true)} className="text-white/80 hover:text-white font-medium transition-all duration-200 hover:scale-105">Terms of Service</button>
          </div>
        </div>
      </main>

      <Modal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Privacy Policy" content={privacyPolicyContent} />
      <Modal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} title="Terms of Service" content={termsContent} />

      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}@keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-2px)}20%,40%,60%,80%{transform:translateX(2px)}}@keyframes blob{0%{transform:translate(0px,0px) scale(1)}33%{transform:translate(30px,-50px) scale(1.1)}66%{transform:translate(-20px,20px) scale(0.9)}100%{transform:translate(0px,0px) scale(1)}}@keyframes float{0%{transform:translateY(0px)}50%{transform:translateY(-20px)}100%{transform:translateY(0px)}}.animate-fade-in-up{animation:fadeInUp 0.6s ease-out forwards}.animate-fadeIn{animation:fadeIn 0.2s ease-out}.animate-scaleIn{animation:scaleIn 0.2s ease-out}.animate-shake{animation:shake 0.5s ease-in-out}.animate-blob{animation:blob 7s infinite}.animate-float{animation:float 6s ease-in-out infinite}.animation-delay-200{animation-delay:0.2s;opacity:0;animation-fill-mode:forwards}.animation-delay-400{animation-delay:0.4s;opacity:0;animation-fill-mode:forwards}.animation-delay-1000{animation-delay:1s}.animation-delay-1500{animation-delay:1.5s}.animation-delay-2000{animation-delay:2s}.animation-delay-2500{animation-delay:2.5s}.animation-delay-3000{animation-delay:3s}.animation-delay-4000{animation-delay:4s}`}</style>
    </div>
  );
};

export default Register;