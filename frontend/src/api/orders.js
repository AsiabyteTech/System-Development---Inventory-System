import apiClient from './client';
import { ORDER_ENDPOINTS } from '../constants/apiEndpoints';

export const ordersAPI = {
    /**
     * List all orders
     */
    getAll: async (params = {}) => {
        const response = await apiClient.get(ORDER_ENDPOINTS.BASE, { params });
        return response.data;
    },

    /**
     * Get single order by tracking number
     */
    getByTracking: async (trackingNumber) => {
        const response = await apiClient.get(ORDER_ENDPOINTS.TRACK(trackingNumber));
        return response.data;
    },

    /**
     * Create new order with promo/package support
     * @param {Object} orderData - { customer_id, items, promo_id, package_id, shipping_address, sales_platform, total_amount }
     */
    create: async (orderData) => {
        const response = await apiClient.post(ORDER_ENDPOINTS.BASE, orderData);
        return response.data;
    },

    /**
     * Check inventory availability before order
     * @param {Array} items - [{ sku, quantity }]
     */
    checkInventory: async (items) => {
        const response = await apiClient.post(`${ORDER_ENDPOINTS.BASE}/check-inventory`, { items });
        return response.data;
    },

    /**
     * Calculate order total with promo/package
     * @param {Object} calcData - { items, promo_id, package_id }
     */
    calculateTotal: async (calcData) => {
        const response = await apiClient.post(`${ORDER_ENDPOINTS.BASE}/calculate`, calcData);
        return response.data;
    },

    /**
     * Update order status
     */
    updateStatus: async (trackingNumber, status) => {
        const response = await apiClient.put(ORDER_ENDPOINTS.UPDATE_STATUS(trackingNumber), { status });
        return response.data;
    },

    /**
     * Fulfill order (generate pick list)
     */
    fulfill: async (trackingNumber) => {
        const response = await apiClient.post(ORDER_ENDPOINTS.FULFILL(trackingNumber));
        return response.data;
    },

    /**
     * Process return
     */
    processReturn: async (trackingNumber, returnData) => {
        const formData = new FormData();
        formData.append('reason', returnData.reason);
        formData.append('sku', returnData.sku);
        formData.append('quantity', returnData.quantity);
        formData.append('description', returnData.description || '');
        
        if (returnData.evidence_files) {
            returnData.evidence_files.forEach(file => {
                formData.append('evidence_files', file);
            });
        }
        
        const response = await apiClient.post(ORDER_ENDPOINTS.RETURN(trackingNumber), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

export default ordersAPI;
