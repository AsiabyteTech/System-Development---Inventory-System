// Order data fetching

import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '../api/orders';

export const useOrders = (initialParams = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });

  const fetchOrders = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      // Only send page, limit, and other filters (not total)
      const requestParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...params
      };
      // Remove total from the request params
      delete requestParams.total;
      
      const response = await ordersAPI.getAll(requestParams);
      
      console.log('Orders API response:', response);
      
      // Handle the specific response structure from the backend
      let ordersData = [];
      let total = 0;
      let page = 1;
      let limit = 20;
      
      // Check if response has the expected structure
      if (response && typeof response === 'object') {
        // Structure: { data: [], pagination: { total, page, limit } }
        if (response.data && Array.isArray(response.data)) {
          ordersData = response.data;
          
          // Get pagination info
          if (response.pagination) {
            total = response.pagination.total || 0;
            page = response.pagination.page || 1;
            limit = response.pagination.limit || 20;
          } else {
            total = ordersData.length;
          }
          
          console.log(`Found ${ordersData.length} orders, total: ${total}`);
        }
        // Alternative structure: { items: [], total: 0 }
        else if (response.items && Array.isArray(response.items)) {
          ordersData = response.items;
          total = response.total || response.count || ordersData.length;
          page = response.page || 1;
          limit = response.limit || 20;
        }
        // Alternative structure: { results: [], count: 0 }
        else if (response.results && Array.isArray(response.results)) {
          ordersData = response.results;
          total = response.count || response.total || ordersData.length;
          page = response.page || 1;
          limit = response.limit || 20;
        }
        // Direct array
        else if (Array.isArray(response)) {
          ordersData = response;
          total = response.length;
        }
      }
      
      setOrders(ordersData);
      setPagination({
        page: page,
        total: total,
        limit: limit,
      });
      setError(null);
      
      console.log('Orders set:', ordersData.length);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err.response?.data?.error?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  // Create a new order
  const createOrder = async (orderData, orderItems = []) => {
    try {
      const newOrder = await ordersAPI.create(orderData, orderItems);
      await fetchOrders();
      return { success: true, data: newOrder };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to create order',
      };
    }
  };

  const trackOrder = async (trackingNumber) => {
    try {
      const result = await ordersAPI.track(trackingNumber);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to track order',
      };
    }
  };

  const updateOrderStatus = async (trackingNumber, status) => {
    try {
      const updated = await ordersAPI.updateStatus(trackingNumber, status);
      await fetchOrders();
      return { success: true, data: updated };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to update order status',
      };
    }
  };

  const markAsDelivery = (trackingNumber) => updateOrderStatus(trackingNumber, 'Delivery');
  const markAsComplete = (trackingNumber) => updateOrderStatus(trackingNumber, 'Complete');
  const cancelOrder = (trackingNumber) => updateOrderStatus(trackingNumber, 'Cancelled');

  const fulfillOrder = async (trackingNumber) => {
    try {
      const result = await ordersAPI.fulfill(trackingNumber);
      await fetchOrders();
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to fulfill order',
      };
    }
  };

  const processReturn = async (trackingNumber, returnData) => {
    try {
      const result = await ordersAPI.processReturn(trackingNumber, returnData);
      await fetchOrders();
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to process return',
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

  // Fetch orders when page or limit changes
  useEffect(() => {
    fetchOrders();
  }, [pagination.page, pagination.limit]);

  // Initial fetch
  useEffect(() => {
    fetchOrders(initialParams);
  }, []);

  return {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
    createOrder,
    trackOrder,
    updateOrderStatus,
    markAsDelivery,
    markAsComplete,
    cancelOrder,
    fulfillOrder,
    processReturn,
    goToPage,
    changeItemsPerPage,
  };
};