import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

export const ProductValue = ({ onBack, onSave }) => {
    const navigate = useNavigate();

    // Local data for the table
  const stocks = [
    {
      id: '1',
      serialNumber: 'SN-001234',
      refNo: 'REF-8890',
      invoiceDate: '2023-10-20',
      price: '180.00',
      staffName: 'Nur'
    },
    {
      id: '2',
      serialNumber: 'SN-001235',
      refNo: 'REF-8891',
      invoiceDate: '2023-10-22',
      price: '180.00',
      staffName: 'Nur'
    }
  ];
  
    return (
        <div className="containersys">
            {/* Top Header Bar */}
            <div className="top-info-bar">
                <div>📍 12-1, Jalan PJS 7/19, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia</div>
                <div>🕒 Office Hours: 9:00 AM - 6:00 PM</div>
            </div>

            {/* Navigation */}
            <header className="headersys">

                <div className="flex items-center gap-2 cursor-pointer" >
                    <div className="flex items-center gap-3">
                        <img src = "src/assets/Pictures/Asiabite.png" alt="AsiaByte Logo" className="h-10 w-auto" />
                            <span className="logo-text">AsiaByte</span>
                    </div>
                </div>
            </header>

            <main className="all-main-content">
                <div className="addedit-banner-row">
                    <div className="title-banner">
                        <button className="menu-btn">
                            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                        </button>
                        <h2 className="banner-title">Total Product Value</h2>
                    </div>

                    <button onClick={() => navigate('/dashboard')} className="close-btn-minimal" style={{width: '40px', height: '40px'}}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

            {/* Stats Cards Row */}
            <div className="stats-grid">
                <div className='stats-card primary-card'>
                    <div className="stats-card-header">
                        <svg className="stats-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="stats-card-label">Total Product Value</span>
                    </div>
                    <div className='stats-card-content'>
                        <h3 className='stats-card-title'>RM$$$</h3>
                        <p className="stats-card-description">Primary vendor for networking equipment</p>
                    </div>
                </div>
                    
                <div className='stats-card secondary-card'>
                    <div className="stats-card-header">
                        <svg className="stats-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="stats-card-label">Date</span>
                    </div>
                    <div className='stats-card-content'>
                        <h3 className='stats-card-amount'>DD/MM/YYYY</h3>
                        <p className="stats-card-period">This month's total purchases</p>
                    </div>
                </div>

            </div>
            <p className="text-[10px] text-gray-400 mt-2 font-medium italic">*Recent</p><br></br>


                <div className="form-section-card">
                    {/*<div className="watermark-bg">
                        <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-[#00008B]">
                            <path d="M30 30 C 10 30, 10 10, 30 10 C 45 10, 55 50, 70 50 C 90 50, 90 30, 70 30 C 55 30, 45 10, 30 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                        </svg>
                    </div>*/}

                    <div className="form-grid">
                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Stock Keeping Unit (SKU)</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Quantity On Hand</label>
                                <input type="number" placeholder="Enter Input" className="form-input" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Status</label>
                                <input type="number" placeholder="Enter Input" className="form-input" />
                            </div> 
                        </div>

                    </div>
                </div>

                <div className="form-section-card">
                    {/*<div className="watermark-bg">
                        <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-[#00008B]">
                            <path d="M30 30 C 10 30, 10 10, 30 10 C 45 10, 55 50, 70 50 C 90 50, 90 30, 70 30 C 55 30, 45 10, 30 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                        </svg>
                    </div>*/}

                    <div className="form-grid">
                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Product Name</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Product Type</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Product Details</label>
                                <textarea type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Initial Vendor Price</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                            <div>
                                <label className="input-label">Initial Selling Price</label>
                                <input type="text" placeholder="Enter Input" className="form-input" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stock Table */}
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr className="bg-[#000066] text-white text-xs uppercase font-serif">
                                <th className="p-4">Serial Number</th>
                                <th className="p-4">Reference No</th>
                                <th className="p-4">Invoice Date</th>
                                {/*<th className="p-4">Price</th>*/}
                                <th className="p-4">Staff</th>
                                
                            </tr>
                        </thead>
                        <tbody className="text-xs text-gray-700 bg-white">
                            {stocks.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4 font-semibold text-[#00008B]">{item.serialNumber}</td>
                                    <td className="p-4">{item.refNo}</td>
                                    <td className="p-4">{item.invoiceDate}</td>
                                    {/*<td className="p-4">{item.price}</td>*/}
                                    <td className="p-4">{item.staffName}</td>
                                    
                                </tr>
                            ))}
                            {/* Empty Rows for visual matching */}
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={`empty-${i}`} className="border-b border-gray-100 h-14">
                                    <td className="p-4 text-gray-300"></td>
                                    <td className="p-4 text-gray-300"></td>
                                    <td className="p-4 text-gray-300"></td>
                                    {/*<td className="p-4 text-gray-300"></td>*/}
                                    <td className="p-4 text-gray-300"></td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Footer */}
      <footer className="bg-[#00008B] h-8 md:h-8 w-full mt-auto"></footer>
        </div>
    );
};

export default ProductValue;