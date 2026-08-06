// Dashboard data fetching

import { useState, useEffect, useCallback } from 'react';
import { dashboardAPI } from '../api/dashboard';

export const useDashboard = (initialFilters = {}) => {
  const [metrics, setMetrics] = useState({
    total_products: 0,
    total_orders: 0,
    total_inventory_value: 0,
    total_product_value: 0,
    low_stock_count: 0,
  });
  const [orderVolume, setOrderVolume] = useState([]);
  const [orderVolumeTotal, setOrderVolumeTotal] = useState(0);
  const [inventoryValue, setInventoryValue] = useState([]);
  const [inventoryTotalValue, setInventoryTotalValue] = useState(0);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [lowStockTotal, setLowStockTotal] = useState(0);
  const [packages, setPackages] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch everything at once (initial load)
  const fetchAll = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const result = await dashboardAPI.getAllDashboardData(filters);
      setMetrics(result.metrics);
      setOrderVolume(result.orderVolume);
      setOrderVolumeTotal(result.orderVolumeTotal);
      setInventoryValue(result.inventoryValue);
      setInventoryTotalValue(result.inventoryTotalValue);
      setLowStockItems(result.lowStockItems);
      setLowStockTotal(result.lowStockTotal);
      setPackages(result.packages);
      setPromotions(result.promotions);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Individual refetchers — useful when a single filter (e.g. the order-volume
  // month picker) changes and you don't want to reload the whole dashboard.
  const fetchOrderVolume = useCallback(async (params = {}) => {
    const result = await dashboardAPI.getOrderVolume(params);
    setOrderVolume(result.data);
    setOrderVolumeTotal(result.total);
    return result;
  }, []);

  const fetchInventoryValue = useCallback(async (params = {}) => {
    const result = await dashboardAPI.getInventoryValue(params);
    setInventoryValue(result.data);
    setInventoryTotalValue(result.total_value);
    return result;
  }, []);

  const fetchLowStock = useCallback(async (params = {}) => {
    const result = await dashboardAPI.getLowStock(params);
    setLowStockItems(result.items);
    setLowStockTotal(result.total);
    return result;
  }, []);

  const fetchPackages = useCallback(async () => {
    const data = await dashboardAPI.getPackages();
    setPackages(data);
    return data;
  }, []);

  const fetchPromotions = useCallback(async () => {
    const data = await dashboardAPI.getPromotions();
    setPromotions(data);
    return data;
  }, []);

  const fetchMetrics = useCallback(async () => {
    const data = await dashboardAPI.getMetrics();
    setMetrics(data);
    return data;
  }, []);

  useEffect(() => {
    fetchAll(initialFilters);
  }, []);

  return {
    metrics,
    orderVolume,
    orderVolumeTotal,
    inventoryValue,
    inventoryTotalValue,
    lowStockItems,
    lowStockTotal,
    packages,
    promotions,
    loading,
    error,
    fetchAll,
    fetchMetrics,
    fetchOrderVolume,
    fetchInventoryValue,
    fetchLowStock,
    fetchPackages,
    fetchPromotions,
    getStatusBadgeClass: dashboardAPI.getStatusBadgeClass,
    getStockStatus: dashboardAPI.getStockStatus,
  };
};
