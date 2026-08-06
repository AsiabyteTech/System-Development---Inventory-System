// Product CRUD

import { apiClient } from "./api";

export const productsAPI = {

  getAll: async (params = { page: 1, limit: 20 }) => {
    try {
      const response = await apiClient.get('/api/v1/product', { params });
      console.log('Products API response:', response);
      return response.data;
    } catch (error) {
      console.error("Get products error:", error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get single product by SKU
  getBySKU: async (sku) => {
    try {
      const response = await apiClient.get(`/api/v1/product/${sku}`);
      console.log('Product API response:', response);
      return response.data;
    } catch (error) {
      console.error("Get product error:", error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get product summary stats (total products, total margin) for card display
  // ⚠️ VERIFY this path matches your actual Django urls.py — placeholder based on existing route pattern
  getSummary: async () => {
    try {
      const response = await apiClient.get('/api/v1/product/summary');
      return response.data;
    } catch (error) {
      console.error("Get product summary error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get stock info for a single product by SKU
  // ⚠️ VERIFY this path matches your actual Django urls.py — placeholder based on existing route pattern
  getStockInfo: async (sku) => {
    try {
      const response = await apiClient.get(`/api/v1/product/${sku}/stock`);
      return response.data;
    } catch (error) {
      console.error("Get product stock info error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Create product (Admin only)
  create: async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key === 'image' && productData[key]) {
        formData.append('product_image', productData[key]);
      } else {
        formData.append(key, productData[key]);
      }
    });
    
    const response = await apiClient.post('/api/v1/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Update product (Admin only)
  update: async (sku, productData) => {
    try {
      const response = await apiClient.put(`/api/v1/product/${sku}`, productData);
      console.log('Product update API response:', response);
      return response.data;
    } catch (error) {
      console.error("Update product error:", error.response?.data || error.message);
      throw error;
    }
  },
  
  // Delete product (Admin only)
  delete: async (sku) => {
    try {
      const response = await apiClient.delete(`/api/v1/product/${sku}`);
      console.log('Product delete API response:', response);
      return response.data;
    } catch (error) {
      console.error("Delete product error:", error.response?.data || error.message);
      throw error;
    }
  },
};
