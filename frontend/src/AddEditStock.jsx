import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

const AddEditStock = ({ isOpen, onClose, stock, mode }) => {
    const navigate = useNavigate();
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

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && stock) {
                setFormData(stock);
            } else {
                setFormData({
                    id: '',
                    sku: 'EZ-C8C-2MP',
                    serialNumber: '',
                    refNo: 'PO-001',
                    stockDate: '',
                    trackingNumber: '',
                    //status: '',
                    promo: '',
                    package: '',
                    customerName: '',
                    //remark: ''
                });
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
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center overflow-hidden">
            <svg width="400" height="200" viewBox="0 0 210 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d="M65 15C35 15 10 37 10 65C10 93 35 115 65 115C85 115 102 105 112 90C122 105 139 115 159 115C189 115 214 93 214 65C214 37 189 15 159 15C139 15 122 25 112 40C102 25 85 15 65 15ZM65 35C80 35 93 45 98 58L75 88C72 92 68 95 63 95C52 95 43 86 43 75C43 64 52 55 63 55H85L65 35ZM159 35C175 35 189 48 189 65C189 82 175 95 159 95C148 95 139 88 134 78L157 48C160 44 164 41 169 41H147L159 35Z" 
                    fill="#0504AA" 
                />
            </svg>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fadeIn">
                
                <Watermark />

                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-800 p-2.5 rounded-xl shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {mode === 'edit' ? 'Stock' : 'Add New Stock'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {mode === 'edit' ? 'Stock information below' : 'Fill in the stock details below'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-5">
                            {/* Section 1: Stock Identification */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Stock Identification
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Keeping Unit (SKU)</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={formData.sku}
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                            />
                                            <div className="absolute right-3 top-3 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">SKU is auto-generated and cannot be edited</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number (SN)</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={formData.serialNumber}
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                            />
                                            <div className="absolute right-3 top-3 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.status}
                                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white appearance-none"
                                            >
                                                <option value="">Select Status</option>
                                                <option value="in_stock">In Stock</option>
                                                <option value="out_of_stock">Out of Stock</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                            <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>*/}
                                </div>
                            </div>

                            {/* Section 2: Dates  */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Dates 
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Out</label>
                                        <div className="relative">
                                            <input 
                                                type="date"
                                                value={formData.stockDate}
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                            />
                                            <div className="absolute right-3 top-3 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                    
                            {/* Section 3: Reference Information */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Reference Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference No</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={formData.refNo}
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                            />
                                            <div className="absolute right-3 top-3 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Reference No is locked for ths transaction</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Promo</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={formData.promo}
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                            />
                                            <div className="absolute right-3 top-3 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Package</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={formData.package}
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                            />
                                            <div className="absolute right-3 top-3 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Customer Information */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Customer Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={formData.trackingNumber} 
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" 
                                            />
                                            <div className="absolute right-3 top-3 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Tracking is auto-generated by the system</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={formData.customerName} 
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" 
                                            />
                                            <div className="absolute right-3 top-3 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Customer Name is auto-generated by the system</p>
                                    </div>
                                    {/*<div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                                        <textarea 
                                            type="text" 
                                            value={formData.remark}
                                            onChange={(e) => setFormData({...formData, remark: e.target.value})}
                                            placeholder="Enter any additional remarks" 
                                            rows="3"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none"
                                        />
                                    </div>*/}
                                </div>
                            </div>


                            {/* Quick Stats - Optional */}
                            {mode === 'edit' && (
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Stock Movement</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Last Updated:</span>
                                            <span className="font-semibold">Feb 20, 2024</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Movement Type:</span>
                                            <span className="font-semibold">Stock In</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Updated By:</span>
                                            <span className="font-semibold">John Doe</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    {mode === 'edit' ? (
                        <button 
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group" 
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    ) : (
                        <div />
                    )}

                    <div className="flex gap-3">
                        <button 
                            onClick={onClose} 
                            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            className="save-btn-main bg-blue-800 text-white px-8 py-2 rounded-md flex items-center gap-2" 
                            onClick={() => {
                                console.log("Saving stock:", formData);
                                onClose();
                            }}
                        >
                            <span>{mode === 'edit' ? 'Update' : 'Save'}</span>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Stock?</h3>
                                <p className="text-gray-500 mb-6">
                                    This action cannot be undone. This will permanently delete this stock item from the system.
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button 
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-lg"
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