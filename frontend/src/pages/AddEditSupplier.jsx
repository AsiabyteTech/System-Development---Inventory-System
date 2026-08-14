// AddEditSupplier.jsx - CORRECT Supplier Modal
import React, { useState, useEffect } from 'react';
import '../App.css';
import '../styles/animations.css';

const AddEditSupplier = ({ isOpen, onClose, supplier, mode, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pic: '',
    image: null
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && supplier) {
        setFormData({
          name: supplier.name || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
          pic: supplier.pic || '',
          image: null
        });
        setImagePreview(supplier.logo || null);
      } else {
        setFormData({
          name: '',
          phone: '',
          address: '',
          pic: '',
          image: null
        });
        setImagePreview(null);
      }
      setError(null);
    }
  }, [isOpen, supplier, mode]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validate
    if (!formData.name.trim()) {
      setError('Supplier name is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Prepare data for API
      const supplierData = {
        supplier_name: formData.name,
        supplier_phone: formData.phone,
        supplier_address: formData.address,
        person_in_charge: formData.pic,
        image: formData.image
      };

      await onSave(supplierData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save supplier');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await onDelete(supplier.id);
        onClose();
      } catch (err) {
        setError(err.message || 'Failed to delete supplier');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fadeIn">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="bg-blue-800 p-2.5 rounded-xl shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {mode === 'edit' ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {mode === 'edit' ? 'Update supplier information' : 'Enter supplier details below'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-gray-100 p-2 rounded-full transition-all duration-200 focus:outline-none"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Image Upload */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Supplier Logo / Image
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Supplier" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm inline-block">
                    Choose Image
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>

          {/* Supplier Details */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Supplier Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter supplier name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Person In Charge</label>
                <input
                  type="text"
                  value={formData.pic}
                  onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                  placeholder="Enter person in charge"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter supplier address"
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          {mode === 'edit' && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:opacity-50"
              disabled={saving}
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </button>
          )}
          
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="bg-blue-800 text-white px-8 py-2.5 rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm disabled:opacity-70 disabled:cursor-not-allowed hover:bg-blue-900 transition-all duration-200"
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
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditSupplier;