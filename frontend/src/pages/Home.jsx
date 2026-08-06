// ✅ REFACTORED: imports organized and cleaned
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiArrowRight, FiUser } from 'react-icons/fi';
import { BsGraphUp, BsBoxSeam, BsPeople } from 'react-icons/bs';

// ✅ REFACTORED: role import path corrected
import { isAdmin } from "../shared/role";

// ✅ REFACTORED: CSS imports - animations moved to dedicated file
import "../App.css";
import "../styles/animations.css";

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

  const getImagePath = (img) => `/Pictures/${img}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      {/* Header Section */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200/60 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex justify-between items-center gap-2 sm:gap-4">
          <div 
            className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer flex-shrink-0" 
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <img 
                src="/Pictures/Asiabite.png" 
                alt="AsiaByte Logo" 
                className="h-7 sm:h-8 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -inset-1 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <span className="text-base sm:text-lg md:text-xl font-bold font-serif bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                AsiaByte
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <div className='hidden sm:flex flex-col items-end mr-0 sm:mr-1 md:mr-2'>
              <span className='text-xs sm:text-sm font-semibold text-slate-800'>Zaty Raof</span>
              <span className='text-[10px] sm:text-xs text-blue-600/70'>{isAdmin() ? 'Administrator' : 'Staff'}</span>
            </div>
            <div className="relative flex items-center">
              <button className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
                <FiUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </button>
              <span className='absolute -bottom-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3.5 md:h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse'></span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden w-full">
        <div 
          className="hero-background w-full absolute inset-0"
          style={{
            backgroundImage: "url('/Pictures/hero0.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed"
          }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-blue-900/75 to-slate-900/80"></div>
        <div className="absolute inset-0 shadow-inner pointer-events-none"></div>

        <div className="hidden sm:block absolute top-20 left-10 w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-blue-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="hidden md:block absolute bottom-20 right-10 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-purple-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28">
          <div className="max-w-full sm:max-w-2xl md:max-w-3xl animate-fade-in-up text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight">
              AsiaByte P&L Inventory Systems
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-blue-50/95 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto sm:mx-0 leading-relaxed">
              We specialize in networking, cloud services, security systems, and IT support tailored to your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 mb-2 sm:mb-3">
              Clients & Partners
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-500">Partnering with the best in the industry</p>
          </div>
          
          <div className="relative w-full">
            <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 md:w-12 lg:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-8 md:w-12 lg:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            <div className="overflow-hidden py-3 sm:py-4 w-full">
              <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 animate-scroll">
                {[...partners, ...partners].map((img, index) => (
                  <div 
                    key={`logo-${index}`} 
                    className="flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 lg:w-32 lg:h-24 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-visible"
                  >
                    <img 
                      src={getImagePath(img)} 
                      alt={`Partner ${index + 1}`} 
                      className="w-full h-full object-contain p-1.5 sm:p-2 md:p-3"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                      }}
                    />
                    <span className="hidden group-hover:block text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-slate-500 font-medium text-center px-1 sm:px-2 absolute bottom-0 left-0 right-0 bg-white/90 rounded-b-xl py-0.5 sm:py-1 truncate">
                      {img.split('.')[0].replace(/[-_]/g, ' ').substring(0, 15).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <main className="py-8 sm:py-12 md:py-16 bg-slate-50 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 sm:mb-3">Navigation</h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-500">Access your inventory management tools</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-4 sm:gap-5 md:gap-6 w-full">
            
            {/* Left Column */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              
              {/* Dashboard Card */}
              <div 
                className="group bg-blue-50 hover:bg-blue-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-200 overflow-hidden cursor-pointer w-full"
                onClick={() => navigate('/dashboard')}
              >
                <div className="p-3 sm:p-4 md:p-5 relative">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-800">Dashboard</h3>
                  <div className="absolute top-3 sm:top-4 md:top-5 right-3 sm:right-4 md:right-5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-125 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                      <BsGraphUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 flex items-center text-[11px] sm:text-xs md:text-sm font-medium text-blue-600">
                    View Reports
                    <FiArrowRight className="ml-1 sm:ml-2 transition-transform group-hover:translate-x-1 text-xs sm:text-sm" />
                  </div>
                </div>
              </div>

              {/* Supplier Card */}
              <div 
                className="group bg-emerald-50 hover:bg-emerald-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-emerald-200 overflow-hidden cursor-pointer w-full"
                onClick={() => navigate('/invoice')}
              >
                <div className="p-3 sm:p-4 md:p-5 relative">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-800">Supplier</h3>
                  <div className="absolute top-3 sm:top-4 md:top-5 right-3 sm:right-4 md:right-5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-125 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                      <BsPeople className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-8 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 flex items-center text-[11px] sm:text-xs md:text-sm font-medium text-emerald-600">
                    View Invoices
                    <FiArrowRight className="ml-1 sm:ml-2 transition-transform group-hover:translate-x-1 text-xs sm:text-sm" />
                  </div>
                </div>
              </div>

              {/* Product Card */}
              <div 
                className="sm:col-span-2 bg-purple-50 hover:bg-purple-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-200 overflow-hidden cursor-pointer w-full"
                onClick={() => navigate('/product')}
              >
                <div className="p-3 sm:p-4 md:p-5 relative">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-800">Product</h3>
                  <div className="absolute top-3 sm:top-4 md:top-5 right-3 sm:right-4 md:right-5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-125 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                      <BsBoxSeam className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 flex items-center text-[11px] sm:text-xs md:text-sm font-medium text-purple-600">
                    Check Stock Levels
                    <FiArrowRight className="ml-1 sm:ml-2 transition-transform group-hover:translate-x-1 text-xs sm:text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Card */}
            <div 
              className="group bg-amber-50 hover:bg-amber-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-200 overflow-hidden cursor-pointer w-full"
              onClick={() => navigate('/order')}
            >
              <div className="p-3 sm:p-4 md:p-5 relative">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-800">Order</h3>
                <div className="absolute top-3 sm:top-4 md:top-5 right-3 sm:right-4 md:right-5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-125 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                    <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-8 text-amber-600" />
                  </div>
                </div>
                <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 flex flex-col gap-1 sm:gap-1.5">
                  <div className="flex items-center text-[11px] sm:text-xs md:text-sm font-medium text-amber-600">
                    Customer
                    <FiArrowRight className="ml-1 sm:ml-2 transition-transform group-hover:translate-x-1 text-xs sm:text-sm" />
                  </div>
                  <div className="flex items-center text-[11px] sm:text-xs md:text-sm font-medium text-amber-600">
                    Inventory
                    <FiArrowRight className="ml-1 sm:ml-2 transition-transform group-hover:translate-x-1 text-xs sm:text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 sm:py-4 md:py-6 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500">
              © 2026 AsiaByte. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;