import React from 'react';
import '../App.css';

const FilePreviewModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fadeIn">
                
                <Watermark />

                {/* ✅ RESPONSIVE FIX: Modal Header - responsive padding and text sizes */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="bg-blue-800 p-2 sm:p-2.5 rounded-xl shadow-lg flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">File Preview</h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                                Order: {order.trackingNumber} - {order.customerName}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition-all duration-200 flex-shrink-0"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* ✅ RESPONSIVE FIX: Modal Body - responsive padding and grid */}
                <div className="p-4 sm:p-6 overflow-y-auto">
                    {/* File Information Section - responsive grid */}
                    <div className="mb-4 sm:mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            File Information
                        </h3>
                        {/* ✅ RESPONSIVE FIX: Responsive grid that stacks on mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 text-xs sm:text-sm">File Name:</span>
                                <p className="font-medium text-gray-700 mt-1 text-xs sm:text-sm break-words">{order.fileName || 'document.pdf'}</p>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs sm:text-sm">File Type:</span>
                                <p className="font-medium text-gray-700 mt-1 text-xs sm:text-sm break-words">{order.fileType || 'application/pdf'}</p>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs sm:text-sm">Order ID:</span>
                                <p className="font-medium text-gray-700 mt-1 text-xs sm:text-sm">{order.id}</p>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs sm:text-sm">Tracking Number:</span>
                                <p className="font-medium text-gray-700 mt-1 text-xs sm:text-sm break-words">{order.trackingNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* File Preview Section - responsive */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Document Preview
                            </h3>
                        </div>
                        {/* ✅ RESPONSIVE FIX: Preview area with responsive sizing */}
                        <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 text-center mb-3 sm:mb-4 text-xs sm:text-sm break-words max-w-full px-2">
                                {order.fileName || 'Invoice document for this order'}
                            </p>
                            {/* ✅ RESPONSIVE FIX: Button group - wraps on mobile */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                                <button 
                                    onClick={() => window.open(order.fileUrl, '_blank')}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm"
                                >
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download File
                                </button>
                                <button 
                                    onClick={() => window.open(order.fileUrl, '_blank')}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm"
                                >
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Online
                                </button>
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-3 sm:mt-4 text-center">*This is a preview placeholder. In production, actual file content will be displayed here.</p>
                        </div>
                    </div>

                    {/* ✅ RESPONSIVE FIX: Order Summary Section - responsive grid */}
                    <div className="mt-4 sm:mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500 text-xs sm:text-sm">Status:</span>
                                <p className="font-medium mt-1">
                                    <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
                                        order.status === 'Complete' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Delivery' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs sm:text-sm">Margin Total:</span>
                                <p className="font-medium text-gray-700 mt-1 text-xs sm:text-sm">RM {order.marginTotal}</p>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs sm:text-sm">Platform:</span>
                                <p className="font-medium text-gray-700 mt-1 text-xs sm:text-sm break-words">{order.salesPlatform}</p>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs sm:text-sm">Purchase Date:</span>
                                <p className="font-medium text-gray-700 mt-1 text-xs sm:text-sm">{order.purchaseDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ RESPONSIVE FIX: Modal Footer - responsive button */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="px-4 sm:px-6 py-1.5 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Animation styles */}
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

export default FilePreviewModal;