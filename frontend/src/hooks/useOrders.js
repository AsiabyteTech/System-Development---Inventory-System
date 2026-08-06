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
      const response = await ordersAPI.getAll({ ...pagination, ...params });
      setOrders(response.data || response.items || []);
      setPagination({
        page: response.page || 1,
        total: response.total || 0,
        limit: response.limit || 20,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new order (bundles order details + selected product line items).
  // New orders start life as 'Pending' — per your flow, the backend is assumed
  // to reserve the selected stock units as part of this call.
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

  // Generic status update — underlies the Delivery/Complete/Cancelled transitions below.
  // ⚠️ VERIFY the exact status string values your backend expects.
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

  // Convenience wrappers matching your described flow
  const markAsDelivery = (trackingNumber) => updateOrderStatus(trackingNumber, 'Delivery');
  const markAsComplete = (trackingNumber) => updateOrderStatus(trackingNumber, 'Complete');
  // Cancel releases the stock reservation back to available (assumed backend-side,
  // same pattern as processReturn below)
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

  // Process a return (releases the reserved/sold unit back to available, with evidence)
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
  };
};
