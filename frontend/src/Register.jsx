import React, { useState } from 'react';
import './App.css';
import { isAdmin } from "./shared/role"; // ✅ ADDED: role helper import

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // ✅ ADDED: separate state for confirm password toggle
  const [email, setEmail] = useState(''); // ✅ ADDED: state for email input
  const [validationCode, setValidationCode] = useState(''); // ✅ ADDED: state for validation code
  const [password, setPassword] = useState(''); // ✅ ADDED: state for password
  const [confirmPassword, setConfirmPassword] = useState(''); // ✅ ADDED: state for confirm password
  const [isLoading, setIsLoading] = useState(false); // ✅ UPDATED: added loading state to match login
  const [errorMessage, setErrorMessage] = useState(''); // ✅ UPDATED: added error state to match login
  const [agreeToTerms, setAgreeToTerms] = useState(false); // ✅ ADDED: terms agreement state
  const [showPrivacyModal, setShowPrivacyModal] = useState(false); // ✅ ADDED: privacy modal state
  const [showTermsModal, setShowTermsModal] = useState(false); // ✅ ADDED: terms modal state
  
  // ✅ ADDED: Password strength validation
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // ✅ ADDED: Check password strength
  const checkPasswordStrength = (pwd) => {
    setPasswordStrength({
      hasMinLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    });
  };

  // ✅ ADDED: Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  // ✅ ADDED: Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    // Check if user agreed to terms
    if (!agreeToTerms) {
      setErrorMessage('Please read and agree to the Privacy Policy and Terms of Service to continue.');
      setIsLoading(false);
      return;
    }
    
    // Basic validation
    if (!email || !validationCode || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      setIsLoading(false);
      return;
    }
    
    // Check password strength
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
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted', { email, validationCode, password, confirmPassword });
      // Here you would typically navigate or show success message
      setIsLoading(false);
      alert('Registration successful! Please login.');
    }, 1000);
  };

  // ✅ ADDED: Handle Google registration
  const handleGoogleRegister = () => {
    setIsLoading(true);
    setErrorMessage('');
    
    // Simulate Google authentication
    setTimeout(() => {
      console.log('Google registration initiated');
      // Store role in localStorage (default to staff for demo)
      localStorage.setItem("role", "staff");
      localStorage.setItem("userEmail", "user@gmail.com");
      localStorage.setItem("googleRegister", "true");
      setIsLoading(false);
      alert('Google registration successful! Please login.');
    }, 1000);
  };

  // ✅ FIXED: Modal component for Privacy Policy and Terms - Fixed mobile layout
  const Modal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4" onClick={onClose}>
        <div className="modal-container bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] animate-scaleIn" onClick={(e) => e.stopPropagation()}>
          {/* Fixed Header */}
          <div className="modal-header flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h3>
            <button 
              onClick={onClose}
              className="modal-close w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-slate-100 transition-all duration-200 flex items-center justify-center group flex-shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          {/* Scrollable Content Area */}
          <div className="modal-content p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-600">
            {content}
          </div>
          
          {/* Fixed Footer with Button */}
          <div className="modal-footer p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex justify-end rounded-b-2xl flex-shrink-0">
            <button 
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ ADDED: Privacy Policy content
  const privacyPolicyContent = (
    <>
      <div className="space-y-4">
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">1. Information We Collect</h4>
          <p className="text-xs sm:text-sm leading-relaxed">AsiaByte P&L Inventory System collects information you provide directly to us, such as when you create an account, update your profile, or use our services. This may include your name, email address, phone number, company information, and inventory data.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">2. How We Use Your Information</h4>
          <p className="text-xs sm:text-sm leading-relaxed">We use the information we collect to provide, maintain, and improve our services, to process transactions, to communicate with you, and to protect against fraud or unauthorized access to your account.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">3. Data Security</h4>
          <p className="text-xs sm:text-sm leading-relaxed">We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is encrypted and stored securely.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">4. Data Sharing</h4>
          <p className="text-xs sm:text-sm leading-relaxed">We do not share your personal information with third parties except as necessary to provide our services, comply with the law, or protect our rights. We may share aggregated, anonymized data for analytical purposes.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">5. Your Rights</h4>
          <p className="text-xs sm:text-sm leading-relaxed">You have the right to access, correct, or delete your personal information. You may also request a copy of your data or ask us to restrict processing of your information.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">6. Cookies and Tracking</h4>
          <p className="text-xs sm:text-sm leading-relaxed">We use cookies and similar tracking technologies to enhance your experience, analyze usage, and personalize content. You can control cookie settings through your browser preferences.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">7. Updates to This Policy</h4>
          <p className="text-xs sm:text-sm leading-relaxed">We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the effective date.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">8. Contact Us</h4>
          <p className="text-xs sm:text-sm leading-relaxed">If you have questions about this privacy policy, please contact us at privacy@asiabyte.com or call +60 3-1234 5678.</p>
        </div>
        
        <p className="text-xs text-slate-400 italic mt-4">Effective Date: January 1, 2026</p>
      </div>
    </>
  );

  // ✅ ADDED: Terms of Service content
  const termsContent = (
    <>
      <div className="space-y-4">
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">1. Acceptance of Terms</h4>
          <p className="text-xs sm:text-sm leading-relaxed">By accessing or using AsiaByte P&L Inventory System, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">2. Account Registration</h4>
          <p className="text-xs sm:text-sm leading-relaxed">You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">3. User Responsibilities</h4>
          <p className="text-xs sm:text-sm leading-relaxed">You agree to use the system in compliance with all applicable laws and regulations. You are responsible for all inventory data you input and for ensuring the accuracy of your information.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">4. Prohibited Activities</h4>
          <p className="text-xs sm:text-sm leading-relaxed">You may not use the system for any illegal purpose, to infringe on the rights of others, to distribute malware, or to attempt to gain unauthorized access to any part of the system.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">5. Intellectual Property</h4>
          <p className="text-xs sm:text-sm leading-relaxed">All content, features, and functionality of the system are owned by AsiaByte and are protected by intellectual property laws. You may not copy, modify, or distribute any part of the system without our express written consent.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">6. Limitation of Liability</h4>
          <p className="text-xs sm:text-sm leading-relaxed">AsiaByte shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the system.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">7. Termination</h4>
          <p className="text-xs sm:text-sm leading-relaxed">We may terminate or suspend your account immediately, without prior notice, for conduct that violates these terms or is harmful to other users or the system.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">8. Governing Law</h4>
          <p className="text-xs sm:text-sm leading-relaxed">These terms shall be governed by and construed in accordance with the laws of Malaysia, without regard to its conflict of law provisions.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">9. Changes to Terms</h4>
          <p className="text-xs sm:text-sm leading-relaxed">We reserve the right to modify these terms at any time. Your continued use of the system after any changes constitutes acceptance of the new terms.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">10. Contact Information</h4>
          <p className="text-xs sm:text-sm leading-relaxed">For questions about these terms, please contact us at legal@asiabyte.com.</p>
        </div>
        
        <p className="text-xs text-slate-400 italic mt-4">Last Updated: January 1, 2026</p>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Animated Background with Gradient Mesh and Blobs - Matching Login */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800">
        {/* Animated glowing blobs */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-float opacity-60"></div>
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-float animation-delay-1000 opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full animate-float animation-delay-2000 opacity-50"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-float animation-delay-3000 opacity-30"></div>
        <div className="absolute top-2/3 right-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float animation-delay-1500 opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-float animation-delay-2500 opacity-50"></div>
      </div>

      <main className="auth-container max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center min-h-screen relative z-10">
        
        {/* ✨ UPDATED: Left Section - Branding - Matching Login style */}
        <div className="brand-section flex-1 mb-12 md:mb-0 md:pr-16 lg:pr-20">
          <div className="brand-header mb-10 animate-fade-in-up">
            <div className="brand-icon-box w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-105 border border-white/30">
              {/* ✅ FIXED: Updated image path */}
              <img src="/Pictures/Asiabite.png" alt="Logo" className="logo-image w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain" />
            </div>
          </div>

          <div className="brand-content animate-fade-in-up animation-delay-200">
            <h1 className="hero-text mb-6">
              <span className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-white via-white to-cyan-200 bg-clip-text text-transparent block leading-tight">
                AsiaByte
              </span>
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/95 block mt-2 leading-tight">
                P&L Inventory System
              </span>
            </h1>
            
            <div className="relative mt-6 max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-75"></div>
              <div className="relative bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/25">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-cyan-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
                  <svg className="w-5 h-5 text-blue-300 animate-pulse animation-delay-1000" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white text-base md:text-lg lg:text-xl font-semibold leading-relaxed tracking-wide">
                  Join teams building the future with 
                  <span className="inline-block ml-1">
                    <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-bold">
                      AsiaByte's
                    </span>
                  </span>
                  <br />
                  <span className="text-cyan-200/90 font-bold">strong infrastructure platform.</span>
                </p>
                <div className="mt-3 flex gap-1 justify-start">
                  <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-4 h-1 bg-cyan-400/50 rounded-full"></div>
                  <div className="w-2 h-1 bg-cyan-400/30 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 hidden md:block">
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* ✨ UPDATED: Right Section - Register Form - Matching Login card style */}
        <div className="form-section flex-1 max-w-md w-full animate-fade-in-up animation-delay-400">
          <div className="auth-card bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-8 relative overflow-hidden">
            <div className="card-accent-bar absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
            
            <header className="card-header mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
              <p className="text-slate-500 font-medium mt-1">Please enter your details to sign up.</p>
            </header>

            {/* ✨ UPDATED: Error message display matching Login */}
            {errorMessage && (
              <div className="error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2 animate-shake">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMessage}
              </div>
            )}

            <form className="auth-form space-y-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="input-group">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
                      <polyline points='22,6 12,13 2,6'></polyline>
                    </svg>
                  </div>
                  <input
                    type='email'
                    id='email'
                    placeholder='name@company.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isAdmin()}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              {/* Validation Code Field */}
              <div className="input-group">
                <label htmlFor="code" className="block text-sm font-semibold text-slate-700 mb-2">Validation Code</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                    </svg>
                  </div>
                  <input
                    type='text'
                    id='code'
                    placeholder='Enter validation code'
                    value={validationCode}
                    onChange={(e) => setValidationCode(e.target.value)}
                    disabled={!isAdmin()}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              {/* Password Field with Strength Indicator */}
              <div className="input-group">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                      <rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect>
                      <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id='password'
                    placeholder='Create a strong password'
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={!isAdmin()}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  />
                  <button 
                    type='button'
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!isAdmin()}
                    aria-label='Toggle password visibility'
                  >
                    {showPassword ? (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
                        <line x1='1' y1='1' x2='23' y2='23'></line>
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                        <circle cx='12' cy='12' r='3'></circle>
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* ✅ ADDED: Password strength indicator */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-semibold text-slate-600 mb-1">Password Requirements:</div>
                    <div className={`text-xs flex items-center gap-1 ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordStrength.hasMinLength ? '✓' : '○'} At least 8 characters
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordStrength.hasUpperCase ? '✓' : '○'} At least one uppercase letter
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordStrength.hasLowerCase ? '✓' : '○'} At least one lowercase letter
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordStrength.hasNumber ? '✓' : '○'} At least one number
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
                      {passwordStrength.hasSpecialChar ? '✓' : '○'} At least one special character (!@#$%^&*)
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="input-group">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                      <rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect>
                      <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id='confirmPassword'
                    placeholder='Confirm your password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!isAdmin()}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                  />
                  <button 
                    type='button'
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={!isAdmin()}
                    aria-label='Toggle confirm password visibility'
                  >
                    {showConfirmPassword ? (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
                        <line x1='1' y1='1' x2='23' y2='23'></line>
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                        <circle cx='12' cy='12' r='3'></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div className="mt-1 text-xs text-red-500">Passwords do not match</div>
                )}
              </div>

              {/* ✅ ADDED: Terms and Conditions Agreement */}
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                  required
                />
                <label htmlFor="agreeToTerms" className="text-sm text-slate-600">
                  I have read and agree to the{' '}
                  <button 
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Privacy Policy
                  </button>
                  {' '}and{' '}
                  <button 
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Terms of Service
                  </button>
                </label>
              </div>

              {/* Submit Button with Loading State */}
              {isAdmin() && (
                <button 
                  type='submit' 
                  className="submit-btn w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              )}
              
              {/* Disabled message for staff users */}
              {!isAdmin() && (
                <div className="disabled-message bg-slate-50 border border-slate-200 text-slate-500 px-4 py-3 rounded-lg text-sm text-center font-medium">
                  Registration is only available for administrators.
                </div>
              )}
            </form>

            {/* ✅ ADDED: Google Registration Button */}
            <div className="divider relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">or sign up with</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="social-btn w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-70 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-slate-700 font-medium">Continue with Google</span>
            </button>

            {/* Footer with link to Login */}
            <footer className="card-footer mt-6 text-center">
              <p className="text-slate-600 font-medium">
                Already have an account? 
                <button 
                  onClick={() => window.location.href = '/login'} 
                  className="text-blue-600 hover:text-blue-700 font-semibold ml-1 hover:underline transition-colors"
                >
                  Sign in
                </button>
              </p>
            </footer>
          </div>
          
          {/* Legal links */}
          <div className="legal-links flex justify-center gap-6 mt-6 text-sm">
            <button 
              onClick={() => setShowPrivacyModal(true)}
              className="text-white/80 hover:text-white font-medium transition-all duration-200 hover:scale-105"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setShowTermsModal(true)}
              className="text-white/80 hover:text-white font-medium transition-all duration-200 hover:scale-105"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </main>

      {/* Modals for Privacy Policy and Terms of Service */}
      <Modal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
        title="Privacy Policy" 
        content={privacyPolicyContent} 
      />
      
      <Modal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
        title="Terms of Service" 
        content={termsContent} 
      />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1500 {
          animation-delay: 1.5s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-2500 {
          animation-delay: 2.5s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Register;