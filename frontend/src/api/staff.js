// Staff management API

import { apiClient } from "./api";

export const staffAPI = {
  // Get all staff members (Admin only)
  getAll: async (params = { page: 1, limit: 20 }) => {
    try {
      const cleanParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          cleanParams[key] = params[key];
        }
      });
      
      console.log('Fetching staff with params:', cleanParams);
      const response = await apiClient.get('/api/v1/staff', { params: cleanParams });
      console.log('Staff API response:', response);
      return response.data;
    } catch (error) {
      console.error("Get staff error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get single staff member by ID (Admin only)
  getById: async (staffId) => {
    try {
      const response = await apiClient.get(`/api/v1/staff/${staffId}`);
      return response.data;
    } catch (error) {
      console.error("Get staff error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Create new staff member (Admin only)
  create: async (staffData) => {
    try {
      const response = await apiClient.post('/api/v1/staff/register', staffData);
      return response.data;
    } catch (error) {
      console.error("Create staff error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Update staff member (Admin only)
  update: async (staffId, staffData) => {
    try {
      const response = await apiClient.put(`/api/v1/staff/${staffId}`, staffData);
      return response.data;
    } catch (error) {
      console.error("Update staff error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete staff member (Admin only)
  delete: async (staffId) => {
    try {
      const response = await apiClient.delete(`/api/v1/staff/${staffId}`);
      return response.data;
    } catch (error) {
      console.error("Delete staff error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Update staff role (Admin only)
  updateRole: async (staffId, role) => {
    try {
      const response = await apiClient.patch(`/api/v1/staff/${staffId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error("Update staff role error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Toggle staff active status (Admin only)
  toggleStatus: async (staffId) => {
    try {
      const response = await apiClient.patch(`/api/v1/staff/${staffId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error("Toggle staff status error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default staffAPI;