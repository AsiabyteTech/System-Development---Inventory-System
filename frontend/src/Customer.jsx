import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './App.css';

const Customer = ({
    onBack, 
    onSave,
    onNavigateToEditCustomer
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    // ✅ ADDED: State for file upload
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    
    // ✅ ADDED: Check if we're editing an order from Order page
    const editOrderData = location.state?.editOrderData;
    const isEditingOrder = !!editOrderData;
    
    // ✅ ADDED: Receive cart data from Inventory page
    const incomingItems = location.state?.orderItems || [];
    const incomingTracking = location.state?.trackingNumber || '';
    
    // ✅ ADDED: State for customer form data (preloaded from order if editing)
    const [customerFormData, setCustomerFormData] = useState({
        customerName: '',
        phoneNumber: '',
        email: '',
        address: '',
        status: 'Active',
        salesPlatform: '',
        purchaseDate: '',
    });
    
    // ✅ ADDED: State for order-specific data
    const [orderData, setOrderData] = useState({
        trackingNumber: '',
        marginTotal: '',
        orderStatus: 'Pending',
        shippingAddress: '',
        paymentMethod: '',
        remark: '',
        orderItems: []
    });
    
    // ✅ ADDED: Preload data when editing an order
    useEffect(() => {
        if (isEditingOrder && editOrderData) {
            // Preload customer form data
            setCustomerFormData({
                customerName: editOrderData.customerData?.name || editOrderData.customerName || '',
                phoneNumber: editOrderData.customerData?.phone || '',
                email: editOrderData.customerData?.email || '',
                address: editOrderData.customerData?.address || '',
                status: editOrderData.customerData?.status || 'Active',
                salesPlatform: editOrderData.salesPlatform || '',
                purchaseDate: editOrderData.purchaseDate || '',
            });
            
            // Preload order data
            setOrderData({
                trackingNumber: editOrderData.trackingNumber || '',
                marginTotal: editOrderData.marginTotal || '',
                orderStatus: editOrderData.status || 'Pending',
                shippingAddress: editOrderData.shippingAddress || '',
                paymentMethod: editOrderData.paymentMethod || '',
                remark: editOrderData.remark || '',
                orderItems: editOrderData.orderItems || []
            });
        }
    }, [isEditingOrder, editOrderData]);
    
    // ✅ ADDED: Update orderData when data comes from Inventory page
    useEffect(() => {
        if (incomingItems.length > 0) {
            setOrderData(prev => ({
                ...prev,
                trackingNumber: incomingTracking || prev.trackingNumber,
                orderItems: incomingItems
            }));
            console.log('✅ Updated orderData from Inventory:', incomingItems);
        }
    }, [incomingItems, incomingTracking]);
    
    const handleDelete = () => {
        console.log("Customer/Order Deleted");
        setShowDeleteConfirm(false);
        navigate('/order');
    };

    const [SKUs, setSKUs] = useState(['']);

    // ✅ ADDED: Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            console.log("File selected:", file.name);
        }
    };
    
    // ✅ ADDED: Handle save (could save customer + order together)
    const handleSave = () => {
        console.log("Saving customer/order:", { customerFormData, orderData });
        if (isEditingOrder) {
            alert('Order updated successfully!');
        } else {
            alert('Customer saved successfully!');
        }
        navigate('/order');
    };
    
    // ✅ ADDED: Function to handle navigation to AddEditStock with data
    const handleOpenStock = () => {
        // Prepare data for AddEditStock
        const stockData = {
            trackingNumber: orderData.trackingNumber,
            customerName: customerFormData.customerName,
            sku: orderData.orderItems.length > 0 ? orderData.orderItems.map(item => item.sku).join(', ') : '',
        };
        
        // Store in localStorage to pass to AddEditStock
        localStorage.setItem('pendingStockData', JSON.stringify(stockData));
        
        // Navigate to Stock page (you'll need to open the modal there)
        // For now, we'll just alert and log
        console.log('Data to pass to AddEditStock:', stockData);
        alert('Stock data prepared. Navigate to Stock page to view.');
    };

    // Local data for the table (order items) - now uses orderData.orderItems
    const orders = orderData.orderItems.length > 0 
        ? orderData.orderItems 
        : [
            { id: '1', sku: 'EZ-C8C-2MP', type: 'CCTV', quantity: 2, total: '80.00'},
            { id: '2', sku: 'EZ-C8C-5MP', type: 'CCTV', quantity: 2, total: '80.00'},
            { id: '3', sku: 'EZ-H1C', type: 'CCTV', quantity: 1, total: '40.00'},
          ];

    // ✅ ADDED: Calculate grand total from orders array (auto-updates when orders change)
    const grandTotal = orders.reduce((sum, item) => sum + parseFloat(item.total), 0);

    // ✅ ADDED: Function to handle inventory navigation with tracking number
    const handleInventoryNavigation = () => {
        navigate('/inventory', {
            state: {
                trackingNumber: orderData.trackingNumber
            }
        });
    };

    return (
        <div className="containersys min-h-screen bg-slate-50 overflow-x-hidden">
            {/* ✅ RESPONSIVE FIX: Top Header Bar - wrap on mobile */}
            <div className="top-info-bar bg-gradient-to-r from-blue-900 to-blue-800 text-white text-[10px] sm:text-xs py-2 px-3 sm:px-6 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span>📍</span>
                    <span className="truncate max-w-[180px] sm:max-w-none">12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    <span>🕒</span>
                    <span>Office Hours: 9:00 AM - 6:00 PM</span>
                </div>
            </div>

            {/* ✅ RESPONSIVE FIX: Navigation - responsive padding and logo size */}
            <header className="headersys bg-white border-b border-slate-200/60 shadow-sm py-2 sm:py-3 px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="relative">
                            <img src="/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute -inset-1 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <span className="logo-text text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text font-serif text-transparent">AsiaByte</span>
                    </div>  
                </div>
            </header>

            <main className="all-main-content w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">

                {/* ✅ RESPONSIVE FIX: Top Bar Info - responsive layout */}
                <div className="addedit-banner-row flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <div className="title-banner flex items-center bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg overflow-hidden shadow-lg">
                        <button className="menu-btn p-2 sm:p-3">
                            <svg className="menu-icon w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </button>
                        <h2 className="banner-title text-white text-base sm:text-lg md:text-xl px-4 sm:px-6">
                            {isEditingOrder ? 'Edit Order' : 'Customer'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/order')} 
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ✅ RESPONSIVE FIX: Form Card - responsive grid */}
                <div className="form-section-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-slate-100 relative overflow-hidden w-full">
                    <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
                        <div className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Customer Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Customer Name" 
                                    className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    value={customerFormData.customerName}
                                    onChange={(e) => setCustomerFormData({...customerFormData, customerName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                                {/* ✅ UPDATED: phone number validation - numbers only, max 12 digits */}
                                <input 
                                    type="text" 
                                    placeholder="e.g., 60123456789" 
                                    className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    value={customerFormData.phoneNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                                        setCustomerFormData({...customerFormData, phoneNumber: value});
                                    }}
                                />
                                <p className="text-[10px] sm:text-xs text-slate-400 mt-1">*Numbers only (0-9), maximum 12 digits</p>
                            </div>
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Email</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Email" 
                                    className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    value={customerFormData.email}
                                    onChange={(e) => setCustomerFormData({...customerFormData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Address</label>
                                <textarea 
                                    placeholder="Enter Address" 
                                    className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
                                    rows="3"
                                    value={customerFormData.address}
                                    onChange={(e) => setCustomerFormData({...customerFormData, address: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
                                <div className="filter-wrapper relative">
                                    <select 
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-sm"
                                        value={customerFormData.status}
                                        onChange={(e) => setCustomerFormData({...customerFormData, status: e.target.value})}
                                    >
                                        <option>Active</option>
                                        <option>Inactive</option>
                                        <option>Pending</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Sales Platform</label>
                                <div className="filter-wrapper relative">
                                    <select 
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-sm"
                                        value={customerFormData.salesPlatform}
                                        onChange={(e) => setCustomerFormData({...customerFormData, salesPlatform: e.target.value})}
                                    >
                                        <option value="">Select Platform</option>
                                        <option>Shopee</option>
                                        <option>Lazada</option>
                                        <option>TikTok</option>
                                        <option>Direct</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Purchase Date / Stock Out</label>
                                <input 
                                    type="date" 
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    value={customerFormData.purchaseDate}
                                    onChange={(e) => setCustomerFormData({...customerFormData, purchaseDate: e.target.value})}
                                />
                            </div>

                            {/* File Upload Field below Purchase Date */}
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Upload Document</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="fileUpload"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    />
                                    <label
                                        htmlFor="fileUpload"
                                        className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-all duration-200 group text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            <span className="text-xs sm:text-sm text-slate-600 truncate max-w-[150px] sm:max-w-full">
                                                {fileName ? fileName : 'Choose file'}
                                            </span>
                                        </div>
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </label>
                                </div>
                                <p className="text-[10px] sm:text-xs text-slate-400 mt-1">*Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)</p>
                                {selectedFile && (
                                    <div className="mt-2 text-[10px] sm:text-xs text-green-600 flex items-center gap-1">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        File ready: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ RESPONSIVE FIX: Tracking Number Section - responsive */}
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-100 w-full">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                        <div className="w-full lg:w-2/3">
                            <label className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tracking Number</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1 min-w-0">
                                    <input
                                        type="text"
                                        placeholder="Enter Tracking Number"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-8 sm:pl-10 text-sm"
                                        value={orderData.trackingNumber}
                                        onChange={(e) => setOrderData({...orderData, trackingNumber: e.target.value})}
                                    />
                                    <svg 
                                        className="absolute left-2 sm:left-3 top-2 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                            d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                        />
                                    </svg>
                                </div>
                                {/* ✅ UPDATED: Pass tracking number to Inventory page */}
                                <button
                                    onClick={handleInventoryNavigation}
                                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center self-start sm:self-auto"
                                    title="View Inventory"
                                >
                                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </button>
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-400 mt-2">*Enter tracking number to view order details</p>
                        </div>
                    </div>
                </div>

                {/* ✅ RESPONSIVE FIX: Order Table - ONLY table may scroll horizontally */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden mb-6 sm:mb-8 w-full">
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[500px]">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">SKU</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Type</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Quantity</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Total (RM)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {orders.map((item, index) => (
                                        <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-blue-900 text-xs sm:text-sm md:text-base">{item.sku}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm md:text-base">{item.type}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm md:text-base">{item.quantity}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-slate-800 text-xs sm:text-sm md:text-base">RM {item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* ✅ RESPONSIVE FIX: Grand Total Summary - auto-updates */}
                    <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center gap-3 sm:gap-6">
                            <div className="text-right">
                                <span className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider">Grand Total:</span>
                            </div>
                            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md">
                                <span className="text-base sm:text-lg font-bold">RM {grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ RESPONSIVE FIX: Remark section - responsive */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6 mb-6 sm:mb-8 w-full">
                    <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Remark</label>
                    <textarea 
                        placeholder="Enter Remarks" 
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
                        rows="3"
                        value={orderData.remark}
                        onChange={(e) => setOrderData({...orderData, remark: e.target.value})}
                    />
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-2">*Additional notes or special instructions for this customer order</p>
                </div>

                {/* ✅ RESPONSIVE FIX: Action Buttons - responsive */}
                <div className="flex justify-between items-center gap-4 w-full">
                    <div className="flex gap-2">
                        <button 
                            className="flex items-center gap-1 sm:gap-2 text-red-600 hover:text-red-700 px-4 sm:px-6 py-2 sm:py-3 transition-all duration-200 hover:scale-105 font-semibold text-sm sm:text-base"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="text-sm font-medium"></span>
                        </button>
                        {/* ✅ ADDED: Stock button to pass data to AddEditStock */}
                        <button 
                            onClick={handleOpenStock}
                            className="flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-700 px-4 sm:px-6 py-2 sm:py-3 transition-all duration-200 hover:scale-105 font-semibold text-sm sm:text-base"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>Stock</span>
                        </button>
                    </div>

                    <button 
                        onClick={handleSave}
                        className="save-btn-main bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                        <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'></path>
                            <polyline points='17 21 17 13 7 13 7 21' />
                            <polyline points='7 3 7 8 15 8' />
                        </svg>
                        <span>{isEditingOrder ? '' : ''}</span>
                    </button>
                </div>
            </main>

            {/* ✅ RESPONSIVE FIX: Delete Confirmation Modal - responsive */}
            {showDeleteConfirm && (
                <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="modal-container bg-white rounded-xl p-5 sm:p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="modal-content text-center">
                            <div className="modal-icon-wrapper w-14 h-14 sm:w-16 sm:h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <svg className="modal-icon w-7 h-7 sm:w-8 sm:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="modal-title text-lg sm:text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
                            <p className="modal-description text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6">
                                This action cannot be undone. This will permanently delete this customer record from the system.
                            </p>
                            <div className="modal-actions flex gap-3">
                                <button className="btn-cancel flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm" onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </button>
                                <button className="btn-confirm-delete flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg shadow-red-500/20 text-sm" onClick={handleDelete}>
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ RESPONSIVE FIX: Footer */}
            <footer className="bg-gradient-to-r from-blue-900 to-blue-700 h-8 w-full flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs">© 2026 AsiaByte. All rights reserved.</span>
            </footer>
        </div>
    );
};

export default Customer;