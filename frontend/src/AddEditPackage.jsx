import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

const AddEditPackage = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    // ✅ ADDED: auto package ID state
    const [packageId, setPackageId] = useState("");
    
    // ✅ ADDED: state for price input with validation
    const [packagePrice, setPackagePrice] = useState("");
    
    // ✅ ADDED: state for reduction percentage
    const [reduction, setReduction] = useState("");
    
    // ✅ ADDED: flag to track if price is manually overridden
    const [isManualPrice, setIsManualPrice] = useState(false);

    const handleDelete = () => {
        console.log("Product Deleted");
        setShowDeleteConfirm(false);
        navigate('/dashboard')
    };

    // ✅ ADDED: auto-generate package ID when component loads
    useEffect(() => {
        // In a real application, you would fetch the last ID from your backend
        // For demo purposes, we'll simulate getting the last ID
        const getLastPackageId = () => {
            // This could be an API call to get the last package ID
            // For now, we'll use localStorage to track the last ID
            const lastId = localStorage.getItem('lastPackageId');
            if (lastId) {
                return parseInt(lastId) + 1;
            }
            return 1; // Start from 1 if no existing packages
        };
        
        const newIdNumber = getLastPackageId();
        const newId = `PCK${String(newIdNumber).padStart(2, '0')}`;
        setPackageId(newId);
        
        // Store the current ID for next time
        localStorage.setItem('lastPackageId', newIdNumber.toString());
    }, []);

    const products = [
    { id: '1', image: '/Pictures/EZC8C.jpg', sku: 'EZ-C8C-2MP', type: 'CCTV', margin: '8.00', quantity: 7 },
    { id: '2', image: '/Pictures/C8C5MP.png', sku: 'EZ-C8C-5MP', type: 'CCTV', margin: '8.00', quantity: 2 },
    { id: '3', image: '/Pictures/Ezviz-H1C front.jpg', sku: 'EZ-H1C', type: 'CCTV', margin: '8.00', quantity: 1 },
    { id: '4', image: '/Pictures/ez ty1pro.jpg', sku: 'EZ-TY1-PRO', type: 'CCTV', margin: '8.00', quantity: 5 },
    { id: '5', image: '/Pictures/ez h6cpro.png', sku: 'EZ-H6C-PRO', type: 'CCTV', margin: '8.00', quantity: 2 },
    { id: '6', image: '/Pictures/H9c.png', sku: 'EZ-H9C-DL', type: 'CCTV', margin: '8.00', quantity: 4 },
    { id: '7', image: '/Pictures/c6n.jpg', sku: 'EZ-C6N', type: 'CCTV', margin: '14.00', quantity: 1 },
  ];

  const [quantities, setQuantities] = useState(
    products.reduce((acc, product) => ({ ...acc, [product.id]: 0}), {} )
  );

  const updateQty = (id,delta) => {
    setQuantities(prev => {
        const currentQty = prev[id] || 0;
        const product = products.find(p => p.id === id);
        const newQty = currentQty + delta;

        if (newQty < 0 || newQty > product.quantity) return prev;

        return{ ...prev, [id]: newQty};
    });
  };

  // ✅ CALC: total margin from selected quantities
  const totalMargin = products.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + (parseFloat(item.margin) * qty);
  }, 0);

  // ✅ CALC: final price after reduction
  const reductionValue = (totalMargin * (parseFloat(reduction) || 0)) / 100;
  const finalPrice = totalMargin - reductionValue;

  // ✅ AUTO: update package price when margin or reduction changes (unless manually overridden)
  useEffect(() => {
    if (!isManualPrice && totalMargin > 0) {
      setPackagePrice(finalPrice.toFixed(2));
    } else if (!isManualPrice && totalMargin === 0) {
      setPackagePrice("");
    }
  }, [totalMargin, reduction, isManualPrice]);

  // ✅ Handle manual price input
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

  // ✅ Check if any items are selected
  const hasSelectedItems = totalMargin > 0;

    return (
        <div className="containersys min-h-screen bg-slate-50">
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

            <main className="all-main-content max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                {/* ✅ RESPONSIVE FIX: Banner row - responsive padding and layout */}
                <div className="addedit-banner-row flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <div className="title-banner flex items-center bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg overflow-hidden shadow-lg">
                        <div className="menu-btn p-2 sm:p-3">
                            <svg className="menu-icon w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                        </div>
                        <h2 className="banner-title text-white text-base sm:text-lg md:text-xl px-4 sm:px-6">Add/Edit Package</h2>
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

                {/* ✅ RESPONSIVE FIX: Form Card - responsive padding and grid */}
                <div className="form-section-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-slate-100 relative overflow-hidden">
                    <div className="watermark-bg absolute inset-0 opacity-5 pointer-events-none">
                        <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-[#00008B]">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M30 30 C 10 30, 10 10, 30 10 C 45 10, 55 50, 70 50 C 90 50, 90 30, 70 30 C 55 30, 45 10, 30 10"></path>
                        </svg>
                    </div>

                    <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
                        <div className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Package ID</label>
                                {/* ✅ UPDATED: auto-generated package ID (readonly) */}
                                <input
                                    type="text"
                                    value={packageId}
                                    readOnly
                                    className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">*Auto-generated, cannot be edited</p>
                            </div>
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Package Name</label>
                                <input type="text" placeholder="Enter Package Name" className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
                            </div>
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Price (RM)</label>
                                {/* ✅ UPDATED: number-only input for price with validation and auto-update */}
                                <input
                                    type="text"
                                    value={packagePrice}
                                    onChange={handlePriceChange}
                                    placeholder="0.00"
                                    className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">
                                    {hasSelectedItems && !isManualPrice 
                                        ? '*Auto-calculated from margin and reduction' 
                                        : '*Numbers only (0-9 and decimal point)'}
                                </p>
                            </div>
                            
                            {/* ✅ ADDED: Reduction Percentage Input */}
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Reduction (%)</label>
                                <input
                                    type="text"
                                    value={reduction}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        if (value === '' || parseInt(value) <= 100) {
                                            setReduction(value);
                                            // When user starts using reduction, auto mode is re-enabled for price
                                            if (isManualPrice) {
                                                setIsManualPrice(false);
                                            }
                                        }
                                    }}
                                    placeholder="Enter reduction percentage (0-100)"
                                    className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    disabled={!hasSelectedItems}
                                />
                                <p className="text-[10px] text-slate-400 mt-1">
                                    {!hasSelectedItems 
                                        ? '*Select products to enable reduction' 
                                        : '*Numbers only (0-100)'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Dateline</label>
                                <div className="filter-group">
                                    <input type="date" className="filter-select w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="input-label text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Remark</label>
                                <textarea type="text" placeholder="Enter Remarks" className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" rows="3" />
                            </div>
                            
                            {/* ✅ ADDED: Pricing Summary Card */}
                            {hasSelectedItems && (
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
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600">Reduction:</span>
                                            <span className="font-semibold text-slate-800">{reduction || 0}%</span>
                                        </div>
                                        {reduction && reduction > 0 && (
                                            <div className="flex justify-between items-center text-red-600">
                                                <span className="text-slate-600">Discount Amount:</span>
                                                <span className="font-semibold">- RM {reductionValue.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                                            <span className="font-semibold text-slate-700">Final Price:</span>
                                            <span className="font-bold text-blue-900 text-lg">RM {finalPrice.toFixed(2)}</span>
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

                {/* ✅ RESPONSIVE FIX: Table with horizontal scroll on mobile */}
                <div className="table-wrapper bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6 sm:mb-8">
                    <div className="overflow-x-auto">
                        <div className="min-w-[700px]">
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white text-[10px] sm:text-xs uppercase tracking-wider">
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">Product</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">SKU</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">Type</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">Margin</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">Available</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold">Select Qty</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs sm:text-sm text-slate-600 bg-white divide-y divide-slate-100">
                                    {products.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                <img src={item.image} alt="Product" className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-lg shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300" onClick={() => setSelectedImage(item.image)} />
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-blue-900 text-xs sm:text-sm">{item.sku}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-500 text-xs sm:text-sm">{item.type}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-slate-700 text-xs sm:text-sm">RM {item.margin}</td>
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
                                                        disabled={quantities[item.id] === 0}>-</button>
                                                    <span className="qty-display font-bold text-blue-900 min-w-[20px] sm:min-w-[24px] text-center text-sm sm:text-base">{quantities[item.id] || 0}</span>
                                                    <button
                                                        onClick={() => updateQty(item.id, 1)}
                                                        className="qty-btn w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg text-blue-900 font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
                                                        disabled={quantities[item.id] >= item.quantity}>+</button>
                                                </div>
                                                {/* ✅ ADDED: Show individual product contribution to margin */}
                                                {quantities[item.id] > 0 && (
                                                    <div className="text-[10px] text-green-600 mt-1">
                                                        +RM {(parseFloat(item.margin) * quantities[item.id]).toFixed(2)}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ✅ RESPONSIVE FIX: Action Buttons - responsive spacing */}
                <div className="flex justify-between items-center gap-4">
                    <button 
                        className="flex items-center gap-1 sm:gap-2 text-red-600 hover:text-red-700 px-4 sm:px-6 py-2 sm:py-3 transition-all duration-200 hover:scale-105 font-semibold text-sm sm:text-base"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-sm font-medium"></span>
                    </button>

                    <button className="save-btn-main bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 sm:gap-3">
                        <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'></path>
                            <polyline points='17 21 17 13 7 13 7 21' />
                            <polyline points='7 3 7 8 15 8' />
                        </svg>
                    </button>
                </div>
            </main>

            {/* ✅ RESPONSIVE FIX: Image Preview Modal - responsive sizing */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-[90%] sm:max-w-2xl w-full bg-white rounded-xl p-2 shadow-2xl animate-in zoom-in duration-300">
                        <button className="absolute -top-8 sm:-top-10 -right-1 sm:-right-2 text-white hover:text-red-400 text-2xl sm:text-3xl font-bold"
                        onClick={() => setSelectedImage(null)}>&times;</button>
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

export default AddEditPackage;