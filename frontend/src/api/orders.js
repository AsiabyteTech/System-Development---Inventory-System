// Order management

import { apiClient } from "./api";

export const ordersAPI = {
  // List all orders
  getAll: async (params = { page: 1, limit: 20 }) => {
    try {
      const response = await apiClient.get('/api/v1/order', { params });
      return response.data;
    } catch (error) {
      console.error("Get orders error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Create new order (bundles order details + selected product line items).
  // Matches the invoice-creation pattern: the backend is assumed to reserve
  // stock for these items atomically as part of order creation.
  // ⚠️ VERIFY: if your backend instead expects a separate reserve step after
  // create, call stockAPI.reserve(trackingNumber, items) right after this succeeds.
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
          // Present only for the synthetic bundle line items Inventory adds when
          // a promo/package deal is applied — links the order line back to the deal.
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
  // ⚠️ VERIFY exact status string casing expected by the backend
  // (using 'Pending' | 'Delivery' | 'Complete' | 'Cancelled' to match the UI)
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

  // Fulfill order (generate pick list)
  fulfill: async (trackingNumber) => {
    try {
      const response = await apiClient.post(`/api/v1/order/${trackingNumber}/fulfill`);
      return response.data;
    } catch (error) {
      console.error("Fulfill order error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Process return with evidence (also used for the Cancel/Release flow)
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
