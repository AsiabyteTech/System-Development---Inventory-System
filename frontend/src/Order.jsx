import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import {Outlet} from 'react-router';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Order = ({ 
  onBack, 
  onNavigateToAddOrder,
  onNavigateToEditOrder
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Local data for the table
  const orders = [
    {
      id: '1',
      trackingNumber: 'TN-12345678',
      customerName: 'Ahmad Faiz',
      purchaseDate: '2023-10-25',
      salesPlatform: 'Shopee',
      marginTotal: '45.00',
      status: 'Pending'
    },
    {
      id: '2',
      trackingNumber: 'TN-87654321',
      customerName: 'Sarah Lim',
      purchaseDate: '2023-10-26',
      salesPlatform: 'Lazada',
      marginTotal: '120.50',
      status: 'Delivery'
    },
    {
      id: '3',
      trackingNumber: 'TN-99887766',
      customerName: 'Jason Tan',
      purchaseDate: '2023-10-24',
      salesPlatform: 'Direct',
      marginTotal: '250.00',
      status: 'Complete'
    }
  ];
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'status-badge-pending';
      case 'Delivery': return 'status-badge-delivery';
      case 'Complete': return 'status-badge-complete';
      default: return 'status-badge-default';
    }
  };

  // Apply all filters
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.salesPlatform.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Month filter
    let matchesMonth = true;
    if (selectedMonth) {
      const orderMonth = order.purchaseDate.substring(0, 7); // Get YYYY-MM format
      matchesMonth = orderMonth === selectedMonth;
    }
    
    // Platform filter
    const matchesPlatform = selectedPlatform === '' || order.salesPlatform === selectedPlatform;
    
    // Status filter
    const matchesStatus = selectedStatus === '' || order.status === selectedStatus;
    
    return matchesSearch && matchesMonth && matchesPlatform && matchesStatus;
  });

  // Calculate counts
  const pendingCount = orders.filter(order => order.status === 'Pending').length;
  const deliveryCount = orders.filter(order => order.status === 'Delivery').length;
  const completeCount = orders.filter(order => order.status === 'Complete').length;

  // Reset all filters
  const resetFilters = () => {
    setSelectedMonth('');
    setSelectedPlatform('');
    setSelectedStatus('');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className='flex-1 ml-16 md:ml-64 transition-all duration-300'>
        <main className="all-main-content">
          {/* Page Title Banner */}
          <div className="page-banner flex justify-center items-center mb-8">
            <h2 className="bg-[#00008B] text-white px-12 py-2 rounded-full text-xl font-bold shadow-md">Order</h2>
          </div>

          {/* Status Cards - Modern Dashboard Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Pending Card */}
            <div className="group bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round'strokeLinejoin='round' strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className='text-sm font-medium text-amber-100 uppercase tracking-wider'>PENDING</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className='text-3xl font-bold text-white'>{pendingCount}</h3>
                  <p className='text-sm text-amber-100'>Awaiting processing</p>
                </div>
              </div>
            </div>

            {/* Delivery Card */}
            <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                      </svg>
                    </div>
                    <span className='text-sm font-medium text-blue-100 uppercase tracking-wider'>DELIVERY</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className='text-3xl font-bold text-white'>{deliveryCount}</h3>
                  <p className='text-sm text-blue-100'>On the way</p>
                </div>
              </div>
            </div>

            {/* Complete Card */}
            <div className="group bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className='text-sm font-medium text-emerald-100 uppercase tracking-wider'>COMPLETE</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className='text-3xl font-bold text-white'>{completeCount}</h3>
                  <p className='text-sm text-emerald-100'>Delivered orders</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-6 font-medium italic">*Current order status</p>

          {/* Search & Add Section - Modern Card Style */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6 border border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="lg:w-2/3">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Search</label>
                <div className="flex gap-3">
                  <div className="relative flex-1 max-w-md">
                    <input 
                      type="text" 
                      placeholder="Search by Tracking Number or Customer..."
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
                <p className="text-xs text-slate-400 mt-2">*Tracking Number, Customer Name</p>
              </div>
              
              <div className="flex items-center justify-end">
                <button 
                  onClick={() => navigate('/customer')}
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
                  title="Add New Customer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Toolbar - Modern Style with Working Filters */}
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
            
            {/* Sales Platform Filter */}
            <div className="relative min-w-[120px]">
              <select 
                className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-lg appearance-none focus:outline-none cursor-pointer hover:border-blue-300 transition-colors"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="">Sales Platform</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Shopee">Shopee</option>
                <option value="Lazada">Lazada</option>
                <option value="Direct">Direct</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
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
                <option value="Pending">Pending</option>
                <option value="Delivery">Delivery</option>
                <option value="Complete">Complete</option>
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

          {/* Order Table - Modern Dashboard Style */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            {filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"></th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Tracking Number</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Customer Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Purchase Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Sales Platform</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Margin Total</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">File</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => navigate(item.id)}
                            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-blue-900">{item.trackingNumber}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{item.customerName}</td>
                        <td className="px-6 py-4 text-slate-600">{item.purchaseDate}</td>
                        <td className="px-6 py-4 text-slate-600">{item.salesPlatform}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800">RM {item.marginTotal}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button className="w-8 h-8 bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Empty Rows for visual matching */}
                    {filteredOrders.length > 0 && filteredOrders.length < 5 && 
                      [...Array(5 - filteredOrders.length)].map((_, i) => (
                        <tr key={`empty-${i}`} className="border-b border-slate-50 h-14">
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4 text-slate-300">—</td>
                          <td className="px-6 py-4 text-slate-300">—</td>
                          <td className="px-6 py-4 text-slate-300">—</td>
                          <td className="px-6 py-4 text-slate-300">—</td>
                          <td className="px-6 py-4 text-slate-300">—</td>
                          <td className="px-6 py-4 text-slate-300">—</td>
                          <td className="px-6 py-4 text-slate-300"></td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              /* No Results Found State - Modern Design */
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className='w-10 h-10 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No orders found</h3>
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

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Order;