import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import {Outlet} from 'react-router';
import { useNavigate } from 'react-router-dom';
import AddEditInvoiceModal from './AddEditInvoice';
import './App.css';
// ✅ ADDED: role helper import
import { isAdmin } from "./shared/role";

const Invoice = ({ 
  /*onBack, 
  onNavigateToSupplier, 
  onNavigateToAddInvoice,
  onNavigateToEditInvoice */
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState('add');
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Local data for the table
  const invoices = [
    {
      id: '1',
      refNo: 'INV-2023-001',
      date: '2023-10-25',
      snDetails: ['SN-10293', 'SN-10294'],
      supplier: 'Dahua Tech',
      amount: '5,420.00'
    },
    {
      id: '2',
      refNo: 'INV-2023-002',
      date: '2023-10-26',
      snDetails: ['SN-88210'],
      supplier: 'TP-Link MY',
      amount: '1,200.50'
    }
  ];

  const filteredInvoices = invoices.filter(invoice => 
    invoice.refNo.toLowerCase().includes(searchTerm.toLowerCase())  ||
    invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const openAddModal = () => {
    setModalMode('add');
    setSelectedInvoice(null);
    setIsModalOpen(true);
  };

  const openEditModal = (invoice) => {
    setModalMode('edit');
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  }

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar />
      {/* ✅ RESPONSIVE FIX: Main content area with proper overflow control */}
      <div className='flex-1 min-w-0 ml-16 md:ml-64 transition-all duration-300 overflow-x-hidden'>
        <main className="all-main-content w-full max-w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          
          {/* ✅ RESPONSIVE FIX: Page Title Banner - full width, no overflow */}
          <div className="page-banner flex justify-center items-center mb-4 sm:mb-6 w-full">
            <h2 className="bg-[#00008B] text-white px-6 sm:px-8 md:px-12 py-1.5 sm:py-2 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-md whitespace-nowrap">Invoice</h2>
          </div>

          {/* ✅ RESPONSIVE FIX: Stats Cards Row - responsive grid, no overflow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 w-full">
            {/* Supplier Card */}
            <button 
              onClick={() => navigate('/supplier')}
              className="group bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden text-left w-full"
            >
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                    <span className="text-[10px] sm:text-[11px] md:text-sm font-medium text-blue-100 uppercase tracking-wider">SUPPLIER</span>
                  </div>
                </div>
                <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">Supplier Inc.</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-blue-100">Primary vendor for networking equipment</p>
                </div>
              </div>
            </button>

            {/* Purchase Card */}
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden w-full">
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-[10px] sm:text-[11px] md:text-sm font-medium text-slate-500 uppercase tracking-wider">PURCHASE</span>
                  </div>
                </div>
                <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-800">RM 24,580.00</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-slate-500">This month's total purchases</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] sm:text-xs text-slate-400 mb-3 sm:mb-4 md:mb-6 font-medium italic">*Recent</p>

          {/* ✅ RESPONSIVE FIX: Search & Add Section - responsive stack */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-slate-100 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 md:gap-6">
              <div className="w-full md:flex-1">
                <label className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">Search</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative flex-1 min-w-0">
                    <input 
                      type="text" 
                      placeholder="Search by Reference No or Supplier..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-8 sm:pl-10 text-xs sm:text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-2 sm:left-3 top-2 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                    </svg>
                  </div>
                  <button className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                    </svg>
                    <span>Search</span>
                  </button>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2">*Reference No, Supplier Name</p>
              </div>
              
              {/* ✅ ADDED: role-based condition - Add button only for admin */}
              <div className="flex items-center justify-start md:justify-end">
                {isAdmin() && (
                  <button 
                    onClick={openAddModal}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
                    title="Add New Invoice"
                  >
                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ✅ RESPONSIVE FIX: Filter Toolbar - responsive wrapping */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6 w-full">
            <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
              <button className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
              </button>
              <span className="text-xs sm:text-sm text-slate-400">|</span>
              <div className="filter-group px-1 sm:px-2">
                <input type="month" className="border-0 bg-transparent text-xs sm:text-sm text-slate-600 focus:outline-none w-full max-w-[140px] sm:max-w-full"/>
              </div>
            </div>
            
            <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>

          {/* ✅ RESPONSIVE FIX: Invoice Table - ONLY table may scroll horizontally */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden w-full">
            {filteredInvoices.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[650px] md:min-w-0">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                      {isAdmin() && (
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider"></th>
                      )}
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Reference No</th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Invoice Date</th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">SN Details</th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Supplier</th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Amount</th>
                      <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider">File</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-blue-50/50 transition-colors">
                        {isAdmin() && (
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                            <button 
                              onClick={() => openEditModal(inv)}
                              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                            >
                              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                              </svg>
                            </button>
                           </td>
                        )}
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <span className="font-semibold text-blue-900 text-xs sm:text-sm md:text-base">{inv.refNo}</span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-slate-600 text-xs sm:text-sm md:text-base">{inv.date}</td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <div className="flex flex-col space-y-0.5 sm:space-y-1">
                            {inv.snDetails.map((sn, idx) => (
                              <span key={idx} className="inline-block bg-slate-100 text-slate-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] md:text-xs w-fit">
                                {sn}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <span className="font-medium text-blue-900 text-xs sm:text-sm md:text-base">{inv.supplier}</span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <span className="font-bold text-slate-800 text-xs sm:text-sm md:text-base">RM {inv.amount}</span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                          <div className="flex justify-center">
                            <button className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
                              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* No Results Found State - Modern Design */
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-20 px-4 w-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-700 mb-1 sm:mb-2 text-center">No invoices found</h3>
                <p className="text-xs sm:text-sm md:text-base text-slate-500 mb-3 sm:mb-4 text-center">Try searching for a different Reference No or Supplier</p>
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          <Outlet />
        </main>
        <AddEditInvoiceModal isOpen={IsModalOpen} onClose={() => setIsModalOpen(false)} invoice={selectedInvoice} mode={modalMode} />
      </div>
    </div>
  );
};

export default Invoice;