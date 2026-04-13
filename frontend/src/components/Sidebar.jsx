import React from 'react';
import { FaHome, FaTachometerAlt, FaTruck, FaBox, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  
  // Get user role from localStorage (set during login)
  const userRole = localStorage.getItem("userRole") || "Staff";
  
  const menuItems = [
    { name: "Home", path: "/", icon: <FaHome />, isParent: false },
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt />, isParent: false },
    { name: "Supplier", path: "/invoice", icon: <FaTruck />, isParent: true },
    { name: "Product", path: "/product", icon: <FaBox />, isParent: false },
    { name: "Order", path: "/order", icon: <FaShoppingCart />, isParent: false },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate('/login');
  };

  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-50 flex flex-col">
      
      {/* Sidebar Header - Modern glass effect */}
      <div className="px-5 pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative">
            <img 
              src='src/assets/Pictures/Asiabite.png' 
              alt='AsiaByte Logo' 
              className='w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3'
            />
            <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-serif bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent tracking-tight">
              AsiaByte
            </span>
            <span className="text-[10px] text-blue-300/60 tracking-wider uppercase">Inventory System</span>
          </div>
        </div>
      </div>

      {/* Navigation Content - Improved spacing and visual hierarchy */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6">
        <div className="px-4 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400/60 px-3">
            Main Navigation
          </span>
        </div>
        <ul className="space-y-1.5 px-3">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                end={item.isParent}
                to={item.path}
                className={({ isActive }) => 
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {/* Active indicator bar */}
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-sm"></div>
                    )}
                    <span className={`text-lg transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium tracking-wide">{item.name}</span>
                    
                    {/* Active badge for current page */}
                    {isActive && (
                      <span className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Footer - Modern profile & logout section */}
      <div className="border-t border-white/10 pt-4 pb-6 px-4 mt-auto">
        {/* User Profile - Enhanced design */}
        <div className="relative group mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Zaty Raof</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-xs text-slate-400 truncate">{formatRole(userRole)}</p>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Logout Button - Enhanced */}
        <button 
          onClick={handleLogout} 
          className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-slate-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent"
        >
          <span className="text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <FaSignOutAlt />
          </span>
          <span className="text-sm font-medium tracking-wide">Logout</span>
          
          {/* Hover gradient effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/5 transition-all duration-500"></div>
        </button>
        
        {/* Version info - subtle touch */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-500/60">v2.0.0 © 2026</p>
        </div>
      </div>

      {/* Custom scrollbar styling */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;