import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddEditStockModal from './AddEditStock';
import './App.css';

const Stock = ({}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState('add');
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Reserved': return 'status-badge-reserved';
      case 'Available': return 'status-badge-available';
      default: return 'status-badge-default';
    }
  }

  // Local data for the table
  const stocks = [
    { id: '1', sku: 'EZ-C8C-2MP', serialNumber: 'SN-001234', refNo: 'REF-8890', stockIn: '2023-10-20', stockOut: '2023-10-21', trackingNumber: 'TRK-9901223', status: 'Reserved'},
    { id: '2', sku: 'EZ-C8C-2MP', serialNumber: 'SN-001235', refNo: 'REF-8891', stockIn: '2023-10-22', stockOut: '', trackingNumber: '', status: 'Available'}
  ];

  const filteredStocks = stocks.filter(stock =>
    stock.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /*const openAddModal = () => {
    setModalMode('add');
    setSelectedStock(null);
    setIsModalOpen(true);
  };*/

  const openEditModal = (stock) => {
    setModalMode('edit');
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  return (
    <div className="containersys">

      {/* Top Info Bar */}
      <div className="top-info-bar">
        
        <div>📍 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</div>
        <div>🕒 Office Hours: 9:00 AM - 6:00 PM</div>
      </div>

      {/* Navigation Bar */}
      <header className="headersys">
        
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex items-center gap-3">
          <img src="src/assets/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-10 w-auto" />
            <span className="logo-text">AsiaByte</span>
          </div>  
        </div>
      </header>

      <main className="all-main-content">
        {/* Page Title Banner */}
        <div className="addedit-banner-row">
          <div className="page-banner">
            <button className="menu-btn">
                <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
            </button>
              <h2 className="banner-title">Stock</h2>
          </div>
          <button onClick={() => navigate('/product')} className="close-btn-minimal" style={{ width: '40px', height: '40px' }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Stats Cards Row */}
        <div className="stats-grid">
        
          <div className='stats-card primary-card'>
            <div className='stats-card-header'>
              <svg className="stats-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className='stats-card-label'>Reserved</span>
            </div>
            <div className='stats-card-content'>
              <h3 className='stats-card-title'>1</h3>
              <p className='stats-card-description'>HUUHUH</p>
            </div>
          </div>

          <div className='stats-card secondary-card'>
            <div className='stats-card-header'>
              <svg className="stats-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className='stats-card-label'>Available</span>
            </div>
            <div className='stats-card-content'>
              <h3 className='stats-card-amount'>3</h3>
              <p className='stats-card-period'>Yeahhh</p>
            </div>
          </div>

        </div>
        <p className="text-[10px] text-gray-400 mt-2 font-medium italic">*Recent</p><br></br>

        {/* Search, Reserved, Add Info Area */}
        <div className="search-container">
          <div className="search-section">
            <label className="search-label">Search</label>
            <div className="search-input-group">
              <input 
                type="text" 
                placeholder="Enter Input"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
            <p className="search-hint">*Serial Number, Reference No, Tracking Number</p>
          </div>

          {/*<div className="add-section">
            
            <button 
              onClick={openAddModal}
              className="add-button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
          </div>*/}
        </div>

        {/* Filter Toolbar - Simple Clean Version */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="bg-white border border-gray-200 rounded p-2 shadow-sm cursor-pointer hover:bg-gray-50">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </div>
          
          {/* Date Filter */}
          <div className="filter-group">
            <input type="month" className="filter-select"/>
          </div>
          
          {/* Status Filter */}
          <div className="relative min-w-[100px]">
            <select className="w-full bg-white border border-gray-200 text-xs px-3 py-2 rounded appearance-none focus:outline-none cursor-pointer hover:border-gray-300">
              <option>Status</option>
              <option>Available</option>
              <option>Reserved</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          
          <button className="flex items-center gap-1 text-xs text-red-500 font-bold border border-red-100 px-3 py-2 rounded bg-red-50 hover:bg-red-100 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Reset Filter
          </button>
        </div>

        {/* Stock Table */}
        <div className="table-wrapper">
          {filteredStocks.length > 0 ? (
            <table className="table">
                <thead>
                    <tr className="bg-[#000066] text-white text-xs uppercase font-serif">
                        <th className="p-4 w-12"></th>
                        <th className="p-4">Serial Number</th>
                        <th className="p-4">Reference No</th>
                        <th className="p-4">Stock In</th>
                        <th className="p-4">Stock Out</th>
                        <th className="p-4">Tracking Number</th>
                        <th className="p-4 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="text-xs text-gray-700 bg-white">
                    {filteredStocks.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                            <td className="p-4">
                                <button 
                                    onClick={() => openEditModal(item)}
                                    className="edit-icon-btn"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                    </svg>
                                </button>
                            </td>
                            <td className="p-4 font-semibold text-[#00008B]">{item.serialNumber}</td>
                            <td className="p-4">{item.refNo}</td>
                            <td className="p-4">{item.stockIn}</td>
                            <td className="p-4">{item.stockOut}</td>
                            <td className="p-4">{item.trackingNumber || '-'}</td>
                            <td className='p-4 text-center'>
                              <span className={`status-badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                            </td>
                            
                        </tr>
                    ))}
                    
                </tbody>
            </table>

          ) : (
            /* No Results Found State */
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <div className="mb-4 text-gray-300">
                <svg className='w-16 h-16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
                </svg>
              </div>
                  <h3 className="text-lg font-semibold text-gray-600">No invoices found</h3>
                  <p className="text-gray-400">Try searching for a different Reference No or Supplier</p>
                  <button onClick={() => setSearchTerm('')} className="mt-4 text-blue-600 font-medium hover:underline">
                    Clear Search
                  </button>
            </div>

          )}
            
        </div>
      </main>
      <AddEditStockModal isOpen={IsModalOpen} onClose={() => setIsModalOpen(false)} stock={selectedStock} mode={modalMode} />

      {/* Footer */}
      <footer className="bg-[#00008B] h-8 md:h-8 w-full mt-auto"></footer>
    </div>
  );
};

export default Stock;