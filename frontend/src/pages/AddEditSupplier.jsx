// ✅ REFACTORED: imports organized
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoicesAPI } from '../api/invoices';
import '../App.css';
import '../styles/animations.css';

const AddEditInvoice = ({ isOpen, onClose, invoice, mode, onSave }) => {
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
    supplierId: '',
    remark: '',
    date: '',
    amount: '',
    file: null
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [supplierSearchText, setSupplierSearchText] = useState('');
  
  // State for product autocomplete
  const [productSearchText, setProductSearchText] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [currentProductSection, setCurrentProductSection] = useState(null);
  const [barcodeInputValue, setBarcodeInputValue] = useState('');
  const [products, setProducts] = useState([]);
  
  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  // Fetch suppliers on mount
  useEffect(() => {
    if (isOpen) {
      fetchSuppliers();
      fetchProducts();
    }
  }, [isOpen]);

  const fetchSuppliers = async () => {
    try {
      const response = await invoicesAPI.getSuppliers();
      let supplierData = [];
      if (response?.data) {
        supplierData = Array.isArray(response.data) ? response.data : [response.data];
      } else if (response?.suppliers) {
        supplierData = response.suppliers;
      } else if (Array.isArray(response)) {
        supplierData = response;
      }
      
      const mappedSuppliers = supplierData.map(item => ({
        id: item.SupplierID || item.supplier_id || item.id,
        name: item.SupplierName || item.supplier_name || item.name || 'Unknown'
      }));
      setSuppliers(mappedSuppliers);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await invoicesAPI.getProducts();
      let productData = [];
      if (response?.data) {
        productData = Array.isArray(response.data) ? response.data : [response.data];
      } else if (response?.products) {
        productData = response.products;
      } else if (Array.isArray(response)) {
        productData = response;
      }
      
      const mappedProducts = productData.map(item => ({
        sku: item.SKU || item.sku || '',
        name: item.ProductName || item.product_name || ''
      }));
      setProducts(mappedProducts);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // Filtered suppliers based on search text
  const filteredSuppliers = supplierSearchText
    ? suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(supplierSearchText.toLowerCase())
      )
    : suppliers;

  // Filtered product options based on search text
  const filteredProducts = productSearchText
    ? products.filter(product =>
        product.sku.toLowerCase().includes(productSearchText.toLowerCase()) ||
        product.name.toLowerCase().includes(productSearchText.toLowerCase())
      )
    : products;

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (mode === 'edit' && invoice) {
        setFormData({
          refNo: invoice.refNo || '',
          supplier: invoice.supplier || '',
          supplierId: invoice.supplierId || '',
          remark: invoice.remark || '',
          date: invoice.date || '',
          amount: invoice.amount || '',
          file: invoice.file || null
        });
        setSections(invoice.sections || [{ product: '', serialNumbers: [''] }]);
        if (invoice.file) {
          setSelectedFile(invoice.file);
          setFileName(invoice.file.name);
        }
        setSupplierSearchText(invoice.supplier || '');
      } else {
        // Auto-generate reference number
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        // Get last invoice number from localStorage
        const lastInvNum = parseInt(localStorage.getItem('lastInvoiceNumber') || '0');
        const newInvNum = lastInvNum + 1;
        const refNo = `INV-${year}${month}${day}-${String(newInvNum).padStart(3, '0')}`;
        localStorage.setItem('lastInvoiceNumber', newInvNum.toString());
        
        setFormData({
          refNo: refNo,
          supplier: '',
          supplierId: '',
          remark: '',
          date: dateStr,
          amount: '',
          file: null
        });
        setSections([{ product: '', serialNumbers: [''] }]);
        setSelectedFile(null);
        setFileName('');
        setSupplierSearchText('');
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

  const handleDelete = async () => {
    try {
      if (invoice && invoice.refNo) {
        await invoicesAPI.delete(invoice.refNo);
        console.log("Invoice Deleted:", invoice.refNo);
        setShowDeleteConfirm(false);
        onClose();
        if (onSave) {
          onSave(null);
        }
        navigate('/invoice');
      }
    } catch (err) {
      console.error("Failed to delete invoice:", err);
      alert(err.response?.data?.detail || err.message || "Failed to delete invoice");
    }
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

  // Product update function
  const updateProduct = (sectionIndex, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].product = value;
    setSections(newSections);
    setProductSearchText(value);
    setShowProductDropdown(false);
  };

  // Handle product input change
  const handleProductInputChange = (sectionIndex, value) => {
    setProductSearchText(value);
    const newSections = [...sections];
    newSections[sectionIndex].product = value;
    setSections(newSections);
    setShowProductDropdown(true);
    setCurrentProductSection(sectionIndex);
  };

  // Handle supplier input change
  const handleSupplierInputChange = (value) => {
    setSupplierSearchText(value);
    setFormData({...formData, supplier: value});
    setShowSupplierDropdown(true);
  };

  // Handle supplier selection
  const handleSupplierSelect = (supplier) => {
    setFormData({...formData, supplier: supplier.name, supplierId: supplier.id});
    setSupplierSearchText(supplier.name);
    setShowSupplierDropdown(false);
  };

  const addProductSection = () => {
    setSections([...sections, { product: '', serialNumbers: [''] }]);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (file) {
      if (file.size > maxSize) {
        alert('File size exceeds 5MB limit. Please choose a smaller file.');
        return;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png|doc|docx)$/i)) {
        alert('Unsupported file format. Please upload PDF, DOC, DOCX, JPG, or PNG files.');
        return;
      }
      
      setSelectedFile(file);
      setFileName(file.name);
      setFormData({...formData, file: file});
      console.log("File selected:", file.name);
    }
  };

  // Barcode detection
  const handleBarcodeDetected = (barcode) => {
    if (!barcode.trim() || currentSectionIndex === null) return;

    const newSections = [...sections];
    const serialList = newSections[currentSectionIndex].serialNumbers;

    const emptyIndex = serialList.findIndex((sn) => sn.trim() === "");

    if (emptyIndex !== -1) {
      serialList[emptyIndex] = barcode;
    } else {
      serialList.push(barcode);
    }

    serialList.push("");
    setSections(newSections);
    setBarcodeInputValue('');
  };

  const openBarcodeScanner = (sectionIndex) => {
    setCurrentSectionIndex(sectionIndex);
    setShowBarcodeScanner(true);
    setBarcodeInputValue('');
  };

  const handleProductFocus = (sectionIndex) => {
    setCurrentProductSection(sectionIndex);
    const currentProductValue = sections[sectionIndex].product;
    setProductSearchText(currentProductValue);
    setShowProductDropdown(true);
  };

  const handleProductBlur = () => {
    setTimeout(() => {
      setShowProductDropdown(false);
    }, 200);
  };

  // Handle supplier blur
  const handleSupplierBlur = () => {
    setTimeout(() => {
      setShowSupplierDropdown(false);
    }, 200);
  };

  // Handle form submission - FIXED: Now calls the API
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.refNo.trim()) {
      alert('Reference No is required');
      return;
    }
    if (!formData.supplier.trim()) {
      alert('Supplier Name is required');
      return;
    }
    if (!formData.date) {
      alert('Invoice Date is required');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Amount is required and must be greater than 0');
      return;
    }

    // Check if at least one serial number is filled
    let hasSerialNumbers = false;
    sections.forEach(section => {
      section.serialNumbers.forEach(sn => {
        if (sn.trim() !== '') hasSerialNumbers = true;
      });
    });
    if (!hasSerialNumbers) {
      alert('Please add at least one serial number');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Prepare stock items from sections
      const stockItems = [];
      sections.forEach(section => {
        section.serialNumbers.forEach(sn => {
          if (sn.trim() !== '') {
            stockItems.push({
              serial_number: sn.trim(),
              sku: section.product || '',
            });
          }
        });
      });

      // Prepare invoice data
      const invoiceData = {
        reference_no: formData.refNo,
        supplier_name: formData.supplier,
        supplier_id: formData.supplierId || null,
        invoice_date: formData.date,
        amount: parseFloat(formData.amount),
        remark: formData.remark || '',
        image: selectedFile
      };

      console.log('Saving invoice data:', invoiceData);
      console.log('Stock items:', stockItems);

      if (mode === 'edit') {
        // Update existing invoice
        await invoicesAPI.update(formData.refNo, invoiceData);
        alert(`Invoice "${formData.refNo}" updated successfully!`);
      } else {
        // Create new invoice with stock items
        await invoicesAPI.create(invoiceData, stockItems);
        alert(`Invoice "${formData.refNo}" created successfully!`);
      }

      // Close modal and refresh
      onClose();
      if (onSave) {
        onSave(invoiceData);
      }
    } catch (err) {
      console.error("Failed to save invoice:", err);
      const errorMsg = err.response?.data?.detail || err.message || "Failed to save invoice";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-x-hidden">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fadeIn">
        
        <Watermark />

        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-blue-800 p-2 sm:p-2.5 rounded-xl shadow-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                {mode === 'edit' ? 'Edit Invoice' : 'Create New Invoice'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {mode === 'edit' ? 'Update invoice details below' : 'Fill in the invoice information below'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition-all duration-200 focus:outline-none"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mx-4 sm:mx-6 mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          
          {/* Section 1: Basic Information */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference No *</label>
                  <input 
                    type="text" 
                    value={formData.refNo}
                    onChange={(e) => setFormData({...formData, refNo: e.target.value})}
                    placeholder="e.g., INV-2024-001" 
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                    disabled={mode === 'edit'}
                  />
                  {mode === 'edit' && (
                    <p className="text-xs text-amber-600 mt-1">Reference No cannot be changed in edit mode</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={supplierSearchText}
                      onChange={(e) => handleSupplierInputChange(e.target.value)}
                      onFocus={() => setShowSupplierDropdown(true)}
                      onBlur={handleSupplierBlur}
                      placeholder="Search or select supplier..." 
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                    />
                    {showSupplierDropdown && filteredSuppliers.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredSuppliers.map((supplier) => (
                          <div
                            key={supplier.id}
                            className="px-3 sm:px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-sm"
                            onClick={() => handleSupplierSelect(supplier)}
                          >
                            {supplier.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                  <textarea 
                    value={formData.remark}
                    onChange={(e) => setFormData({...formData, remark: e.target.value})}
                    placeholder="Additional notes (optional)" 
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none text-sm" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date *</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (RM) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 sm:top-2.5 text-gray-500 text-sm">RM</span>
                    <input 
                      type="text" 
                      value={formData.amount}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/[^0-9.]/g, '')
                          .replace(/(\..*)\./g, '$1');
                        setFormData({...formData, amount: value});
                      }}
                      placeholder="0.00" 
                      className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">*Numbers only (0-9 and decimal point)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice File</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="invoiceFileUpload"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="invoiceFileUpload"
                      className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-xs sm:text-sm text-slate-600 truncate max-w-[150px] sm:max-w-full">
                          {fileName ? fileName : 'Choose file'}
                        </span>
                      </div>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </label>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-1">*Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)</p>
                  {selectedFile && (
                    <div className="mt-2 text-[10px] sm:text-xs text-green-600 flex items-center gap-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      File ready: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Serial Numbers - Dynamic Sections */}
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex flex-wrap items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
                Product {sectionIdx + 1}
                <span className="text-xs font-normal text-gray-500">({section.serialNumbers.filter(sn => sn.trim() !== '').length} items)</span>
              </h3>
              
              {/* Product selection */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product SKU</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={section.product}
                      onChange={(e) => handleProductInputChange(sectionIdx, e.target.value)}
                      onFocus={() => handleProductFocus(sectionIdx)}
                      onBlur={handleProductBlur}
                      placeholder="Search or select product by SKU..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                    />
                    {showProductDropdown && currentProductSection === sectionIdx && productSearchText && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <div
                              key={product.sku}
                              className="px-3 sm:px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-sm"
                              onClick={() => updateProduct(sectionIdx, product.sku)}
                            >
                              <span className="font-medium">{product.sku}</span>
                              {product.name && <span className="text-gray-500 ml-2">- {product.name}</span>}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 sm:px-4 py-2 text-gray-500 text-sm">No products found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:self-end">
                  <button
                    onClick={() => openBarcodeScanner(sectionIdx)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2a2 2 0 012 2v1m0-12v1a2 2 0 01-2 2h-2M4 12h16M7 12v5m4-5v5m4-5v5M4 7V6a2 2 0 012-2h1M4 17v1a2 2 0 002 2h1m9-16h1a2 2 0 012 2v1" />
                    </svg>
                    Scan Barcode
                  </button>
                </div>
              </div>
              
              {/* Serial Numbers table */}
              <div className="overflow-x-auto w-full">
                <div className="min-w-[500px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 sm:p-4 w-12"></th>
                        <th className="p-3 sm:p-4 text-left font-medium text-gray-700">Serial Number</th>
                        <th className="p-3 sm:p-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {section.serialNumbers.map((sn, serialIdx) => (
                        <tr key={serialIdx} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 sm:p-4 text-center">
                            {serialIdx === 0 ? (
                              <button 
                                onClick={() => addSerialNumberRow(sectionIdx)} 
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                              placeholder={`Enter serial number`}
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                              value={sn}
                              onChange={(e) => updateSerialNumber(sectionIdx, serialIdx, e.target.value)}
                            />
                          </td>
                          <td className="p-3 sm:p-4 text-center">
                            {section.serialNumbers.length > 1 && (
                              <button 
                                onClick={() => removeSerialNumberRow(sectionIdx, serialIdx)} 
                                className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500"
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
              
              {/* Quick Stats */}
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
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          {mode === 'edit' ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:opacity-50"
              disabled={saving}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </button>
          ) : (
            <div />
          )}
          
          <div className="flex gap-2 sm:gap-3">
            <button 
              onClick={onClose} 
              className="px-4 sm:px-6 py-1.5 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              className="save-btn-main bg-blue-800 text-white px-6 sm:px-8 py-1.5 sm:py-2 rounded-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'edit' ? 'Update' : 'Save'}</span>
                  <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300 text-sm"
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
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 sm:p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  Scan Barcode for Product {currentSectionIndex !== null ? currentSectionIndex + 1 : ''}
                </h3>
                <button 
                  onClick={() => {
                    setShowBarcodeScanner(false);
                    setCurrentSectionIndex(null);
                    setBarcodeInputValue('');
                  }}
                  className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition-all duration-200 focus:outline-none"
                >
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
                    value={barcodeInputValue}
                    onChange={(e) => setBarcodeInputValue(e.target.value)}
                    placeholder="Scan or Type Barcode"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleBarcodeDetected(barcodeInputValue);
                      }
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    onClick={() => {
                      setShowBarcodeScanner(false);
                      setCurrentSectionIndex(null);
                      setBarcodeInputValue('');
                    }}
                  >
                    Done
                  </button>
                  <button 
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                    onClick={() => handleBarcodeDetected(barcodeInputValue)}
                  >
                    Add Barcode
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEditInvoice;