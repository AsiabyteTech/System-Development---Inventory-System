import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const AddEditInvoice = ({isOpen, onClose, invoice, mode}) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [currentScanIndex, setCurrentScanIndex] = useState(null);
  const [serialNumbers, setSerialNumbers] = useState(['']);
  const [formData, setFormData] = useState({
    refNo: '',
    supplier: '',
    remark: '',
    date: '',
    amount: '',
    file: null
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && invoice) {
        setFormData({
          refNo: invoice.refNo || '',
          supplier: invoice.supplier || '',
          remark: invoice.remark || '',
          date: invoice.date || '',
          amount: invoice.amount || '',
          file: invoice.file || null
        });
        setSerialNumbers(invoice.snDetails || ['']);
      } else {
        setFormData({
          refNo: '',
          supplier: '',
          remark: '',
          date: '',
          amount: '',
          file: null
        });
        setSerialNumbers(['']);
      }
    }
  }, [isOpen, invoice, mode]);

  if (!isOpen) return null;

  const Watermark = () => (
    <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center overflow-hidden">
      <svg width="400" height="200" viewBox="0 0 210 95" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M65 15C35 15 10 37 10 65C10 93 35 115 65 115C85 115 102 105 112 90C122 105 139 115 159 115C189 115 214 93 214 65C214 37 189 15 159 15C139 15 122 25 112 40C102 25 85 15 65 15ZM65 35C80 35 93 45 98 58L75 88C72 92 68 95 63 95C52 95 43 86 43 75C43 64 52 55 63 55H85L65 35ZM159 35C175 35 189 48 189 65C189 82 175 95 159 95C148 95 139 88 134 78L157 48C160 44 164 41 169 41H147L159 35Z" 
          fill="#0504AA" 
        />
      </svg>
    </div>
  );

  const handleDelete = () => {
    console.log("Invoice Deleted");
    setShowDeleteConfirm(false);
    onClose();
    navigate('/invoice');
  };

  const addSerialNumberRow = () => {
    setSerialNumbers([...serialNumbers, '']);
  };

  const updateSerialNumber = (index, value) => {
    const newSns = [...serialNumbers];
    newSns[index] = value;
    setFormData({...formData, snDetails: newSns});
    setSerialNumbers(newSns);
  };

  const removeSerialNumberRow = (index) => {
    const newSns = serialNumbers.filter((_, i) => i !== index);
    setSerialNumbers(newSns.length ? newSns : ['']);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, file: file});
    }
  };

  const handleBarcodeDetected = (barcode) => {
    if (currentScanIndex !== null) {
      updateSerialNumber(currentScanIndex, barcode);
      setShowBarcodeScanner(false);
      setCurrentScanIndex(null);

      // Auto-add new row
      if (currentScanIndex === serialNumbers.length - 1) {
        addSerialNumberRow();
      }
    }
  };

  const openBarcodeScanner = (index) => {
    setCurrentScanIndex(index);
    setShowBarcodeScanner(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fadeIn">
        
        <Watermark />

        {/* Modal Header  */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="bg-blue-800 p-2.5 rounded-xl shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{mode === 'edit' ? 'Edit Invoice' : 'Create New Invoice'}</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {mode === 'edit' ? 'Update invoice details below' : 'Fill in the invoice information below'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: Basic Information Grid */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Invoice Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference No</label>
                  <input 
                    type="text" 
                    value={formData.refNo}
                    onChange={(e) => setFormData({...formData, refNo: e.target.value})}
                    placeholder="e.g., INV-2024-001" 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                  <input 
                    type="text" 
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    placeholder="Enter supplier name" 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                  <textarea 
                    value={formData.remark}
                    onChange={(e) => setFormData({...formData, remark: e.target.value})}
                    placeholder="Additional notes (optional)" 
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (RM)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">RM</span>
                    <input 
                      type="text" 
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00" 
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice File</label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-xs text-gray-500">
                          {formData.file ? formData.file.name : 'Click to upload PDF or image'}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Costs Table */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cost Breakdown
            </h3>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
                    <th className="p-4 text-left font-medium">Purchase Cost (RM)</th>
                    <th className="p-4 text-left font-medium">Additional Cost (RM)</th>
                    <th className="p-4 text-left font-medium">Total Cost (RM)</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-t border-gray-200">
                    <td className="p-4">
                      <input 
                        type="text" 
                        placeholder="0.00" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        type="text" 
                        placeholder="0.00" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        type="text" 
                        placeholder="0.00" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Serial Numbers */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
              Serial Numbers
              <span className="text-xs font-normal text-gray-500 ml-2">({serialNumbers.length} items)</span>
            </h3>
            
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 w-12"></th>
                    <th className="p-4 text-left font-medium text-gray-700">Serial Number</th>
                    <th className="p-4 w-24 text-center font-medium text-gray-700">Scan</th>
                    <th className="p-4 w-20"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {serialNumbers.map((sn, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-center">
                        {idx === 0 ? (
                          <button 
                            onClick={addSerialNumberRow} 
                            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                            title="Add new serial number"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        ) : (
                          <span className="text-gray-300 text-lg">•</span>
                        )}
                      </td>
                      <td className="p-4">
                        <input 
                          type="text" 
                          placeholder={`SN-${String(idx + 1).padStart(3, '0')}`}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          value={sn}
                          onChange={(e) => updateSerialNumber(idx, e.target.value)}
                        />
                      </td>
                      <td className='p-4 text-center'>
                        <button
                          onClick={() => openBarcodeScanner(idx)}
                          className='w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 mx-auto group'
                          title='Scan barcode'
                        >
                          <svg className='w-4 h-4 group-hover:scale-110 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M12 4v1m6 11h2a2 2 0 012 2v1m0-12v1a2 2 0 01-2 2h-2M4 12h16M7 12v5m4-5v5m4-5v5M4 7V6a2 2 0 012-2h1M4 17v1a2 2 0 002 2h1m9-16h1a2 2 0 012 2v1" />
                          </svg>
                        </button>
                      </td>
                      <td className="p-4">
                        {serialNumbers.length > 1 && (
                          <button 
                            onClick={() => removeSerialNumberRow(idx)} 
                            className="w-8 h-8 text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition-all duration-200 group"
                            title="Remove serial number"
                          >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Quick Stats for Serial Numbers */}
            {serialNumbers.length > 1 && (
              <div className="mt-3 flex gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                  {serialNumbers.filter(sn => sn.trim() !== '').length} filled
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded-full">
                  {serialNumbers.filter(sn => sn.trim() === '').length} empty
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          {mode === 'edit' ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          ) : (
            <div />
          )}
          
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button 
              className="save-btn-main bg-blue-800 text-white px-8 py-2 rounded-md flex items-center gap-2"
              onClick={() => {
                console.log("Saving invoice:", formData, serialNumbers);
                onClose();
              }}
            >
              <span>{mode === 'edit' ? 'Update' : 'Save'}</span>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Invoice?</h3>
                <p className="text-gray-500 mb-6">
                  This action cannot be undone. This will permanently delete invoice <span className="font-semibold">{formData.refNo || 'INV-001'}</span> from the system.
                </p>
                <div className="flex gap-3 w-full">
                  <button 
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-lg"
                    onClick={handleDelete}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Barcode Scanner Modal */}
        {showBarcodeScanner && (
          <div className='fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-xl font-bold text-gray-800'>
                  Scan Barcode for Serial #{currentScanIndex !== null ? currentScanIndex + 1 : ''}
                </h3>
                <button 
                  onClick={() => {
                    setShowBarcodeScanner(false);
                    setCurrentScanIndex(null);
                  }}
                  className='hover:bg-gray-100 p-2 rounded-full transition-all duration-200'>
                    <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
              </div>

              <div className='bg-gray-100 rounded-xl p-8 mb-4 flex flex-col items-center'>
                  {/*Barcode Scanner */}
                  <div className='w-48 h-48 bg-gray-200 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center mb-4'>
                  <svg className='w-16 h-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 4v1m6 11h2a2 2 0 012 2v1m0-12v1a2 2 0 01-2 2h-2M4 12h16M7 12v5m4-5v5m4-5v5M4 7V6a2 2 0 012-2h1M4 17v1a2 2 0 002 2h1m9-16h1a2 2 0 012 2v1'/>
                  </svg>
                  </div>
                  <p className='text-gray-600 text-center mb-2'>Position barcode in front of camera</p>
                  <p className='text-sm text-gray-500 text-center'>or enter manually below</p>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Barcode Number</label>
                  <input
                    type='text'
                    placeholder='Scan or Type Barcode'
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleBarcodeDetected(e.target.value);
                      }
                    }}
                  />
                </div>
                <div className='flex gap-3'>
                  <button
                    className='flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium'
                    onClick={() => {
                      setShowBarcodeScanner(false);
                      setCurrentScanIndex(null);
                    }}
                  >Cancel</button>

                  <button 
                    className='flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg'
                    onClick={() => {
                      handleBarcodeDetected('SN' + Math.floor(Math.random() * 1000000));
                    }}
                  >Scan</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add animation keyframes*/}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddEditInvoice;