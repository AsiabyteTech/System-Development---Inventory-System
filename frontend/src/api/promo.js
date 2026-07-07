import { apiClient } from "./api";

export const promoAPI = {
    /**
     * Get all promotions
     */
    getAll: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/v1/promotion', { params });
            return response.data;
        } catch (error) {
            console.error("Get promotion error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Get single promotion by promo_id
     */
    getByPromoId: async (promo_id) => {
        try {
            const response = await apiClient.get(`/api/v1/promotion/${promo_id}`);
            return response.data;
        } catch (error) {
            console.error("Get promotion by promo_id error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Create new promotion
     */
    create: async (promoData) => {
        try {
            const formData = new FormData();
            
            // Map frontend fields to backend expected fields (matches your table)
            const backendPromo = {
                PromoName: promoData.PromoName || promoData.promo_name || promoData.name,
                Dateline: promoData.Dateline || promoData.dateline,
                Price: promoData.Price || promoData.price,
                Reduction: promoData.Reduction || promoData.reduction,
                Remark: promoData.Remark || promoData.remark || '',
            };

            Object.keys(backendPromo).forEach(key => {
                if (backendPromo[key] !== undefined && backendPromo[key] !== null) {
                    formData.append(key, backendPromo[key]);
                }
            });
            
            // If there's an image
            if (promoData.image && promoData.image instanceof File) {
                formData.append('promo_image', promoData.image);
            }
            
            const response = await apiClient.post('/api/v1/promotion', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error("Create promotion error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Update promotion
     */
    update: async (promo_id, promoData) => {
        try {
            const formData = new FormData();
            
            const updatePromo = {
                PromoName: promoData.PromoName || promoData.promo_name || promoData.name,
                Dateline: promoData.Dateline || promoData.dateline,
                Price: promoData.Price || promoData.price,
                Reduction: promoData.Reduction || promoData.reduction,
                Remark: promoData.Remark || promoData.remark || '',
            };

            Object.keys(updatePromo).forEach(key => {
                if (updatePromo[key] !== undefined && updatePromo[key] !== null) {
                    formData.append(key, updatePromo[key]);
                }
            });

            if (promoData.image && promoData.image instanceof File) {
                formData.append('promo_image', promoData.image);
            }

            const response = await apiClient.put(`/api/v1/promotion/${promo_id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error("Update promotion error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Delete promotion
     */
    delete: async (promo_id) => {
        try {
            const response = await apiClient.delete(`/api/v1/promotion/${promo_id}`);
            return response.data;
        } catch (error) {
            console.error("Delete promotion error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Get active promotions that apply to a product
     */
    getApplicablePromos: async (skus) => {
        try {
            const skuParam = Array.isArray(skus) ? skus.join(',') : skus;
            const response = await apiClient.get('/api/v1/promotion/applicable', {
                params: { skus: skuParam }
            });
            return response.data;
        } catch (error) {
            console.error("Get applicable promos error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Get products for promotion dropdown/selection
     */
    getProducts: async () => {
        try {
            const response = await apiClient.get('/api/v1/product');
            return response.data;
        } catch (error) {
            console.error("Get products error:", error.response?.data || error.message);
            throw error;
        }
    }
};

export default promoAPI;