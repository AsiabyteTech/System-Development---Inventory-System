// Customer data fetching

import { useState, useEffect, useCallback } from 'react';
import { customersAPI } from '../api/customer';

export const useCustomers = (initialParams = {}) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });

  const fetchCustomers = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await customersAPI.getAll({ ...pagination, ...params });
      setCustomers(response.data || response.items || []);
      setPagination({
        page: response.page || 1,
        total: response.total || 0,
        limit: response.limit || 20,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, []);

  const getCustomer = async (customerId) => {
    try {
      const data = await customersAPI.getById(customerId);
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to load customer',
      };
    }
  };

  const createCustomer = async (customerData) => {
    try {
      const newCustomer = await customersAPI.create(customerData);
      await fetchCustomers();
      return { success: true, data: newCustomer };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to create customer',
      };
    }
  };

  const updateCustomer = async (customerId, customerData) => {
    try {
      const updated = await customersAPI.update(customerId, customerData);
      await fetchCustomers();
      return { success: true, data: updated };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to update customer',
      };
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await customersAPI.delete(customerId);
      await fetchCustomers();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to delete customer',
      };
    }
  };

  useEffect(() => {
    fetchCustomers(initialParams);
  }, []);

  return {
    customers,
    loading,
    error,
    pagination,
    fetchCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
