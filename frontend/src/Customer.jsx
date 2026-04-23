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
        // In real app, save to backend here
        if (isEditingOrder) {
            alert('Order updated successfully!');
        } else {
            alert('Customer saved successfully!');
        }
        navigate('/order');
    };

    // Local data for the table (order items)
    const orders = orderData.orderItems.length > 0 
        ? orderData.orderItems 
        : [
            { id: '1', sku: 'EZ-C8C-2MP', type: 'CCTV', quantity: 2, total: '80.00'},
            { id: '2', sku: 'EZ-C8C-5MP', type: 'CCTV', quantity: 2, total: '80.00'},
            { id: '3', sku: 'EZ-H1C', type: 'CCTV', quantity: 1, total: '40.00'},
          ];

    // ✅ ADDED: Calculate grand total from orders array
    const grandTotal = orders.reduce((sum, item) => sum + parseFloat(item.total), 0);

    return (
        <div className="containersys min-h-screen bg-slate-50">
            {/* Top Header Bar */}
            <div className="top-info-bar bg-gradient-to-r from-blue-900 to-blue-800 text-white text-xs py-2 px-6 flex justify-between">
                <div>📍 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</div>
                <div>🕒 Office Hours: 9:00 AM - 6:00 PM</div>
            </div>

            {/* Navigation */}
            <header className="headersys bg-white border-b border-slate-200/60 shadow-sm py-3 px-6">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="relative">
                            <img src="/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute -inset-1 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <span className="logo-text text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text font-serif text-transparent">AsiaByte</span>
                    </div>  
                </div>
            </header>

            <main className="all-main-content max-w-7xl mx-auto p-6 md:p-8">

                {/*Top Bar Info - ✅ UPDATED: Dynamic title for order editing */}
                <div className="addedit-banner-row flex justify-between items-center mb-6">
                    <div className="title-banner flex items-center bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg overflow-hidden shadow-lg">
                        <button className="menu-btn p-3">
                            <svg className="menu-icon w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </button>
                        <h2 className="banner-title text-white text-xl px-6">
                            {isEditingOrder ? 'Edit Order' : 'Customer'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/order')} 
                            className="w-10 h-10 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                        >
                            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form Card */}
                <div className="form-section-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 mb-8 border border-slate-100 relative overflow-hidden">
                    <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-5">
                            <div>
                                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Customer Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Customer Name" 
                                    className="form-input w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    value={customerFormData.customerName}
                                    onChange={(e) => setCustomerFormData({...customerFormData, customerName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Phone Number" 
                                    className="form-input w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    value={customerFormData.phoneNumber}
                                    onChange={(e) => setCustomerFormData({...customerFormData, phoneNumber: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Email</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Email" 
                                    className="form-input w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    value={customerFormData.email}
                                    onChange={(e) => setCustomerFormData({...customerFormData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Address</label>
                                <textarea 
                                    placeholder="Enter Address" 
                                    className="form-input w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                                    rows="3"
                                    value={customerFormData.address}
                                    onChange={(e) => setCustomerFormData({...customerFormData, address: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
                                <div className="filter-wrapper relative">
                                    <select 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                                        value={customerFormData.status}
                                        onChange={(e) => setCustomerFormData({...customerFormData, status: e.target.value})}
                                    >
                                        <option>Active</option>
                                        <option>Inactive</option>
                                        <option>Pending</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Sales Platform</label>
                                <div className="filter-wrapper relative">
                                    <select 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
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
                                        <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Purchase Date / Stock Out</label>
                                <input 
                                    type="date" 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    value={customerFormData.purchaseDate}
                                    onChange={(e) => setCustomerFormData({...customerFormData, purchaseDate: e.target.value})}
                                />
                            </div>

                            {/* File Upload Field below Purchase Date */}
                            <div>
                                <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Upload Document</label>
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
                                        className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            <span className="text-sm text-slate-600">
                                                {fileName ? fileName : 'Choose file'}
                                            </span>
                                        </div>
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </label>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">*Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)</p>
                                {selectedFile && (
                                    <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        File ready to upload: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/*Tracking Number - ✅ UPDATED: Shows order tracking number when editing */}
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6 border border-slate-100">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="lg:w-2/3">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tracking Number</label>
                            <div className="flex gap-3">
                                <div className="relative flex-1 max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Enter Tracking Number"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-10"
                                        value={orderData.trackingNumber}
                                        onChange={(e) => setOrderData({...orderData, trackingNumber: e.target.value})}
                                    />
                                    <svg 
                                        className="absolute left-3 top-3 w-4 h-4 text-slate-400"
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
                                <button
                                    onClick={() => navigate('/inventory')}
                                    className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
                                    title="View Inventory"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">*Enter tracking number to view order details</p>
                        </div>
                    </div>
                </div>

                {/* Order Table */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Total (RM)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-blue-900">{item.sku}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.type}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.quantity}</td>
                                        <td className="px-6 py-4 font-bold text-slate-800">RM {item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Grand Total Summary Below Table */}
                    <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                        <div className="flex justify-end items-center gap-6">
                            <div className="text-right">
                                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Grand Total:</span>
                            </div>
                            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-3 rounded-lg shadow-md">
                                <span className="text-lg font-bold">RM {grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Remark section - Full width */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 mb-8">
                    <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Remark</label>
                    <textarea 
                        placeholder="Enter Remarks" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        rows="3"
                        value={orderData.remark}
                        onChange={(e) => setOrderData({...orderData, remark: e.target.value})}
                    />
                    <p className="text-xs text-slate-400 mt-2">*Additional notes or special instructions for this customer order</p>
                </div>

                {/* Action Buttons - Delete on Left, Save on Right */}
                <div className="flex justify-between items-center gap-4">
                    {/* Delete Button - Left side */}
                    <button 
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 px-6 py-3 transition-all duration-200 hover:scale-105 font-semibold"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-sm font-medium"></span>
                    </button>

                    {/* Save Button - Right side - ✅ UPDATED: Uses handleSave */}
                    <button 
                        onClick={handleSave}
                        className="save-btn-main bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
                    >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'></path>
                            <polyline points='17 21 17 13 7 13 7 21' />
                            <polyline points='7 3 7 8 15 8' />
                        </svg>
                        <span>{isEditingOrder ? '' : ''}</span>
                    </button>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="modal-container bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="modal-content text-center">
                            <div className="modal-icon-wrapper w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="modal-icon w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="modal-title text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
                            <p className="modal-description text-sm text-slate-500 mb-6">
                                This action cannot be undone. This will permanently delete this customer record from the system.
                            </p>
                            <div className="modal-actions flex gap-3">
                                <button className="btn-cancel flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium" onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </button>
                                <button className="btn-confirm-delete flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg shadow-red-500/20" onClick={handleDelete}>
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gradient-to-r from-blue-900 to-blue-700 h-8 w-full flex items-center justify-center">
                <span className="text-white text-xs">© 2026 AsiaByte. All rights reserved.</span>
            </footer>
        </div>
    );
};

export default Customer;