import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

const AddEditPromo = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const handleDelete = () => {
        console.log("Product Deleted");
        setShowDeleteConfirm(false);
        navigate('/dashboard')
    };

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
    products.reduce((acc, product) => ({ ...acc, [product.id]: 0}), {})
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

  return (
    <div className="containersys min-h-screen bg-slate-50">
        {/*Top Header Bar */}
        <div className="top-info-bar bg-gradient-to-r from-blue-900 to-blue-800 text-white text-xs py-2 px-6 flex justify-between">
            <div>📍 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</div>
            <div>🕒 Office Hours: 9:00 AM - 6:00 PM</div>
        </div>

        {/*Navigation */}
        <header className="headersys bg-white border-b border-slate-200/60 shadow-sm py-3 px-6">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="relative">
                        {/* ✅ FIXED: Updated logo image path */}
                        <img src="/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute -inset-1 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="logo-text text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text font-serif text-transparent">AsiaByte</span>
                </div>
            </div>
        </header>

        <main className="all-main-content max-w-7xl mx-auto p-6 md:p-8">
            <div className="addedit-banner-row flex justify-between items-center mb-6">
                <div className="title-banner flex items-center bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg overflow-hidden shadow-lg">
                    <div className="menu-btn p-3">
                        <svg className="menu-icon w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                    </div>
                    <h2 className="banner-title text-white font-serif text-xl px-6">Add/Edit Promotion</h2>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="w-10 h-10 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                    >
                        <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Form Card - Improved design */}
            <div className="form-section-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 mb-8 border border-slate-100 relative overflow-hidden">
                <div className="watermark-bg absolute inset-0 opacity-5 pointer-events-none">
                    <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-[#00008B]">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M30 30 C 10 30, 10 10, 30 10 C 45 10, 55 50, 70 50 C 90 50, 90 30, 70 30 C 55 30, 45 10, 30 10"></path>
                    </svg>
                </div>

                <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-5">
                        <div>
                            <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Promotion ID</label>
                            <input type="text" placeholder="Enter Promotion ID" className="form-input w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"/>
                        </div>
                        <div>
                            <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Promotion Name</label>
                            <input type="text" placeholder="Enter Promotion Name" className="form-input w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                            <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Remark</label>
                            <textarea type="text" placeholder="Enter Remarks" className="form-input w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" rows="3" />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Dateline</label>
                            <div className="filter-group">
                                <input type="date" className="filter-select w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"/>
                            </div>
                        </div>
                        <div>
                            <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Reduction</label>
                            <input type="text" placeholder="Enter Reduction" className="form-input w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                            <label className="input-label text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Price (RM)</label>
                            <input type="text" placeholder="Enter Price" className="form-input w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table - Improved styling */}
            <div className="table-wrapper bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 text-left font-semibold">Product</th>
                            <th className="px-6 py-4 text-left font-semibold">SKU</th>
                            <th className="px-6 py-4 text-left font-semibold">Type</th>
                            <th className="px-6 py-4 text-left font-semibold">Margin</th>
                            <th className="px-6 py-4 text-left font-semibold">Available</th>
                            <th className="px-6 py-4 text-left font-semibold">Select Qty</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-600 bg-white divide-y divide-slate-100">
                        {products.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    {/* ✅ FIXED: Using updated image path from products array */}
                                    <img src={item.image} alt="Product" className="w-14 h-14 object-cover rounded-lg shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300" onClick={() => setSelectedImage(item.image)}></img>
                                </td>
                                <td className="px-6 py-4 font-semibold text-blue-900">{item.sku}</td>
                                <td className="px-6 py-4 text-slate-500">{item.type}</td>
                                <td className="px-6 py-4 font-medium text-slate-700">RM {item.margin}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {item.quantity} units
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="qty-controls flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200 w-fit">
                                        <button
                                            onClick={() => updateQty(item.id, -1)}
                                            className="qty-btn w-8 h-8 bg-white rounded-lg text-blue-900 font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                            disabled={quantities[item.id] === 0}>-</button>
                                        <span className="qty-display font-bold text-blue-900 min-w-[24px] text-center">{quantities[item.id] || 0}</span>
                                        <button
                                            onClick={() => updateQty(item.id, 1)}
                                            className="qty-btn w-8 h-8 bg-white rounded-lg text-blue-900 font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                            disabled={quantities[item.id] >= item.quantity}>+</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Action Buttons - Delete on Left, Save on Right */}
            <div className="flex justify-between items-center gap-4">
                {/* Delete Button - Left side */}
                <button 
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 px-6 py-3 transition-all duration-200 hover:scale-105 font-semibold"
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-sm font-medium"></span>
                </button>

                {/* Save Button - Right side */}
                <button className="save-btn-main bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3">
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'></path>
                        <polyline points='17 21 17 13 7 13 7 21' />
                        <polyline points='7 3 7 8 15 8' />
                    </svg>
                    <span></span>
                </button>
            </div>
        </main>

        {/* Image Preview Modal */}
        {selectedImage && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}>
                <div className="relative max-w-2xl w-full bg-white rounded-xl p-2 shadow-2xl animate-in zoom-in duration-300">
                    <button className="absolute -top-10 -right-2 text-white hover:text-red-400 text-3xl font-bold"
                    onClick={() => setSelectedImage(null)}>&times;</button>

                    <img src={selectedImage} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
                </div>
            </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
            <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="modal-container bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                    <div className="modal-content text-center">
                        <div className="modal-icon-wrapper w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="modal-icon w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="modal-title text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
                        <p className="modal-description text-sm text-slate-500 mb-6">
                            This action cannot be undone. This will permanently delete this promotion from the system.
                        </p>
                        <div className="modal-actions flex gap-3">
                            <button className="btn-cancel flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium" onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </button>
                            <button className="btn-confirm-delete flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg shadow-red-500/20" onClick={handleDelete}>
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Footer with centered text */}
        <footer className="bg-gradient-to-r from-blue-900 to-blue-700 h-8 w-full print:hidden flex items-center justify-center">
            <span className="text-white text-xs">© 2026 AsiaByte. All rights reserved.</span>
        </footer>

        {/* Print footer element that will be visible in print */}
        <div className="print-footer hidden print:block text-center text-gray-700 text-xs mt-4">
            © 2026 AsiaByte. All rights reserved.
        </div>
    </div>
  );
};

export default AddEditPromo;