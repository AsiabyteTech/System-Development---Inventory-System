// ✅ REFACTORED: imports organized
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../App.css';
import '../styles/animations.css';

const AddEditStock = ({ isOpen, onClose, stock, mode, onSave, onDelete }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showStockList, setShowStockList] = useState(false);
    
    const [formData, setFormData] = useState({
        id: '',
        sku: '',
        serialNumber: '',
        refNo: '',
        stockDate: '',
        trackingNumber: '',
        promo: '',
        promoPrice: '',
        package: '',
        packagePrice: '',
        customerName: '',
        status: 'AVAILABLE',
        purchaseCost: '',
        remark: ''
    });

    // Mock stock items for display - In production, this would come from an API
    const [associatedStocks, setAssociatedStocks] = useState([]);

    // Check for pending stock data from localStorage (passed from Customer)
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

    // Also check for direct location state
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
                setFormData({
                    id: stock.id || '',
                    sku: stock.sku || '',
                    serialNumber: stock.serialNumber || '',
                    refNo: stock.refNo || '',
                    stockDate: stock.stockDate || stock.stockIn || '',
                    trackingNumber: stock.trackingNumber || '',
                    promo: stock.promo || stock.promoId || '',
                    promoPrice: stock.promoPrice || '',
                    package: stock.package || stock.packageId || '',
                    packagePrice: stock.packagePrice || '',
                    customerName: stock.customerName || '',
                    status: stock.status || 'AVAILABLE',
                    purchaseCost: stock.purchaseCost || '',
                    remark: stock.remark || ''
                });

                // Load associated stocks for this promo/package
                loadAssociatedStocks(stock);
            } else {
                setFormData({
                    id: '',
                    sku: '',
                    serialNumber: '',
                    refNo: '',
                    stockDate: new Date().toISOString().split('T')[0],
                    trackingNumber: '',
                    promo: '',
                    promoPrice: '',
                    package: '',
                    packagePrice: '',
                    customerName: '',
                    status: 'AVAILABLE',
                    purchaseCost: '',
                    remark: ''
                });
                setAssociatedStocks([]);
            }
            setError(null);
        }
    }, [stock, isOpen, mode]);

    // Load associated stocks (mock data - replace with API call)
    const loadAssociatedStocks = (stockData) => {
        // In production, you would fetch from API:
        // const stocks = await stockAPI.getByPromoOrPackage(stockData.promoId || stockData.packageId);
        
        // Mock data for demo
        const mockStocks = [
            { id: 'STK-001', serialNumber: 'SN-1001', sku: 'CAM-001', status: 'AVAILABLE' },
            { id: 'STK-002', serialNumber: 'SN-1002', sku: 'CAM-001', status: 'RESERVED' },
            { id: 'STK-003', serialNumber: 'SN-1003', sku: 'CAM-002', status: 'AVAILABLE' },
        ];
        
        // Filter based on promo or package
        let filtered = mockStocks;
        if (stockData.promo || stockData.promoId) {
            filtered = mockStocks.filter(s => s.sku === stockData.sku);
        } else if (stockData.package || stockData.packageId) {
            filtered = mockStocks.filter(s => s.sku === stockData.sku);
        }
        
        setAssociatedStocks(filtered);
    };

    const handleDelete = async () => {
        if (!stock || !stock.id || !onDelete) return;
        const result = await onDelete(stock.id);
        setShowDeleteConfirm(false);
        if (result.success) {
            onClose();
            navigate('/stock');
        } else {
            alert(result.error || "Failed to delete stock");
        }
    };

    // Handle form submission - FIXED: Now calls the API
    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.sku.trim()) {
            alert('SKU is required');
            return;
        }
        if (!formData.serialNumber.trim()) {
            alert('Serial Number is required');
            return;
        }
        if (!formData.refNo.trim()) {
            alert('Reference No is required');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // Prepare data for API
            const stockData = {
                sku: formData.sku,
                serial_number: formData.serialNumber,
                ref_no: formData.refNo,
                stock_in: formData.stockDate,
                status: formData.status,
                tracking_number: formData.trackingNumber,
                purchase_cost: parseFloat(formData.purchaseCost) || 0,
                remark: formData.remark,
                promo_id: formData.promo || null,
                promo_price: parseFloat(formData.promoPrice) || 0,
                package_id: formData.package || null,
                package_price: parseFloat(formData.packagePrice) || 0,
                customer_name: formData.customerName || ''
            };

            if (onSave) {
                const result = await onSave(stockData);
                if (result.success) {
                    alert(mode === 'edit'
                        ? `Stock "${formData.serialNumber}" updated successfully!`
                        : `Stock "${formData.serialNumber}" created successfully!`);
                    onClose();
                } else {
                    setError(result.error || "Failed to save stock");
                    alert(result.error || "Failed to save stock. Please try again.");
                }
            }
        } catch (err) {
            console.error("Failed to save stock:", err);
            setError(err.response?.data?.detail || err.message || "Failed to save stock");
            alert(err.response?.data?.detail || err.message || "Failed to save stock. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        const statusUpper = status?.toUpperCase() || '';
        switch (statusUpper) {
            case 'RESERVED': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'AVAILABLE': return 'bg-green-50 text-green-700 border-green-200';
            case 'SOLD': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'DAMAGED': return 'bg-red-50 text-red-700 border-red-200';
            case 'RETURNED': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    if (!isOpen) return null;

    const Watermark = () => (
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center overflow-hidden">
            <img 
                src="/Pictures/watermark.png"
                alt="Watermark"
                className="w-[450px] h-auto object-contain"
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-x-hidden">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fadeIn">
                
                <Watermark />

                {/* Modal Header */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="bg-blue-800 p-2 sm:p-2.5 rounded-xl shadow-lg flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
                                {mode === 'edit' ? 'Edit Stock' : 'Add New Stock'}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                                {mode === 'edit' ? 'Update stock information below' : 'Fill in the stock details below'}
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

                {/* Error Message */}
                {error && (
                    <div className="mx-4 sm:mx-6 mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Modal Body */}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                                        <input 
                                            type="text"
                                            value={formData.sku}
                                            onChange={(e) => setFormData({...formData, sku: e.target.value.toUpperCase()})}
                                            className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed"
                                            disabled={mode === 'edit'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number (SN) *</label>
                                        <input 
                                            type="text"
                                            value={formData.serialNumber}
                                            onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                                            className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed"
                                            disabled={mode === 'edit'}
                                        />
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Date</label>
                                        <input 
                                            type="date"
                                            value={formData.stockDate}
                                            onChange={(e) => setFormData({...formData, stockDate: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select 
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white appearance-none text-sm"
                                        >
                                            <option value="AVAILABLE">Available</option>
                                            <option value="RESERVED">Reserved</option>
                                            <option value="SOLD">Sold</option>
                                            <option value="DAMAGED">Damaged</option>
                                            <option value="RETURNED">Returned</option>
                                        </select>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference No *</label>
                                        <input 
                                            type="text"
                                            value={formData.refNo}
                                            onChange={(e) => setFormData({...formData, refNo: e.target.value})}
                                            className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed"
                                            disabled={mode === 'edit'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Cost (RM)</label>
                                        <input 
                                            type="text"
                                            value={formData.purchaseCost}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                                setFormData({...formData, purchaseCost: value});
                                            }}
                                            className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed"
                                            disabled={mode === 'edit'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                                        <input 
                                            type="text"
                                            value={formData.remark}
                                            onChange={(e) => setFormData({...formData, remark: e.target.value})}
                                            placeholder="Add a remark"
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Customer Information */}
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
                                        <input 
                                            type="text" 
                                            value={formData.trackingNumber} 
                                            onChange={(e) => setFormData({...formData, trackingNumber: e.target.value})}
                                            className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed" 
                                            disabled={mode === 'edit'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.customerName} 
                                            onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                                            className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed" 
                                            disabled={mode === 'edit'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: Package & Promo - Full width at bottom */}
                    {mode === 'edit' && (
                        <div className="mt-4 sm:mt-6">
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 sm:p-5 rounded-xl border-2 border-purple-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                        </svg>
                                        Package & Promo Details
                                    </h3>
                                    {associatedStocks.length > 0 && (
                                        <button
                                            onClick={() => setShowStockList(!showStockList)}
                                            className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                                        >
                                            {showStockList ? 'Hide' : 'Show'} Associated Stocks
                                            <svg className={`w-3 h-3 transition-transform ${showStockList ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {/* Package Section */}
                                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                                        <h4 className="text-sm font-medium text-purple-700 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Package
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Package ID</label>
                                                <input 
                                                    type="text"
                                                    value={formData.package}
                                                    onChange={(e) => setFormData({...formData, package: e.target.value})}
                                                    className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed"
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Package Price (RM)</label>
                                                <input 
                                                    type="text"
                                                    value={formData.packagePrice}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                                        setFormData({...formData, packagePrice: value});
                                                    }}
                                                    className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed"
                                                    disabled
                                                />
                                            </div>
                                            {associatedStocks.filter(s => s.sku === formData.sku).length > 0 && (
                                                <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                                                    <p className="text-xs text-purple-600">
                                                        {associatedStocks.filter(s => s.sku === formData.sku).length} stock items in this package
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Promo Section */}
                                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                                        <h4 className="text-sm font-medium text-blue-700 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                            </svg>
                                            Promo
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Promo ID</label>
                                                <input 
                                                    type="text"
                                                    value={formData.promo}
                                                    onChange={(e) => setFormData({...formData, promo: e.target.value})}
                                                    className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed"
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Promo Price (RM)</label>
                                                <input 
                                                    type="text"
                                                    value={formData.promoPrice}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                                        setFormData({...formData, promoPrice: value});
                                                    }}
                                                    className="form-input w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-slate-200 rounded-lg text-sm cursor-not-allowed"
                                                    disabled
                                                />
                                            </div>
                                            {associatedStocks.filter(s => s.sku === formData.sku).length > 0 && (
                                                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                                    <p className="text-xs text-blue-600">
                                                        {associatedStocks.filter(s => s.sku === formData.sku).length} stock items in this promo
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Associated Stocks List */}
                                {showStockList && associatedStocks.length > 0 && (
                                    <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                                            <h5 className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                Associated Stock Items
                                                <span className="text-xs text-gray-400 font-normal">({associatedStocks.length} items)</span>
                                            </h5>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-3 py-2 text-left font-medium text-gray-600">ID</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-600">Serial Number</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-600">SKU</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {associatedStocks.map((s) => (
                                                        <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-3 py-2 font-mono text-blue-600">{s.id}</td>
                                                            <td className="px-3 py-2 font-medium">{s.serialNumber}</td>
                                                            <td className="px-3 py-2">{s.sku}</td>
                                                            <td className="px-3 py-2">
                                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(s.status)}`}>
                                                                    {s.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {associatedStocks.length === 0 && mode === 'edit' && (
                                    <div className="mt-3 text-center py-4 bg-white rounded-lg border border-dashed border-gray-300">
                                        <p className="text-sm text-gray-500">No stock items associated with this promo/package</p>
                                        <p className="text-xs text-gray-400 mt-1">Stock items will appear here when assigned</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    {mode === 'edit' ? (
                        <button 
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" 
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={saving}
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                        </button>
                    ) : (
                        <div />
                    )}

                    <div className="flex gap-2 sm:gap-3">
                        <button 
                            onClick={onClose} 
                            className="px-4 sm:px-6 py-1.5 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button 
                            className="save-btn-main bg-blue-800 text-white px-6 sm:px-8 py-1.5 sm:py-2 rounded-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm disabled:opacity-70 disabled:cursor-not-allowed" 
                            onClick={handleSubmit}
                            disabled={saving}
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
                                    <span>{mode === 'edit' ? 'Update' : 'Save'}</span>
                                    <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
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
        </div>
    );
};

export default AddEditStock;