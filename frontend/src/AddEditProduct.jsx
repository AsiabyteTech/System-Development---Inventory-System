import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

const AddEditProduct = ({ isOpen, onClose, product, mode }) => {
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({ 
        id: '', 
        sku: '', 
        type: '', 
        margin: '', 
        quantity: '', 
        image: null,
        productName: '',
        productDetails: '',
        vendorPrice: '',
        sellingPrice: '',
        reservedQuantity: '0',
        status: 'active'
    });

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && product) {
                setFormData({
                    ...product,
                    reservedQuantity: product.reservedQuantity || '0',
                    status: product.status || 'active'
                });
                setImagePreview(product.image || null);
            } else {
                setFormData({ 
                    id: '', 
                    sku: '', 
                    type: '', 
                    margin: '', 
                    quantity: '',
                    productName: '',
                    productDetails: '',
                    vendorPrice: '',
                    sellingPrice: '',
                    reservedQuantity: '0',
                    status: 'active',
                    image: null
                });
                setImagePreview(null);
            }
        }
    }, [product, isOpen, mode]);

    const handleDelete = () => {
        console.log("Product Deleted");
        setShowDeleteConfirm(false);
        onClose();
        navigate('/product');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({...formData, image: reader.result});
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    const Watermark = () => (
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center overflow-hidden">
            {/* ✅ FIXED: Updated watermark image path */}
            <img 
                src="/Pictures/watermark.png"
                alt="Watermark"
                className="w-[450px] h-auto object-contain"
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fadeIn">
                
                <Watermark />

                {/* Modal Header - Enhanced */}
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-800 p-2.5 rounded-xl shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {mode === 'edit' ? 'Update product information below' : 'Fill in the product details below'}
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

                {/* Modal Body - Enhanced with better organization */}
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column - Basic Info */}
                        <div className="md:col-span-2 space-y-5">
                            {/* Section 1: Basic Information */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Basic Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stock Keeping Unit)</label>
                                        <input 
                                            type="text" 
                                            value={formData.sku} 
                                            onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                            placeholder="e.g., EZ-C8C-2MP" 
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.productName}
                                            onChange={(e) => setFormData({...formData, productName: e.target.value})}
                                            placeholder="Enter product name" 
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                                        <input 
                                            type="text" 
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            placeholder="e.g., CCTV, Accessory" 
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Details</label>
                                        <textarea 
                                            value={formData.productDetails}
                                            onChange={(e) => setFormData({...formData, productDetails: e.target.value})}
                                            placeholder="Enter product description, specifications, etc." 
                                            rows="3"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.status}
                                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white appearance-none"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="discontinued">Discontinued</option>
                                            </select>
                                            <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Pricing Information */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Pricing Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Price (RM)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-gray-500">RM</span>
                                            <input 
                                                type="text" 
                                                value={formData.vendorPrice}
                                                onChange={(e) => setFormData({...formData, vendorPrice: e.target.value})}
                                                placeholder="0.00" 
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (RM)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-gray-500">RM</span>
                                            <input 
                                                type="text" 
                                                value={formData.sellingPrice}
                                                onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                                                placeholder="0.00" 
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Margin (%)</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={formData.margin}
                                                onChange={(e) => setFormData({...formData, margin: e.target.value})}
                                                placeholder="8.00" 
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                                            />
                                            <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Stock Information */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    Stock Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity On Hand</label>
                                        <input 
                                            type="number" 
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                            placeholder="0" 
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reserved Quantity (Sold)</label>
                                        <input 
                                            type="number" 
                                            value={formData.reservedQuantity}
                                            onChange={(e) => setFormData({...formData, reservedQuantity: e.target.value})}
                                            placeholder="0" 
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                                        />
                                    </div>
                                </div>
                                {formData.quantity && (
                                    <div className="mt-3 flex gap-2 text-xs">
                                        <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full">
                                            Available: {parseInt(formData.quantity || 0) - parseInt(formData.reservedQuantity || 0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Image Upload */}
                        <div className="space-y-5">
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Product Image
                                </h3>
                                
                                {/* Image Upload Area */}
                                <div className="flex flex-col items-center">
                                    <div className="relative group">
                                        <div className={`w-40 h-40 rounded-2xl border-3 border-dashed transition-all duration-300 overflow-hidden
                                            ${imagePreview ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-100 group-hover:border-blue-400 group-hover:bg-blue-50'}`}>
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Upload Overlay */}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-2xl cursor-pointer">
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                            <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3 text-center">
                                        Click to upload product image<br />PNG, JPG up to 2MB
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats - Optional */}
                            {mode === 'edit' && (
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Product Stats</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Sold:</span>
                                            <span className="font-semibold">24 units</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Revenue:</span>
                                            <span className="font-semibold">RM 12,450</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Last Updated:</span>
                                            <span className="font-semibold">Feb 20, 2024</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer - Enhanced */}
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
                                console.log("Saving product:", formData);
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

                {/* Delete Confirmation Modal - Enhanced */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
                                <p className="text-gray-500 mb-6">
                                    This action cannot be undone. This will permanently delete <span className="font-semibold">{formData.sku || 'this product'}</span> from the system.
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

export default AddEditProduct;