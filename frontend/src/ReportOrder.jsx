import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPrinter } from 'react-icons/fi';
import './App.css';

const ReportOrder = ({ onBack, onSave }) => {

    const navigate = useNavigate();
    
    // Date filter state - initialize with current month
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    // Local data for the table with the specific report data
    const [reports] = useState([
        {
            id: '1',
            serialNumber: 'SN-14345',
            refNo: 'mn2131232',
            inoutDate: '2023-10-24',
            trackingNumber: 'TN-99887766',
            status: 'Complete'
        }
    ]);

    // Filtered reports based on selected month
    const [filteredReports, setFilteredReports] = useState(reports);

    // Update filtered reports when month changes
    useEffect(() => {
        if (selectedMonth) {
            const [year, month] = selectedMonth.split('-');
            const filtered = reports.filter(report => {
                const reportDate = new Date(report.inoutDate);
                return reportDate.getFullYear() === parseInt(year) && 
                       reportDate.getMonth() + 1 === parseInt(month);
            });
            setFilteredReports(filtered.length > 0 ? filtered : []);
        } else {
            setFilteredReports(reports);
        }
    }, [selectedMonth, reports]);

    // Calculate stats based on filtered reports
    const totalOrders = filteredReports.length;
    const totalOrderValue = filteredReports.reduce((sum, report) => {
        // Example calculation - in real app, you'd have actual amount field
        return sum + 1250.50;
    }, 0);

    // Format selected month for display
    const formattedMonth = selectedMonth ? 
        new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 
        'All Time';

    // Print function
    const handlePrint = () => {
        window.print();
    };

    // Get status badge color
    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'Complete':
                return 'bg-green-50 text-green-700';
            case 'Pending':
                return 'bg-yellow-50 text-yellow-700';
            case 'Processing':
                return 'bg-blue-50 text-blue-700';
            default:
                return 'bg-slate-50 text-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col print:bg-white">
            {/* Top Header Bar - Modernized */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white text-xs py-2 px-6 flex flex-wrap justify-between items-center print:hidden">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Office Hours: 9:00 AM - 6:00 PM</span>
                </div>
            </div>

            {/* Navigation - Modernized */}
            <header className="bg-white border-b border-slate-200/60 shadow-sm py-3 px-6 print:hidden">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="relative">
                            <img src="src/assets/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute -inset-1 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <span className="text-xl font-bold font-serif bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">AsiaByte</span>
                    </div>
                </div>
            </header>

             <main className="all-main-content">
                <div className="addedit-banner-row">
                    <div className="title-banner">
                        <button className="menu-btn print:hidden">
                            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                        </button>
                        <h2 className="banner-title print:text-black print:bg-transparent print:shadow-none print:px-0">Order Volume Report</h2>
                    </div>

                    {/* Close Button only - Print button moved below */}
                    <div className="flex items-center gap-3 print:hidden">
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="w-10 h-10 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                            title="Close"
                        >
                            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Stats Cards Row - Blue/White Dashboard Theme */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 print:grid-cols-3 print:gap-4">
                    {/* Total Order Card - Blue Theme */}
                    <div className="group bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden print:bg-white print:shadow-none print:border print:border-gray-200">
                        <div className="p-6 print:p-4">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform print:bg-gray-100">
                                        <svg className="w-6 h-6 text-white print:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-blue-100 uppercase tracking-wider print:text-gray-600">Total Order</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold text-white print:text-gray-900">{totalOrders}</h3>
                                <p className="text-sm text-blue-100 print:text-gray-500">Orders for {formattedMonth}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Order Value Card - Light Blue Theme */}
                    <div className="group bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden print:bg-white print:shadow-none print:border print:border-gray-200">
                        <div className="p-6 print:p-4">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform print:bg-gray-100">
                                        <svg className="w-6 h-6 text-white print:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-blue-100 uppercase tracking-wider print:text-gray-600">Total Order Value</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold text-white print:text-gray-900">RM {totalOrderValue.toFixed(2)}</h3>
                                <p className="text-sm text-blue-100 print:text-gray-500">Revenue for {formattedMonth}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Date Card - White Theme with Filter */}
                    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden print:bg-white print:shadow-none print:border print:border-gray-200">
                        <div className="p-6 print:p-4">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform print:bg-gray-100">
                                        <svg className="w-6 h-6 text-blue-600 print:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wider print:text-gray-600">Filter by Month</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 print:hidden">
                                    <input
                                        type="month"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <p className="text-sm text-slate-500 print:text-gray-600">{filteredReports.length} orders found</p>
                                <p className="text-sm text-slate-500 hidden print:block">Period: {formattedMonth}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-slate-400 mb-6 font-medium italic print:hidden">*Filtered by selected month</p>

                {/* Form Sections - Modern Cards with Subtle Blue Backgrounds */}
                <div className="space-y-6 mb-8 print:space-y-4">
                    {/* SKU & Status Card */}
                    <div className="bg-blue-50/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-100 print:bg-white print:shadow-none print:border print:border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Stock Keeping Unit (SKU)</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter SKU" 
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all print:border-0 print:p-0 print:font-medium" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Status</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Status" 
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all print:border-0 print:p-0 print:font-medium" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quantity Card */}
                    <div className="bg-blue-50/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-100 print:bg-white print:shadow-none print:border print:border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Quantity On Hand (Balance)</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter Quantity" 
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all print:border-0 print:p-0 print:font-medium" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Reserved Quantity (Sold)</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter Reserved Quantity" 
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all print:border-0 print:p-0 print:font-medium" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Margin</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Margin" 
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all print:border-0 print:p-0 print:font-medium" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Details Card */}
                    <div className="bg-blue-50/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-100 print:bg-white print:shadow-none print:border print:border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Product Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter Product Name" 
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all print:border-0 print:p-0 print:font-medium" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Product Type</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter Product Type" 
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all print:border-0 print:p-0 print:font-medium" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Product Details</label>
                                    <textarea 
                                        placeholder="Enter Product Details" 
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all print:border-0 print:p-0 print:font-medium" 
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Initial Vendor Price</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter Vendor Price" 
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all print:border-0 print:p-0 print:font-medium" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 print:text-gray-700">Initial Selling Price</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter Selling Price" 
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all print:border-0 print:p-0 print:font-medium" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stock Table - Modern Dashboard Style */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden print:shadow-none print:border print:border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white print:bg-gray-100 print:text-gray-900">
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider print:px-4 print:py-2">Serial Number</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider print:px-4 print:py-2">Reference No</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider print:px-4 print:py-2">Stock Out</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider print:px-4 print:py-2">Tracking Number</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider print:px-4 print:py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredReports.length > 0 ? (
                                    filteredReports.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-blue-900 print:text-gray-900 print:px-4 print:py-2">{item.serialNumber}</td>
                                            <td className="px-6 py-4 text-slate-600 print:text-gray-700 print:px-4 print:py-2">{item.refNo}</td>
                                            <td className="px-6 py-4 text-slate-600 print:text-gray-700 print:px-4 print:py-2">{item.inoutDate}</td>
                                            <td className="px-6 py-4 text-slate-600 print:text-gray-700 print:px-4 print:py-2">{item.trackingNumber || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)} print:bg-transparent print:p-0 print:text-gray-900`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            No orders found for the selected month
                                        </td>
                                    </tr>
                                )}
                                {/* Empty Rows for visual matching when data exists but less than 5 rows */}
                                {filteredReports.length > 0 && filteredReports.length < 5 && 
                                    [...Array(5 - filteredReports.length)].map((_, i) => (
                                        <tr key={`empty-${i}`} className="border-b border-slate-50 h-14 print:hidden">
                                            <td className="px-6 py-4 text-slate-300">—</td>
                                            <td className="px-6 py-4 text-slate-300">—</td>
                                            <td className="px-6 py-4 text-slate-300">—</td>
                                            <td className="px-6 py-4 text-slate-300">—</td>
                                            <td className="px-6 py-4 text-slate-300">—</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Print Button - Centered below the table */}
                <div className="flex justify-center mt-8 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                        <FiPrinter className="w-5 h-5" />
                        <span className="text-base">Print</span>
                    </button>
                </div>
            </main>

            {/* Footer with centered text */}
            <footer className="bg-gradient-to-r from-blue-900 to-blue-700 h-8 w-full print:hidden flex items-center justify-center">
                <span className="text-white text-xs">© 2026 AsiaByte. All rights reserved.</span>
            </footer>

            {/* Print footer element that will be visible in print */}
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
                }
            `}</style>
        </div>
    );
};

export default ReportOrder;