import React from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiArrowRight, FiUser } from 'react-icons/fi';
import { BsGraphUp, BsBoxSeam, BsPeople } from 'react-icons/bs';
// ✅ ADDED: role-based condition import
import { isAdmin } from "./shared/role";
import "./App.css";

const Home = () => {
  const navigate = useNavigate();
  const partners = [
    "ruckus-networks-logo.png",
    "dahua.png",
    "rising net distributor.png",
    "TPLINK_Logo_2.svg.png",
    "hikvision-removebg-preview.png",
    "viskou_distributor-removebg-preview.png",
    "amt-removebg-preview.png",
    "ezviz.png",
    "tapo.jpg",
    "hiksemi.png",
  ];

  // ✅ FIXED: Updated image path to use public folder
  const getImagePath = (img) => `/Pictures/${img}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header with glass effect matching dashboard */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 group cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="relative">
              {/* ✅ FIXED: Updated image path */}
              <img 
                src="/Pictures/Asiabite.png" 
                alt="AsiaByte Logo" 
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -inset-1 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <span className="text-xl font-bold font-serif bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                AsiaByte
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className='hidden md:flex flex-col items-end mr-2'>
              <span className='text-sm font-semibold text-slate-800'>Zaty Raof</span>
              {/* ✅ ADDED: role-based condition - Display role dynamically */}
              <span className='text-xs text-blue-600/70'>{isAdmin() ? 'Administrator' : 'Staff'}</span>
            </div>
            <div className="relative flex items-center">
              <button className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
                <FiUser className="w-5 h-5" />
              </button>
              <span className='absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse'></span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with hero0.jpg background using App.css class */}
      <section className="relative overflow-hidden">
        {/* Background Image using hero-background class from App.css */}
        <div className="hero-background">
          {/* Lighter gradient overlay for better image visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/45 to-blue-700/40"></div>
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              AsiaByte P&L Inventory Systems
            </h1>
            <p className="text-lg md:text-xl text-blue-50/90 mb-8 max-w-2xl leading-relaxed">
              We specialize in networking, cloud services, security systems, and IT support tailored to your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ FIXED: Partners Section - No clipping, full borders visible */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
              Clients & Partners
            </h2>
            <p className="text-slate-500">Partnering with the best in the industry</p>
          </div>
          
          {/* Scrolling Container - Fixed overflow and clipping issues */}
          <div className="relative">
            {/* Gradient overlays - adjusted width to not cut off cards */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            {/* ✅ FIXED: Scroll container with proper padding and overflow */}
            <div className="overflow-hidden py-4">
              <div className="flex gap-6 animate-scroll">
                {/* Combine original and duplicate logos in one array */}
                {[...partners, ...partners].map((img, index) => (
                  <div 
                    key={`logo-${index}`} 
                    className="flex-shrink-0 w-32 h-24 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-visible"
                  >
                    {/* ✅ FIXED: Using updated getImagePath function */}
                    <img 
                      src={getImagePath(img)} 
                      alt={`Partner ${index + 1}`} 
                      className="w-full h-full object-contain p-3"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                      }}
                    />
                    {/* Fallback text if image fails to load */}
                    <span className="hidden group-hover:block text-xs text-slate-500 font-medium text-center px-2 absolute bottom-0 left-0 right-0 bg-white/90 rounded-b-xl py-1">
                      {img.split('.')[0].replace(/[-_]/g, ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Navigation Cards with original icon hover effect */}
      <main className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Navigation</h2>
            <p className="text-slate-500">Access your inventory management tools</p>
          </div>
          
          <div className="grid lg:grid-cols-[1.3fr_0.9fr] gap-6">
            
            {/* Left Column - 3 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Dashboard Card - Blue theme */}
              <div 
                className="group bg-blue-50 hover:bg-blue-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-200 overflow-hidden cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                <div className="p-5 relative">
                  <h3 className="text-lg font-bold text-slate-800">Dashboard</h3>
                  <div className="absolute top-5 right-5">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-125 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                      <BsGraphUp className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-12 flex items-center text-sm font-medium text-blue-600">
                    View Reports
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Supplier Card - Green theme */}
              <div 
                className="group bg-emerald-50 hover:bg-emerald-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-emerald-200 overflow-hidden cursor-pointer"
                onClick={() => navigate('/invoice')}
              >
                <div className="p-5 relative">
                  <h3 className="text-lg font-bold text-slate-800">Supplier</h3>
                  <div className="absolute top-5 right-5">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-125 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                      <BsPeople className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-12 flex items-center text-sm font-medium text-emerald-600">
                    View Invoices
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Product Card - Purple theme */}
              <div 
                className="group sm:col-span-2 bg-purple-50 hover:bg-purple-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-200 overflow-hidden cursor-pointer"
                onClick={() => navigate('/product')}
              >
                <div className="p-5 relative">
                  <h3 className="text-lg font-bold text-slate-800">Product</h3>
                  <div className="absolute top-5 right-5">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-125 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                      <BsBoxSeam className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-12 flex items-center text-sm font-medium text-purple-600">
                    Check Stock Levels
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Card */}
            <div 
              className="group bg-amber-50 hover:bg-amber-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-200 overflow-hidden cursor-pointer"
              onClick={() => navigate('/order')}
            >
              <div className="p-5 relative">
                <h3 className="text-lg font-bold text-slate-800">Order</h3>
                <div className="absolute top-5 right-5">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-125 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                    <FiShoppingCart className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
                <div className="mt-12 flex flex-col gap-1.5">
                  <div className="flex items-center text-sm font-medium text-amber-600">
                    Customer
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="flex items-center text-sm font-medium text-amber-600">
                    Inventory
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - professional footer at bottom */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs text-slate-500">
              © 2026 AsiaByte. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Animation styles */}
      <style jsx>{`
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Home;