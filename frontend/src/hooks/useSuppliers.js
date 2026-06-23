import { useState, useEffect, useCallback } from 'react';
import { suppliersAPI } from '../api/suppliers';

export const useSuppliers = (initialParams = {}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });

  // State for selected supplier's purchases (invoice count + total amount)
  const [selectedSupplierSummary, setSelectedSupplierSummary] = useState({
    total_invoices: 0,
    total_purchases: 0,
    average_invoice_value: 0,
    last_purchase_date: null,
    loading: false,
    error: null
  });

  const [totalInventoryPurchases, setTotalInventoryPurchases] = useState(0);
  const [totalInvoicesCount, setTotalInvoicesCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(false);

  // Cache for supplier summaries to avoid repeated API calls
  const [supplierSummariesCache, setSupplierSummariesCache] = useState({});

  const fetchSuppliers = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await suppliersAPI.getAll({ ...pagination, ...params });
      setSuppliers(response.data || []);
      setPagination({
        page: response.page || 1,
        total: response.total || 0,
        limit: response.limit || 20,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch total inventory purchases from ALL suppliers
  const fetchTotalInventoryPurchases = useCallback(async (period = 'all') => {
    setStatsLoading(true);
    try {
      const response = await suppliersAPI.getTotalInventoryPurchases(period);
      setTotalInventoryPurchases(response.total_purchases || 0);
      setTotalInvoicesCount(response.total_invoices || 0);
      return response;
    } catch (err) {
      console.error('Failed to fetch total inventory purchases:', err);
      setTotalInventoryPurchases(0);
      setTotalInvoicesCount(0);
      return null;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch supplier summary (invoice count + total purchases) for card display
  const fetchSupplierSummary = useCallback(async (supplierId, period = 'all', forceRefresh = false) => {
    if (!supplierId) {
      setSelectedSupplierSummary({
        total_invoices: 0,
        total_purchases: 0,
        last_purchase_date: null,
        loading: false,
        error: 'No supplier selected'
      });
      return null;
    }

    // Check cache first (unless force refresh)
    const cacheKey = `${supplierId}_${period}`;
    if (!forceRefresh && supplierSummariesCache[cacheKey]) {
      setSelectedSupplierSummary({
        ...supplierSummariesCache[cacheKey],
        loading: false,
        error: null
      });
      return supplierSummariesCache[cacheKey];
    }

    setSelectedSupplierSummary(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await suppliersAPI.getSupplierSummary(supplierId, period);
      
      const summaryData = {
        total_invoices: response.total_invoices || 0,
        total_purchases: response.total_purchases || 0,
        last_purchase_date: response.last_purchase_date,
        supplier_name: response.supplier_name,
        period: period
      };
      
      // Update cache
      setSupplierSummariesCache(prev => ({
        ...prev,
        [cacheKey]: summaryData
      }));
      
      setSelectedSupplierSummary({
        ...summaryData,
        loading: false,
        error: null
      });
      
      return summaryData;
    } catch (err) {
      console.error('Failed to fetch supplier summary:', err);
      const errorMsg = err.response?.data?.error?.message || 'Failed to load supplier purchases';
      setSelectedSupplierSummary({
        total_invoices: 0,
        total_purchases: 0,
        last_purchase_date: null,
        loading: false,
        error: errorMsg
      });
      return null;
    }
  }, [supplierSummariesCache]);

  // Legacy method - kept for compatibility (maps to new summary)
  const fetchSupplierPurchases = useCallback(async (supplierId, period = 'all') => {
    const summary = await fetchSupplierSummary(supplierId, period);
    return {
      total_purchases: summary?.total_purchases || 0,
      invoice_count: summary?.total_invoices || 0,
      last_purchase_date: summary?.last_purchase_date
    };
  }, [fetchSupplierSummary]);

  // Fetch summaries for multiple suppliers (for dashboard overview)
  const fetchMultipleSupplierSummaries = useCallback(async (supplierIds, period = 'all') => {
    if (!supplierIds || supplierIds.length === 0) return [];
    
    try {
      const response = await suppliersAPI.getBulkSupplierSummary(supplierIds, period);
      // Update cache for each supplier
      const newCacheEntries = {};
      (response.summaries || []).forEach(summary => {
        const cacheKey = `${summary.supplier_id}_${period}`;
        newCacheEntries[cacheKey] = {
          total_invoices: summary.total_invoices,
          total_purchases: summary.total_purchases,
          last_purchase_date: summary.last_purchase_date,
          supplier_name: summary.supplier_name
        };
      });
      
      setSupplierSummariesCache(prev => ({
        ...prev,
        ...newCacheEntries
      }));
      
      return response.summaries || [];
    } catch (err) {
      console.error('Failed to fetch bulk supplier summaries:', err);
      return [];
    }
  }, []);

  const createSupplier = async (supplierData) => {
    try {
      const newSupplier = await suppliersAPI.create(supplierData);
      await fetchSuppliers();
      return { success: true, data: newSupplier };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error?.message || 'Failed to create supplier' 
      };
    }
  };

  const updateSupplier = async (supplierID, supplierData) => {
    try {
      const updated = await suppliersAPI.update(supplierID, supplierData);
      await fetchSuppliers();
      // Clear cache for this supplier
      setSupplierSummariesCache(prev => {
        const newCache = { ...prev };
        Object.keys(newCache).forEach(key => {
          if (key.startsWith(`${supplierID}_`)) {
            delete newCache[key];
          }
        });
        return newCache;
      });
      // Refresh summary if this is the selected supplier
      if (selectedSupplierSummary.supplier_name) {
        await fetchSupplierSummary(supplierID, selectedSupplierSummary.period || 'all', true);
      }
      return { success: true, data: updated };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error?.message || 'Failed to update supplier' 
      };
    }
  };

  const deleteSupplier = async (supplierID) => {
    try {
      await suppliersAPI.delete(supplierID);
      await fetchSuppliers();
      // Clear cache for this supplier
      setSupplierSummariesCache(prev => {
        const newCache = { ...prev };
        Object.keys(newCache).forEach(key => {
          if (key.startsWith(`${supplierID}_`)) {
            delete newCache[key];
          }
        });
        return newCache;
      });
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error?.message || 'Failed to delete supplier' 
      };
    }
  };

  // Refresh all data for current supplier
  const refreshCurrentSupplier = useCallback(async (supplierId, period = 'all') => {
    if (supplierId) {
      await Promise.all([
        fetchSupplierSummary(supplierId, period, true),
        fetchTotalInventoryPurchases(period)
      ]);
    }
  }, [fetchSupplierSummary, fetchTotalInventoryPurchases]);

  // Change period and refresh data
  const changePeriod = useCallback(async (supplierId, period) => {
    await refreshCurrentSupplier(supplierId, period);
  }, [refreshCurrentSupplier]);

  useEffect(() => {
    fetchSuppliers(initialParams);
    fetchTotalInventoryPurchases();
  }, []);

  return {
    suppliers,
    loading,
    error,
    pagination,
    selectedSupplierSummary,
    totalInventoryPurchases,
    totalInvoicesCount,  
    statsLoading,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    fetchSupplierPurchases,
    fetchSupplierSummary,
    fetchTotalInventoryPurchases,
    fetchMultipleSupplierSummaries,
    refreshCurrentSupplier,
    changePeriod,

    // Cache management
    clearSupplierCache: () => setSupplierSummariesCache({}), // Clear all cached summaries
  };
};
