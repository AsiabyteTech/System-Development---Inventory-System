import apiClient from './client';

export const suppliersAPI = {
  // List all suppliers
  getAll: async (params = { page: 1, limit: 20, search: '' }) => {
    const response = await apiClient.get('/api/v1/supplier', { params });
    return response.data;
  },
  
  // Get single supplier by ID
  getBySupplierID: async (supplierID) => {
    const response = await apiClient.get(`/api/v1/supplier/${supplierID}`);
    return response.data;
  },

  // Get total inventory purchases from ALL suppliers
  getTotalInventoryPurchases: async (period = 'all') => {
    const response = await apiClient.get('/supplier/total-purchases', { 
      params: { period } 
    });
    return response.data;
  },
  
  // Get supplier purchase history
  getPurchases: async (supplierID, period = 'all') => {
    const response = await apiClient.get(`/supplier/${supplierID}/purchases`, { 
      params: { period } 
    });
    return response.data;
  },

  // Get supplier summary (invoice count + total purchase amount) for card display
  getSupplierSummary: async (supplierID, period = 'all') => {
    const response = await apiClient.get(`/supplier/${supplierID}/summary`, {
      params: { period }
    });
    return {
      supplier_id: response.data.supplier_id,
      supplier_name: response.data.supplier_name,
      total_invoices: response.data.total_invoices || 0,
      total_purchases: response.data.total_purchases || 0,
      average_invoice_value: response.data.average_invoice_value || 0,
      last_purchase_date: response.data.last_purchase_date,
      period: response.data.period || period
    };
  },

  // Get bulk summary for multiple suppliers (for dashboard)
  getBulkSupplierSummary: async (supplierIds = [], period = 'all') => {
    const response = await apiClient.post('/supplier/bulk-summary', {
      supplier_ids: supplierIds,
      period: period
    });
    return response.data;
  },
  
  // Create supplier with image
  create: async (supplierData) => {
    const formData = new FormData();
    formData.append('supplier_name', supplierData.supplier_name);
    formData.append('supplier_address', supplierData.supplier_address);
    formData.append('person_in_charge', supplierData.person_in_charge || '');
    formData.append('supplier_phone', supplierData.supplier_phone || '');
    
    if (supplierData.supplier_image) {
      formData.append('supplier_image', supplierData.supplier_image);
    }
    
    const response = await apiClient.post('/api/v1/supplier', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Update supplier
  update: async (supplierID, supplierData) => {
    const formData = new FormData();
    formData.append('supplier_name', supplierData.supplier_name);
    formData.append('supplier_address', supplierData.supplier_address);
    formData.append('person_in_charge', supplierData.person_in_charge || '');
    formData.append('supplier_phone', supplierData.supplier_phone || '');
    
    if (supplierData.supplier_image) {
      formData.append('supplier_image', supplierData.supplier_image);
    }
    
    const response = await apiClient.put(`/api/v1/supplier/${supplierID}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Delete supplier
  delete: async (supplierID) => {
    const response = await apiClient.delete(`/api/v1/supplier/${supplierID}`);
    return response.data;
  },
  
  // Upload supplier image separately
  uploadImage: async (supplierID, imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await apiClient.post(`/api/v1/supplier/${supplierID}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
