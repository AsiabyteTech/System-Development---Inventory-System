import apiClient from './client';

export const packageAPI = {
    /**
     * Get all packages
     */
    getAll: async (params = {}) => {
        const response = await apiClient.get('/package', { params });
        return response.data;
    },

    /**
     * Get single package by ID
     */
    getById: async (id) => {
        const response = await apiClient.get(`/package/${id}`);
        return response.data;
    },

    /**
     * Create new package
     * @param {Object} packageData - { package_name, price, dateline, remark, products }
     */
    create: async (packageData) => {
        const response = await apiClient.post('/package', packageData);
        return response.data;
    },

    /**
     * Update package
     */
    update: async (id, packageData) => {
        const response = await apiClient.put(`/package/${id}`, packageData);
        return response.data;
    },

    /**
     * Delete package
     */
    delete: async (id) => {
        const response = await apiClient.delete(`/package/${id}`);
        return response.data;
    },

    /**
     * Get products in package
     */
    getPackageProducts: async (id) => {
        const response = await apiClient.get(`/package/${id}/products`);
        return response.data;
    },

    /**
     * Get packages that apply to a product (for Order Page dropdown)
     * @param {string|Array} skus - Single SKU or array of SKUs
     */
    getApplicablePackages: async (skus) => {
        const skuParam = Array.isArray(skus) ? skus.join(',') : skus;
        const response = await apiClient.get('/package/applicable', {
            params: { skus: skuParam }
        });
        return response.data;
    },
};

export default packageAPI;
