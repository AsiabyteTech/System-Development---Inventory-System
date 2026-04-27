import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const AddEditInvoice = ({isOpen, onClose, invoice, mode}) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [currentScanIndex, setCurrentScanIndex] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(null);
  const [sections, setSections] = useState([
    { product: '', serialNumbers: [''] }
  ]);
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
        setSections(invoice.sections || [{ product: '', serialNumbers: [''] }]);
      } else {
        setFormData({
          refNo: '',
          supplier: '',
          remark: '',
          date: '',
          amount: '',
          file: null
        });
        setSections([{ product: '', serialNumbers: [''] }]);
      }
    }
  }, [isOpen, invoice, mode]);

  if (!isOpen) return null;

    const Watermark = () => (
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center overflow-hidden">
            <img 
                src="/Pictures/watermark.png"
                alt="Watermark"
                className="w-[450px] h-auto object-contain"
            />
        </div>
    );

  const handleDelete = () => {
    console.log("Invoice Deleted");
    setShowDeleteConfirm(false);
    onClose();
    navigate('/invoice');
  };

  const addSerialNumberRow = (sectionIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].serialNumbers.push('');
    setSections(newSections);
  };

  const updateSerialNumber = (sectionIndex, serialIndex, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].serialNumbers[serialIndex] = value;
    setSections(newSections);
  };

  const removeSerialNumberRow = (sectionIndex, serialIndex) => {
    const newSections = [...sections];
    const newSerialNumbers = newSections[sectionIndex].serialNumbers.filter((_, i) => i !== serialIndex);
    newSections[sectionIndex].serialNumbers = newSerialNumbers.length ? newSerialNumbers : [''];
    setSections(newSections);
  };

  const updateProduct = (sectionIndex, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].product = value;
    setSections(newSections);
  };

  const addProductSection = () => {
    setSections([...sections, { product: '', serialNumbers: [''] }]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, file: file});
    }
  };

  const handleBarcodeDetected = (barcode) => {
    if (currentScanIndex !== null && currentSectionIndex !== null) {
      updateSerialNumber(currentSectionIndex, currentScanIndex, barcode);
      setShowBarcodeScanner(false);
      setCurrentScanIndex(null);
      setCurrentSectionIndex(null);

      if (currentScanIndex === sections[currentSectionIndex].serialNumbers.length - 1) {
        addSerialNumberRow(currentSectionIndex);
      }
    }
  };

  const openBarcodeScanner = (sectionIndex, serialIndex) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentScanIndex(serialIndex);
    setShowBarcodeScanner(true);
  };

  const productOptions = [
    'EZ-C8C-2MP',
    'EZ-C8C-5MP',
    'EZ-H1C',
    'EZ-TY1-PRO',
    'EZ-H6C-PRO',
    'EZ-H9C-DL',
    'EZ-C6N',
    'TP-C200',
    'TP-C500',
    'HS-SD-64G'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-x-hidden">
      {/* ✅ RESPONSIVE FIX: Modal container with proper width and overflow control */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fadeIn">
        
        <Watermark />

        {/* Modal Header - responsive padding */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-blue-800 p-2 sm:p-2.5 rounded-xl shadow-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{mode === 'edit' ? 'Edit Invoice' : 'Create New Invoice'}</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {mode === 'edit' ? 'Update invoice details below' : 'Fill in the invoice information below'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition-all duration-200"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* ✅ RESPONSIVE FIX: Modal Body with scroll and proper overflow */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          
          {/* Section 1: Basic Information Grid - responsive */}
          <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Invoice Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference No</label>
                  <input 
                    type="text" 
                    value={formData.refNo}
                    onChange={(e) => setFormData({...formData, refNo: e.target.value})}
                    placeholder="e.g., INV-2024-001" 
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                  <input 
                    type="text" 
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    placeholder="Enter supplier name" 
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                  <textarea 
                    value={formData.remark}
                    onChange={(e) => setFormData({...formData, remark: e.target.value})}
                    placeholder="Additional notes (optional)" 
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none text-sm" 
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (RM)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 sm:top-2.5 text-gray-500 text-sm">RM</span>
                    <input 
                      type="text" 
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00" 
                      className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice File</label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-400 mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-full">
                          {formData.file ? formData.file.name : 'Click to upload PDF or image'}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Costs Table - with horizontal scroll on mobile */}
          <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cost Breakdown
            </h3>
            {/* ✅ RESPONSIVE FIX: Table wrapper with horizontal scroll */}
            <div className="overflow-x-auto w-full">
              <div className="min-w-[400px]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
                      <th className="p-3 sm:p-4 text-left font-medium">Purchase Cost (RM)</th>
                      <th className="p-3 sm:p-4 text-left font-medium">Additional Cost (RM)</th>
                      <th className="p-3 sm:p-4 text-left font-medium">Total Cost (RM)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-t border-gray-200">
                      <td className="p-3 sm:p-4">
                        <input 
                          type="text" 
                          placeholder="0.00" 
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                        />
                       </td>
                      <td className="p-3 sm:p-4">
                        <input 
                          type="text" 
                          placeholder="0.00" 
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                        />
                       </td>
                      <td className="p-3 sm:p-4">
                        <input 
                          type="text" 
                          placeholder="0.00" 
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                        />
                       </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 3: Serial Numbers - Dynamic Sections with responsive tables */}
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex flex-wrap items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
                Product {sectionIdx + 1}
                <span className="text-xs font-normal text-gray-500">({section.serialNumbers.length} items)</span>
              </h3>
              
              {/* Product Dropdown - full width */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select 
                  value={section.product}
                  onChange={(e) => updateProduct(sectionIdx, e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                >
                  <option value="">Select Product</option>
                  {productOptions.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>
              
              {/* ✅ RESPONSIVE FIX: Serial Numbers table with horizontal scroll */}
              <div className="overflow-x-auto w-full">
                <div className="min-w-[500px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 sm:p-4 w-12"></th>
                        <th className="p-3 sm:p-4 text-left font-medium text-gray-700">Serial Number</th>
                        <th className="p-3 sm:p-4 w-24 text-center font-medium text-gray-700">Scan</th>
                        <th className="p-3 sm:p-4 w-20"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {section.serialNumbers.map((sn, serialIdx) => (
                        <tr key={serialIdx} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 sm:p-4 text-center">
                            {serialIdx === 0 ? (
                              <button 
                                onClick={() => addSerialNumberRow(sectionIdx)} 
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                                title="Add new serial number"
                              >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                                </svg>
                              </button>
                            ) : (
                              <span className="text-gray-300 text-lg">•</span>
                            )}
                           </td>
                          <td className="p-3 sm:p-4">
                            <input 
                              type="text" 
                              placeholder={`SN-${String(serialIdx + 1).padStart(3, '0')}`}
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                              value={sn}
                              onChange={(e) => updateSerialNumber(sectionIdx, serialIdx, e.target.value)}
                            />
                           </td>
                          <td className="p-3 sm:p-4 text-center">
                            <button
                              onClick={() => openBarcodeScanner(sectionIdx, serialIdx)}
                              className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 mx-auto group"
                              title="Scan barcode"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2a2 2 0 012 2v1m0-12v1a2 2 0 01-2 2h-2M4 12h16M7 12v5m4-5v5m4-5v5M4 7V6a2 2 0 012-2h1M4 17v1a2 2 0 002 2h1m9-16h1a2 2 0 012 2v1" />
                              </svg>
                            </button>
                           </td>
                          <td className="p-3 sm:p-4">
                            {section.serialNumbers.length > 1 && (
                              <button 
                                onClick={() => removeSerialNumberRow(sectionIdx, serialIdx)} 
                                className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition-all duration-200 group"
                                title="Remove serial number"
                              >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>
              
              {/* Quick Stats for Serial Numbers */}
              {section.serialNumbers.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                    {section.serialNumbers.filter(sn => sn.trim() !== '').length} filled
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    {section.serialNumbers.filter(sn => sn.trim() === '').length} empty
                  </span>
                </div>
              )}
            </div>
          ))}
          
          {/* Add Product Button */}
          <div className="flex justify-center">
            <button
              onClick={addProductSection}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </div>

        {/* Modal Footer - responsive */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          {mode === 'edit' ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group text-sm"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          ) : (
            <div />
          )}
          
          <div className="flex gap-2 sm:gap-3">
            <button 
              onClick={onClose} 
              className="px-4 sm:px-6 py-1.5 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button 
              className="save-btn-main bg-blue-800 text-white px-6 sm:px-8 py-1.5 sm:py-2 rounded-md flex items-center gap-2 text-sm"
              onClick={() => {
                console.log("Saving invoice:", formData, sections);
                onClose();
              }}
            >
              <span>{mode === 'edit' ? 'Update' : 'Save'}</span>
              <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal - responsive */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 sm:p-6 animate-fadeIn">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Delete Invoice?</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">
                  This action cannot be undone. This will permanently delete invoice <span className="font-semibold">{formData.refNo || 'INV-001'}</span> from the system.
                </p>
                <div className="flex gap-3 w-full">
                  <button 
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-lg text-sm"
                    onClick={handleDelete}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Barcode Scanner Modal - responsive */}
        {showBarcodeScanner && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 sm:p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  Scan Barcode for Serial #{currentScanIndex !== null ? currentScanIndex + 1 : ''}
                </h3>
                <button 
                  onClick={() => {
                    setShowBarcodeScanner(false);
                    setCurrentScanIndex(null);
                    setCurrentSectionIndex(null);
                  }}
                  className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition-all duration-200">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
              </div>

              <div className="bg-gray-100 rounded-xl p-6 sm:p-8 mb-4 flex flex-col items-center">
                <div className="w-36 h-36 sm:w-48 sm:h-48 bg-gray-200 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2a2 2 0 012 2v1m0-12v1a2 2 0 01-2 2h-2M4 12h16M7 12v5m4-5v5m4-5v5M4 7V6a2 2 0 012-2h1M4 17v1a2 2 0 002 2h1m9-16h1a2 2 0 012 2v1"/>
                  </svg>
                </div>
                <p className="text-gray-600 text-center text-sm mb-2">Position barcode in front of camera</p>
                <p className="text-xs sm:text-sm text-gray-500 text-center">or enter manually below</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Barcode Number</label>
                  <input
                    type="text"
                    placeholder="Scan or Type Barcode"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleBarcodeDetected(e.target.value);
                      }
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
                    onClick={() => {
                      setShowBarcodeScanner(false);
                      setCurrentScanIndex(null);
                      setCurrentSectionIndex(null);
                    }}
                  >Cancel</button>
                  <button 
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg text-sm"
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