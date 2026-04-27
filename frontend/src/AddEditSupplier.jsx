import React, { useState, useEffect } from 'react';
import './App.css';

const AddEditSupplier = ({isOpen, onClose, supplier, mode}) => {
  const [formData, setFormData] = useState({ id: '', name: '', address: '', pic: '', phone: '', logo: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleDelete = () => {
    console.log("Supplier/Partner Deleted");
    setShowDeleteConfirm(false);
    onClose();
  }

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && supplier) {
        setFormData(supplier);
        setImagePreview(supplier.logo || null);
      } else {
        setFormData({ id: '', name: '', address: '', pic: '', phone: '', logo: '' });
        setImagePreview(null);
      }
    }
  }, [isOpen, supplier, mode]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({...formData, logo: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-x-hidden">
      {/* ✅ RESPONSIVE FIX: Modal container with proper width control */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden animate-fadeIn">
        
        <Watermark />

        {/* ✅ RESPONSIVE FIX: Modal Header - responsive padding */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="bg-blue-800 p-2 sm:p-2.5 rounded-xl shadow-lg flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
                {mode === 'edit' ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                {mode === 'edit' ? 'Update supplier information below' : 'Fill in the supplier details below'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="close-btn-minimal hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition-all duration-200 flex-shrink-0"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* ✅ RESPONSIVE FIX: Modal Body - responsive grid that stacks on mobile */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Basic Information
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID</label>
                    <input 
                      type="text" 
                      value={formData.id} 
                      onChange={(e) => setFormData({...formData, id: e.target.value})}
                      placeholder="e.g., SUP-001" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      placeholder="Enter company name" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Address</label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})} 
                      placeholder="Enter full address" 
                      rows="3"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none text-sm" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Contact Information
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Person In Charge</label>
                    <input 
                      type="text" 
                      value={formData.pic}
                      onChange={(e) => setFormData({...formData, pic: e.target.value})} 
                      placeholder="Enter PIC name" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                        setFormData({...formData, phone: value});
                      }} 
                      placeholder="e.g., 60123456789" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm" 
                    />
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">*Numbers only (0-9), maximum 12 digits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-4 sm:space-y-5">
              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Company Logo
                </h3>
                
                {/* ✅ RESPONSIVE FIX: Image Upload Area - responsive sizing */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className={`w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-2xl border-3 border-dashed transition-all duration-300 overflow-hidden
                      ${imagePreview ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-100 group-hover:border-blue-400 group-hover:bg-blue-50'}`}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Overlay */}
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-2xl cursor-pointer">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-2 sm:mt-3 text-center">
                    Click to upload logo<br />PNG, JPG up to 2MB
                  </p>
                </div>
              </div>

              {/* Status/Additional Info - Optional */}
              {mode === 'edit' && (
                <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Info</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Created:</span>
                      <span className="font-semibold text-xs sm:text-sm">Jan 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Last Updated:</span>
                      <span className="font-semibold text-xs sm:text-sm">Feb 20, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Total Orders:</span>
                      <span className="font-semibold text-xs sm:text-sm">24</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ RESPONSIVE FIX: Modal Footer - responsive padding and buttons */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          {mode === 'edit' ? (
            <button 
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group text-sm" 
              onClick={() => setShowDeleteConfirm(true)}
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
                console.log("Saving this data:", formData);
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

        {/* ✅ RESPONSIVE FIX: Delete Confirmation Modal - responsive */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 sm:p-6 animate-fadeIn">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Delete Supplier?</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">
                  This action cannot be undone. This will permanently delete <span className="font-semibold">{formData.name}</span> from the system.
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
      </div>

      {/* Add animation keyframes to your CSS */}
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

export default AddEditSupplier;