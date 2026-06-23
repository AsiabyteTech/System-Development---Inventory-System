import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

const Inventory = ({ onBack, onNavigateToCustomer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ ADDED: Get tracking number from navigation state
  const trackingNumber = location.state?.trackingNumber || '';
  
  const [products] = useState([
    { id: '1', sku: 'C8C2MP', type: 'CCTV', image: '/Pictures/EZC8C.jpg', price: 180.00, qtyLeft: 2 },
    { id: '2', sku: 'C8C5MP', type: 'CCTV', image: '/Pictures/C8C5MP.png', price: 240.00, qtyLeft: 3 },
    { id: '3', sku: 'H1C', type: 'CCTV', image: '/Pictures/Ezviz-H1C front.jpg', price: 95.00, qtyLeft: 4 },
    { id: '4', sku: 'PROD004', type: 'CCTV', image: '/Pictures/EZC8C.jpg', price: 150.00, qtyLeft: 5 },
    { id: '5', sku: 'PROD005', type: 'CCTV', image: '/Pictures/C8C5MP.png', price: 200.00, qtyLeft: 3 },
    { id: '6', sku: 'PROD006', type: 'CCTV', image: '/Pictures/Ezviz-H1C front.jpg', price: 120.00, qtyLeft: 6 }
  ]);

  const [quantities, setQuantities] = useState(
    products.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {})
  );

  const updateQty = (id, delta) => {
    setQuantities(prev => {
      const currentQty = prev[id] || 0;
      const product = products.find(p => p.id === id);
      const newQty = currentQty + delta;

      if (newQty < 0 || newQty > product.qtyLeft) return prev;
      
      return { ...prev, [id]: newQty };
    });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredProducts = products.filter(product => 
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ ADDED: Function to handle navigation back to Customer with cart data
  const handleBackToCustomer = () => {
    // ✅ ADDED: Create selected items array from cart (quantities > 0)
    const selectedItems = products
      .filter(product => quantities[product.id] > 0)
      .map(product => ({
        sku: product.sku,
        type: product.type,
        quantity: quantities[product.id],
        total: (product.price * quantities[product.id]).toFixed(2)
      }));
    
    console.log('Selected Items from Inventory:', selectedItems);
    
    // ✅ ADDED: Navigate back to Customer with cart data and tracking number
    navigate('/customer', {
      state: {
        trackingNumber: trackingNumber,
        orderItems: selectedItems
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* ✅ UI IMPROVEMENT: Top Header Bar - modernized to match Product page */}
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

      {/* ✅ UI IMPROVEMENT: Navigation - modernized to match Product page */}
      <header className="bg-white border-b border-slate-200/60 shadow-sm py-2 sm:py-3 px-4 sm:px-6">
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
        
        {/* ✅ UI IMPROVEMENT: Page Title Banner - modernized to match Product page */}
        <div className="addedit-banner-row flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="title-banner flex items-center bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg overflow-hidden shadow-lg">
            <button className="menu-btn p-2 sm:p-3">
              <svg className="menu-icon w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </button>
            <h2 className="banner-title text-white text-base sm:text-lg md:text-xl px-4 sm:px-6">Inventory</h2>
          </div>
          <button onClick={() => navigate('/customer')} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-105 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* ✅ ADDED: Display tracking number below banner when passed from Customer page */}
        {trackingNumber && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 mb-4 border border-blue-100">
            <p className="text-sm text-slate-600">
              🔍 Tracking Number: <span className="font-semibold text-blue-900">{trackingNumber}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Select products for this tracking number</p>
          </div>
        )}

        {/* ✅ REMOVED: extra Tracking Number button section that navigated to Customer page */}

        {/* ✅ UI IMPROVEMENT: Search Section - modernized to match Product page */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6 mb-6 border border-slate-100 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div className="w-full md:flex-1">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button 
                  onClick={() => {setShowSearch(!showSearch); if(showSearch) setSearchTerm('')}} 
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  title="Toggle Search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {showSearch && (
                  <div className="relative flex-1 min-w-0">
                    <input 
                      type='text' 
                      placeholder='Search by SKU...' 
                      className='w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-8 sm:pl-10 text-xs sm:text-sm'
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <svg className="absolute left-2 sm:left-3 top-2 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ UI IMPROVEMENT: Product Grid - modernized card layout matching Product page style */}
        <div className='w-full'>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {filteredProducts.map(product => {
                // ✅ ADDED: Calculate live available quantity = original qtyLeft - selected quantity
                const availableQty = product.qtyLeft - (quantities[product.id] || 0);
                
                return (
                  <div key={product.id} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden">
                    {/* Product Image Section - Modernized */}
                    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center h-48">
                      <img 
                        src={product.image} 
                        alt={product.sku} 
                        className="w-32 h-32 object-contain transition-transform duration-300 group-hover:scale-110" 
                      />
                    </div>
                    
                    {/* Product Info Section - Modernized */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-900 text-sm sm:text-base">{product.sku}</span>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">In Stock</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-500">Price</span>
                          <p className="font-bold text-slate-800 text-base">RM {product.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-500">Available</span>
                          {/* ✅ UPDATED: Display live available quantity that updates with selected quantity */}
                          <p className="font-semibold text-emerald-600 text-base">{availableQty} units</p>
                        </div>
                      </div>

                      {/* Quantity Controls - Modernized */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-medium text-slate-500">Quantity:</span>
                          <div className="qty-controls flex items-center gap-2 sm:gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                            <button
                              onClick={() => updateQty(product.id, -1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg text-blue-900 font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
                              disabled={quantities[product.id] === 0}
                            >
                              -
                            </button>
                            <span className="qty-display font-bold text-blue-900 min-w-[28px] sm:min-w-[32px] text-center text-sm sm:text-base">
                              {quantities[product.id] || 0}
                            </span>
                            <button
                              onClick={() => updateQty(product.id, 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg text-blue-900 font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
                              disabled={quantities[product.id] >= product.qtyLeft}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        {quantities[product.id] > 0 && (
                          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Selected: {quantities[product.id]} unit(s)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ✅ UI IMPROVEMENT: No Results Found State - modernized to match Product page */
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 w-full bg-white rounded-xl shadow-lg border border-slate-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className='w-8 h-8 sm:w-10 sm:h-10 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-2 text-center">No products found</h3>
              <p className="text-sm sm:text-base text-slate-500 mb-4 text-center">
                {searchTerm ? `No results for "${searchTerm}"` : 'No products available'}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* ✅ UI IMPROVEMENT: Save Button - modernized with cart data passing */}
        <div className="flex justify-end mt-8">
          <button 
            onClick={handleBackToCustomer}
            className="save-btn-main bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'></path>
              <polyline points='17 21 17 13 7 13 7 21' />
              <polyline points='7 3 7 8 15 8' />
            </svg>
            <span></span>
          </button>
        </div>
      </main>

      {/* ✅ UI IMPROVEMENT: Footer - modernized to match Product page */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-700 h-8 w-full flex items-center justify-center">
        <span className="text-white text-[10px] sm:text-xs">© 2026 AsiaByte. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Inventory;