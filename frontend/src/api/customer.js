import apiClient from './client';
import { CUSTOMER_ENDPOINTS } from '../constants/apiEndpoints';

export const customersAPI = {
    /**
     * List all customers
     * @param {Object} params - { page, limit, search }
     */
    getAll: async (params = {}) => {
        const response = await apiClient.get(CUSTOMER_ENDPOINTS.BASE, { params });
        return response.data;
    },

    /**
     * Get single customer by ID
     * @param {number} id - Customer ID
     */
    getById: async (id) => {
        const response = await apiClient.get(CUSTOMER_ENDPOINTS.GET_BY_ID(id));
        return response.data;
    },

    /**
     * Get customer by email or phone
     * @param {string} identifier - Email or phone number
     */
    getByIdentifier: async (identifier) => {
        const response = await apiClient.get(`${CUSTOMER_ENDPOINTS.BASE}/search`, {
            params: { q: identifier },
        });
        return response.data;
    },

    /**
     * Create new customer
     * @param {Object} customerData - { name, email, phone, address }
     */
    create: async (customerData) => {
        const response = await apiClient.post(CUSTOMER_ENDPOINTS.BASE, customerData);
        return response.data;
    },

    /**
     * Update customer
     * @param {number} id - Customer ID
     * @param {Object} customerData - Updated data
     */
    update: async (id, customerData) => {
        const response = await apiClient.put(CUSTOMER_ENDPOINTS.GET_BY_ID(id), customerData);
        return response.data;
    },

    /**
     * Delete customer (soft delete)
     * @param {number} id - Customer ID
     */
    delete: async (id) => {
        const response = await apiClient.delete(CUSTOMER_ENDPOINTS.GET_BY_ID(id));
        return response.data;
    },

    /**
     * Get customer order history
     * @param {number} id - Customer ID
     * @param {Object} params - { page, limit, status }
     */
    getOrderHistory: async (id, params = {}) => {
        const response = await apiClient.get(`${CUSTOMER_ENDPOINTS.GET_BY_ID(id)}/orders`, { params });
        return response.data;
    },

    /**
     * Add order to customer (link existing order)
     * @param {number} customerId - Customer ID
     * @param {string} orderId - Order ID
     */
    addOrder: async (customerId, orderId) => {
        const response = await apiClient.post(`${CUSTOMER_ENDPOINTS.GET_BY_ID(customerId)}/orders`, {
            order_id: orderId,
        });
        return response.data;
    },

    /**
     * Get customer with complete details including orders and returns
     * @param {number} id - Customer ID
     */
    getCustomerProfile: async (id) => {
        const [customer, orders] = await Promise.all([
            customersAPI.getById(id),
            customersAPI.getOrderHistory(id),
        ]);
        
        return {
            ...customer,
            orders: orders.items || [],
            total_orders: orders.total || 0,
            total_spent: orders.total_spent || 0,
        };
    },
};

export default customersAPI;
