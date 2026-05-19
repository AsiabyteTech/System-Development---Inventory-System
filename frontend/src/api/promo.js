import apiClient from './client';

export const promoAPI = {
    /**
     * Get all promotions
     */
    getAll: async (params = {}) => {
        const response = await apiClient.get('/promotion', { params });
        return response.data;
    },

    /**
     * Get single promotion by ID
     */
    getById: async (id) => {
        const response = await apiClient.get(`/promotion/${id}`);
        return response.data;
    },

    /**
     * Create new promotion
     * @param {Object} promoData - { promo_name, remark, dateline, reduction, price, product_skus, reduction_type }
     */
    create: async (promoData) => {
        const response = await apiClient.post('/promotion', promoData);
        return response.data;
    },

    /**
     * Update promotion
     */
    update: async (id, promoData) => {
        const response = await apiClient.put(`/promotion/${id}`, promoData);
        return response.data;
    },

    /**
     * Delete promotion
     */
    delete: async (id) => {
        const response = await apiClient.delete(`/promotion/${id}`);
        return response.data;
    },

    /**
     * Get active promotions that apply to a product (for Order Page dropdown)
     * @param {string|Array} skus - Single SKU or array of SKUs
     */
    getApplicablePromos: async (skus) => {
        const skuParam = Array.isArray(skus) ? skus.join(',') : skus;
        const response = await apiClient.get('/promotion/applicable', {
            params: { skus: skuParam }
        });
        return response.data;
    },
};

export default promoAPI;
