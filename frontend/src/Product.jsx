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

  // Calculate total products count
  const totalProducts = products.length;
  
  // Calculate total margin
  const totalMargin = products.reduce((sum, product) => sum + parseFloat(product.margin), 0);

    return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className='flex-1 ml-16 md:ml-64 transition-all duration-300'>
        <main className="all-main-content">
          {/* Page Title Banner */}
          <div className="page-banner flex justify-center items-center mb-8">
            <h2 className="bg-[#00008B] text-white px-12 py-2 rounded-full text-xl font-bold shadow-md">Product</h2>
          </div>

          {/* Stats Cards Row - Modern Dashboard Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Total Product Card */}
            <div className="group bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-blue-100 uppercase tracking-wider">TOTAL PRODUCT</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-white">{totalProducts}</h3>
                  <p className="text-sm text-blue-100">Active products in inventory</p>
                </div>
              </div>
            </div>

            {/* Total Margin Card */}
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">TOTAL MARGIN</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-slate-800">RM {totalMargin.toFixed(2)}</h3>
                  <p className="text-sm text-slate-500">Combined product margin</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-6 font-medium italic">*Current inventory</p>

          {/* Search & Add Section - Modern Card Style */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6 border border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="lg:w-2/3">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Search</label>
                <div className="flex gap-3">
                  <div className="relative flex-1 max-w-md">
                    <input 
                      type="text" 
                      placeholder="Search by SKU or Type..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                    </svg>
                  </div>
                  <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                    </svg>
                    <span>Search</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">*SKU, Product Type</p>
              </div>
              
              <div className="flex items-center justify-end">
                <button 
                  onClick={openAddModal}
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
                  title="Add New Product"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Toolbar - Modern Style */}
          <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
              </button>
              <span className="text-sm text-slate-400">|</span>
              <div className="filter-group px-2">
                <input type="month" className="border-0 bg-transparent text-sm text-slate-600 focus:outline-none"/>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>

          {/* Product Table - Modern Dashboard Style */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            {filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"></th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Margin</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => openEditModal(item)}
                              className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <img src={item.image} alt="Product" className="w-14 h-14 object-cover rounded-lg shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300" onClick={() => setSelectedImage(item.image)} />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-blue-900">{item.sku}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{item.type}</td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-700">RM {item.margin}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-700">{item.quantity}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button 
                              className="w-8 h-8 bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105" 
                              onClick={() => navigate('/stock')}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
            ) : (
              /* No Results Found State - Modern Design */
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className='w-10 h-10 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
                <p className="text-slate-500 mb-4">Try searching for a different SKU or Type</p>
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          <Outlet />
        </main>
        <AddEditProductModal isOpen={IsModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} mode={modalMode} />

        {/* Image Preview Modal */}
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