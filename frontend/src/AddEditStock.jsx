import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './App.css';

const AddEditStock = ({ isOpen, onClose, stock, mode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        sku: '',
        serialNumber: '',
        refNo: '',
        stockDate: '',
        trackingNumber: '',
        //status: '',
        promo: '',
        package: '',
        customerName: '',
        //remark: ''
    });

    // ✅ ADDED: Check for pending stock data from localStorage (passed from Customer)
    useEffect(() => {
        const pendingStockData = localStorage.getItem('pendingStockData');
        if (pendingStockData) {
            const parsedData = JSON.parse(pendingStockData);
            console.log('✅ Received pending stock data:', parsedData);
            
            setFormData(prev => ({
                ...prev,
                trackingNumber: parsedData.trackingNumber || prev.trackingNumber,
                customerName: parsedData.customerName || prev.customerName,
                sku: parsedData.sku || prev.sku
            }));
            
            // Clear after using
            localStorage.removeItem('pendingStockData');
        }
    }, []);

    // ✅ ADDED: Also check for direct location state (if navigated directly)
    useEffect(() => {
        if (location.state) {
            console.log('✅ Received stock data from location state:', location.state);
            setFormData(prev => ({
                ...prev,
                trackingNumber: location.state.trackingNumber || prev.trackingNumber,
                customerName: location.state.customerName || prev.customerName,
            }));
        }
    }, [location.state]);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && stock) {
                setFormData(stock);
            } else {
                setFormData(prev => ({
                    ...prev,
                    id: '',
                    sku: 'EZ-C8C-2MP',
                    serialNumber: '',
                    refNo: 'PO-001',
                    stockDate: '',
                    //trackingNumber: '', // Keep existing if any
                    //status: '',
                    promo: '',
                    package: '',
                    //customerName: '', // Keep existing if any
                    //remark: ''
                }));
            }
        }
    }, [stock, isOpen, mode]);

    const handleDelete = () => {
        console.log("Stock Deleted");
        setShowDeleteConfirm(false);
        onClose();
        navigate('/stock');
    };

    const Watermark = () => (
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center overflow-hidden">
            <img 
                src="/Pictures/watermark.png"
                alt="Watermark"
                className="w-[450px] h-auto object-contain"
            />
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-x-hidden">
            {/* ✅ RESPONSIVE FIX: Modal container with proper width control */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fadeIn">
                
                <Watermark />

                {/* ✅ RESPONSIVE FIX: Modal Header - responsive padding */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="bg-blue-800 p-2 sm:p-2.5 rounded-xl shadow-lg flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
                                {mode === 'edit' ? 'Stock' : 'Add New Stock'}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                                {mode === 'edit' ? 'Stock information below' : 'Fill in the stock details below'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition-all duration-200 flex-shrink-0"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* ✅ RESPONSIVE FIX: Modal Body - responsive grid that stacks on mobile */}
                <div className="p-4 sm:p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Left Column */}
                        <div className="space-y-4 sm:space-y-5">
                            {/* Section 1: Stock Identification */}
                            <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Stock Identification
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Keeping Unit (SKU)</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={formData.sku}
                                                disabled
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                                            />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">SKU is auto-generated and cannot be edited</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number (SN)</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={formData.serialNumber}
                                                disabled
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Dates */}
                            <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Dates
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Out</label>
                                        <div className="relative">
                                            <input 
                                                type="date"
                                                value={formData.stockDate}
                                                disabled
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4 sm:space-y-5">
                            {/* Section 3: Reference Information */}
                            <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Reference Information
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference No</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={formData.refNo}
                                                disabled
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                                            />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Reference No is locked for this transaction</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Promo</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={formData.promo}
                                                disabled
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Package</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={formData.package}
                                                disabled
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Customer Information - ✅ Auto-filled from Customer page */}
                            <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Customer Information
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={formData.trackingNumber} 
                                                disabled
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm" 
                                            />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Tracking is auto-generated by the system</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={formData.customerName} 
                                                disabled
                                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm" 
                                            />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Customer Name is auto-generated by the system</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats - Optional */}
                            {mode === 'edit' && (
                                <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Stock Movement</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 text-xs sm:text-sm">Last Updated:</span>
                                            <span className="font-semibold text-xs sm:text-sm">Feb 20, 2024</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 text-xs sm:text-sm">Movement Type:</span>
                                            <span className="font-semibold text-xs sm:text-sm">Stock In</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 text-xs sm:text-sm">Updated By:</span>
                                            <span className="font-semibold text-xs sm:text-sm">John Doe</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer - Buttons removed (preserved as original) */}

                {/* ✅ RESPONSIVE FIX: Delete Confirmation Modal - responsive */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 sm:p-6 animate-fadeIn">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Delete Stock?</h3>
                                <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">
                                    This action cannot be undone. This will permanently delete this stock item from the system.
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button 
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-lg text-sm"
                                        onClick={handleDelete}
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Animation styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AddEditStock;