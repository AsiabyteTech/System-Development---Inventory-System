// Supplier CRUD

import apiClient from './client';

export const suppliersAPI = {
  // List all products (with pagination)
  getAll: async (params = { page: 1, limit: 20 }) => {
    const response = await apiClient.get('/supplier', { params });
    return response.data;
  },
  
  // Get single supplier by ID
  getBySupplierID: async (supplierID) => {
    const response = await apiClient.get(`/supplier/${supplierID}`);
    return response.data;
  },
  
  // Create supplier (Admin only)
  create: async (supplierData) => {
    const formData = new FormData();
    Object.keys(supplierData).forEach(key => {
      if (key === 'image' && supplierData[key]) {
        formData.append('supplier_image', supplierData[key]);
      } else {
        formData.append(key, supplierData[key]);
      }
    });
    
    const response = await apiClient.post('/supplier', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Update supplier (Admin only)
  update: async (supplierID, supplierData) => {
    const response = await apiClient.put(`/supplier/${supplierID}`, supplierData);
    return response.data;
  },
  
  // Delete supplier (Admin only)
  delete: async (supplierID) => {
    const response = await apiClient.delete(`/supplier/${supplierID}`);
    return response.data;
  },
};