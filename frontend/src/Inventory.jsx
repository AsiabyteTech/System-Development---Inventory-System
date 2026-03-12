import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Inventory = ({ onBack, onNavigateToCustomer }) => {
  const navigate = useNavigate();
  const [products] = useState([
    { id: '1', sku: 'C8C2MP', image: 'src/assets/Pictures/EZC8C.jpg', price: 180.00, qtyLeft: 2 },
    { id: '2', sku: 'C8C5MP', image: 'src/assets/Pictures/C8C5MP.png', price: 240.00, qtyLeft: 3 },
    { id: '3', sku: 'H1C', image: 'src/assets/Pictures/Ezviz-H1C front.jpg', price: 95.00, qtyLeft: 4 },
    { id: '4', sku: 'PROD004', image: 'src/assets/Pictures/EZC8C.jpg', price: 150.00, qtyLeft: 5 },
    { id: '5', sku: 'PROD005', image: 'src/assets/Pictures/C8C5MP.png', price: 200.00, qtyLeft: 3 },
    { id: '6', sku: 'PROD006', image: 'src/assets/Pictures/Ezviz-H1C front.jpg', price: 120.00, qtyLeft: 6 }
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

  return (
    <div className="container-inventory">
      {/* Top Info Bar */}
      <div className="top-info-bar">
        <div>📍 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</div>
        <div>🕒 Office Hours: 9:00 AM - 6:00 PM</div>
      </div>

      {/* Navigation Bar */}
      <header className="headersys">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex items-center gap-3">
            <img src="src/assets/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-10 w-auto" />
            <span className="logo-text">AsiaByte</span>
          </div>  
        </div>
      </header>

      <main className="all-main-content">
        {/* Page Title Banner */}
        <div className="addedit-banner-row">
          <div className="title-banner">
            <button className="menu-btn">
              <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </button>
            <h2 className="banner-title">Inventory</h2>
          </div>
          <button onClick={() => navigate('/customer')} className="close-btn-minimal" style={{width: '40px', height: '40px'}}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate('/customer')} className="tracking-btn">
            Tracking Number
          </button>
        </div>

        <div className='flex items-center gap-2 mb-4'>
          <button onClick = {() => {setShowSearch(!showSearch); if(showSearch) setSearchTerm('')}} className="search-toggle-btn">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

        {showSearch && (
          <input type='text' placeholder='Search' className='search-input' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        )}

        </div>
        
        <br /> <br />

        {/* Product Grid - with Empty State Check */}
        <div className='product-grid-wrapper'>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="image-container">
                    <img src={product.image} alt={product.sku} className="product-image" />
                  </div>
                  
                  <div className="product-info-row">
                    <div className="left-info">
                      <span className="sku-text">{product.sku}</span>
                      <span className="price-text">Price: RM {product.price.toFixed(2)}</span>
                    </div>
                    <div className="right-info">
                      <span className="qty-label">Available:</span>
                      <span className="qty-value">{product.qtyLeft}</span>
                    </div>
                  </div>

                  <div className="qty-controls">
                    <button 
                      onClick={() => updateQty(product.id, -1)} 
                      className="qty-btn"
                      disabled={quantities[product.id] === 0}
                    >-</button>
                    <span className="qty-display">{quantities[product.id] || 0}</span>
                    <button 
                      onClick={() => updateQty(product.id, 1)} 
                      className="qty-btn"
                      disabled={quantities[product.id] >= product.qtyLeft}
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* This is your "No Results Found" message */
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-600">No products found</h3>
              <p className="text-gray-400">Try adjusting your search for "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="mt-4 text-blue-600 font-medium hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="save-container">
          <button onClick={onNavigateToCustomer} className="save-btn-main">Save
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'></path>
              <polyline points='17 21 17 13 7 13 7 21' />
              <polyline points='7 3 7 8 15 8' />
            </svg>
          </button>
        </div>
      </main>

      <footer className="bg-[#00008B] h-8 md:h-8 w-full mt-auto"></footer>
    </div>
  );
};

export default Inventory;