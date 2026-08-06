// Customer CRUD

import { apiClient } from "./api";

export const customersAPI = {
  // List all customers
  getAll: async (params = { page: 1, limit: 20 }) => {
    try {
      const response = await apiClient.get('/api/v1/customer', { params });
      return response.data;
    } catch (error) {
      console.error("Get customers error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get single customer by ID
  getById: async (customerId) => {
    try {
      const response = await apiClient.get(`/api/v1/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error("Get customer error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new customer
  create: async (customerData) => {
    try {
      const formData = new FormData();

      const backendCustomer = {
        CustomerName: customerData.customer_name || customerData.customerName,
        PhoneNumber: customerData.phone_number || customerData.phoneNumber,
        Email: customerData.email,
        Address: customerData.address,
        Stat: customerData.status || 'Active',
        SalesPlatform: customerData.sales_platform || customerData.salesPlatform,
        PurchaseDate: customerData.purchase_date || customerData.purchaseDate,
      };

      Object.keys(backendCustomer).forEach(key => {
        if (backendCustomer[key] !== undefined && backendCustomer[key] !== null) {
          formData.append(key, backendCustomer[key]);
        }
      });

      if (customerData.image && customerData.image instanceof File) {
        formData.append('customer_image', customerData.image);
      }

      const response = await apiClient.post('/api/v1/customer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Create customer error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Update an existing customer
  update: async (customerId, customerData) => {
    try {
      const formData = new FormData();

      const updateCustomer = {
        CustomerName: customerData.customer_name || customerData.customerName,
        PhoneNumber: customerData.phone_number || customerData.phoneNumber,
        Email: customerData.email,
        Address: customerData.address,
        Stat: customerData.status,
        SalesPlatform: customerData.sales_platform || customerData.salesPlatform,
        PurchaseDate: customerData.purchase_date || customerData.purchaseDate,
      };

      Object.keys(updateCustomer).forEach(key => {
        if (updateCustomer[key] !== undefined && updateCustomer[key] !== null) {
          formData.append(key, updateCustomer[key]);
        }
      });

      if (customerData.image && customerData.image instanceof File) {
        formData.append('customer_image', customerData.image);
      }

      const response = await apiClient.put(`/api/v1/customer/${customerId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Update customer error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a customer
  // ⚠️ VERIFY this endpoint exists — it wasn't visible in the API doc screenshot
  delete: async (customerId) => {
    try {
      const response = await apiClient.delete(`/api/v1/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error("Delete customer error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default customersAPI;
