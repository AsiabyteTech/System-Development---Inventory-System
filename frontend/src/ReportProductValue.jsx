import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPrinter } from 'react-icons/fi';
import './App.css';

export const ProductValue = ({ onBack, onSave }) => {
    const navigate = useNavigate();

    // ✅ UI MATCH: Filter type state (all, month, year, sku) - matches ReportOrder
    const [filterType, setFilterType] = useState('month');
    
    // Date filter state - initialize with current month
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    
    // ✅ UI MATCH: Year filter state
    const [selectedYear, setSelectedYear] = useState(() => {
        const now = new Date();
        return now.getFullYear().toString();
    });
    
    // ✅ UI MATCH: SKU filter state
    const [selectedSKU, setSelectedSKU] = useState('');
    
    // ✅ UI MATCH: State for price inputs with numbers-only validation
    const [initialVendorPrice, setInitialVendorPrice] = useState('');
    const [initialSellingPrice, setInitialSellingPrice] = useState('');

    // ✅ UPDATED: Local data for the table with SKU field
    const [stocks] = useState([
        {
            id: '1',
            sku: 'EZ-C8C-2MP',
            serialNumber: 'SN-001234',
            refNo: 'REF-8890',
            invoiceDate: '2023-10-20',
            price: '180.00',
            staffName: 'Nur',
            vendorPrice: '180.00',
            sellingPrice: '220.00'
        },
        {
            id: '2',
            sku: 'C8C5MP',
            serialNumber: 'SN-001235',
            refNo: 'REF-8891',
            invoiceDate: '2023-10-22',
            price: '240.00',
            staffName: 'Nur',
            vendorPrice: '240.00',
            sellingPrice: '290.00'
        },
        {
            id: '3',
            sku: 'H1C',
            serialNumber: 'SN-001236',
            refNo: 'REF-8892',
            invoiceDate: '2024-01-15',
            price: '95.00',
            staffName: 'Ahmad',
            vendorPrice: '95.00',
            sellingPrice: '130.00'
        },
        {
            id: '4',
            sku: 'EZ-C8C-2MP',
            serialNumber: 'SN-001237',
            refNo: 'REF-8893',
            invoiceDate: '2024-02-20',
            price: '180.00',
            staffName: 'Sarah',
            vendorPrice: '180.00',
            sellingPrice: '220.00'
        },
        {
            id: '5',
            sku: 'PROD004',
            serialNumber: 'SN-001238',
            refNo: 'REF-8894',
            invoiceDate: '2024-03-10',
            price: '150.00',
            staffName: 'John',
            vendorPrice: '150.00',
            sellingPrice: '190.00'
        }
    ]);

    // Filtered stocks based on selected filter type
    const [filteredStocks, setFilteredStocks] = useState(stocks);

    // ✅ UI MATCH: Unique SKU dropdown options
    const skuOptions = [...new Set(stocks.map((stock) => stock.sku).filter(Boolean))];

    // ✅ UI MATCH: Selected SKU details for display
    const selectedSKUDetails = selectedSKU ? stocks.find((stock) => stock.sku === selectedSKU) : null;

    // ✅ UI MATCH: Flexible filtering logic based on filter type (matches ReportOrder)
    useEffect(() => {
        let filtered = [...stocks];

        if (filterType === 'month' && selectedMonth) {
            const [year, month] = selectedMonth.split('-');
            filtered = stocks.filter(stock => {
                const stockDate = new Date(stock.invoiceDate);
                return stockDate.getFullYear() === parseInt(year) && 
                       stockDate.getMonth() + 1 === parseInt(month);
            });
        } else if (filterType === 'year' && selectedYear) {
            filtered = stocks.filter(stock => {
                const stockDate = new Date(stock.invoiceDate);
                return stockDate.getFullYear() === parseInt(selectedYear);
            });
        } else if (filterType === 'sku') {
            if (selectedSKU) {
                filtered = stocks.filter(stock => stock.sku === selectedSKU);
            } else {
                filtered = [];
            }
        }

        setFilteredStocks(filtered);
    }, [filterType, selectedMonth, selectedYear, selectedSKU, stocks]);

    // Calculate total product value based on filtered stocks
    const totalProductValue = filteredStocks.reduce((sum, item) => sum + parseFloat(item.price), 0);
    
    // ✅ UI MATCH: Format display text based on filter type
    const getFilterDisplayText = () => {
        switch(filterType) {
            case 'month':
                return selectedMonth ? 
                    new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 
                    'Select Month';
            case 'year':
                return selectedYear || 'Select Year';
            case 'sku':
                return selectedSKU || 'Select SKU';
            default:
                return 'All Products';
        }
    };

    // Format display text for stats card
    const getStatsDisplayText = () => {
        switch(filterType) {
            case 'month':
                return `Total value for ${getFilterDisplayText()}`;
            case 'year':
                return `Total value for Year ${getFilterDisplayText()}`;
            case 'sku':
                return selectedSKU ? `Total value for SKU: ${selectedSKU}` : 'Please select a SKU';
            default:
                return 'All Products';
        }
    };

    // ✅ UI MATCH: Get current date for print header
    const getCurrentDate = () => {
        const now = new Date();
        return now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Print function
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col print:bg-white">
            {/* ✅ UI MATCH: Professional Report Header - appears only in print */}
            <div className="hidden print:block print-report-header">
                <div className="print-header-content">
                    <h1>AsiaByte P&L Inventory System</h1>
                    <h2>Total Product Value Report</h2>
                    <div className="print-header-details">
                        <div className="print-detail-row">
                            <span className="print-label">Generated Date:</span>
                            <span className="print-value">{getCurrentDate()}</span>
                        </div>
                        <div className="print-detail-row">
                            <span className="print-label">Filter Applied:</span>
                            <span className="print-value">{getStatsDisplayText()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ UI MATCH: Compact Summary Section - appears only in print */}
            <div className="hidden print:block print-summary-section">
                <h3 className="print-section-title">Summary</h3>
                <div className="print-summary-grid">
                    <div className="print-summary-item">
                        <div className="print-summary-label">Total Items</div>
                        <div className="print-summary-value">{filteredStocks.length}</div>
                    </div>
                    <div className="print-summary-item">
                        <div className="print-summary-label">Total Product Value</div>
                        <div className="print-summary-value">RM {totalProductValue.toFixed(2)}</div>
                    </div>
                    <div className="print-summary-item">
                        <div className="print-summary-label">Period</div>
                        <div className="print-summary-value">{getFilterDisplayText()}</div>
                    </div>
                </div>
            </div>

            {/* ✅ UI MATCH: Top Header Bar - wrap on mobile (hidden in print) */}
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

            {/* ✅ UI MATCH: Navigation - Modernized (hidden in print) */}
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
                {/* ✅ UI MATCH: Banner row - responsive padding and gap (hidden in print) */}
                <div className="addedit-banner-row flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6 print:hidden">
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

                {/* ✅ UI MATCH: Stats Cards Row with dynamic display text (hidden in print) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 print:hidden">
                    {/* Total Product Value Card */}
                    <div className="group bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] sm:text-sm font-medium text-blue-100 uppercase tracking-wider">Total Product Value</span>
                                </div>
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white">RM {totalProductValue.toFixed(2)}</h3>
                                <p className="text-xs sm:text-sm text-blue-100">{getStatsDisplayText()}</p>
                            </div>
                        </div>
                    </div>

                    {/* ✅ UI MATCH: Filter Card with dynamic input based on filter type */}
                    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] sm:text-sm font-medium text-slate-500 uppercase tracking-wider">Filter Products</span>
                                </div>
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                                <div>
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                    >
                                        <option value="all">All Products</option>
                                        <option value="month">Filter by Month</option>
                                        <option value="year">Filter by Year</option>
                                        <option value="sku">Filter by SKU</option>
                                    </select>
                                </div>
                                
                                {filterType === 'month' && (
                                    <input
                                        type="month"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                )}
                                
                                {filterType === 'year' && (
                                    <input
                                        type="number"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        placeholder="Enter year (e.g., 2024)"
                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                )}
                                
                                {/* ✅ UI MATCH: SKU filter as dropdown instead of text input */}
                                {filterType === 'sku' && (
                                    <select
                                        value={selectedSKU}
                                        onChange={(e) => setSelectedSKU(e.target.value)}
                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                    >
                                        <option value="">Select SKU</option>
                                        {skuOptions.map((sku) => (
                                            <option key={sku} value={sku}>
                                                {sku}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                
                                <p className="text-xs sm:text-sm text-slate-500">
                                    {filterType === 'sku' && !selectedSKU 
                                        ? 'Please select a SKU to view products' 
                                        : `${filteredStocks.length} ${filteredStocks.length === 1 ? 'item' : 'items'} found`}
                                </p>
                                {filterType !== 'all' && filteredStocks.length === 0 && filterType !== 'sku' && (
                                    <p className="text-xs text-amber-600">No results found. Try different filter criteria.</p>
                                )}
                                {filterType === 'sku' && !selectedSKU && (
                                    <p className="text-xs text-blue-600">Select a SKU from the dropdown to view details.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 mb-4 sm:mb-6 font-medium italic print:hidden">*Filter your products by selecting a filter option above</p>

                {/* ✅ UI MATCH: SKU Details Section - Only shows when filter type is 'sku' AND a SKU is selected */}
                {filterType === 'sku' && selectedSKU && selectedSKUDetails && (
                    <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 print:block">
                        {/* SKU Information Card */}
                        <div className="bg-blue-50/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-blue-100 print:bg-white print:shadow-none print:border print:border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                SKU Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Stock Keeping Unit (SKU)</label>
                                    <input 
                                        type="text" 
                                        value={selectedSKUDetails.sku}
                                        readOnly
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Staff Name</label>
                                    <input 
                                        type="text" 
                                        value={selectedSKUDetails.staffName}
                                        readOnly
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Details Card with auto-filled data from selected SKU */}
                        <div className="bg-blue-50/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-blue-100 print:bg-white print:shadow-none print:border print:border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Product Details
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Product Name</label>
                                        <input 
                                            type="text" 
                                            value={`${selectedSKUDetails.sku}`}
                                            readOnly
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Product Type</label>
                                        <input 
                                            type="text" 
                                            value="CCTV"
                                            readOnly
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Product Details</label>
                                        <textarea 
                                            value={`SKU: ${selectedSKUDetails.sku}\nSerial Number: ${selectedSKUDetails.serialNumber}\nReference No: ${selectedSKUDetails.refNo}\nInvoice Date: ${selectedSKUDetails.invoiceDate}\nStaff: ${selectedSKUDetails.staffName}`}
                                            readOnly
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed" 
                                            rows="3"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Initial Vendor Price (RM)</label>
                                        <input 
                                            type="text" 
                                            value={selectedSKUDetails.vendorPrice || initialVendorPrice}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                                setInitialVendorPrice(value);
                                            }}
                                            placeholder="Enter Vendor Price" 
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">*Numbers only (0-9 and decimal point)</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Initial Selling Price (RM)</label>
                                        <input 
                                            type="text" 
                                            value={selectedSKUDetails.sellingPrice || initialSellingPrice}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                                setInitialSellingPrice(value);
                                            }}
                                            placeholder="Enter Selling Price" 
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">*Numbers only (0-9 and decimal point)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ✅ UI MATCH: Order Details Table Section Title (for print) */}
                <div className="hidden print:block print-section-title-container">
                    <h3 className="print-section-title">Product Value Details</h3>
                </div>

                {/* ✅ UI MATCH: Table with SKU column */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden print:shadow-none print:border print:border-gray-300">
                    <div className="overflow-x-auto">
                        <div className="min-w-[700px]">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white print:bg-gray-100 print:text-gray-900">
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider print:px-3 print:py-2">SKU</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider print:px-3 print:py-2">Serial Number</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider print:px-3 print:py-2">Reference No</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider print:px-3 print:py-2">Invoice Date</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider print:px-3 print:py-2">Staff</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider print:px-3 print:py-2">Price (RM)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredStocks.length > 0 ? (
                                        filteredStocks.map((item) => (
                                            <tr key={item.id} className="hover:bg-blue-50/50 transition-colors print:hover:bg-transparent">
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-blue-900 text-sm sm:text-base print:text-gray-900 print:px-3 print:py-2 print:text-xs">{item.sku || '-'}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base print:text-gray-700 print:px-3 print:py-2 print:text-xs">{item.serialNumber}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base print:text-gray-700 print:px-3 print:py-2 print:text-xs">{item.refNo}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base print:text-gray-700 print:px-3 print:py-2 print:text-xs">{item.invoiceDate}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base print:text-gray-700 print:px-3 print:py-2 print:text-xs">{item.staffName}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-slate-700 text-sm sm:text-base print:text-gray-700 print:px-3 print:py-2 print:text-xs">RM {item.price}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-3 sm:px-6 py-8 sm:py-12 text-center text-slate-500 text-sm sm:text-base">
                                                {filterType === 'sku' && !selectedSKU 
                                                    ? 'Please select a SKU from the dropdown to view products'
                                                    : `No records found for the selected ${filterType === 'month' ? 'month' : filterType === 'year' ? 'year' : filterType === 'sku' ? 'SKU' : 'filters'}`}
                                             </td>
                                        </tr>
                                    )}
                                    {/* Empty Rows for visual matching */}
                                    {filteredStocks.length > 0 && filteredStocks.length < 5 && 
                                        [...Array(5 - filteredStocks.length)].map((_, i) => (
                                            <tr key={`empty-${i}`} className="border-b border-slate-50 h-12 sm:h-14 print:hidden">
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-300 text-sm sm:text-base">—</td>
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

                {/* ✅ UI MATCH: Print Button (hidden in print) */}
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

            {/* ✅ UI MATCH: Footer (hidden in print) */}
            <footer className="bg-gradient-to-r from-blue-900 to-blue-700 h-8 w-full print:hidden flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs">© 2026 AsiaByte. All rights reserved.</span>
            </footer>

            {/* ✅ UI MATCH: Professional Print Footer with Page Numbers */}
            <div className="hidden print:block print-footer">
                <div className="print-footer-line"></div>
                <div className="print-footer-content">
                    <span>© 2026 AsiaByte. All rights reserved.</span>
                    <span>Page <span className="print-page-number"></span> of <span className="print-total-pages"></span></span>
                </div>
            </div>

            {/* ✅ UI MATCH: Professional Print Styles for Business Report */}
            <style jsx>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 1.5cm;
                    }
                    
                    body {
                        background: white !important;
                        font-size: 11pt;
                        line-height: 1.4;
                        color: #1a1a1a;
                    }
                    
                    /* ===== PRINT-ONLY REPORT HEADER ===== */
                    .print-report-header {
                        display: block !important;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #1e3a8a;
                        padding-bottom: 15px;
                    }
                    
                    .print-header-content {
                        text-align: center;
                    }
                    
                    .print-header-content h1 {
                        font-size: 18pt;
                        font-weight: 700;
                        color: #1e3a8a;
                        margin: 0 0 5px 0;
                        letter-spacing: 1px;
                    }
                    
                    .print-header-content h2 {
                        font-size: 14pt;
                        font-weight: 600;
                        color: #374151;
                        margin: 0 0 12px 0;
                    }
                    
                    .print-header-details {
                        display: flex;
                        justify-content: center;
                        gap: 30px;
                        font-size: 10pt;
                        margin-top: 8px;
                    }
                    
                    .print-detail-row {
                        display: inline-flex;
                        gap: 6px;
                    }
                    
                    .print-label {
                        font-weight: 600;
                        color: #4b5563;
                    }
                    
                    .print-value {
                        color: #1f2937;
                    }
                    
                    /* ===== PRINT-ONLY SUMMARY SECTION ===== */
                    .print-summary-section {
                        display: block !important;
                        margin-bottom: 20px;
                    }
                    
                    .print-section-title {
                        font-size: 12pt;
                        font-weight: 600;
                        color: #374151;
                        margin: 0 0 10px 0;
                        padding-bottom: 5px;
                        border-bottom: 1px solid #d1d5db;
                    }
                    
                    .print-section-title-container {
                        display: block !important;
                        margin-top: 15px;
                        margin-bottom: 10px;
                    }
                    
                    .print-summary-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                        margin-top: 10px;
                    }
                    
                    .print-summary-item {
                        border: 1px solid #e5e7eb;
                        padding: 8px 12px;
                        border-radius: 4px;
                        background: #f9fafb;
                    }
                    
                    .print-summary-label {
                        font-size: 9pt;
                        font-weight: 600;
                        color: #6b7280;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 4px;
                    }
                    
                    .print-summary-value {
                        font-size: 14pt;
                        font-weight: 700;
                        color: #1f2937;
                    }
                    
                    /* ===== PROFESSIONAL TABLE STYLES ===== */
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 9pt;
                        margin-top: 8px;
                    }
                    
                    th {
                        background: #f3f4f6 !important;
                        color: #111827 !important;
                        font-weight: 700 !important;
                        padding: 6px 8px !important;
                        border: 1px solid #d1d5db !important;
                        text-transform: uppercase;
                        font-size: 8pt;
                        letter-spacing: 0.5px;
                    }
                    
                    td {
                        padding: 5px 8px !important;
                        border: 1px solid #e5e7eb !important;
                        font-size: 9pt;
                        color: #374151;
                    }
                    
                    /* Zebra striping for better readability */
                    tbody tr:nth-child(even) {
                        background-color: #f9fafb;
                    }
                    
                    /* ===== PRINT FOOTER ===== */
                    .print-footer {
                        display: block !important;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        margin-bottom: 0.8cm;
                        font-size: 8pt;
                        color: #6b7280;
                    }
                    
                    .print-footer-line {
                        border-top: 1px solid #d1d5db;
                        margin-bottom: 6px;
                    }
                    
                    .print-footer-content {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    /* ===== HIDE ALL WEB-ONLY ELEMENTS ===== */
                    .print\\:hidden {
                        display: none !important;
                    }
                    
                    /* Remove shadows and gradients */
                    .shadow-lg, .shadow-xl, .shadow-2xl {
                        box-shadow: none !important;
                    }
                    
                    .bg-gradient-to-r, .bg-gradient-to-br {
                        background: transparent !important;
                    }
                    
                    /* Remove hover effects */
                    .hover\\:bg-blue-50\\/50:hover {
                        background: transparent !important;
                    }
                    
                    /* Ensure content doesn't overlap with footer */
                    .all-main-content {
                        margin-bottom: 1.5cm;
                    }
                    
                    /* Page break control */
                    table {
                        page-break-inside: avoid;
                    }
                    
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    
                    /* Keep borders clean */
                    .border, .border-slate-100, .border-slate-200 {
                        border-color: #d1d5db !important;
                    }
                    
                    /* Page number counters */
                    .print-page-number:before {
                        content: counter(page);
                    }
                    
                    .print-total-pages:before {
                        content: counter(pages);
                    }
                    
                    /* Keep SKU details section visible in print when applicable */
                    .print\\:block {
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductValue;