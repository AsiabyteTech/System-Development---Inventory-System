import React, { useState, useRef, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import AddEditSupplierModal from './AddEditSupplier';
import './App.css';
import { isAdmin } from "./shared/role";

const Supplier = () => {
  const navigate = useNavigate();
  const logoScrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeDot, setActiveDot] = useState(0);

  const scrollLogos = (direction) => {
    const container = logoScrollRef.current;
    if (!container) return;
    const scrollAmount = 280;
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  };

  const checkScrollPosition = () => {
    const container = logoScrollRef.current;
    if (!container) return;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const scrollPercent = container.scrollLeft / scrollWidth;
    const totalDots = suppliers.length;
    const dotIndex = Math.round(scrollPercent * (totalDots - 1));
    setActiveDot(dotIndex);
  };

  const scrollToSupplier = (index) => {
    const container = logoScrollRef.current;
    if (!container) return;
    const supplierElements = container.children;
    if (supplierElements[index]) {
      supplierElements[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  useEffect(() => {
    const container = logoScrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const [modalMode, setModalMode] = useState('add');
  const [IsModalOpen, setIsModalOpen] = useState(false);

  const suppliers = [
    {
      id: 'SUP-001',
      name: 'Tapo',
      logo: 'src/assets/Pictures/tapo.jpg',
      pic: 'John Doe',
      address: 'Industrial Park A, Area 51',
      phone: '+6012-3456789'
    },
    {
      id: 'SUP-002',
      name: 'Ezviz',
      logo: 'src/assets/Pictures/ezviz.png',
      pic: 'Jane Smith',
      address: 'Security Hub, West Wing',
      phone: '+6012-9876543'
    },
    {
      id: 'SUP-003',
      name: 'Dahua',
      logo: 'src/assets/Pictures/dahua.png',
      pic: 'Alan Wong',
      address: 'Tech Valley, Block C',
      phone: '+6011-22334455'
    },
  ];
  
  const [activeSupplierIdx, setActiveSupplierIdx] = useState(0);
  const current = suppliers[activeSupplierIdx];

  const openAddModal = () => {
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    setModalMode('edit');
    setIsModalOpen(true);
  };

  return (
    <div className="containersys min-h-screen bg-slate-50">
      <div className="top-info-bar bg-gradient-to-r from-blue-900 to-blue-800 text-white text-xs py-2 px-6 flex justify-between">
        <div>📍 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</div>
        <div>🕒 Office Hours: 9:00 AM - 6:00 PM</div>
      </div>

      <header className="headersys bg-white border-b border-slate-200/60 shadow-sm py-3 px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/invoice')}>
            <div className="relative">
              <img src="src/assets/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="logo-text text-xl font-bold font-serif bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">AsiaByte</span>
          </div>
        </div>
      </header>

      <main className="all-main-content max-w-7xl mx-auto p-6 md:p-8">
        <div className="addedit-banner-row flex justify-between items-center mb-6">
          <div className="title-banner flex items-center bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg overflow-hidden shadow-lg">
            <div className="menu-btn p-3">
              <svg className="menu-icon w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="banner-title text-white font-serif text-xl px-6">Supplier Management</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/invoice')} className="w-10 h-10 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-105 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">SUPPLIER MANAGEMENT</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-800">{suppliers.length} Active Suppliers</h3>
                <p className="text-sm text-slate-500">Manage your vendor relationships</p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">PURCHASE</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-slate-800">RM 24,580.00</h3>
                <p className="text-sm text-slate-500">This month's total purchases</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ FIXED: Supplier Logo Selection Card - Arrows now visible */}
        <div className="form-section-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 mb-8 border border-slate-100 relative overflow-visible">
          <div className="relative z-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Supplier</label>
                {isAdmin() && (
                  <button onClick={openAddModal} className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center" title="Add New Supplier">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                )}
              </div>
              
              {/* ✅ FIXED: Arrow positioning - INSIDE the container with proper spacing */}
              <div className="relative">
                {/* Left Arrow - Positioned inside on the left edge */}
                {showLeftArrow && (
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all duration-200 focus:outline-none"
                    onClick={() => scrollLogos(-1)}
                    aria-label="Scroll left"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Scrollable container */}
                <div 
                  ref={logoScrollRef}
                  className="flex gap-5 overflow-x-auto overflow-y-visible scroll-smooth py-4 px-10"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <style>{`
                    .supplier-logo-scroll::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {suppliers.map((s, idx) => (
                    <button 
                      key={s.id}
                      onClick={() => {
                        setActiveSupplierIdx(idx);
                        scrollToSupplier(idx);
                      }}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 min-w-[140px] shrink-0 ${
                        activeSupplierIdx === idx 
                          ? 'bg-blue-50 border-2 border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                          : 'bg-white hover:bg-slate-50 border border-slate-200 hover:shadow-md hover:scale-105'
                      }`}
                    >
                      <div className="w-20 h-20 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                        <img src={s.logo} alt={s.name} className="w-16 h-16 object-contain" />
                      </div>
                      <span className={`text-sm font-semibold ${
                        activeSupplierIdx === idx ? 'text-blue-700' : 'text-slate-700'
                      }`}>
                        {s.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Right Arrow - Positioned inside on the right edge */}
                {showRightArrow && (
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all duration-200 focus:outline-none"
                    onClick={() => scrollLogos(1)}
                    aria-label="Scroll right"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Pagination Dots */}
              {suppliers.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {suppliers.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveSupplierIdx(idx);
                        scrollToSupplier(idx);
                      }}
                      className={`transition-all duration-300 ${
                        activeSupplierIdx === idx
                          ? 'w-6 h-2 bg-blue-600 rounded-full'
                          : 'w-2 h-2 bg-slate-300 rounded-full hover:bg-slate-400'
                      }`}
                      aria-label={`Go to supplier ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Supplier Details Form */}
        <div className="form-section-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 mb-8 border border-slate-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800">{current.name}</h3>
              {isAdmin() && (
                <button onClick={openEditModal} className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center" title="Edit Supplier">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </button>
              )}
            </div>

            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Supplier ID</label>
                <input type="text" disabled defaultValue={current.id} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium" />
              </div>

              <div className="hidden md:block"></div>

              {/* Person In Charge */}
              <div className="space-y-2">
                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Person In Charge</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input type="text" disabled={!isAdmin()} defaultValue={current.pic} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 disabled:bg-slate-100 disabled:cursor-not-allowed" />
                </div>
              </div>

              {/* Supplier Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Supplier Address</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 pointer-events-none z-10">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <textarea rows={3} disabled={!isAdmin()} defaultValue={current.address} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 disabled:bg-slate-100 disabled:cursor-not-allowed resize-none" />
                </div>
              </div>

              {/* Supplier Phone */}
              <div className="space-y-2">
                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Supplier Phone Number</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <input type="text" disabled={!isAdmin()} defaultValue={current.phone} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 disabled:bg-slate-100 disabled:cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddEditSupplierModal isOpen={IsModalOpen} onClose={() => setIsModalOpen(false)} mode={modalMode} supplier={modalMode === 'edit' ? current : null}/>

      <footer className="bg-gradient-to-r from-blue-900 to-blue-700 h-8 w-full print:hidden flex items-center justify-center">
        <span className="text-white text-xs">© 2026 AsiaByte. All rights reserved.</span>
      </footer>

      <div className="print-footer hidden print:block text-center text-gray-700 text-xs mt-4">
        © 2026 AsiaByte. All rights reserved.
      </div>
    </div>
  );
};

export default Supplier;