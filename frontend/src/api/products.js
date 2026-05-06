// Product CRUD

import apiClient from './client';

export const productsAPI = {
  // List all products (with pagination)
  getAll: async (params = { page: 1, limit: 20 }) => {
    const response = await apiClient.get('/product', { params });
    return response.data;
  },
  
  // Get single product by SKU
  getBySKU: async (sku) => {
    const response = await apiClient.get(`/product/${sku}`);
    return response.data;
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
    
    const response = await apiClient.post('/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Update product (Admin only)
  update: async (sku, productData) => {
    const response = await apiClient.put(`/product/${sku}`, productData);
    return response.data;
  },
  
  // Delete product (Admin only)
  delete: async (sku) => {
    const response = await apiClient.delete(`/product/${sku}`);
    return response.data;
  },
};