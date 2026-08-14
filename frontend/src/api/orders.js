// Order management

import { apiClient } from "./api";

export const ordersAPI = {
  // List all orders
  getAll: async (params = { page: 1, limit: 20 }) => {
    try {
      // Clean up params - remove any undefined or null values
      const cleanParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          cleanParams[key] = params[key];
        }
      });
      
      console.log('Fetching orders with params:', cleanParams);
      const response = await apiClient.get('/api/v1/order', { params: cleanParams });
      console.log('Orders API response:', response);
      console.log('Response data structure:', response.data);
      
      // The backend returns { data: [], pagination: { total, page, limit } }
      return response.data;
    } catch (error) {
      console.error("Get orders error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Create new order
  create: async (orderData, orderItems = []) => {
    try {
      const payload = {
        TrackingNumber: orderData.tracking_number,
        CustomerID: orderData.customer_id,
        SalesPlatform: orderData.sales_platform,
        PurchaseDate: orderData.purchase_date,
        ShippingAddress: orderData.shipping_address,
        PaymentMethod: orderData.payment_method,
        Remark: orderData.remark || '',
        items: (orderItems || []).map(item => ({
          sku: item.sku,
          quantity: item.quantity,
          ...(item.dealType === 'promo' ? { promo_id: item.dealId } : {}),
          ...(item.dealType === 'package' ? { package_id: item.dealId } : {}),
        })),
      };
      const response = await apiClient.post('/api/v1/order', payload);
      return response.data;
    } catch (error) {
      console.error("Create order error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Track by tracking number
  track: async (trackingNumber) => {
    try {
      const response = await apiClient.get(`/api/v1/order/track/${trackingNumber}`);
      return response.data;
    } catch (error) {
      console.error("Track order error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Update order status
  updateStatus: async (trackingNumber, status) => {
    try {
      const response = await apiClient.put(`/api/v1/order/${trackingNumber}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Update order status error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Fulfill order
  fulfill: async (trackingNumber) => {
    try {
      const response = await apiClient.post(`/api/v1/order/${trackingNumber}/fulfill`);
      return response.data;
    } catch (error) {
      console.error("Fulfill order error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Process return
  processReturn: async (trackingNumber, returnData) => {
    try {
      const formData = new FormData();
      formData.append('reason', returnData.reason);
      formData.append('sku', returnData.sku);
      formData.append('quantity', returnData.quantity);
      formData.append('description', returnData.description);

      (returnData.evidence_files || []).forEach(file => {
        formData.append('evidence_files', file);
      });

      const response = await apiClient.post(`/api/v1/order/${trackingNumber}/return`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Process return error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default ordersAPI;