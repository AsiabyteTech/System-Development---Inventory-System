import { apiClient } from "./api";

export const suppliersAPI = {
  // List all suppliers
  getAll: async (params = { page: 1, limit: 20 }) => {
    try {
      const response = await apiClient.get('/api/v1/supplier', { params });
      return response.data;
    } catch (error) {
      console.error("Get suppliers error:", error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get single supplier by ID
  getBySupplierID: async (supplierID) => {
    try {
      const response = await apiClient.get(`/api/v1/supplier/${supplierID}`);
      return response.data;
    } catch (error) {
      console.error("Get supplier by ID error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get total inventory purchases from ALL suppliers
  getTotalInventoryPurchases: async (period = 'all') => {
    try {
      const response = await apiClient.get('/api/v1/supplier/total-purchases', { 
        params: { period } 
      });
      return response.data;
    } catch (error) {
      console.error("Get total purchases error:", error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get supplier purchase history
  getPurchases: async (supplierID, period = 'all') => {
    try {
      const response = await apiClient.get(`/api/v1/supplier/${supplierID}/purchases`, { 
        params: { period } 
      });
      return response.data;
    } catch (error) {
      console.error("Get supplier purchases error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get supplier summary (invoice count + total purchase amount) for card display
  getSupplierSummary: async (supplierID, period = 'all') => {
    try {
      const response = await apiClient.get(`/api/v1/supplier/${supplierID}/summary`, {
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
    } catch (error) {
      console.error("Get supplier summary error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get bulk summary for multiple suppliers (for dashboard)
  getBulkSupplierSummary: async (supplierIds = [], period = 'all') => {
    try {
      const response = await apiClient.post('/api/v1/supplier/bulk-summary', {
        supplier_ids: supplierIds,
        period: period
      });
      return response.data;
    } catch (error) {
      console.error("Get bulk supplier summary error:", error.response?.data || error.message);
      throw error;
    }
  },
  
  // Update the create and update functions to use SupplierPhoneNumber
create: async (supplierData) => {
  try {
    const formData = new FormData();
    
    const backendSupplier = {
      SupplierName: supplierData.supplier_name || supplierData.name,
      SupplierPhoneNumber: supplierData.supplier_phone || supplierData.phone,
      SupplierAddress: supplierData.supplier_address || supplierData.address,
      PersonInCharge: supplierData.person_in_charge || supplierData.pic,
    };

    Object.keys(backendSupplier).forEach(key => {
      if (backendSupplier[key] !== undefined && backendSupplier[key] !== null) {
        formData.append(key, backendSupplier[key]);
      }
    });
    
    if (supplierData.image && supplierData.image instanceof File) {
      formData.append('supplier_image', supplierData.image);
    }
    
    const response = await apiClient.post('/api/v1/supplier', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error("Create supplier error:", error.response?.data || error.message);
    throw error;
  }
},

update: async (supplierID, supplierData) => {
  try {
    const formData = new FormData();
    
    const updateSupplier = {
      SupplierName: supplierData.supplier_name || supplierData.name,
      SupplierPhoneNumber: supplierData.supplier_phone || supplierData.phone,
      SupplierAddress: supplierData.supplier_address || supplierData.address,
      PersonInCharge: supplierData.person_in_charge || supplierData.pic,
    };

    Object.keys(updateSupplier).forEach(key => {
      if (updateSupplier[key] !== undefined && updateSupplier[key] !== null) {
        formData.append(key, updateSupplier[key]);
      }
    });

    if (supplierData.image && supplierData.image instanceof File) {
      formData.append('supplier_image', supplierData.image);
    }
    
    const response = await apiClient.put(`/api/v1/supplier/${supplierID}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error("Update supplier error:", error.response?.data || error.message);
    throw error;
  }
},
  
  // Delete supplier
  delete: async (supplierID) => {
    try {
      const response = await apiClient.delete(`/api/v1/supplier/${supplierID}`);
      return response.data;
    } catch (error) {
      console.error("Delete supplier error:", error.response?.data || error.message);
      throw error;
    }
  },
  
  // Upload supplier image separately
  uploadImage: async (supplierID, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await apiClient.post(`/api/v1/supplier/${supplierID}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Upload supplier image error:", error.response?.data || error.message);
      throw error;
    }
  },
};