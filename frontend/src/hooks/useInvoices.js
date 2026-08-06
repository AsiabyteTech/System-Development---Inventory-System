import { useState, useEffect, useCallback } from 'react';
import { invoicesAPI } from '../api/invoices';

export const useInvoices = (initialParams = {}) => {
  // Invoice states
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });
  
  // Supplier states
  const [suppliers, setSuppliers] = useState([]);

  // Supplier CARDS
  const [stats, setStats] = useState({
    supplier_count: 0,
    total_inventory_value: 0,
    total_invoices: 0,
    average_invoice_value: 0,
    loading: true,
  });
  
  // Product states
  const [products, setProducts] = useState([]);

  const [statsLoading, setStatsLoading] = useState(false);
  
  // Stock/Serial Number states
  const [stockItems, setStockItems] = useState([]);
  const [checkingSerial, setCheckingSerial] = useState(false);

  // ============ INVOICE METHODS ============
  const fetchInvoices = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await invoicesAPI.getAll({ ...pagination, ...params });
      setInvoices(response.data || response.items || []);
      setPagination({
        page: response.page || 1,
        total: response.total || 0,
        limit: response.limit || 20,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, []);

  const createInvoice = async (invoiceData, stockItems) => {
    try {
      const newInvoice = await invoicesAPI.create(invoiceData, stockItems);
      await fetchInvoices();
      await fetchInvoiceStats();
      await fetchSuppliers();
      return { success: true, data: newInvoice };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error?.message || 'Failed to create invoice' 
      };
    }
  };

  const updateInvoice = async (referenceNo, invoiceData) => {
    try {
      const updated = await invoicesAPI.update(referenceNo, invoiceData);
      await fetchInvoices();
      await fetchInvoiceStats();
      return { success: true, data: updated };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error?.message || 'Failed to update invoice' 
      };
    }
  };

  const deleteInvoice = async (referenceNo) => {
    try {
      await invoicesAPI.delete(referenceNo);
      await fetchInvoices();
      await fetchInvoiceStats();
      await fetchSuppliers();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error?.message || 'Failed to delete invoice' 
      };
    }
  };

  // ============ SUPPLIER METHODS ============

  // INVOICE STATS FOR CARDS
  const fetchInvoiceStats = useCallback(async () => {
    setStats(prev => ({ ...prev, loading: true }));
    try {
      const response = await invoicesAPI.getInvoiceStats();
      if (response.success) {
        setStats({
          supplier_count: response.supplier_count,
          total_inventory_value: response.total_inventory_value,
          total_invoices: response.total_invoices,
          average_invoice_value: response.average_invoice_value,
          loading: false,
        });
      } else {
        setStats(prev => ({ 
          ...prev, 
          loading: false, 
          error: response.error 
        }));
      }
    } catch (err) {
      setStats(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.response?.data?.error?.message || 'Failed to load stats' 
      }));
    }
  }, []);

  const fetchSuppliers = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await invoicesAPI.getSuppliers();
      setSuppliers(response.data || response.items || []);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
      setSuppliers([]);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ============ PRODUCT METHODS ============
  const fetchProducts = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await invoicesAPI.getProducts();
      setProducts(response.data || response.items || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (sku) => {
    setStatsLoading(true);
    try {
      const response = await invoicesAPI.getProductsBySKU(sku);
      return response.data || response.items || [];
    } catch (err) {
      console.error('Failed to search products:', err);
      return [];
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ============ STOCK METHODS ============
  const fetchInvoiceItems = useCallback(async (refNo) => {
    try {
      const response = await invoicesAPI.getInvoiceItems(refNo);
      setStockItems(response.items || []);
      return response;
    } catch (err) {
      console.error('Failed to fetch invoice items:', err);
      return { items: [], total_value: 0, total_stock_units: 0 };
    }
  }, []);

  const checkSerialNumber = useCallback(async (serialNumber) => {
    setCheckingSerial(true);
    try {
      const response = await invoicesAPI.checkSerialNumber(serialNumber);
      return {
        exists: response.exists || false,
        data: response.data || null,
      };
    } catch (err) {
      console.error('Failed to check serial number:', err);
      return { exists: false, data: null, error: err.message };
    } finally {
      setCheckingSerial(false);
    }
  }, []);

  // ============ BARCODE SCAN ============
  const scanBarcode = useCallback(async (serialNumber, referenceNo = null) => {
    setCheckingSerial(true);
    try {
      const result = await invoicesAPI.scanBarcode(serialNumber, referenceNo);
      return result;
    } catch (err) {
      console.error('Barcode scan failed:', err);
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Failed to scan barcode',
        serial_number: serialNumber,
      };
    } finally {
      setCheckingSerial(false);
    }
  }, []);

  // Refresh all invoice data (stats + invoices + suppliers)
  const refreshAllInvoiceData = useCallback(async () => {
    await Promise.all([
      fetchInvoiceStats(),
      fetchInvoices(),
      fetchSuppliers(),
    ]);
  }, [fetchInvoiceStats, fetchInvoices, fetchSuppliers]);

  useEffect(() => {
    refreshAllInvoiceData();
    fetchProducts(); // Load products for dropdown (suppliers/invoices already covered above)
  }, [refreshAllInvoiceData]);

  return {
    // Invoice data
    invoices,
    loading,
    error,
    pagination,
    stats,
    fetchInvoices,
    fetchInvoiceStats,
    refreshAllInvoiceData,
    
    createInvoice,
    updateInvoice,
    deleteInvoice,
    
    statsLoading,
    // Supplier data
    suppliers,
    fetchSuppliers,
    // NOTE: fetchRecentSuppliers / fetchMonthlyPurchaseTotal / recentSuppliers were
    // referenced elsewhere in this hook but never implemented, and invoices.js has
    // no matching API method either. Removed rather than guessing at an endpoint —
    // add them back (with a real invoicesAPI method) if/when that feature is built.
    
    // Product data
    products,
    fetchProducts,
    searchProducts,
    
    // Stock data
    stockItems,
    checkingSerial,
    fetchInvoiceItems,
    checkSerialNumber,
    scanBarcode,  
  };
};
