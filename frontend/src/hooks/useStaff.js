// Staff data fetching

import { useState, useEffect, useCallback } from 'react';
import { staffAPI } from '../api/staff';

export const useStaff = (initialParams = {}) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });

  const fetchStaff = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const requestParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...params
      };
      delete requestParams.total;
      
      const response = await staffAPI.getAll(requestParams);
      
      console.log('Staff API response:', response);
      
      let staffData = [];
      let total = 0;
      let page = 1;
      let limit = 20;
      
      if (response && typeof response === 'object') {
        // Structure: { data: [], pagination: { total, page, limit } }
        if (response.data && Array.isArray(response.data)) {
          staffData = response.data;
          if (response.pagination) {
            total = response.pagination.total || 0;
            page = response.pagination.page || 1;
            limit = response.pagination.limit || 20;
          } else {
            total = staffData.length;
          }
        }
        // Alternative structure: { items: [], total: 0 }
        else if (response.items && Array.isArray(response.items)) {
          staffData = response.items;
          total = response.total || response.count || staffData.length;
          page = response.page || 1;
          limit = response.limit || 20;
        }
        // Alternative structure: { results: [], count: 0 }
        else if (response.results && Array.isArray(response.results)) {
          staffData = response.results;
          total = response.count || response.total || staffData.length;
          page = response.page || 1;
          limit = response.limit || 20;
        }
        // Direct array
        else if (Array.isArray(response)) {
          staffData = response;
          total = response.length;
        }
      }
      
      setStaff(staffData);
      setPagination({
        page: page,
        total: total,
        limit: limit,
      });
      setError(null);
      
      console.log('Staff set:', staffData.length);
    } catch (err) {
      console.error('Fetch staff error:', err);
      setError(err.response?.data?.error?.message || 'Failed to load staff');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  // Create staff member
  const createStaff = async (staffData) => {
    try {
      const newStaff = await staffAPI.create(staffData);
      await fetchStaff();
      return { success: true, data: newStaff };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to create staff',
      };
    }
  };

  // Update staff member
  const updateStaff = async (staffId, staffData) => {
    try {
      const updated = await staffAPI.update(staffId, staffData);
      await fetchStaff();
      return { success: true, data: updated };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to update staff',
      };
    }
  };

  // Delete staff member
  const deleteStaff = async (staffId) => {
    try {
      await staffAPI.delete(staffId);
      await fetchStaff();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to delete staff',
      };
    }
  };

  // Update staff role
  const updateStaffRole = async (staffId, role) => {
    try {
      const updated = await staffAPI.updateRole(staffId, role);
      await fetchStaff();
      return { success: true, data: updated };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to update staff role',
      };
    }
  };

  // Toggle staff status
  const toggleStaffStatus = async (staffId) => {
    try {
      const updated = await staffAPI.toggleStatus(staffId);
      await fetchStaff();
      return { success: true, data: updated };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to toggle staff status',
      };
    }
  };

  // Pagination controls
  const goToPage = useCallback((page) => {
    const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
    if (page < 1 || page > totalPages) return;
    setPagination(prev => ({ ...prev, page }));
  }, [pagination.total, pagination.limit]);

  const changeItemsPerPage = useCallback((newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: newLimit,
      page: 1
    }));
  }, []);

  // Fetch staff when page or limit changes
  useEffect(() => {
    fetchStaff();
  }, [pagination.page, pagination.limit]);

  // Initial fetch
  useEffect(() => {
    fetchStaff(initialParams);
  }, []);

  return {
    staff,
    loading,
    error,
    pagination,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    updateStaffRole,
    toggleStaffStatus,
    goToPage,
    changeItemsPerPage,
  };
};