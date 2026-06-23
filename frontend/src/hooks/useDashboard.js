import { useState, useEffect, useCallback } from 'react';
import dashboardAPI from '../api/dashboard';
import reportsAPI from '../api/reports';

export const useDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [orderVolume, setOrderVolume] = useState([]);
  const [inventoryValue, setInventoryValue] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [pnlData, setPnlData] = useState(null);
  const [loading, setLoading] = useState({
    metrics: true,
    orderVolume: true,
    inventoryValue: true,
    lowStock: true,
    pnl: true,
  });
  const [error, setError] = useState(null);

  // Fetch dashboard metrics
  const fetchMetrics = useCallback(async () => {
    setLoading(prev => ({ ...prev, metrics: true }));
    try {
      const data = await dashboardAPI.getMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load metrics');
    } finally {
      setLoading(prev => ({ ...prev, metrics: false }));
    }
  }, []);

  // Fetch order volume data
  const fetchOrderVolume = useCallback(async (params = {}) => {
    setLoading(prev => ({ ...prev, orderVolume: true }));
    try {
      const data = await dashboardAPI.getOrderVolume(params);
      setOrderVolume(data.data || data.items || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load order volume');
    } finally {
      setLoading(prev => ({ ...prev, orderVolume: false }));
    }
  }, []);

  // Fetch inventory value data
  const fetchInventoryValue = useCallback(async (params = {}) => {
    setLoading(prev => ({ ...prev, inventoryValue: true }));
    try {
      const data = await dashboardAPI.getInventoryValue(params);
      setInventoryValue(data.data || data.items || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load inventory value');
    } finally {
      setLoading(prev => ({ ...prev, inventoryValue: false }));
    }
  }, []);

  // Fetch low stock items
  const fetchLowStock = useCallback(async (params = {}) => {
    setLoading(prev => ({ ...prev, lowStock: true }));
    try {
      const data = await dashboardAPI.getLowStock(params);
      setLowStockItems(data.items || data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load low stock items');
    } finally {
      setLoading(prev => ({ ...prev, lowStock: false }));
    }
  }, []);

  // Fetch P&L report
  const fetchPnL = useCallback(async (params = {}) => {
    setLoading(prev => ({ ...prev, pnl: true }));
    try {
      const data = await reportsAPI.getPnL(params);
      setPnlData(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load P&L report');
    } finally {
      setLoading(prev => ({ ...prev, pnl: false }));
    }
  }, []);

  // Fetch all dashboard data at once
  const fetchAllDashboardData = useCallback(async (orderParams = {}, lowStockParams = {}) => {
    setLoading({
      metrics: true,
      orderVolume: true,
      inventoryValue: true,
      lowStock: true,
      pnl: true,
    });
    
    try {
      const [metricsData, orderData, inventoryData, lowStockData] = await Promise.all([
        dashboardAPI.getMetrics(),
        dashboardAPI.getOrderVolume(orderParams),
        dashboardAPI.getInventoryValue({}),
        dashboardAPI.getLowStock(lowStockParams),
      ]);
      
      setMetrics(metricsData);
      setOrderVolume(orderData.data || orderData.items || []);
      setInventoryValue(inventoryData.data || inventoryData.items || []);
      setLowStockItems(lowStockData.items || lowStockData.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load dashboard data');
    } finally {
      setLoading({
        metrics: false,
        orderVolume: false,
        inventoryValue: false,
        lowStock: false,
        pnl: false,
      });
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMetrics();
    fetchOrderVolume();
    fetchInventoryValue();
    fetchLowStock();
  }, []);

  return {
    // Data
    metrics,
    orderVolume,
    inventoryValue,
    lowStockItems,
    pnlData,
    
    // Loading states
    loading,
    isLoading: Object.values(loading).some(Boolean),
    
    // Error
    error,
    
    // Actions
    fetchMetrics,
    fetchOrderVolume,
    fetchInventoryValue,
    fetchLowStock,
    fetchPnL,
    fetchAllDashboardData,
    
    // Helper: Get stock status color (for traffic light table)
    getStockStatus: (stockLevel) => {
      if (stockLevel <= 0) return { status: 'Out', color: '#dc3545' };
      if (stockLevel < 5) return { status: 'Low', color: '#ffc107' };
      if (stockLevel < 10) return { status: 'Initial Stock', color: '#17a2b8' };
      return { status: 'Good', color: '#28a745' };
    },
  };
};

export default useDashboard;
