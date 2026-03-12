import React from 'react';
import { FaHome, FaTachometerAlt, FaTruck, FaBox, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: "Home", path: "/", icon: <FaHome />, isParent: false },
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt />, isParent: false },
    { name: "Supplier", path: "/invoice", icon: <FaTruck />, isParent: true },
    { name: "Product", path: "/product", icon: <FaBox />, isParent: false },
    { name: "Order", path: "/order", icon: <FaShoppingCart />, isParent: false },
  ];

  return (
    <div className="sidebar-container">
      
      {/* Sidebar Header - Updated to match Home header design */}
      <div className="sidebar-header">
        <div className="sidebar-header-content group cursor-pointer">
          <div className="relative">
            <img 
              src='src/assets/Pictures/Asiabite.png' 
              alt='AsiaByte Logo' 
              className='sidebar-logo group-hover:scale-105 transition-transform duration-300'
            />
            <div className="absolute -inset-1 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="sidebar-brand font-serif text-white">
            AsiaByte
          </span>
        </div>
      </div>

      {/* Navigation Content */}
      <div className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                end={item.isParent}
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-link-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Footer: Logout Section */}
      <div className="sidebar-footer">
        {/* User Profile */}
        <div className='sidebar-profile'>
          <div className='sidebar-profile-avatar'>
            <button className="sidebar-profile-button">
              <svg className="sidebar-profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
            <span className='sidebar-profile-status'></span>
          </div>

          <div className='sidebar-profile-info'>
            <p className='sidebar-profile-name'>Zaty Raof</p>
            <p className='sidebar-profile-role'>Admin</p>
          </div>
        </div>
        
        <button className="sidebar-logout-btn">
          <FaSignOutAlt className="sidebar-logout-icon" />
          <span className="sidebar-logout-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;