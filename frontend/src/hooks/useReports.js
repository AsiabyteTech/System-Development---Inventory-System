// Report data fetching (ReportOrder.jsx / ReportProductValue.jsx)

import { useState, useCallback } from 'react';
import { reportsAPI } from '../api/reports';

export const useReports = () => {
  const [orderReport, setOrderReport] = useState({ items: [], total: 0, summary: {} });
  const [inventoryReport, setInventoryReport] = useState({ items: [], total_value: 0, summary: {} });
  const [pnl, setPnl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Order volume report — filters: { month, year, sku, status }
  const fetchOrderReport = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const result = await reportsAPI.getOrderReport(filters);
      setOrderReport(result);
      setError(null);
      return result;
    } catch (err) {
      setError('Failed to load order report');
      return { items: [], total: 0, summary: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  // Inventory value report — filters: { month, year, sku, product_type }
  const fetchInventoryReport = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const result = await reportsAPI.getInventoryReport(filters);
      setInventoryReport(result);
      setError(null);
      return result;
    } catch (err) {
      setError('Failed to load inventory value report');
      return { items: [], total_value: 0, summary: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPnL = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const result = await reportsAPI.getPnL(params);
      setPnl(result);
      setError(null);
      return result;
    } catch (err) {
      setError('Failed to load P&L report');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = async (reportType, params = {}, format = 'csv') => {
    return await reportsAPI.exportReport(reportType, params, format);
  };

  const printReport = (elementId) => {
    reportsAPI.printReport(elementId);
  };

  return {
    orderReport,
    inventoryReport,
    pnl,
    loading,
    error,
    fetchOrderReport,
    fetchInventoryReport,
    fetchPnL,
    exportReport,
    printReport,
  };
};
