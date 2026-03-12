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

  const filteredOrders = orders.filter(order =>
    order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())  ||
    order.salesPlatform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="containersys">

      <Sidebar />

      <div className='flex-1 ml-16 md:ml-64 bg-gray-100 min-h-screen'>

      <main className="all-main-content">
        {/* Page Title Banner */}
        <div className="page-banner flex justify-center items-center mb-8">
            <h2 className="bg-[#00008B] text-white px-12 py-2 rounded-full text-xl font-bold shadow-md">Order</h2>
        </div>

        {/* Status Cards */}
        <div className="order-stats-grid">
          <div className='order-stats-card pending-card'>
            <div className='stats-card-header'>
              <svg className='stats-card-icon' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round'strokeLinejoin='round' strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className='stats-card-label'>Pending</span>
            </div>
            <div className='stats-card-content'>
              <h3 className='stats-card-title'>0</h3>
            </div>
          </div>

          <div className='order-stats-card delivery-card'>
            <div className='stats-card-header'>
              <svg className='stats-card-icon' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
              </svg>
              <span className='stats-card-label'>Delivery</span>
            </div>
            <div className='stats-card-content'>
              <h3 className='stats-card-title'>0</h3>
            </div>
          </div>

          <div className='order-stats-card complete-card'>
            <div className='stats-card-header'>
              <svg className='stats-card-icon' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className='stats-card-label'>Complete</span>
            </div>
            <div className='stats-card-content'>
              <h3 className='stats-card-title'>2</h3>
            </div>
          </div>
         
        </div>
        <p className="text-[10px] text-gray-400 mt-2 font-medium italic">*Recent</p><br></br>

        {/* Search & Reserved Info Area */}
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
            <p className="search-hint">*Tracking Number, Customer Name</p>
          </div>

          <div className="add-section">
            
        {/*Reserved Count*/}
            
            <button 
              onClick={() => navigate('/customer')}
              className="add-button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
          </div>
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
          
          {/* Sales Platform Filter */}
          <div className="relative min-w-[120px]">
            <select className="w-full bg-white border border-gray-200 text-xs px-3 py-2 rounded appearance-none focus:outline-none cursor-pointer hover:border-gray-300">
              <option>Sales Platform</option>
              <option>TikTok</option>
              <option>Instagram</option>
              <option>Facebook</option>
              <option>Shoppee</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="relative min-w-[100px]">
            <select className="w-full bg-white border border-gray-200 text-xs px-3 py-2 rounded appearance-none focus:outline-none cursor-pointer hover:border-gray-300">
              <option>Status</option>
              <option>Pending</option>
              <option>Delivery</option>
              <option>Complete</option>
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

        {/* Order Table */}
        <div className="table-wrapper">
          {filteredOrders.length > 0 ? (
            <table className="table">
                <thead>
                    <tr className="bg-[#000066] text-white text-xs uppercase font-serif">
                        <th className="p-4 w-12"></th>
                        <th className="p-4">Tracking Number</th>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Purchase Date</th>
                        <th className="p-4">Sales Platform</th>
                        <th className="p-4">Margin Total</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">File</th>
                    </tr>
                </thead>
                <tbody className="text-xs text-gray-700 bg-white">
                    {filteredOrders.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                            <td className="p-4">
                                <button 
                                    onClick={() => navigate(item.id)}
                                    className="w-7 h-7 bg-[#2563EB] hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-sm"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                    </svg>
                                </button>
                            </td>
                            <td className="p-4 font-semibold text-[#00008B]">{item.trackingNumber}</td>
                            <td className="p-4">{item.customerName}</td>
                            <td className="p-4">{item.purchaseDate}</td>
                            <td className="p-4">{item.salesPlatform}</td>
                            <td className="p-4 font-bold">RM {item.marginTotal}</td>
                            <td className="p-4 text-center">
                              <span className={`status-badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                            </td>
                            <td className="p-4 text-center">
                                <button className="w-7 h-7 bg-[#2563EB] hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-sm mx-auto">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </button>
                            </td>
                            
                            
                        </tr>
                    ))}
                    {/* Empty Rows for visual matching */}
                    {[1, 2, 3, 4].map((i) => (
                        <tr key={`empty-${i}`} className="border-b border-gray-100 h-14">
                            <td className="p-4"></td>
                            <td className="p-4 text-gray-300"></td>
                            <td className="p-4 text-gray-300"></td>
                            <td className="p-4 text-gray-300"></td>
                            <td className="p-4 text-gray-300"></td>
                            <td className="p-4 text-gray-300"></td>
                            <td className="p-4 text-gray-300"></td>
                            <td className="p-4 text-gray-300 text-center"></td>
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
                  <p className="text-gray-400">Try searching for a different Tracking Number or Customer Name</p>
                  <button onClick={() => setSearchTerm('')} className="mt-4 text-blue-600 font-medium hover:underline">
                    Clear Search
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