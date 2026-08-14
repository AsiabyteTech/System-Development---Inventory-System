// Register.jsx - Remove staffId field and related state
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // REMOVED: staffId state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
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

  // FIXED: Form submission without staffId
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validation
    if (!agreeToTerms) {
      setErrorMessage('Please read and agree to the Privacy Policy and Terms of Service.');
      setIsLoading(false);
      return;
    }
    
    if (!fullName || !email || !password || !confirmPassword) {
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
    
    try {
      console.log('Attempting registration with:', { fullName, email });
      
      // staffId is now auto-generated on the backend
      const response = await register(fullName, email, password);
      
      console.log('Registration successful:', response);
      
      // Show the auto-generated staff ID to the user
      const generatedStaffId = response.staff_id;
      setSuccessMessage(
        `Registration successful! Your Staff ID is: ${generatedStaffId}. You can now login.`
      );
      
      // Store user info
      localStorage.setItem("userName", fullName);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("staffId", generatedStaffId);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Registration error details:', err);
      
      let errorMsg = 'Registration failed. Please try again.';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data.detail) {
          errorMsg = Array.isArray(data.detail) 
            ? data.detail.map(d => d.msg || d).join(', ')
            : data.detail;
        } else if (data.message) {
          errorMsg = data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    setErrorMessage('');
    
    setTimeout(() => {
      console.log('Google registration initiated as staff');
      localStorage.setItem("role", "staff");
      localStorage.setItem("userRole", "staff");
      localStorage.setItem("userEmail", "staff@gmail.com");
      localStorage.setItem("userName", "Google User");
      localStorage.setItem("staffId", "STAFF001");
      localStorage.setItem("googleRegister", "true");
      localStorage.setItem("isStaffRegistered", "true");
      setIsLoading(false);
      setSuccessMessage('Google registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 1000);
  };

  // Modal component
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

  const privacyPolicyContent = (
    <>
      <div className="space-y-4">
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">1. Information We Collect</h4>
          <p className="text-xs sm:text-sm leading-relaxed">AsiaByte P&L Inventory System collects the following information to provide and improve our services:</p>
          <ul className="list-disc pl-5 mt-2 text-xs sm:text-sm leading-relaxed space-y-1">
            <li><strong>Personal Information:</strong> Full name, email address, Staff ID, and role information</li>
            <li><strong>Account Credentials:</strong> Securely hashed password for system access</li>
            <li><strong>Usage Data:</strong> Inventory management activities, order history, and system interactions</li>
            <li><strong>Device Information:</strong> Browser type, IP address, and access timestamps for security purposes</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">2. How We Use Your Information</h4>
          <p className="text-xs sm:text-sm leading-relaxed">Your information is used for the following purposes:</p>
          <ul className="list-disc pl-5 mt-2 text-xs sm:text-sm leading-relaxed space-y-1">
            <li>Authenticating your identity and providing secure system access</li>
            <li>Managing inventory, orders, and supplier relationships</li>
            <li>Generating reports and analytics for business insights</li>
            <li>Communicating important system updates and notifications</li>
            <li>Improving system performance and user experience</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">3. Data Security & Protection</h4>
          <p className="text-xs sm:text-sm leading-relaxed">We implement industry-standard security measures to protect your data:</p>
          <ul className="list-disc pl-5 mt-2 text-xs sm:text-sm leading-relaxed space-y-1">
            <li>End-to-end encryption for sensitive data transmission</li>
            <li>Secure password hashing (never stored in plain text)</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Role-based access controls to prevent unauthorized data access</li>
            <li>Automatic session timeout after periods of inactivity</li>
          </ul>
          <p className="text-xs sm:text-sm leading-relaxed mt-2">We do NOT sell, trade, or rent your personal information to third parties.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">4. User Rights & Control</h4>
          <p className="text-xs sm:text-sm leading-relaxed">You have the following rights regarding your data:</p>
          <ul className="list-disc pl-5 mt-2 text-xs sm:text-sm leading-relaxed space-y-1">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request account deletion (subject to business retention policies)</li>
            <li><strong>Restriction:</strong> Limit how your data is processed</li>
          </ul>
          <p className="text-xs sm:text-sm leading-relaxed mt-2">To exercise these rights, contact your system administrator.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">5. Data Retention</h4>
          <p className="text-xs sm:text-sm leading-relaxed">We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, including legal, accounting, or reporting requirements. Inactive accounts may be archived after 12 months of inactivity.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">6. Cookies & Tracking Technologies</h4>
          <p className="text-xs sm:text-sm leading-relaxed">We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze system usage. You can control cookie settings through your browser preferences, though disabling cookies may affect system functionality.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">7. Policy Updates</h4>
          <p className="text-xs sm:text-sm leading-relaxed">We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Material changes will be communicated via email or system notification. The effective date will be updated accordingly.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">8. Contact Information</h4>
          <p className="text-xs sm:text-sm leading-relaxed">For questions about this Privacy Policy or your data, please contact:</p>
          <p className="text-xs sm:text-sm leading-relaxed mt-1"><strong>Email:</strong> privacy@asiabyte.com</p>
          <p className="text-xs sm:text-sm leading-relaxed"><strong>Phone:</strong> +60 3-1234 5678</p>
          <p className="text-xs sm:text-sm leading-relaxed"><strong>Address:</strong> 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</p>
        </div>
        
        <p className="text-xs text-slate-400 italic mt-4">Effective Date: April 1, 2026</p>
      </div>
    </>
  );

  // ✅ UPDATED: Expanded Terms of Service content
  const termsContent = (
    <>
      <div className="space-y-4">
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">1. Acceptance of Terms</h4>
          <p className="text-xs sm:text-sm leading-relaxed">By accessing or using the AsiaByte P&L Inventory System, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the system.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">2. Account Registration & Security</h4>
          <p className="text-xs sm:text-sm leading-relaxed">You must provide accurate and complete information when creating an account. You are responsible for:</p>
          <ul className="list-disc pl-5 mt-2 text-xs sm:text-sm leading-relaxed space-y-1">
            <li>Maintaining the confidentiality of your login credentials</li>
            <li>All activities that occur under your account</li>
            <li>Immediately notifying AsiaByte of any unauthorized account access</li>
            <li>Ensuring your password meets security requirements (minimum 8 characters, including uppercase, lowercase, numbers, and special characters)</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">3. User Responsibilities</h4>
          <p className="text-xs sm:text-sm leading-relaxed">As a user of the AsiaByte Inventory System, you agree to:</p>
          <ul className="list-disc pl-5 mt-2 text-xs sm:text-sm leading-relaxed space-y-1">
            <li>Use the system only for legitimate business purposes</li>
            <li>Maintain accurate and up-to-date inventory records</li>
            <li>Follow proper procedures for stock intake, orders, and returns</li>
            <li>Report any system errors or security vulnerabilities promptly</li>
            <li>Respect the confidentiality of other users' data</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">4. Prohibited Activities</h4>
          <p className="text-xs sm:text-sm leading-relaxed">The following activities are strictly prohibited:</p>
          <ul className="list-disc pl-5 mt-2 text-xs sm:text-sm leading-relaxed space-y-1">
            <li>Attempting to gain unauthorized access to other accounts or data</li>
            <li>Uploading malicious code, viruses, or harmful software</li>
            <li>Manipulating inventory data to falsify records</li>
            <li>Using the system for any illegal or fraudulent activities</li>
            <li>Sharing your account credentials with unauthorized personnel</li>
            <li>Attempting to bypass security measures or access restrictions</li>
            <li>Interfering with system performance or availability</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">5. Role-Based Access & Permissions</h4>
          <p className="text-xs sm:text-sm leading-relaxed">Access to system features is determined by your assigned role:</p>
          <ul className="list-disc pl-5 mt-2 text-xs sm:text-sm leading-relaxed space-y-1">
            <li><strong>Admin:</strong> Full system access, including user management, reporting, and configuration</li>
            <li><strong>Staff:</strong> Access to inventory and order management, limited administrative functions</li>
          </ul>
          <p className="text-xs sm:text-sm leading-relaxed mt-2">You may not attempt to access features beyond your authorized role.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">6. Intellectual Property</h4>
          <p className="text-xs sm:text-sm leading-relaxed">All content, features, and functionality of the AsiaByte Inventory System, including but not limited to software, design, logos, and trademarks, are owned by AsiaByte and are protected by intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of the system without express written consent.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">7. Limitation of Liability</h4>
          <p className="text-xs sm:text-sm leading-relaxed">To the maximum extent permitted by law, AsiaByte shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business interruption, resulting from your use of or inability to use the system.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">8. Termination of Access</h4>
          <p className="text-xs sm:text-sm leading-relaxed">AsiaByte reserves the right to suspend or terminate your account immediately, without prior notice, for conduct that violates these terms, poses a security risk, or is harmful to other users or the system. Upon termination, your access to the system will be revoked, and your data may be archived or deleted in accordance with our data retention policy.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">9. Data Backup & Recovery</h4>
          <p className="text-xs sm:text-sm leading-relaxed">While AsiaByte performs regular system backups, users are encouraged to maintain their own records of critical data. AsiaByte is not responsible for data loss resulting from system failures, user errors, or unauthorized access.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">10. Modification of Terms</h4>
          <p className="text-xs sm:text-sm leading-relaxed">AsiaByte reserves the right to modify these terms at any time. Material changes will be communicated via email or system notification. Your continued use of the system after any changes constitutes acceptance of the new terms.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">11. Governing Law</h4>
          <p className="text-xs sm:text-sm leading-relaxed">These terms shall be governed by and construed in accordance with the laws of Malaysia, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of the system shall be subject to the exclusive jurisdiction of the courts of Malaysia.</p>
        </div>
        
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">12. Contact Information</h4>
          <p className="text-xs sm:text-sm leading-relaxed">For questions about these Terms of Service, please contact:</p>
          <p className="text-xs sm:text-sm leading-relaxed mt-1"><strong>Email:</strong> legal@asiabyte.com</p>
          <p className="text-xs sm:text-sm leading-relaxed"><strong>Phone:</strong> +60 3-1234 5678</p>
          <p className="text-xs sm:text-sm leading-relaxed"><strong>Address:</strong> 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</p>
        </div>
        
        <p className="text-xs text-slate-400 italic mt-4">Last Updated: April 1, 2026</p>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <main className="auth-container w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 flex flex-col lg:flex-row items-center justify-center min-h-screen relative z-10">
        
        {/* Left brand section */}
        <div className="brand-section w-full lg:flex-1 mb-8 lg:mb-0 lg:pr-8 xl:pr-16">
          <div className="brand-header mb-6 sm:mb-8 md:mb-10 animate-fade-in-up flex justify-center lg:justify-start">
            <div className="brand-icon-box w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-105 border border-white/30">
              <img src="/Pictures/Asiabite.png" alt="Logo" className="logo-image w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain" />
            </div>
          </div>
          <div className="brand-content text-center lg:text-left animate-fade-in-up animation-delay-200">
            <h1 className="hero-text mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-white via-white to-cyan-200 bg-clip-text text-transparent block leading-tight">
                AsiaByte
              </span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white/95 block mt-2 leading-tight">
                P&L Inventory System
              </span>
            </h1>
            
            <div className="relative mt-4 sm:mt-6 max-w-full sm:max-w-md mx-auto lg:mx-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-75"></div>
              <div className="relative bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/20 shadow-2xl">
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-relaxed tracking-wide">
                  Join teams building the future with AsiaByte's
                  <br />
                  <span className="text-cyan-200/90 font-bold">strong infrastructure platform.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="form-section w-full max-w-md lg:max-w-md xl:max-w-lg mx-auto lg:mx-0 animate-fade-in-up animation-delay-400">
          <div className="auth-card bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-6 sm:p-8 relative overflow-hidden">
            <div className="card-accent-bar absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
            
            <header className="card-header mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Staff Registration</h2>
              <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Please enter your details to create a staff account.</p>
            </header>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="flex-1">{successMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2 animate-shake">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            <form className="auth-form space-y-5" onSubmit={handleSubmit}>
              
              {/* Full Name */}
              <div className="input-group">
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400 flex-shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                      <path d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
                    </svg>
                  </div>
                  <input 
                    type='text' 
                    id='fullName' 
                    placeholder='Enter your full name' 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base" 
                    required 
                  />
                </div>
              </div>
              
              {/* Email */}
              <div className="input-group">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400 flex-shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
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
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base" 
                    required 
                  />
                </div>
              </div>

              {/* Staff ID 
              <div className="input-group">
                <label htmlFor="staffId" className="block text-sm font-semibold text-slate-700 mb-2">Staff ID *</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400 flex-shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                      <path d='M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0h4'></path>
                    </svg>
                  </div>
                  <input 
                    type='text' 
                    id='staffId' 
                    placeholder='e.g., AD01' 
                    value={staffId} 
                    onChange={handleStaffIdChange} 
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base uppercase" 
                    required 
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">*Letters and numbers only, maximum 10 characters</p>
              </div> */}

              {/* Password */}
              <div className="input-group">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Password *</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400 flex-shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
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
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base" 
                    required 
                  />
                  <button 
                    type='button' 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                        <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
                        <line x1='1' y1='1' x2='23' y2='23'></line>
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                        <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                        <circle cx='12' cy='12' r='3'></circle>
                      </svg>
                    )}
                  </button>
                </div>
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

              {/* Confirm Password */}
              <div className="input-group">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password *</label>
                <div className="input-wrapper relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className='w-5 h-5 text-slate-400 flex-shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
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
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-base" 
                    required 
                  />
                  <button 
                    type='button' 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                        <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
                        <line x1='1' y1='1' x2='23' y2='23'></line>
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
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

              {/* Terms Agreement */}
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="agreeToTerms" 
                  checked={agreeToTerms} 
                  onChange={(e) => setAgreeToTerms(e.target.checked)} 
                  className="mt-1 w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 transition-all flex-shrink-0" 
                  required 
                />
                <label htmlFor="agreeToTerms" className="text-xs sm:text-sm text-slate-600">
                  I have read and agree to the{' '}
                  <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Privacy Policy
                  </button>
                  {' '}and{' '}
                  <button type="button" onClick={() => setShowTermsModal(true)} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Terms of Service
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type='submit' 
                className="submit-btn w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 text-sm sm:text-base" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : 'Register'}
              </button>
            </form>
          </div>
          
          {/* Legal links */}
          <div className="legal-links flex justify-center gap-4 sm:gap-6 mt-6 text-xs sm:text-sm">
            <button onClick={() => setShowPrivacyModal(true)} className="text-white/80 hover:text-white font-medium transition-all duration-200 hover:scale-105">
              Privacy Policy
            </button>
            <button onClick={() => setShowTermsModal(true)} className="text-white/80 hover:text-white font-medium transition-all duration-200 hover:scale-105">
              Terms of Service
            </button>
          </div>
        </div>
      </main>

      <Modal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Privacy Policy" content={privacyPolicyContent} />
      <Modal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} title="Terms of Service" content={termsContent} />

      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        @keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-2px)}20%,40%,60%,80%{transform:translateX(2px)}}
        @keyframes blob{0%{transform:translate(0px,0px) scale(1)}33%{transform:translate(30px,-50px) scale(1.1)}66%{transform:translate(-20px,20px) scale(0.9)}100%{transform:translate(0px,0px) scale(1)}}
        @keyframes float{0%{transform:translateY(0px)}50%{transform:translateY(-20px)}100%{transform:translateY(0px)}}
        .animate-fade-in-up{animation:fadeInUp 0.6s ease-out forwards}
        .animate-fadeIn{animation:fadeIn 0.2s ease-out}
        .animate-scaleIn{animation:scaleIn 0.2s ease-out}
        .animate-shake{animation:shake 0.5s ease-in-out}
        .animate-blob{animation:blob 7s infinite}
        .animate-float{animation:float 6s ease-in-out infinite}
        .animation-delay-200{animation-delay:0.2s;opacity:0;animation-fill-mode:forwards}
        .animation-delay-400{animation-delay:0.4s;opacity:0;animation-fill-mode:forwards}
      `}</style>
    </div>
  );
};

export default Register;