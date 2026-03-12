import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

const AddEditPromo = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const handleDelete = () => {
        console.log("Product Delected");
        setShowDeleteConfirm(false);
        navigate('/dashboard')
    };

    const products = [
    { id: '1', image: 'src/assets/Pictures/EZC8C.jpg', sku: 'EZ-C8C-2MP', type: 'CCTV', margin: '8.00', quantity: 7 },
    { id: '2', image: 'src/assets/Pictures/C8C5MP.png', sku: 'EZ-C8C-5MP', type: 'CCTV', margin: '8.00', quantity: 2 },
    { id: '3', image: 'src/assets/Pictures/Ezviz-H1C front.jpg', sku: 'EZ-H1C', type: 'CCTV', margin: '8.00', quantity: 1 },
    { id: '4', image: 'src/assets/Pictures/ez ty1pro.jpg', sku: 'EZ-TY1-PRO', type: 'CCTV', margin: '8.00', quantity: 5 },
    { id: '5', image: 'src/assets/Pictures/ez h6cpro.png', sku: 'EZ-H6C-PRO', type: 'CCTV', margin: '8.00', quantity: 2 },
    { id: '6', image: 'src/assets/Pictures/H9c.png', sku: 'EZ-H9C-DL', type: 'CCTV', margin: '8.00', quantity: 4 },
    { id: '7', image: 'src/assets/Pictures/c6n.jpg', sku: 'EZ-C6N', type: 'CCTV', margin: '14.00', quantity: 1 },
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
    <div className="containersys">
        {/*Top Header Bar */}
        <div className="top-info-bar">
            <div>📍 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</div>
            <div>🕒 Office Hours: 9:00 AM - 6:00 PM</div>
        </div>

        {/*Navigation */}
        <header className="headersys">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-3">
                    <img src="src/assets/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-10 w-auto" />
                    <span className="logo-text">AsiaByte</span>
                </div>
            </div>
        </header>

        <main className="all-main-content">
            <div className="addedit-banner-row">
                <div className="title-banner">
                    <div className="menu-btn">
                        <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                    </div>
                    <h2 className="banner-title">Add/Edit Promotion</h2>
                </div>

                <button onClick={() => navigate('/dashboard')} className="close-btn-minimal" style={{width: '40px', height: '40px'}}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <div className="form-section-card">
                <div className="watermark-bg">
                    <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-[#00008B]">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M30 30 C 10 30, 10 10, 30 10 C 45 10, 55 50, 70 50 C 90 50, 90 30, 70 30 C 55 30, 45 10, 30 10"></path>
                    </svg>
                </div>

                <div className="form-grid">
                    <div className="space-y-6">
                        <div>
                            <label className="input-label">Promotion ID</label>
                            <input type="text" placeholder="Enter Input" className="form-input" />
                        </div>
                        <div>
                            <label className="input-label">Promotion Name</label>
                            <input type="text" placeholder="Enter Input" className="form-input" />
                        </div>
                        <div>
                            <label className="input-label">Remark</label>
                            <textarea type="text" placeholder="Enter Input" className="form-input" />
                        </div>
                        {/*Delete Button */}
                        <button className="delete-btn-footer" onClick={() => setShowDeleteConfirm(true)}>
                            {/*<span>Delete</span>*/}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="input-label">Dateline</label>
                            {/* Date Filter */}
                            <div className="filter-group">
                                <input type="date" className="filter-select"/>
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Reduction</label>
                            <input type="text" placeholder="Enter Input" className="form-input" />
                        </div>
                        <div>
                            <label className="input-label">Price</label>
                            <input type="text" placeholder="Enter Input" className="form-input" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr className="bg-[#000066] text-white text-xs uppercase font-serif">
                            <th className="p-4">Product</th>
                            <th className="p-4">SKU</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Margin</th>
                            <th className="p-4">Quantity</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="text-xs text-gray-700 bg-white">
                        {products.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                <td className="p-4">
                                    <img src={item.image} alt="Product" className="w-12 h-12 object-cover rounded-md shadow-sm cursor-pointer hover:scale-110 transition-transform" onClick={() => setSelectedImage(item.image)}></img>
                                </td>
                                <td className="p-4 font-semibold text-[#00008B]">{item.sku}</td>
                                <td className="p-4 font-medium">{item.type}</td>
                                <td className="p-4 font-bold">RM {item.margin}</td>
                                <td className="p-4 font-medium">{item.quantity}</td>
                                <td className="p-4">
                                    <div className="qty-controls">
                                        <button
                                            onClick={() => updateQty(item.id, -1)}
                                            className="qty-btn"
                                            disabled={quantities[item.id] === 0}>-</button>
                                        <span className="qty-display">{quantities[item.id] || 0}</span>
                                        <button
                                            onClick={() => updateQty(item.id, 1)}
                                            className="qty-btn"
                                            disabled={quantities[item.id] >= item.quantity}>+</button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Save Button */}
            <div className="save-container">
            <button className="save-btn-main">Save
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'></path>
                <polyline points='17 21 17 13 7 13 7 21' />
                <polyline points='7 3 7 8 15 8' />
                </svg>
            </button>
            </div>
        </main>

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

        {showDeleteConfirm && (
            <div className="modal-overlay">
                <div className="modal-container">
                    <div className="modal-content">
                        <div className="modal-icon-wrapper">
                            <svg className="modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="modal-title">Are you sure?</h3>
                        <p className="modal-description">
                            This action cannot be undone. This will permanently delete the promotion ticket from the system.
                        </p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                                Cnacel
                            </button>
                            <button className="btn-confirm-delete" onClick={handleDelete}>
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <footer className="bg-[#00008B] h-8 md:h-8 w-full mt-auto"></footer>

    </div>
  );
};

export default AddEditPromo;