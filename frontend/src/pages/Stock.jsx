// ✅ REFACTORED: imports organized
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStock } from '../hooks/useStock';
import '../App.css';
import '../styles/animations.css';

// ✅ REFACTORED: component imports
import Sidebar from '../components/Sidebar';
import AddEditStockModal from './AddEditStock';
import { isAdmin } from "../shared/role";

const Stock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSku, setSelectedSku] = useState('');
  const [modalMode, setModalMode] = useState('add');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const {
    stocks,
    loading,
    error,
    fetchStocks,
    createStock,
    updateStock,
    deleteStock,
  } = useStock();

  // Get SKU filter from navigation state
  useEffect(() => {
    if (location.state?.filterSku) {
      setSelectedSku(location.state.filterSku);
    }
  }, [location.state]);

  const getStatusBadge = (status) => {
    const statusUpper = status?.toUpperCase() || '';
    switch (statusUpper) {
      case 'RESERVED': return 'bg-purple-50 text-purple-700';
      case 'AVAILABLE': return 'bg-green-50 text-green-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  // Get filtered stocks based on selected SKU (for display)
  const filteredStocks = stocks.filter(stock => {
    // Search filter - ONLY Serial Number, Reference No, Tracking Number
    const matchesSearch = searchTerm === '' ||
      stock.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.refNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Month filter - check if stockIn starts with selected month (YYYY-MM)
    let matchesMonth = true;
    if (selectedMonth) {
      matchesMonth = stock.stockIn?.startsWith(selectedMonth);
    }
    
    // Status filter
    let matchesStatus = true;
    if (selectedStatus) {
      matchesStatus = stock.status?.toUpperCase() === selectedStatus.toUpperCase();
    }
    
    // SKU filter - from navigation state
    let matchesSku = true;
    if (selectedSku) {
      matchesSku = stock.sku === selectedSku;
    }
    
    return matchesSearch && matchesMonth && matchesStatus && matchesSku;
  });

  // ✅ FIXED: Calculate counts based on ALL stocks OR filtered by SKU
  // For cards, show counts based on the selected SKU (if any)
  const getCounts = () => {
    // If a specific SKU is selected, count only that SKU's stocks
    if (selectedSku) {
      const skuStocks = stocks.filter(stock => stock.sku === selectedSku);
      return {
        total: skuStocks.length,
        reserved: skuStocks.filter(stock => stock.status?.toUpperCase() === 'RESERVED').length,
        available: skuStocks.filter(stock => stock.status?.toUpperCase() === 'AVAILABLE').length
      };
    }
    
    // Otherwise, count all stocks
    return {
      total: stocks.length,
      reserved: stocks.filter(stock => stock.status?.toUpperCase() === 'RESERVED').length,
      available: stocks.filter(stock => stock.status?.toUpperCase() === 'AVAILABLE').length
    };
  };

  const counts = getCounts();

  console.log('Selected SKU:', selectedSku);
  console.log('Counts:', counts);

  // Reset all filters
  const resetFilters = () => {
    setSelectedMonth('');
    setSelectedStatus('');
    setSelectedSku('');
    setSearchTerm('');
    // Clear the navigation state
    navigate('/stock', { state: null, replace: true });
  };

  // Clear SKU filter (from navigation)
  const clearSkuFilter = () => {
    setSelectedSku('');
    navigate('/stock', { state: null, replace: true });
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedStock(null);
    setIsModalOpen(true);
  };

  const openEditModal = (stock) => {
    setModalMode('edit');
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  // Delegates to the hook — no direct API call here (AddEditStock.jsx just collects form data)
  const handleStockSave = async (stockData) => {
    if (modalMode === 'edit' && selectedStock) {
      return await updateStock(selectedStock.id, stockData);
    }
    return await createStock(stockData);
  };

  const handleStockDelete = async (id) => {
    return await deleteStock(id);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stocks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar />
      <div className='flex-1 min-w-0 ml-16 md:ml-64 transition-all duration-300 overflow-x-hidden'>
        <main className="all-main-content w-full max-w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          
          {/* Page Title Banner */}
          <div className="page-banner flex justify-center items-center mb-4 sm:mb-6 w-full">
            <h2 className="bg-[#00008B] text-white px-6 sm:px-8 md:px-12 py-1.5 sm:py-2 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-md whitespace-nowrap">
              {selectedSku ? `Stock - ${selectedSku}` : 'Stock'}
            </h2>
          </div>

          {/* Stats Cards Row - Now shows counts based on filtered SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 w-full">
            {/* Total Stock Card */}
            <div className="group bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full">
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <span className="text-[10px] sm:text-[11px] md:text-sm font-medium text-blue-100 uppercase tracking-wider">TOTAL STOCK</span>
                  </div>
                </div>
                <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{counts.total}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-blue-100">
                    {selectedSku ? `Items for ${selectedSku}` : 'Total stock units'}
                  </p>
                </div>
              </div>
            </div>

            {/* Reserved Card */}
            <div className="group bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full">
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <span className="text-[10px] sm:text-[11px] md:text-sm font-medium text-amber-100 uppercase tracking-wider">RESERVED</span>
                  </div>
                </div>
                <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{counts.reserved}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-amber-100">Items reserved for orders</p>
                </div>
              </div>
            </div>

            {/* Available Card */}
            <div className="sm:col-span-2 lg:col-span-1 group bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full">
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-[10px] sm:text-[11px] md:text-sm font-medium text-emerald-100 uppercase tracking-wider">AVAILABLE</span>
                  </div>
                </div>
                <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{counts.available}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-emerald-100">Items available in stock</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] sm:text-xs text-slate-400 mb-3 sm:mb-4 md:mb-6 font-medium italic">*Current stock status</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{error}</p>
              <button 
                onClick={fetchStocks}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Search Section - ONLY Serial Number, Reference No, Tracking Number */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-slate-100 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 md:gap-6">
              <div className="w-full md:flex-1">
                <label className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">Search</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative flex-1 min-w-0">
                    <input 
                      type="text" 
                      placeholder="Search by Serial Number, Reference No, Tracking No..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-8 sm:pl-10 text-xs sm:text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-2 sm:left-3 top-2 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                    </svg>
                  </div>
                  <button 
                    onClick={fetchStocks}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                    </svg>
                    <span>Search</span>
                  </button>
                  {isAdmin() && (
                    <button
                      onClick={openAddModal}
                      className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center flex-shrink-0"
                      title="Add New Stock"
                    >
                      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2">*Serial Number, Reference No, Tracking Number</p>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6 w-full">
            <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
              <button className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
              </button>
              <span className="text-xs sm:text-sm text-slate-400">|</span>
              <div className="filter-group px-1 sm:px-2">
                <input 
                  type="month" 
                  className="border-0 bg-transparent text-xs sm:text-sm text-slate-600 focus:outline-none w-full max-w-[140px] sm:max-w-full"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="relative min-w-[90px] sm:min-w-[100px]">
              <select 
                className="w-full bg-white border border-slate-200 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg appearance-none focus:outline-none cursor-pointer hover:border-blue-300 transition-colors"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
              </select>
              <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            
            <button 
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
              onClick={resetFilters}
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>

          {/* Stock Table */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden w-full">
            {filteredStocks.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[900px] md:min-w-0">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider"></th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">SKU</th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Serial Number</th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Reference No</th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Stock In</th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Stock Out</th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Tracking Number</th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStocks.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <button 
                            onClick={() => openEditModal(item)}
                            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                          >
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <span className="font-semibold text-blue-900 text-xs sm:text-sm md:text-base">{item.sku}</span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <span className="text-slate-600 text-xs sm:text-sm md:text-base">{item.serialNumber}</span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <span className="text-slate-600 text-xs sm:text-sm md:text-base">{item.refNo}</span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <span className="text-slate-600 text-xs sm:text-sm md:text-base">{item.stockIn}</span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <span className="text-slate-600 text-xs sm:text-sm md:text-base">{item.stockOut || '-'}</span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <span className="text-slate-600 text-xs sm:text-sm md:text-base">{item.trackingNumber || '-'}</span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusBadge(item.status)}`}>
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
              /* No Results Found State */
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-20 px-4 w-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-700 mb-1 sm:mb-2 text-center">No stock items found</h3>
                <p className="text-xs sm:text-sm md:text-base text-slate-500 mb-3 sm:mb-4 text-center">
                  {selectedSku ? `No stock available for SKU: ${selectedSku}` : 'Try adjusting your search or filter criteria'}
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    resetFilters();
                  }} 
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </main>
        <AddEditStockModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          stock={selectedStock}
          mode={modalMode}
          onSave={handleStockSave}
          onDelete={handleStockDelete}
        />
      </div>
    </div>
  );
};

export default Stock;