import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPrinter } from 'react-icons/fi';
import './App.css';

export const ProductValue = ({ onBack, onSave }) => {
    const navigate = useNavigate();

    // Date filter state - initialize with current month
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    // Local data for the table
    const [stocks] = useState([
        {
            id: '1',
            serialNumber: 'SN-001234',
            refNo: 'REF-8890',
            invoiceDate: '2023-10-20',
            price: '180.00',
            staffName: 'Nur'
        },
        {
            id: '2',
            serialNumber: 'SN-001235',
            refNo: 'REF-8891',
            invoiceDate: '2023-10-22',
            price: '180.00',
            staffName: 'Nur'
        }
    ]);

    // Filtered stocks based on selected month
    const [filteredStocks, setFilteredStocks] = useState(stocks);

    // Update filtered stocks when month changes
    useEffect(() => {
        if (selectedMonth) {
            const [year, month] = selectedMonth.split('-');
            const filtered = stocks.filter(stock => {
                const stockDate = new Date(stock.invoiceDate);
                return stockDate.getFullYear() === parseInt(year) && 
                       stockDate.getMonth() + 1 === parseInt(month);
            });
            setFilteredStocks(filtered.length > 0 ? filtered : []);
        } else {
            setFilteredStocks(stocks);
        }
    }, [selectedMonth, stocks]);

    // Calculate total product value based on filtered stocks
    const totalProductValue = filteredStocks.reduce((sum, item) => sum + parseFloat(item.price), 0);
    
    // Format selected month for display
    const formattedMonth = selectedMonth ? 
        new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 
        'All Time';

    // Print function
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col print:bg-white">
            {/* ✅ RESPONSIVE FIX: Top Header Bar - wrap on mobile */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white text-[10px] sm:text-xs py-2 px-3 sm:px-6 flex flex-wrap justify-between items-center gap-2 print:hidden">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate max-w-[180px] sm:max-w-none">12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Office Hours: 9:00 AM - 6:00 PM</span>
                </div>
            </div>

            {/* Navigation - Modernized */}
            <header className="bg-white border-b border-slate-200/60 shadow-sm py-2 sm:py-3 px-4 sm:px-6 print:hidden">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="relative">
                            <img src="/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute -inset-1 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <span className="text-lg sm:text-xl font-bold font-serif bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">AsiaByte</span>
                    </div>
                </div>
            </header>

            <main className="all-main-content px-3 sm:px-6 py-4 sm:py-6">
                {/* ✅ RESPONSIVE FIX: Banner row - responsive padding and gap */}
                <div className="addedit-banner-row flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <div className="title-banner">
                        <button className="menu-btn print:hidden">
                            <svg className="menu-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                        </button>
                        <h2 className="banner-title text-lg sm:text-xl print:text-black print:bg-transparent print:shadow-none print:px-0">Total Product Value</h2>
                    </div>

                    <div className="flex items-center gap-3 print:hidden">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                            title="Close"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ✅ RESPONSIVE FIX: Stats Cards Row - responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 print:grid-cols-2 print:gap-4">
                    {/* Total Product Value Card - Blue Theme */}
                    <div className="group bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden print:bg-white print:shadow-none print:border print:border-gray-200">
                        <div className="p-4 sm:p-6 print:p-4">
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform print:bg-gray-100">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white print:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] sm:text-sm font-medium text-blue-100 uppercase tracking-wider print:text-gray-600">Total Product Value</span>
                                </div>
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white print:text-gray-900">RM {totalProductValue.toFixed(2)}</h3>
                                <p className="text-xs sm:text-sm text-blue-100 print:text-gray-500">Total inventory value for {formattedMonth}</p>
                            </div>
                        </div>
                    </div>

                    {/* Date Card - White Theme with Filter */}
                    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden print:bg-white print:shadow-none print:border print:border-gray-200">
                        <div className="p-4 sm:p-6 print:p-4">
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform print:bg-gray-100">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 print:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] sm:text-sm font-medium text-slate-500 uppercase tracking-wider print:text-gray-600">Filter by Month</span>
                                </div>
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2 print:hidden">
                                    <input
                                        type="month"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <p className="text-xs sm:text-sm text-slate-500 print:text-gray-600">{filteredStocks.length} items found</p>
                                <p className="text-xs sm:text-sm text-slate-500 hidden print:block">Period: {formattedMonth}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 mb-4 sm:mb-6 font-medium italic print:hidden">*Filtered by selected month</p>

                {/* ✅ RESPONSIVE FIX: Form Sections - responsive grid */}
                <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 print:space-y-4">
                    {/* SKU & Status Card */}
                    <div className="bg-blue-50/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-blue-100 print:bg-white print:shadow-none print:border print:border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Stock Keeping Unit (SKU)</label>
                                <input
                                    type="text"
                                    placeholder="Enter SKU"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm print:border-0 print:p-0 print:font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Quantity On Hand</label>
                                <input
                                    type="number"
                                    placeholder="Enter Quantity"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm print:border-0 print:p-0 print:font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Details Card */}
                    <div className="bg-blue-50/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-blue-100 print:bg-white print:shadow-none print:border print:border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Product Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Product Name"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm print:border-0 print:p-0 print:font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Product Type</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Product Type"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm print:border-0 print:p-0 print:font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Product Details</label>
                                    <textarea
                                        placeholder="Enter Product Details"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm print:border-0 print:p-0 print:font-medium"
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Initial Vendor Price</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Vendor Price"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm print:border-0 print:p-0 print:font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Initial Selling Price</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Selling Price"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm print:border-0 print:p-0 print:font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ RESPONSIVE FIX: Stock Table with horizontal scroll on mobile */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden print:shadow-none print:border print:border-gray-200">
                    <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white print:bg-gray-100 print:text-gray-900">
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider print:px-4 print:py-2">Serial Number</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider print:px-4 print:py-2">Reference No</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider print:px-4 print:py-2">Invoice Date</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider print:px-4 print:py-2">Staff</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider print:px-4 print:py-2">Price (RM)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredStocks.length > 0 ? (
                                        filteredStocks.map((item) => (
                                            <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-blue-900 text-sm sm:text-base print:text-gray-900 print:px-4 print:py-2">{item.serialNumber}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base print:text-gray-700 print:px-4 print:py-2">{item.refNo}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base print:text-gray-700 print:px-4 print:py-2">{item.invoiceDate}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base print:text-gray-700 print:px-4 print:py-2">{item.staffName}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-slate-700 text-sm sm:text-base print:text-gray-700 print:px-4 print:py-2">RM {item.price}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-3 sm:px-6 py-8 sm:py-12 text-center text-slate-500 text-sm sm:text-base">
                                                No records found for the selected month
                                            </td>
                                        </tr>
                                    )}
                                    {/* Empty Rows for visual matching when data exists but less than 5 rows */}
                                    {filteredStocks.length > 0 && filteredStocks.length < 5 && 
                                        [...Array(5 - filteredStocks.length)].map((_, i) => (
                                            <tr key={`empty-${i}`} className="border-b border-slate-50 h-12 sm:h-14 print:hidden">
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-300 text-sm sm:text-base">—</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-300 text-sm sm:text-base">—</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-300 text-sm sm:text-base">—</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-300 text-sm sm:text-base">—</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-300 text-sm sm:text-base">—</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ✅ RESPONSIVE FIX: Print Button - responsive sizing */}
                <div className="flex justify-center mt-6 sm:mt-8 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                    >
                        <FiPrinter className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span></span>
                    </button>
                </div>
            </main>

            {/* ✅ RESPONSIVE FIX: Footer */}
            <footer className="bg-gradient-to-r from-blue-900 to-blue-700 h-8 w-full print:hidden flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs">© 2026 AsiaByte. All rights reserved.</span>
            </footer>

            {/* Print footer element */}
            <div className="print-footer hidden print:block text-center text-gray-700 text-xs mt-4">
                © 2026 AsiaByte. All rights reserved.
            </div>

            {/* Print styles for A4 paper */}
            <style jsx>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 1.5cm;
                    }
                    
                    body {
                        background: white;
                        font-size: 11pt;
                        line-height: 1.3;
                        position: relative;
                        min-height: 100%;
                    }
                    
                    .all-main-content {
                        padding: 0;
                        max-width: 100%;
                    }
                    
                    h2 {
                        font-size: 18pt;
                        margin-bottom: 12pt;
                    }
                    
                    table {
                        font-size: 10pt;
                        width: 100%;
                        border-collapse: collapse;
                    }
                    
                    th {
                        background: #f0f0f0 !important;
                        color: black !important;
                        font-weight: bold;
                        padding: 6pt;
                    }
                    
                    td {
                        padding: 6pt;
                        border-bottom: 1px solid #ddd;
                    }
                    
                    .group {
                        break-inside: avoid;
                    }
                    
                    /* Force print footer to appear */
                    .print-footer {
                        display: block !important;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        text-align: center;
                        font-size: 10pt;
                        color: #333;
                        margin-bottom: 0.5cm;
                    }
                    
                    /* Ensure content doesn't overlap with footer */
                    .all-main-content {
                        margin-bottom: 1.5cm;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductValue;