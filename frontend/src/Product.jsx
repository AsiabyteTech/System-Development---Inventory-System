// ✅ REFACTORED: imports organized
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from "./api/products";
import { stockAPI } from "./api/stock";
import './App.css';
import './styles/animations.css';

// ✅ REFACTORED: component imports
import Sidebar from './components/Sidebar';
import AddEditProductModal from './AddEditProduct';
import { isAdmin } from "./shared/role";

const Product = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProductsCount, setTotalProductsCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        fetchAllProducts();
    }, []);

    // ✅ CORRECTED: Fetch ALL products using backend pagination
    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let allProductData = [];
            let currentPageNum = 1;
            const pageSize = 100; // Fetch 100 per request
            let hasMore = true;
            
            // First, try to get total count
            let totalCount = 0;
            try {
                const firstResponse = await productsAPI.getAll({ page: 1, limit: pageSize });
                console.log('First page response:', firstResponse);
                
                // Try to get total from response
                if (firstResponse?.total) {
                    totalCount = firstResponse.total;
                } else if (firstResponse?.data?.total) {
                    totalCount = firstResponse.data.total;
                } else if (firstResponse?.pagination?.total) {
                    totalCount = firstResponse.pagination.total;
                }
                
                // Extract products from first response
                let firstPageData = [];
                if (firstResponse?.data?.items) {
                    firstPageData = firstResponse.data.items;
                } else if (firstResponse?.data) {
                    firstPageData = Array.isArray(firstResponse.data) ? firstResponse.data : [firstResponse.data];
                } else if (firstResponse?.products) {
                    firstPageData = firstResponse.products;
                } else if (Array.isArray(firstResponse)) {
                    firstPageData = firstResponse;
                }
                
                allProductData = [...firstPageData];
                console.log(`Page ${currentPageNum} fetched: ${firstPageData.length} products`);
                
                // If we have total count, calculate how many more pages to fetch
                if (totalCount > 0) {
                    const totalPagesNeeded = Math.ceil(totalCount / pageSize);
                    console.log(`Total products: ${totalCount}, Total pages needed: ${totalPagesNeeded}`);
                    
                    // Fetch remaining pages
                    for (let page = 2; page <= totalPagesNeeded; page++) {
                        try {
                            const response = await productsAPI.getAll({ page: page, limit: pageSize });
                            let pageData = [];
                            if (response?.data?.items) {
                                pageData = response.data.items;
                            } else if (response?.data) {
                                pageData = Array.isArray(response.data) ? response.data : [response.data];
                            } else if (response?.products) {
                                pageData = response.products;
                            } else if (Array.isArray(response)) {
                                pageData = response;
                            }
                            allProductData = [...allProductData, ...pageData];
                            console.log(`Page ${page} fetched: ${pageData.length} products. Total: ${allProductData.length}`);
                        } catch (pageErr) {
                            console.warn(`Failed to fetch page ${page}:`, pageErr);
                        }
                    }
                } else {
                    // If no total count, fetch pages until we get empty response
                    while (hasMore) {
                        currentPageNum++;
                        try {
                            const response = await productsAPI.getAll({ page: currentPageNum, limit: pageSize });
                            let pageData = [];
                            if (response?.data?.items) {
                                pageData = response.data.items;
                            } else if (response?.data) {
                                pageData = Array.isArray(response.data) ? response.data : [response.data];
                            } else if (response?.products) {
                                pageData = response.products;
                            } else if (Array.isArray(response)) {
                                pageData = response;
                            }
                            
                            if (pageData.length === 0) {
                                hasMore = false;
                            } else {
                                allProductData = [...allProductData, ...pageData];
                                console.log(`Page ${currentPageNum} fetched: ${pageData.length} products. Total: ${allProductData.length}`);
                                
                                if (pageData.length < pageSize) {
                                    hasMore = false;
                                }
                            }
                        } catch (err) {
                            console.warn(`Failed to fetch page ${currentPageNum}:`, err);
                            hasMore = false;
                        }
                    }
                }
            } catch (err) {
                console.warn('Pagination approach failed, trying single fetch:', err);
                // Fallback: try to get all products at once
                try {
                    const fallbackResponse = await productsAPI.getAll({ limit: 9999 });
                    if (fallbackResponse?.data) {
                        allProductData = Array.isArray(fallbackResponse.data) ? fallbackResponse.data : [fallbackResponse.data];
                    } else if (fallbackResponse?.products) {
                        allProductData = fallbackResponse.products;
                    }
                } catch (fallbackErr) {
                    // If all fails, try without parameters
                    const lastResponse = await productsAPI.getAll();
                    if (lastResponse?.data) {
                        allProductData = Array.isArray(lastResponse.data) ? lastResponse.data : [lastResponse.data];
                    } else if (lastResponse?.products) {
                        allProductData = lastResponse.products;
                    }
                }
            }
            
            console.log('Total products fetched:', allProductData.length);
            
            // Fetch stock data to get quantity on hand
            let stockCountBySku = {};
            try {
                const stockResponse = await stockAPI.getAll();
                const stockData = stockResponse.data || stockResponse.stocks || [];
                
                stockData.forEach(item => {
                    const sku = item.SKU || item.sku;
                    if (sku) {
                        if (!stockCountBySku[sku]) {
                            stockCountBySku[sku] = 0;
                        }
                        const status = item.Stat || item.status || '';
                        if (status.toUpperCase() === 'AVAILABLE') {
                            stockCountBySku[sku]++;
                        }
                    }
                });
                console.log('Stock count by SKU:', stockCountBySku);
            } catch (stockErr) {
                console.warn('Could not fetch stock data:', stockErr);
            }
            
            // Map backend fields to frontend expected fields
            const mappedProducts = allProductData.map(item => {
                const sku = item.SKU || item.sku || '';
                
                return {
                    id: item.id || item.SKU || item.sku || `prod-${Math.random().toString(36).substr(2, 9)}`,
                    sku: sku,
                    productName: item.ProductName || item.product_name || item.productName || '',
                    type: item.ProductType || item.product_type || item.type || '',
                    productDetails: item.ProductDetail || item.description || item.productDetails || '',
                    vendorPrice: item.InitialVendorPrice || item.cost_price || item.vendorPrice || 0,
                    sellingPrice: item.InitialSellingPrice || item.selling_price || item.sellingPrice || 0,
                    margin: item.Margin || item.margin || 0,
                    status: item.Stat || item.status || 'ACTIVE',
                    staffId: item.StaffID || item.staff_id || item.staffId || '',
                    quantityOnHand: item.QuantityOnHand || stockCountBySku[sku] || 0,
                    reservedQuantity: item.ReservedQuantity || 0,
                    currentAvgCost: item.CurrentAvgCost || 0,
                    currentStockValue: item.CurrentStockValue || 0,
                    image: item.product_image || item.image || null
                };
            });
            
            // Remove duplicates by SKU
            const uniqueProducts = [];
            const seenSkus = new Set();
            mappedProducts.forEach(product => {
                if (!seenSkus.has(product.sku)) {
                    seenSkus.add(product.sku);
                    uniqueProducts.push(product);
                }
            });
            
            console.log('Unique products after deduplication:', uniqueProducts.length);
            
            // Store all products
            setAllProducts(uniqueProducts);
            
            // Calculate pagination
            const totalItems = uniqueProducts.length;
            setTotalProductsCount(totalItems);
            const totalPagesCount = Math.ceil(totalItems / itemsPerPage);
            setTotalPages(totalPagesCount > 0 ? totalPagesCount : 1);
            
            // Set current page to 1
            setCurrentPage(1);
            
            // Update displayed products
            updateDisplayedProducts(uniqueProducts, 1, itemsPerPage);
            
        } catch (err) {
            console.error("Failed to fetch products:", err);
            let errorMsg = "Failed to load products. ";
            if (err.response?.status === 422) {
                errorMsg += "Invalid request parameters. Please check the API configuration.";
            } else if (err.response?.status === 404) {
                errorMsg += "Product endpoint not found. Please check if the backend is running.";
            } else if (err.response?.status === 500) {
                errorMsg += "Server error. Please check backend logs.";
            } else if (err.code === 'ERR_NETWORK') {
                errorMsg += "Network error. Please check if the backend server is running.";
            } else {
                errorMsg += err.message || "Please try again.";
            }
            setError(errorMsg);
            setProducts([]);
            setAllProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Update displayed products based on current page
    const updateDisplayedProducts = (productList, page, perPage) => {
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedItems = productList.slice(startIndex, endIndex);
        setProducts(paginatedItems);
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        updateDisplayedProducts(allProducts, page, itemsPerPage);
        // Scroll to top of table
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        const newPerPage = parseInt(e.target.value);
        setItemsPerPage(newPerPage);
        const totalPagesCount = Math.ceil(allProducts.length / newPerPage);
        setTotalPages(totalPagesCount > 0 ? totalPagesCount : 1);
        setCurrentPage(1);
        updateDisplayedProducts(allProducts, 1, newPerPage);
    };

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openAddModal = () => {
        setModalMode('add');
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setModalMode('edit');
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Navigate to Stock page with SKU filter
    const navigateToStock = (sku) => {
        navigate('/stock', { state: { filterSku: sku } });
    };

    // Calculate totals from all products (not just current page)
    const totalMargin = allProducts.reduce((sum, product) => {
        const margin = parseFloat(product.margin) || 0;
        return sum + margin;
    }, 0);
    const totalStockValue = allProducts.reduce((sum, product) => {
        const value = parseFloat(product.currentStockValue) || 0;
        return sum + value;
    }, 0);

    const handleProductSave = async (productData) => {
        try {
            if (modalMode === 'edit') {
                await productsAPI.update(productData.sku, productData);
            } else {
                await productsAPI.create(productData);
            }
            await fetchAllProducts();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to save product:", err);
            alert("Failed to save product. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
            <Sidebar />
            <div className='flex-1 min-w-0 ml-16 md:ml-64 transition-all duration-300 overflow-x-hidden'>
                <main className="all-main-content w-full max-w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                    
                    {/* Page Title Banner */}
                    <div className="page-banner flex justify-center items-center mb-4 sm:mb-6 w-full">
                        <h2 className="bg-[#00008B] text-white px-6 sm:px-8 md:px-12 py-1.5 sm:py-2 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-md whitespace-nowrap">Product</h2>
                    </div>

                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 w-full">
                        {/* Total Product Card */}
                        <div className="group bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full">
                            <div className="p-3 sm:p-4 md:p-6">
                                <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] sm:text-[11px] md:text-sm font-medium text-blue-100 uppercase tracking-wider">TOTAL PRODUCT</span>
                                    </div>
                                </div>
                                <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{totalProductsCount}</h3>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-blue-100">Active products in inventory</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Margin Card */}
                        <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden w-full">
                            <div className="p-3 sm:p-4 md:p-6">
                                <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] sm:text-[11px] md:text-sm font-medium text-slate-500 uppercase tracking-wider">TOTAL MARGIN</span>
                                    </div>
                                </div>
                                <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">RM {totalMargin.toFixed(2)}</h3>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-500">Combined product margin</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Stock Value Card */}
                        <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden w-full">
                            <div className="p-3 sm:p-4 md:p-6">
                                <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] sm:text-[11px] md:text-sm font-medium text-slate-500 uppercase tracking-wider">STOCK VALUE</span>
                                    </div>
                                </div>
                                <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">RM {totalStockValue.toFixed(2)}</h3>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-500">Total inventory value</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-[10px] sm:text-xs text-slate-400 mb-3 sm:mb-4 md:mb-6 font-medium italic">*Current inventory</p>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            <p className="text-sm">{error}</p>
                            <button 
                                onClick={fetchAllProducts}
                                className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Search & Add Section */}
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-slate-100 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 md:gap-6">
                            <div className="w-full md:flex-1">
                                <label className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">Search</label>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <div className="relative flex-1 min-w-0">
                                        <input 
                                            type="text" 
                                            placeholder="Search by SKU, Name or Type..."
                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-8 sm:pl-10 text-xs sm:text-sm"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <svg className="absolute left-2 sm:left-3 top-2 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                                        </svg>
                                    </div>
                                    <button 
                                        onClick={fetchAllProducts}
                                        className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
                                    >
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                                        </svg>
                                        <span>Search</span>
                                    </button>
                                </div>
                                <p className="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2">*SKU, Product Name, Product Type</p>
                            </div>
                            
                            <div className="flex items-center justify-start md:justify-end">
                                {isAdmin() && (
                                    <button 
                                        onClick={openAddModal}
                                        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
                                        title="Add New Product"
                                    >
                                        <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden w-full">
                        {filteredProducts.length > 0 ? (
                            <>
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full min-w-[900px] md:min-w-0">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                                                {isAdmin() && (
                                                    <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Actions</th>
                                                )}
                                                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Product</th>
                                                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">SKU</th>
                                                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Type</th>
                                                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Margin (RM)</th>
                                                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Qty</th>
                                                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredProducts.map((item) => (
                                                <tr key={item.id || item.sku} className="hover:bg-blue-50/50 transition-colors">
                                                    {isAdmin() && (
                                                        <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button 
                                                                    onClick={() => openEditModal(item)}
                                                                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                                                                    title="Edit Product"
                                                                >
                                                                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                                {item.image ? (
                                                                    <img 
                                                                        src={item.image} 
                                                                        alt={item.productName || item.sku} 
                                                                        className="w-full h-full object-cover rounded-lg shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300" 
                                                                        onClick={() => setSelectedImage(item.image)}
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            e.target.parentElement.innerHTML = `
                                                                                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 font-bold text-xs">
                                                                                    ${(item.productName || item.sku).charAt(0).toUpperCase()}
                                                                                </div>
                                                                            `;
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 font-bold text-sm">
                                                                        {(item.productName || item.sku).charAt(0).toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="hidden sm:block">
                                                                <p className="text-xs font-medium text-slate-700 truncate max-w-[100px]">
                                                                    {item.productName || item.sku}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                                                        <span className="font-semibold text-blue-900 text-xs sm:text-sm md:text-base">{item.sku}</span>
                                                    </td>
                                                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                                                        <span className="text-slate-600 text-xs sm:text-sm md:text-base">{item.type || 'N/A'}</span>
                                                    </td>
                                                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                                                        <span className="font-medium text-emerald-600 text-xs sm:text-sm md:text-base">
                                                            RM {parseFloat(item.margin || 0).toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                                                        <span className="font-medium text-slate-700 text-xs sm:text-sm md:text-base">
                                                            {item.quantityOnHand || 0}
                                                        </span>
                                                        {item.reservedQuantity > 0 && (
                                                            <span className="text-xs text-orange-500 ml-1">
                                                                (Res: {item.reservedQuantity})
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                                                        <div className="flex justify-center">
                                                            <button 
                                                                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105" 
                                                                onClick={() => navigateToStock(item.sku)}
                                                                title="View Stock for this product"
                                                            >
                                                                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="border-t border-slate-200 px-4 sm:px-6 py-3 bg-gradient-to-r from-slate-50 to-white">
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                                            {/* Left side - Showing info */}
                                            <div className="text-xs sm:text-sm text-slate-600">
                                                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                                                {Math.min(currentPage * itemsPerPage, totalProductsCount)} of{' '}
                                                {totalProductsCount} products
                                            </div>

                                            {/* Right side - Pagination controls */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Items per page selector */}
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <select
                                                        value={itemsPerPage}
                                                        onChange={handleItemsPerPageChange}
                                                        className="px-2 py-1 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                    >
                                                        <option value={10}>10</option>
                                                        <option value={25}>25</option>
                                                        <option value={50}>50</option>
                                                        <option value={100}>100</option>
                                                    </select>
                                                    <span className="text-xs text-slate-500">per page</span>
                                                </div>

                                                {/* Navigation buttons */}
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handlePageChange(1)}
                                                        disabled={currentPage === 1}
                                                        className={`px-2 py-1 rounded-lg text-xs sm:text-sm ${
                                                            currentPage === 1
                                                                ? 'text-slate-300 cursor-not-allowed'
                                                                : 'text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className={`px-2 py-1 rounded-lg text-xs sm:text-sm ${
                                                            currentPage === 1
                                                                ? 'text-slate-300 cursor-not-allowed'
                                                                : 'text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                    </button>

                                                    {/* Page numbers */}
                                                    {getPageNumbers().map(page => (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${
                                                                currentPage === page
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'text-slate-600 hover:bg-slate-100'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}

                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className={`px-2 py-1 rounded-lg text-xs sm:text-sm ${
                                                            currentPage === totalPages
                                                                ? 'text-slate-300 cursor-not-allowed'
                                                                : 'text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handlePageChange(totalPages)}
                                                        disabled={currentPage === totalPages}
                                                        className={`px-2 py-1 rounded-lg text-xs sm:text-sm ${
                                                            currentPage === totalPages
                                                                ? 'text-slate-300 cursor-not-allowed'
                                                                : 'text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* No Results Found State */
                            <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-20 px-4 w-full">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                    <svg className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-700 mb-1 sm:mb-2 text-center">No products found</h3>
                                <p className="text-xs sm:text-sm md:text-base text-slate-500 mb-3 sm:mb-4 text-center">
                                    {searchTerm ? 'Try searching for a different SKU, Name or Type' : 'No products available in inventory'}
                                </p>
                                {searchTerm ? (
                                    <button 
                                        onClick={() => setSearchTerm('')} 
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
                                    >
                                        Clear Search
                                    </button>
                                ) : (
                                    <button 
                                        onClick={fetchAllProducts}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
                                    >
                                        Refresh
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <Outlet />
                </main>
                <AddEditProductModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    product={selectedProduct} 
                    mode={modalMode}
                    onSave={handleProductSave}
                />

                {/* Image Preview Modal */}
                {selectedImage && (
                    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn duration-300'
                        onClick={() => setSelectedImage(null)}>
                        <div className='relative max-w-[90%] sm:max-w-2xl w-full bg-white rounded-xl p-2 shadow-2xl animate-scaleIn duration-300'>
                            <button 
                                className='absolute -top-8 sm:-top-10 -right-1 sm:-right-2 text-white hover:text-red-400 text-2xl sm:text-3xl font-bold'
                                onClick={() => setSelectedImage(null)}>&times;</button>
                            <img src={selectedImage} alt='Preview' className='w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg' />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;