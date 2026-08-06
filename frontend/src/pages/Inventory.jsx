// ✅ REFACTORED: imports organized
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from './hooks/useProducts';
import { usePromo } from './hooks/usePromo';
import { usePackage } from './hooks/usePackage';
import './App.css';
import './styles/animations.css';

const Inventory = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tracking number from navigation state
  const trackingNumber = location.state?.trackingNumber || '';

  const { allProducts, loading, error, fetchAllProducts } = useProducts();
  const { getApplicablePromos } = usePromo();
  const { getApplicablePackages } = usePackage();

  // Only show sellable (active) products in the order picker.
  // qtyLeft comes from useProducts' merged stock count (quantityOnHand),
  // which is already computed from real AVAILABLE stock units per SKU.
  const products = useMemo(() => {
    return (allProducts || [])
      .filter(p => (p.status || 'ACTIVE').toUpperCase() === 'ACTIVE')
      .map(p => ({
        id: p.id,
        sku: p.sku,
        type: p.type,
        // ⚠️ VERIFY: falls back to a placeholder if no product image is set —
        // confirm this path exists under public/Pictures, or swap for your own.
        image: p.image || '/Pictures/placeholder.png',
        price: parseFloat(p.sellingPrice) || 0,
        qtyLeft: p.quantityOnHand || 0,
      }));
  }, [allProducts]);

  // --- Promotions & Packages: fetch whatever applies to the current active catalog ---
  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [appliedDealIds, setAppliedDealIds] = useState(new Set());

  useEffect(() => {
    const skus = products.map(p => p.sku).filter(Boolean);
    if (skus.length === 0) return;

    let cancelled = false;
    const loadDeals = async () => {
      setDealsLoading(true);
      const [promoResult, packageResult] = await Promise.all([
        getApplicablePromos(skus),
        getApplicablePackages(skus),
      ]);
      if (cancelled) return;

      // ⚠️ VERIFY: assumes each applicable promo/package includes its own linked
      // `products` array (sku + quantity) — the same shape now correctly sent by
      // AddEditPromo/AddEditPackage after the promo.js/package.js fix.
      const promoDeals = (promoResult.data || []).map(p => ({
        id: `promo-${p.PromoID || p.promo_id || p.id}`,
        type: 'promo',
        name: p.PromoName || p.promo_name || p.name || 'Promotion',
        price: parseFloat(p.Price || p.price) || 0,
        items: (p.products || []).map(item => ({
          sku: item.sku || item.SKU,
          quantity: item.quantity || 1,
        })),
      }));

      const packageDeals = (packageResult.data || []).map(pkg => ({
        id: `package-${pkg.PackageID || pkg.package_id || pkg.id}`,
        type: 'package',
        name: pkg.PackageName || pkg.package_name || pkg.name || 'Package',
        price: parseFloat(pkg.Price || pkg.price) || 0,
        items: (pkg.products || []).map(item => ({
          sku: item.sku || item.SKU,
          quantity: item.quantity || 1,
        })),
      }));

      setDeals([...promoDeals, ...packageDeals].filter(d => d.items.length > 0));
      setDealsLoading(false);
    };

    loadDeals();
    return () => { cancelled = true; };
  }, [products]);

  // Per your requirement: if a product qualifies for more than one deal,
  // only the single cheapest (lowest total price) bundle is shown.
  const visibleDeals = useMemo(() => {
    const bestPerSku = {};
    deals.forEach(deal => {
      deal.items.forEach(item => {
        if (!bestPerSku[item.sku] || deal.price < bestPerSku[item.sku].price) {
          bestPerSku[item.sku] = deal;
        }
      });
    });
    const seen = new Set();
    return Object.values(bestPerSku).filter(deal => {
      if (seen.has(deal.id)) return false;
      seen.add(deal.id);
      return true;
    });
  }, [deals]);

  const [quantities, setQuantities] = useState({});

  const updateQty = (id, delta) => {
    setQuantities(prev => {
      const currentQty = prev[id] || 0;
      const product = products.find(p => p.id === id);
      const newQty = currentQty + delta;

      if (newQty < 0 || newQty > product.qtyLeft) return prev;
      
      return { ...prev, [id]: newQty };
    });
  };

  // Add every product in a deal (promo/package) to the cart at its bundle quantity
  const applyDeal = (deal) => {
    setQuantities(prev => {
      const next = { ...prev };
      deal.items.forEach(item => {
        const product = products.find(p => p.sku === item.sku);
        if (!product) return;
        next[product.id] = Math.min(item.quantity, product.qtyLeft);
      });
      return next;
    });
    setAppliedDealIds(prev => new Set(prev).add(deal.id));
  };

  // Remove a deal — resets its member products' quantities back to 0
  const removeDeal = (deal) => {
    setQuantities(prev => {
      const next = { ...prev };
      deal.items.forEach(item => {
        const product = products.find(p => p.sku === item.sku);
        if (product) next[product.id] = 0;
      });
      return next;
    });
    setAppliedDealIds(prev => {
      const next = new Set(prev);
      next.delete(deal.id);
      return next;
    });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredProducts = products.filter(product => 
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle navigation back to Customer with cart data
  const handleBackToCustomer = () => {
    // Map each applied deal's SKUs so we can tag matching cart items below
    const dealBySku = {};
    visibleDeals
      .filter(deal => appliedDealIds.has(deal.id))
      .forEach(deal => {
        deal.items.forEach(item => { dealBySku[item.sku] = deal; });
      });

    // Create selected items array from cart (quantities > 0)
    const selectedItems = products
      .filter(product => quantities[product.id] > 0)
      .map(product => {
        const appliedDeal = dealBySku[product.sku];
        return {
          sku: product.sku,
          type: product.type,
          quantity: quantities[product.id],
          total: (product.price * quantities[product.id]).toFixed(2),
          // ⚠️ VERIFY: backend field names for applying promo/package pricing to an order item
          ...(appliedDeal?.type === 'promo' ? { promo_id: appliedDeal.id.replace('promo-', '') } : {}),
          ...(appliedDeal?.type === 'package' ? { package_id: appliedDeal.id.replace('package-', '') } : {}),
        };
      });
    
    console.log('Selected Items from Inventory:', selectedItems);
    
    // Navigate back to Customer with cart data and tracking number
    navigate('/customer', {
      state: {
        trackingNumber: trackingNumber,
        orderItems: selectedItems
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Top Header Bar - modernized to match Product page */}
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

      {/* Navigation - modernized to match Product page */}
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
        
        {/* Page Title Banner - modernized to match Product page */}
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

        {/* Display tracking number below banner when passed from Customer page */}
        {trackingNumber && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 mb-4 border border-blue-100">
            <p className="text-sm text-slate-600">
              🔍 Tracking Number: <span className="font-semibold text-blue-900">{trackingNumber}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Select products for this tracking number</p>
          </div>
        )}

        {/* Search Section - modernized to match Product page */}
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

        {/* Promotions & Packages — shown above the regular product grid.
            Only the cheapest applicable deal per SKU is shown (per your setup). */}
        {(dealsLoading || visibleDeals.length > 0) && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Promotions &amp; Packages
            </h3>
            {dealsLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {visibleDeals.map(deal => {
                  const isApplied = appliedDealIds.has(deal.id);
                  return (
                    <div key={deal.id} className={`rounded-xl border p-4 shadow-sm transition-all ${isApplied ? 'border-emerald-300 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${deal.type === 'promo' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'}`}>
                            {deal.type === 'promo' ? 'Promo' : 'Package'}
                          </span>
                          <h4 className="font-semibold text-slate-800 text-sm mt-1">{deal.name}</h4>
                        </div>
                        <span className="font-bold text-blue-900 text-base whitespace-nowrap">RM {deal.price.toFixed(2)}</span>
                      </div>
                      <ul className="text-xs text-slate-500 mb-3 space-y-0.5">
                        {deal.items.map(item => (
                          <li key={item.sku}>{item.sku} × {item.quantity}</li>
                        ))}
                      </ul>
                      <button
                        onClick={() => (isApplied ? removeDeal(deal) : applyDeal(deal))}
                        className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-all ${isApplied ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        {isApplied ? 'Added — Remove' : 'Add to Order'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button onClick={fetchAllProducts} className="text-sm font-medium underline">Retry</button>
          </div>
        )}

        {/* Product Grid - modernized card layout matching Product page style */}
        <div className='w-full'>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 w-full bg-white rounded-xl shadow-lg border border-slate-100">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-sm text-slate-500">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {filteredProducts.map(product => {
                // Calculate live available quantity = original qtyLeft - selected quantity
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
                          {/* Display live available quantity that updates with selected quantity */}
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
                              disabled={(quantities[product.id] || 0) === 0}
                            >
                              -
                            </button>
                            <span className="qty-display font-bold text-blue-900 min-w-[28px] sm:min-w-[32px] text-center text-sm sm:text-base">
                              {quantities[product.id] || 0}
                            </span>
                            <button
                              onClick={() => updateQty(product.id, 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg text-blue-900 font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
                              disabled={(quantities[product.id] || 0) >= product.qtyLeft}
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
            /* No Results Found State - modernized to match Product page */
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

        {/* Save Button - modernized with cart data passing */}
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
            <span>Continue to Customer</span>
          </button>
        </div>
      </main>

      {/* Footer - modernized to match Product page */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-700 h-8 w-full flex items-center justify-center">
        <span className="text-white text-[10px] sm:text-xs">© 2026 AsiaByte. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Inventory;