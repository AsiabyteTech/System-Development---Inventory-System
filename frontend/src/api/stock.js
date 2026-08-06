// Stock operations

import { apiClient } from "./api";

export const stockAPI = {
  // Get all stock units
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/v1/stock', { params });
    return response.data;
  },

  // Get a single stock unit's full record by ID
  // ⚠️ VERIFY this path matches your actual Django urls.py
  /*getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/stock/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get stock unit error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new stock unit (stock-in: a physical unit arriving with a serial number + reference no)
  // ⚠️ VERIFY this path matches your actual Django urls.py
  create: async (stockData) => {
    try {
      const response = await apiClient.post('/api/v1/stock', stockData);
      return response.data;
    } catch (error) {
      console.error("Create stock unit error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Update an existing stock unit's record (e.g. correcting ref no, remark, purchase cost)
  // ⚠️ VERIFY this path matches your actual Django urls.py
  update: async (id, stockData) => {
    try {
      const response = await apiClient.put(`/api/v1/stock/${id}`, stockData);
      return response.data;
    } catch (error) {
      console.error("Update stock unit error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a stock unit (e.g. a mis-entered record)
  // ⚠️ VERIFY this path matches your actual Django urls.py
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/v1/stock/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete stock unit error:", error.response?.data || error.message);
      throw error;
    }
  },*/
  
  // Get available stock (not reserved)
  getAvailable: async (sku = null) => {
    const params = sku ? { sku } : {};
    const response = await apiClient.get('/api/v1/stock/available', { params });
    return response.data;
  },
  
  // Get reserved stock
  getReserved: async () => {
    const response = await apiClient.get('/api/v1/stock/reserved');
    return response.data;
  },
  
  // Reserve stock for an order
  reserve: async (orderId, items) => {
    const response = await apiClient.post('/api/v1/stock/reserve', {
      order_id: orderId,
      items, // [{ sku: "EZ-C8C-2MP", quantity: 2 }]
    });
    return response.data;
  },
  
  // Release a reservation (cancellation)
  release: async (reservationId) => {
    const response = await apiClient.post('/api/v1/stock/release', {
      reservation_id: reservationId,
    });
    return response.data;
  },
  
  // Fulfill reservation (move to actual stock out)
  fulfill: async (reservationId, trackingNumber) => {
    const response = await apiClient.post('/api/v1/stock/fulfill', {
      reservation_id: reservationId,
      tracking_number: trackingNumber,
    });
    return response.data;
  },
  
  // Manual stock adjustment (Admin only)
  adjust: async (sku, quantity, type, reason) => {
    const response = await apiClient.post('/api/v1/stock/adjust', {
      sku,
      quantity,
      adjustment_type: type, // 'RETURN_GOOD', 'RETURN_DAMAGED', 'LOSS', 'FOUND'
      reason,
    });
    return response.data;
  },
};