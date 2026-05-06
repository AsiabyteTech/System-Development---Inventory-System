// Stock operations

import apiClient from './client';

export const stockAPI = {
  // Get all stock units
  getAll: async (params = {}) => {
    const response = await apiClient.get('/stock', { params });
    return response.data;
  },
  
  // Get available stock (not reserved)
  getAvailable: async (sku = null) => {
    const params = sku ? { sku } : {};
    const response = await apiClient.get('/stock/available', { params });
    return response.data;
  },
  
  // Get reserved stock
  getReserved: async () => {
    const response = await apiClient.get('/stock/reserved');
    return response.data;
  },
  
  // Reserve stock for an order
  reserve: async (orderId, items) => {
    const response = await apiClient.post('/stock/reserve', {
      order_id: orderId,
      items, // [{ sku: "EZ-C8C-2MP", quantity: 2 }]
    });
    return response.data;
  },
  
  // Release a reservation (cancellation)
  release: async (reservationId) => {
    const response = await apiClient.post('/stock/release', {
      reservation_id: reservationId,
    });
    return response.data;
  },
  
  // Fulfill reservation (move to actual stock out)
  fulfill: async (reservationId, trackingNumber) => {
    const response = await apiClient.post('/stock/fulfill', {
      reservation_id: reservationId,
      tracking_number: trackingNumber,
    });
    return response.data;
  },
  
  // Manual stock adjustment (Admin only)
  adjust: async (sku, quantity, type, reason) => {
    const response = await apiClient.post('/stock/adjust', {
      sku,
      quantity,
      adjustment_type: type, // 'RETURN_GOOD', 'RETURN_DAMAGED', 'LOSS', 'FOUND'
      reason,
    });
    return response.data;
  },
};