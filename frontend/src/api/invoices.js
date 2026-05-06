// Invoices CRUD + Scan

import apiClient from './client';

export const invoicesAPI = {
  // List all invoice (with pagination)
  getAll: async (params = { page: 1, limit: 20 }) => {
    const response = await apiClient.get('/invoice', { params });
    return response.data;
  },
  
  // Get single invoice by reference number
  getByRefNo: async (referenceNo) => {
    const response = await apiClient.get(`/invoice/${referenceNo}`);
    return response.data;
  },
  
  // Create invoice (Admin only)
  create: async (invoiceData) => {
    const formData = new FormData();
    Object.keys(invoiceData).forEach(key => {
      if (key === 'image' && invoiceData[key]) {
        formData.append('invoice_image', invoiceData[key]);
      } else {
        formData.append(key, invoiceData[key]);
      }
    });
    
    const response = await apiClient.post('/invoice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Update invoice (Admin only)
  update: async (referenceNo, invoiceData) => {
    const response = await apiClient.put(`/invoice/${referenceNo}`, invoiceData);
    return response.data;
  },
  
  // Delete invoice (Admin only)
  delete: async (referenceNo) => {
    const response = await apiClient.delete(`/invoice/${referenceNo}`);
    return response.data;
  },
};