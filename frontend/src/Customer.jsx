import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

const Customer = ({
    onBack, 
    onSave,
    onNavigateToEditCustomer
}) => {
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const handleDelete = () => {
        console.log("Product Deleted");
        setShowDeleteConfirm(false);
        navigate('/order');
    };

    const [SKUs, setSKUs] = useState(['']);

    /*const addSKURow = () => {
        setSKUs([...SKUs, '']);
    };

    const updateSKU = (index, value) => {
        const newSKUs = [...SKUs];
        newSKUs[index] = value;
        setSKUs(newSKUs);
    };

    const removeSKURow = (index) => {
        constnewSKUs = SKU.filter((_,i) => i !== index);
        setSKUs(newSKUs.length ? newSKUs : ['']);
    };*/

    // Local data for the table
    const orders = [
    { id: '1', sku: 'EZ-C8C-2MP', type: 'CCTV', quantity: 2, total: '80.00'},
    { id: '2', sku: 'EZ-C8C-5MP', type: 'CCTV', quantity: 2, total: '80.00'},
    { id: '3', sku: 'EZ-H1C', type: 'CCTV', quantity: 1, total: '40.00'},
    
  ];

    return (
        <div className="addedit-page">
            {/* Top Header Bar */}
            <div className="top-info-bar">
                <div>📍 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</div>
                <div>🕒 Office Hours: 9:00 AM - 6:00 PM</div>
            </div>

            {/* Navigation */}
            <header className="headersys">
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="flex items-center gap-3">
                    <img src="src/assets/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-10 w-auto" />
                        <span className="logo-text">AsiaByte</span>
                    </div>  
                </div>
            </header>

            <main className="all-main-content">

                {/*Top Bar Info */}
                <div className="addedit-banner-row">
                    <div className="title-banner">
                        <button className="menu-btn">
                            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </button>
                        <h2 className="banner-title">Customer</h2>
                    </div>
                    <button onClick={() => navigate('/order')} className="close-btn-minimal" style={{width: '40px', height: '40px'}}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/*Form */}
                <div className="form-section-card">
                    {/*<div className="watermark-bg">
                        <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-[#00008B]">
                            <path d="M30 30 C 10 30, 10 10, 30 10 C 45 10, 55 50, 70 50 C 90 50, 90 30, 70 30 C 55 30, 45 10, 30 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                        </svg>
                    </div>*/}

                    <div className="form-grid">
                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Customer Name</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Phone Number</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Email</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Address</label>
                                <textarea type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Status</label>
                                <div className="filter-wrapper">
                                <select className="filter-select">
                                    <option>-</option>
                                    <option>-</option>
                                    <option>-</option>
                                </select>
                                <div className="filter-select-arrow">
                                    <svg className="filter-select-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                                </div>
                            </div>

                            <div>
                                <label className="input-label">Sales Platform</label>
                                <div className="filter-wrapper">
                                <select className="filter-select">
                                    <option>-</option>
                                    <option>-</option>
                                    <option>-</option>
                                </select>
                                <div className="filter-select-arrow">
                                    <svg className="filter-select-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                                </div>
                            </div>

                            <div>
                                <label className="input-label">Purchase Date / Stock Out</label>
                                <input type="date" placeholder="DD-MM-YYYY" className="form-input"/>
                            </div>

                            
                        </div>
                    </div>
                </div>
                
                <br/>
                <hr />
                <br />

                {/*Tracking Number */}
                <div className="search-container">
                    <div className="search-section">
                        <label className="search-label">Tracking Number</label>
                        <div className="search-input-group">
                            <input
                                type="text"
                                placeholder="Enter Input"
                                className="search-input"
                                value={SKUs}
                                onChange={(e) => setSKUs(e.target.value)}
                                
                            />

                        </div>
                    </div>

                    <div className="add-section">
                        <button
                            onClick={() => navigate('/inventory')}
                            className="add-button"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Order Table */}
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr className="bg-[#000066] text-white text-xs uppercase font-serif">
                                <th className="p-4">SKU</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs text-gray-700 bg-white">
                            {orders.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                    
                                    <td className="p-4 font-semibold text-[#00008B]">{item.sku}</td>
                                    <td className="p-4 font-medium">{item.type}</td>
                                    <td className="p-4 font-medium">{item.quantity}</td>
                                    <td className="p-4 font-bold">RM {item.total}</td>
                                
                                </tr>
                            ))}
                            
                        </tbody>
                    </table>
                </div>

                <br/>
                <br/>

                <div className="form-grid">
                    <div className="space-y-6">
                        <div>
                            <label className="input-label">Remark</label>
                            <textarea type="text" placeholder="Enter Input" className="form-input" />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Total</label>
                        <input type="text" placeholder="Enter Input" className="form-input"/>
                    </div>

                    <div>
                        <button className="delete-btn-footer" onClick={() => setShowDeleteConfirm(true)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                    </div>
                </div>

                <br/>
                <br/>

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

            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-content">
                            <div className="modal-icon-wrapper">
                                <svg className="modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="modal-title">Are you sure?</h3>
                            <p className="modal-description">This action cannot be undone. This will permanently delete the customer record from the system.</p>
                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                <button className="btn-confirm-delete" onClick={handleDelete}>Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
      <footer className="bg-[#00008B] h-8 md:h-8 w-full mt-auto"></footer>

        </div>
    );

};

export default Customer;