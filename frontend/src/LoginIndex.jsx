//Product

import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

const AddEditProduct = () => {
    const navigate = useNavigate();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const handleDelete = () => {
        console.log("Product Deleted");
        setShowDeleteConfirm(false);
        navigate('/product');
    };

    const [formData, setFormData] = useState({
        sku: '12345',
        productName: 'Ezviz',
        //productType: 'CCTV',
        //quantity: 0,
        //vendorPrice: 'RM150'

    });

    const [error, setErrors] = useState({});

    const handleInputChange = (e, field) => {
        setFormData ({...formData, [field]: e.target.value });
        // Clear error when user starts typing
        if (error[field]) {
            setErrors({...error, [field]: null});
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.sku) newErrors.sku = "SKU is required";
        if (!formData.productName) newErrors.productName = "Product Name is required";
        //if (formData.quantity < 0) newErrors.quantity = "Quantity cannot be negative";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            console.log("Saving Data:", formData);
            // Proceed with API call
            navigate('/product');
        } else {
            console.log("Validation Failed");
        }
    };

    return (
        <div className="containersys">
            {/* Top Header Bar */}
            <div className="top-info-bar">
                <div>📍 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</div>
                <div>🕒 Office Hours: 9:00 AM - 6:00 PM</div>
            </div>

            {/* Navigation */}
            <header className="headersys">

                <div className="flex items-center gap-2 cursor-pointer" >
                    <div className="flex items-center gap-3">
                        <img src = "src/assets/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-10 w-auto" />
                            <span className="logo-text">AsiaByte</span>
                    </div>
                </div>
                <button className="action-btn-circle" style={{width: '32px', height: '32px'}}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                </button>
            </header>

            <main className="all-main-content">
                <div className="addedit-banner-row">
                    <div className="title-banner">
                        <button className="menu-btn">
                            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                        </button>
                        <h2 className="banner-title">Add/Edit Product</h2>
                    </div>

                    <button onClick={() => navigate('/product')} className="icon-btn-blue" style={{width: '40px', height: '40px'}}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="form-section-card">
                    <div className="watermark-bg">
                        <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-[#00008B]">
                            <path d="M30 30 C 10 30, 10 10, 30 10 C 45 10, 55 50, 70 50 C 90 50, 90 30, 70 30 C 55 30, 45 10, 30 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <div className="form-grid">
                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Stock Keeping Unit (SKU)</label>
                                <input type="text" placeholder="Enter Input" className={`form-input ${errors.sku ? 'border-red-500' : ''}`}
                                value={formData.sku} onChange={(e) => handleInputChange(e, 'sku')} />
                                {errors.sku && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.sku}</p>}
                            </div>
                            <div className="filter-wrapper">
                                <select className="filter-select">
                                <option>Status</option>
                                <option>-</option>
                                <option>-</option>
                                <option>-</option>
                            </select>
                            <div className="filter-select-arrow">
                                <svg className="filter-select-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                            </div> 
                            
                        </div>

                        <div className="space-y-6">

                            <div className="md:col-span-2 flex flex-col items-center pt-4">
                            <label className="input-label">File Invoice</label>
                            <button className="icon-btn-blue" style={{ width: '48px', height: '48px' }}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </button>
                            </div>
                            
                        </div>

                    </div>
                </div>

                <div className="form-section-card">
                    <div className="watermark-bg">
                        <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-[#00008B]">
                            <path d="M30 30 C 10 30, 10 10, 30 10 C 45 10, 55 50, 70 50 C 90 50, 90 30, 70 30 C 55 30, 45 10, 30 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <div className="form-grid">
                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Quantity On Hand (Balance)</label>
                                <input type="number" placeholder="Enter Input" className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Reserved Quantity (Sold)</label>
                                <input type="number" placeholder="Enter Input" className="form-input" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Margin</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div className="form-section-card">
                    <div className="watermark-bg">
                        <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-[#00008B]">
                            <path d="M30 30 C 10 30, 10 10, 30 10 C 45 10, 55 50, 70 50 C 90 50, 90 30, 70 30 C 55 30, 45 10, 30 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <div className="form-grid">
                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Product Name</label>
                                <input type="text" placeholder="Enter Input" className={`form-input ${errors.productName ? 'border-red-500' : ''}`} 
                                value={formData.productName} onChange={(e) => handleInputChange(e, 'productName')}/>
                                {errors.productName && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.productName}</p>}
                            </div>
                            <div>
                                <label className="input-label">Product Type</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Initial Vendor Price</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Product Details</label>
                                <textarea type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Initial Selling Price</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                        </div>
                    </div>
                    
                </div>

                <div className="form-section-card">
                    <div className="watermark-bg">
                        <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-[#00008B]">
                            <path d="M30 30 C 10 30, 10 10, 30 10 C 45 10, 55 50, 70 50 C 90 50, 90 30, 70 30 C 55 30, 45 10, 30 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <div className="form-grid">
                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Service Charges:</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Product Type</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            {/* Delete Button - Red Palette based on Action screenshot */}
                            <button className="delete-btn-footer" onClick={() => setShowDeleteConfirm(true)}>
                                <span>Delete</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                </div>

                <div className="flex justify-center pb-12">
                <button className="save-btn-footer" onClick={handleSave}>
                    <span>Save</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                </button>
                </div>
            </main>

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-gray-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
                            <p className="text-gray-500 text-sm mb-8">
                                This action cannot be undone. This will permanently delete the product from the system.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button 
                                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg shadow-red-200 transition-colors"
                                    onClick={handleDelete}
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
      <footer className="bg-[#00008B] h-8 md:h-8 w-full mt-auto"></footer>
        </div>
    );
};

export default AddEditProduct;