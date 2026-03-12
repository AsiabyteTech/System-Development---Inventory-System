import React, { useState, useRef } from 'react';
import {useNavigate} from "react-router-dom";
import AddEditSupplierModal from './AddEditSupplier';
import './App.css';

const Supplier = () => {
  const navigate = useNavigate();
  const logoScrollRef = useRef(null);
  const scrollLogos = (direction) => {
    const container = logoScrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction * 160,
      behavior: 'smooth',
    });
  };
  
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
    }
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
    <div className="addedit-page">
      {/* Top Header Bar */}
      <div className="top-info-bar">
        <div>📍 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</div>
        <div>🕒 Office Hours: 9:00 AM - 6:00 PM</div>
      </div>

      {/* Navigation */}
      <header className="headersys">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/invoice')}>
          <div className="flex items-center gap-3">
          <img src="src/assets/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-10 w-auto" />
            <span className="logo-text">AsiaByte</span>
          </div>  
        </div>
      </header>

      <main className="all-main-content">
        {/* Banner Section */}
        <div className="addedit-banner-row">
          <div className="page-banner">
          <button className="menu-btn">
            <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </button>
          <h2 className="banner-title">Supplier</h2>
          </div>
          <button onClick={() => navigate('/invoice')} className="close-btn-minimal" style={{ width: '40px', height: '40px' }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
          </button>
        </div>

        {/* Horizontal Logo Scroll*/}
        <div className="supplier-logo-scroll-container">
          <button
            className="logo-nav left"
            onClick={() => scrollLogos(-1)}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <div className="supplier-logo-scroll" ref={logoScrollRef}>
            {suppliers.map((s, idx) => (
              <button 
                key={s.id}
                onClick={() => setActiveSupplierIdx(idx)}
                className={`supplier-logo-btn ${activeSupplierIdx === idx ? 'supplier-logo-active' : 'supplier-logo-inactive'}`}
              >
                <img src={s.logo} alt={s.name} className="supplier-logo-img" />
              </button>
            ))}
          </div>
          <button
            className="logo-nav right"
            onClick={() => scrollLogos(1)}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>

        {/* Supplier Name Header */}
        <div className="supplier-name-header flex justify-between items-center">
          <h3 className="supplier-current-name text-2xl font-bold">{current.name}</h3>
          <button className="supplier-add-btn" onClick={openAddModal}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>
        </div>
        <hr></hr>
        <br></br>

        {/* Form Details Area */}
        <div className="direct-form-container relative mt-4">
          {/* Watermark */}
          {/*<div className="watermark-bg">
            <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-[#00008B]">
              <path d="M30 30 C 10 30, 10 10, 30 10 C 45 10, 55 50, 70 50 C 90 50, 90 30, 70 30 C 55 30, 45 10, 30 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </div>*/}

          {/*<button 
            onClick={() => setIsEditing(!isEditing)}
            className={`edit-btn ${isEditing ? 'edit-active' : 'edit-inactive'}`}
          >
            {isEditing ? (
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <svg className="edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            )}
          </button>*/}

          <button 
            onClick={openEditModal}
            className="supplier-card-edit-btn absolute right-4 top-4 bg-gray-100 p-2 rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
          </button>

          <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="direct-form-field ">
              <label className="input-label">Supplier ID</label>
              <input 
                type="text" 
                disabled
                defaultValue={current.id}
                className="direct-form-input"
              />
            </div>

            <div className="direct-form-spacer"></div>

            <div className="direct-form-field">
              <label className="input-label">Person In Charge</label>
              <input 
                type="text" 
                disabled
                defaultValue={current.pic}
                className="direct-form-input"
              />
            </div>

            <div className="direct-form-field">
              <label className="input-label">Supplier Address</label>
              <textarea 
                type="text" 
                disabled
                defaultValue={current.address}
                className="direct-form-input"
              />
            </div>

            <div className="direct-form-field">
              <label className="input-label">Supplier Phone Number</label>
              <input 
                type="text"
                disabled 
                defaultValue={current.phone}
                className="direct-form-input"
              />
            </div>
          </div>
        </div>
      </main>

      {/*Modal Component */}
      <AddEditSupplierModal isOpen={IsModalOpen} onClose={() => setIsModalOpen(false)} mode={modalMode} supplier={modalMode === 'edit' ? current : null}/>

      {/* Footer */}
      <footer className="bg-[#00008B] h-8 md:h-8 w-full mt-auto"></footer>
    </div>
  );
};

export default Supplier;