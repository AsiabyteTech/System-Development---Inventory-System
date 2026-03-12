import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router-dom';
import AddEditProductModal from './AddEditProduct';
import './App.css';

const Product = ({}) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [IsModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Local data for the table
    const products = [
    { id: '1', image: 'src/assets/Pictures/EZC8C.jpg', sku: 'EZ-C8C-2MP', type: 'CCTV', margin: '8.00', quantity: 7 },
    { id: '2', image: 'src/assets/Pictures/C8C5MP.png', sku: 'EZ-C8C-5MP', type: 'CCTV', margin: '8.00', quantity: 2 },
    { id: '3', image: 'src/assets/Pictures/Ezviz-H1C front.jpg', sku: 'EZ-H1C', type: 'CCTV', margin: '8.00', quantity: 1 },
    { id: '4', image: 'src/assets/Pictures/ez ty1pro.jpg', sku: 'EZ-TY1-PRO', type: 'CCTV', margin: '8.00', quantity: 5 },
    { id: '5', image: 'src/assets/Pictures/ez h6cpro.png', sku: 'EZ-H6C-PRO', type: 'CCTV', margin: '8.00', quantity: 2 },
    { id: '6', image: 'src/assets/Pictures/H9c.png', sku: 'EZ-H9C-DL', type: 'CCTV', margin: '8.00', quantity: 4 },
    { id: '7', image: 'src/assets/Pictures/c6n.jpg', sku: 'EZ-C6N', type: 'CCTV', margin: '14.00', quantity: 1 },
  ];

  const filteredProducts = products.filter(product =>
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type.toLowerCase().includes(searchTerm.toLowerCase())
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

    return (
    <div className="containersys">
        <Sidebar />
    <div className='flex-1 ml-16 md:ml-64 bg-gray-100 min-h-screen'>

      <main className="all-main-content">
        {/* Page Title Banner */}
        <div className="page-banner flex justify-center items-center mb-8">
            <h2 className="bg-[#00008B] text-white px-12 py-2 rounded-full text-xl font-bold shadow-md">Product</h2>
        </div>

        {/* Stats Cards Row */}
        <div className="stats-grid">
            <div className='stats-card primary-card'>
                <div className="stats-card-header">
                    <svg className="stats-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="stats-card-label">Total Product</span>
                </div>
                <div className='stats-card-content'>
                    <h3 className='stats-card-title'>7</h3>
                    <p className="stats-card-description">Primary vendor for networking equipment</p>
                </div>
            </div>
                
            <div className='stats-card secondary-card'>
                <div className="stats-card-header">
                    <svg className="stats-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="stats-card-label">Total Margin</span>
                </div>
                <div className='stats-card-content'>
                    <h3 className='stats-card-amount'>RM 24,580.00</h3>
                    <p className="stats-card-period">This month's total purchases</p>
                </div>
            </div>

        </div>
        <p className="text-[10px] text-gray-400 mt-2 font-medium italic">*Recent</p><br></br>

        {/* Search & Add Section */}
        <div className="search-container">
            <div className="search-section">
                <label className="search-label">Search</label>
                <div className="search-input-group">
                    <input 
                        type="text" 
                        placeholder="Enter Input"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-button">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                        </svg>
                    </button>
                </div>
                <p className="search-hint">*SKU, Type</p>
            </div>
            
            <div className="add-section">
                 
                <button 
                    onClick={openAddModal}
                    className="add-button"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                </button>
            </div>
        </div>

        

        {/* Product Table */}
        <div className="table-wrapper">
            {filteredProducts.length > 0 ? (
                <table className="table">
                <thead>
                    <tr className="bg-[#000066] text-white text-xs uppercase font-serif">
                        <th className="p-4"></th>
                        <th className="p-4">Product</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Margin</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4 text-center">Stock</th>
                    </tr>
                </thead>
                <tbody className="text-xs text-gray-700 bg-white">
                    {filteredProducts.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                            
                            <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                <button 
                                    onClick={() => openEditModal(item)}
                                    className="edit-icon-btn"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                    </svg>
                                </button>
                                
                                </div>
                            </td>
                            <td className="p-4">
                                <img src={item.image} alt="Product" className="w-12 h-12 object-cover rounded-md shadow-sm cursor-pointer hover:scale-110 transition-transform" onClick={() => setSelectedImage(item.image)} />
                            </td>
                            <td className="p-4 font-semibold text-[#00008B]">{item.sku}</td>
                            <td className="p-4 font-medium">{item.type}</td>
                            <td className="p-4 font-bold">RM {item.margin}</td>
                            <td className="p-4 font-medium">{item.quantity}</td>
                            <td className="p-4 text-center">
                                <button className="w-7 h-7 bg-[#2563EB] text-white rounded-md inline-flex items-center justify-center shadow-sm hover:bg-blue-700 transition-colors" onClick={() => navigate('/stock')}> {/*navigate(item.id) */}
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            ) : (
                /* No Results Found State */
                <div className='flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200'>
                    <div className='mb-4 text-gray-300'>
                        <svg className='w-16 h-16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
                        </svg>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-600'>No invoices found</h3>
                    <p className='text-gray-400'>Try searching for a different SKU or Type</p>
                    <button onClick={() => setSearchTerm('')} className='mt-4 text-blue-600 font-medium hover:underline'>
                        Clear Search
                    </button>
                </div>

            )}
            
        </div>
        <Outlet />
      </main>
      <AddEditProductModal isOpen={IsModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} mode={modalMode} />

      {selectedImage && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300'
        onClick={() => setSelectedImage(null)}>
            <div className='relative max-w-2xl w-full bg-white rounded-xl p-2 shadow-2xl animate-in zoom-in duration-300'>
                <button className='absolute -top-10 -right-2 text-white hover:text-red-400 text-3xl font-bold'
                onClick={() => setSelectedImage(null)}>&times;</button>

                <img src={selectedImage} alt='Preview' className='w-full h-auto max-h-[80vh] object-contain rounded-lg' />

            </div>
        </div>
        )}

      
    </div>
    </div>
    );
};

export default Product;