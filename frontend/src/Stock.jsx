import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { useNavigate } from 'react-router-dom';
import AddEditStockModal from './AddEditStock';
import './App.css';

const Stock = ({}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalMode, setModalMode] = useState('add');
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Reserved': return 'bg-purple-50 text-purple-700';
      case 'Available': return 'bg-green-50 text-green-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  }

  // Local data for the table
  const stocks = [
    { id: '1', sku: 'EZ-C8C-2MP', serialNumber: 'SN-001234', refNo: 'REF-8890', stockIn: '2023-10-20', stockOut: '2023-10-21', trackingNumber: 'TRK-9901223', status: 'Reserved'},
    { id: '2', sku: 'EZ-C8C-2MP', serialNumber: 'SN-001235', refNo: 'REF-8891', stockIn: '2023-10-22', stockOut: '', trackingNumber: '', status: 'Available'}
  ];

  // Apply all filters (search + month + status)
  const filteredStocks = stocks.filter(stock => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      stock.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Month filter - check if stockIn starts with selected month (YYYY-MM)
    let matchesMonth = true;
    if (selectedMonth) {
      matchesMonth = stock.stockIn.startsWith(selectedMonth);
    }
    
    // Status filter
    let matchesStatus = true;
    if (selectedStatus) {
      matchesStatus = stock.status === selectedStatus;
    }
    
    return matchesSearch && matchesMonth && matchesStatus;
  });

  // Calculate counts based on filtered data for stats cards
  const reservedCount = stocks.filter(stock => stock.status === 'Reserved').length;
  const availableCount = stocks.filter(stock => stock.status === 'Available').length;

  // Reset all filters
  const resetFilters = () => {
    setSelectedMonth('');
    setSelectedStatus('');
    // Note: searchTerm is not reset here as it has its own clear button
  };

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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className='flex-1 ml-16 md:ml-64 transition-all duration-300'>
        <main className="all-main-content">
          {/* Page Title Banner */}
          <div className="page-banner flex justify-center items-center mb-8">
            <h2 className="bg-[#00008B] text-white px-12 py-2 rounded-full text-xl font-bold shadow-md">Stock</h2>
          </div>

          {/* Stats Cards Row - Modern Dashboard Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Reserved Card - Blue gradient like Product page */}
            <div className="group bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-blue-100 uppercase tracking-wider">RESERVED</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-white">{reservedCount}</h3>
                  <p className="text-sm text-blue-100">Items reserved for orders</p>
                </div>
              </div>
            </div>

            {/* Available Card - White with border like Product page */}
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">AVAILABLE</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-slate-800">{availableCount}</h3>
                  <p className="text-sm text-slate-500">Items available in stock</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-6 font-medium italic">*Current stock status</p>

          {/* Search Section - Modern Card Style (Matches Product page) */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6 border border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="lg:w-2/3">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Search</label>
                <div className="flex gap-3">
                  <div className="relative flex-1 max-w-md">
                    <input 
                      type="text" 
                      placeholder="Search by Serial Number, Reference No, Tracking No..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                    </svg>
                  </div>
                  <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                    </svg>
                    <span>Search</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">*Serial Number, Reference No, Tracking Number</p>
              </div>
              
              <div className="flex items-center justify-end">
                {/* Add button commented out as in original */}
              </div>
            </div>
          </div>

          {/* Filter Toolbar - Modern Style (Matches Product page) */}
          <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
              </button>
              <span className="text-sm text-slate-400">|</span>
              <div className="filter-group px-2">
                <input 
                  type="month" 
                  className="border-0 bg-transparent text-sm text-slate-600 focus:outline-none"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="relative min-w-[100px]">
              <select 
                className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-lg appearance-none focus:outline-none cursor-pointer hover:border-blue-300 transition-colors"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
              onClick={resetFilters}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>

          {/* Stock Table - Modern Dashboard Style (Matches Product page) */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            {filteredStocks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"></th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Serial Number</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Reference No</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Stock In</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Stock Out</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Tracking Number</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStocks.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => openEditModal(item)}
                            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-blue-900">{item.serialNumber}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{item.refNo}</td>
                        <td className="px-6 py-4 text-slate-600">{item.stockIn}</td>
                        <td className="px-6 py-4 text-slate-600">{item.stockOut || '-'}</td>
                        <td className="px-6 py-4 text-slate-600">{item.trackingNumber || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* No Results Found State - Modern Design (Matches Product page) */
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className='w-10 h-10 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No stock items found</h3>
                <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    resetFilters();
                  }} 
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </main>
        <AddEditStockModal isOpen={IsModalOpen} onClose={() => setIsModalOpen(false)} stock={selectedStock} mode={modalMode} />
      </div>
    </div>
  );
};

export default Stock;