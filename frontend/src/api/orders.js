// Order management

import apiClient from './client';

export const ordersAPI = {
  // List all orders
  getAll: async (params = { page: 1, status: null }) => {
    const response = await apiClient.get('/order', { params });
    return response.data;
  },
  
  // Create new order
  create: async (orderData) => {
    const response = await apiClient.post('/order', orderData);
    return response.data;
  },
  
  // Track by tracking number
  track: async (trackingNumber) => {
    const response = await apiClient.get(`/order/track/${trackingNumber}`);
    return response.data;
  },
  
  // Update order status
  updateStatus: async (trackingNumber, status) => {
    const response = await apiClient.put(`/order/${trackingNumber}/status`, {
      status, // pending, processing, packing, shipped, delivered, cancelled
    });
    return response.data;
  },
  
  // Fulfill order (generate pick list)
  fulfill: async (trackingNumber) => {
    const response = await apiClient.post(`/order/${trackingNumber}/fulfill`);
    return response.data;
  },
  
  // Process return with evidence
  processReturn: async (trackingNumber, returnData) => {
    const formData = new FormData();
    formData.append('reason', returnData.reason);
    formData.append('sku', returnData.sku);
    formData.append('quantity', returnData.quantity);
    formData.append('description', returnData.description);
    
    // Append multiple evidence files
    returnData.evidence_files.forEach(file => {
      formData.append('evidence_files', file);
    });
    
    const response = await apiClient.post(`/order/${trackingNumber}/return`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};