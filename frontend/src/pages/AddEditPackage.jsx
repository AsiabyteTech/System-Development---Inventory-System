// ✅ REFACTORED: imports organized
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePackage } from '../hooks/usePackage';
import { useProducts } from '../hooks/useProducts';
import '../App.css';
import '../styles/animations.css';

// ✅ REFACTORED: component imports
import { isAdmin } from "../shared/role";

const AddEditPackage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saving, setSaving] = useState(false);

    const { createPackage, updatePackage, deletePackage } = usePackage();
    const { allProducts, loading, error: productsError, fetchAllProducts } = useProducts();

    // ✅ Check if we're in edit mode
    const editMode = location.state?.mode === 'edit';
    const packageData = location.state?.packageData || null;
    
    // Form field states - matching your table structure
    const [packageId, setPackageId] = useState("");
    const [packageName, setPackageName] = useState("");
    const [packagePrice, setPackagePrice] = useState("");
    const [packageDateline, setPackageDateline] = useState("");
    const [packageRemark, setPackageRemark] = useState("");
    const [isManualPrice, setIsManualPrice] = useState(false);
    
    // Store selected products with their quantities
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);

    // Product picker list — reuses useProducts (already merges live stock/margin data)
    // instead of this component independently re-fetching and re-mapping products.
    const products = useMemo(() => {
        return (allProducts || []).map(item => ({
            id: item.id,
            sku: item.sku,
            name: item.productName,
            type: item.type,
            margin: item.margin,
            quantity: item.quantityOnHand,
            image: item.image || '/Pictures/default-product.png',
        }));
    }, [allProducts]);

    // Initialize quantities with zeros
    const initialQuantities = products.reduce((acc, product) => ({ ...acc, [product.id]: 0}), {});
    const [quantities, setQuantities] = useState(initialQuantities);

    // Reset quantities when products change
    useEffect(() => {
        const newQuantities = products.reduce((acc, product) => ({ ...acc, [product.id]: 0}), {});
        setQuantities(newQuantities);
    }, [products]);

    const handleDelete = async () => {
        setShowDeleteConfirm(false);
        const result = await deletePackage(packageId);
        if (result.success) {
            navigate('/dashboard');
        } else {
            alert(result.error || "Failed to delete package");
        }
    };

    // ✅ Load data when in edit mode
    useEffect(() => {
        if (editMode && packageData && products.length > 0) {
            console.log('📦 Loading package for edit:', packageData);
            
            // Map backend fields to frontend (matching your table structure)
            setPackageId(packageData.PackageID || packageData.package_id || packageData.id || '');
            setPackageName(packageData.PackageName || packageData.package_name || packageData.name || '');
            setPackagePrice(packageData.Price || packageData.price || '');
            setPackageDateline(packageData.Dateline || packageData.dateline || '');
            setPackageRemark(packageData.Remark || packageData.remark || '');
            
            // Load products with their quantities if available
            if (packageData.products && packageData.products.length > 0) {
                const newQuantities = { ...initialQuantities };
                let totalQty = 0;
                
                packageData.products.forEach((prod) => {
                    const product = products.find(p => p.sku === prod.sku);
                    if (product) {
                        newQuantities[product.id] = prod.quantity || 1;
                        totalQty += prod.quantity || 1;
                    }
                });
                
                setQuantities(newQuantities);
                setTotalQuantity(totalQty);
                console.log('✅ Restored quantities:', newQuantities);
            }
        } else if (!editMode) {
            // Reset quantities when not in edit mode
            setQuantities(initialQuantities);
            setSelectedProducts([]);
            setTotalQuantity(0);
        }
    }, [editMode, packageData, products]);

    // Update quantity stock
    const updateQty = (id, delta) => {
        setQuantities(prev => {
            const currentQty = prev[id] || 0;
            const product = products.find(p => p.id === id);
            const newQty = currentQty + delta;

            if (newQty < 0 || (product && newQty > product.quantity)) return prev;

            // Update total quantity
            const newTotal = Object.values({ ...prev, [id]: newQty }).reduce((sum, qty) => sum + qty, 0);
            setTotalQuantity(newTotal);

            return { ...prev, [id]: newQty };
        });
    };

    // Calculate total margin from selected quantities
    const totalMargin = products.reduce((sum, item) => {
        const qty = quantities[item.id] || 0;
        return sum + (parseFloat(item.margin) * qty);
    }, 0);

    // Auto update package price when margin changes (unless manually overridden)
    useEffect(() => {
        if (!isManualPrice && totalMargin > 0 && !editMode) {
            setPackagePrice(totalMargin.toFixed(2));
        } else if (!isManualPrice && totalMargin === 0) {
            setPackagePrice("");
        }
    }, [totalMargin, isManualPrice, editMode]);

    // Handle manual price input
    const handlePriceChange = (e) => {
        const value = e.target.value
            .replace(/[^0-9.]/g, '')
            .replace(/(\..*)\./g, '$1');
        setPackagePrice(value);
        setIsManualPrice(true);
        
        // If user clears the price, reset auto mode
        if (value === '') {
            setIsManualPrice(false);
        }
    };

    const hasSelectedItems = totalMargin > 0;

    // ✅ Handle Save/Update with actual API
    const handleSave = async () => {
        // Validate required fields
        if (!packageName.trim()) {
            alert('Please enter a package name');
            return;
        }
        if (!packagePrice || parseFloat(packagePrice) <= 0) {
            alert('Please enter a valid price');
            return;
        }
        if (!packageDateline) {
            alert('Please select a dateline');
            return;
        }
        
        // Build the product list from selected quantities
        const selectedProductsList = [];
        let totalQty = 0;
        
        products.forEach(product => {
            const qty = quantities[product.id] || 0;
            if (qty > 0) {
                selectedProductsList.push({
                    sku: product.sku,
                    quantity: qty,
                    product_id: product.id
                });
                totalQty += qty;
            }
        });

        if (selectedProductsList.length === 0) {
            alert('Please select at least one product with quantity > 0');
            return;
        }

        // Prepare data matching your table structure
        const packageDataToSave = {
            PackageName: packageName,
            Dateline: packageDateline,
            Price: parseFloat(packagePrice),
            Remark: packageRemark,
            products: selectedProductsList
        };

        try {
            setSaving(true);

            const result = editMode
                ? await updatePackage(packageId, packageDataToSave)
                : await createPackage(packageDataToSave);

            if (!result.success) {
                alert(result.error || "Failed to save package. Please try again.");
                return;
            }

            alert(editMode
                ? `Package "${packageName}" updated successfully!`
                : `Package "${packageName}" created successfully!`);

            navigate('/dashboard');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading package...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="containersys min-h-screen bg-slate-50">
            {/* Top Header Bar */}
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

            {/* Navigation */}
            <header className="headersys bg-white border-b border-slate-200/60 shadow-sm py-2 sm:py-3 px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="relative">
                            <img src="/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute -inset-1 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <span className="logo-text text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text font-serif text-transparent">AsiaByte</span>
                    </div>
                </div>
            </header>

            <main className="all-main-content max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                {/* Error Message */}
                {productsError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        <p className="text-sm">{productsError}</p>
                        <button 
                            onClick={fetchAllProducts}
                            className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Banner row */}
                <div className="addedit-banner-row flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <div className="title-banner flex items-center bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg overflow-hidden shadow-lg">
                        <div className="menu-btn p-2 sm:p-3">
                            <svg className="menu-icon w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                        </div>
                        <h2 className="banner-title text-white text-base sm:text-lg md:text-xl px-4 sm:px-6">
                            {editMode ? 'Edit Package' : 'Add Package'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form Card */}
                <div className="form-section-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-slate-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            <div className="space-y-4 sm:space-y-5">
                                <div>
                                    <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Package ID</label>
                                    <input
                                        type="text"
                                        value={packageId || (editMode ? 'Auto-generated' : 'New')}
                                        readOnly
                                        className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {editMode ? '*Package ID is locked for editing' : '*Auto-generated on save'}
                                    </p>
                                </div>
                                <div>
                                    <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Package Name *</label>
                                    <input 
                                        type="text" 
                                        value={packageName}
                                        onChange={(e) => setPackageName(e.target.value)}
                                        placeholder="Enter Package Name" 
                                        className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Price (RM) *</label>
                                    <input
                                        type="text"
                                        value={packagePrice}
                                        onChange={handlePriceChange}
                                        placeholder="0.00"
                                        className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {editMode 
                                            ? '*Manually edit the price' 
                                            : hasSelectedItems && !isManualPrice 
                                                ? '*Auto-calculated from margin' 
                                                : '*Numbers only (0-9 and decimal point)'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-5">
                                <div>
                                    <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Dateline *</label>
                                    <div className="filter-group">
                                        <input 
                                            type="date" 
                                            value={packageDateline}
                                            onChange={(e) => setPackageDateline(e.target.value)}
                                            className="filter-select w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Remark</label>
                                    <textarea 
                                        value={packageRemark}
                                        onChange={(e) => setPackageRemark(e.target.value)}
                                        placeholder="Enter Remarks" 
                                        className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
                                        rows="3" 
                                    />
                                </div>
                                
                                {/* Pricing Summary Card */}
                                {(hasSelectedItems || editMode) && (
                                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Pricing Summary
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600">Total Margin:</span>
                                                <span className="font-semibold text-slate-800">RM {totalMargin.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                                                <span className="font-semibold text-slate-700">Final Price:</span>
                                                <span className="font-bold text-blue-900 text-lg">RM {parseFloat(packagePrice || 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        {isManualPrice && (
                                            <p className="text-[10px] text-amber-600 mt-2 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Manual price mode active
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Table */}
                <div className="table-wrapper bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6 sm:mb-8">
                    <div className="overflow-x-auto">
                        <div className="min-w-[700px]">
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white text-[10px] sm:text-xs uppercase tracking-wider">
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">Product</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">SKU</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">Type</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">Margin (RM)</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">Available</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">Select Qty</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs sm:text-sm text-slate-600 bg-white divide-y divide-slate-100">
                                    {products.length > 0 ? (
                                        products.map((item) => (
                                            <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                        {item.image && item.image.startsWith('http') ? (
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.sku} 
                                                                className="w-full h-full object-cover rounded-lg shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300" 
                                                                onClick={() => setSelectedImage(item.image)}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.parentElement.innerHTML = `
                                                                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 font-bold text-xs">
                                                                            ${(item.sku || 'P').charAt(0).toUpperCase()}
                                                                        </div>
                                                                    `;
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 font-bold text-sm">
                                                                {(item.sku || 'P').charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-blue-900 text-xs sm:text-sm">{item.sku}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-500 text-xs sm:text-sm">{item.type || 'N/A'}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-slate-700 text-xs sm:text-sm">RM {parseFloat(item.margin).toFixed(2)}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-50 text-blue-700">
                                                        {item.quantity} units
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <div className="qty-controls flex items-center gap-2 sm:gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200 w-fit">
                                                        <button
                                                            onClick={() => updateQty(item.id, -1)}
                                                            className="qty-btn w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg text-blue-900 font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
                                                            disabled={(quantities[item.id] || 0) === 0}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="qty-display font-bold text-blue-900 min-w-[20px] sm:min-w-[24px] text-center text-sm sm:text-base">
                                                            {quantities[item.id] || 0}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQty(item.id, 1)}
                                                            className="qty-btn w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg text-blue-900 font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
                                                            disabled={(quantities[item.id] || 0) >= (item.quantity || 0)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    {quantities[item.id] > 0 && (
                                                        <div className="text-[10px] text-green-600 mt-1">
                                                            +RM {(parseFloat(item.margin) * quantities[item.id]).toFixed(2)}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-8 text-slate-500">
                                                No products available. Please add products first.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Summary Row */}
                    <div className="border-t border-slate-200 px-4 sm:px-6 py-3 bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex justify-end items-center gap-4">
                            <span className="text-sm font-medium text-slate-600">Total Items Selected:</span>
                            <span className="font-bold text-blue-900 text-lg">{totalQuantity}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center gap-4">
                    {editMode && (
                        <button 
                            className="flex items-center gap-1 sm:gap-2 text-red-600 hover:text-red-700 px-4 sm:px-6 py-2 sm:py-3 transition-all duration-200 hover:scale-105 font-semibold text-sm sm:text-base"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="text-sm font-medium">Delete</span>
                        </button>
                    )}
                    
                    <div className="flex gap-2 sm:gap-3 ml-auto">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="px-4 sm:px-6 py-2 sm:py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-all duration-200 hover:scale-105 font-medium text-sm sm:text-base"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="save-btn-main bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 sm:gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'></path>
                                        <polyline points='17 21 17 13 7 13 7 21' />
                                        <polyline points='7 3 7 8 15 8' />
                                    </svg>
                                    <span>{editMode ? 'Update' : 'Save'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn duration-300"
                    onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-[90%] sm:max-w-2xl w-full bg-white rounded-xl p-2 shadow-2xl animate-scaleIn duration-300">
                        <button 
                            className="absolute -top-8 sm:-top-10 -right-1 sm:-right-2 text-white hover:text-red-400 text-2xl sm:text-3xl font-bold"
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>
                        <img src={selectedImage} alt="Preview" className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg" />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="modal-container bg-white rounded-xl p-5 sm:p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="modal-content text-center">
                            <div className="modal-icon-wrapper w-14 h-14 sm:w-16 sm:h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <svg className="modal-icon w-7 h-7 sm:w-8 sm:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="modal-title text-lg sm:text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
                            <p className="modal-description text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6">
                                This action cannot be undone. This will permanently delete this package from the system.
                            </p>
                            <div className="modal-actions flex gap-3">
                                <button 
                                    className="btn-cancel flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm" 
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn-confirm-delete flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg shadow-red-500/20 text-sm" 
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
            <footer className="bg-gradient-to-r from-blue-900 to-blue-700 h-8 w-full flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs">© 2026 AsiaByte. All rights reserved.</span>
            </footer>
        </div>
    );
};

export default AddEditPackage;