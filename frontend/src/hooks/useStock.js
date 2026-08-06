// Stock data fetching — unit-level stock records (one row per physical unit)

import { useState, useEffect, useCallback } from 'react';
import { stockAPI } from '../api/stock';

export const useStock = (initialParams = {}) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map one backend stock record to the shape the UI expects
  const mapStock = (item) => ({
    id: item.id || item.stock_id || item.SerialNumber,
    sku: item.SKU || item.sku,
    serialNumber: item.SerialNumber || item.serial_number || item.serialNumber,
    refNo: item.RefNo || item.ref_no || item.refNo,
    stockIn: item.StockIn || item.stock_in || item.stockIn,
    stockOut: item.StockOut || item.stock_out || item.stockOut,
    trackingNumber: item.TrackingNumber || item.tracking_number || item.trackingNumber,
    status: item.Stat || item.status || 'AVAILABLE',
    orderId: item.OrderId || item.order_id,
    purchaseCost: item.PurchaseCost || item.purchase_cost,
    promoId: item.PromoId || item.promo_id,
    packageId: item.PackageId || item.package_id,
    remark: item.Remark || item.remark,
  });

  const fetchStocks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockAPI.getAll({ ...initialParams, ...params });
      const stockData = response.data || response.stocks || [];
      setStocks(stockData.map(mapStock));
    } catch (err) {
      console.error('Failed to fetch stocks:', err);
      setError(err.response?.data?.error?.message || err.message || 'Failed to load stocks');
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Unit-record CRUD (stock-in a new unit, correct a record, remove a mis-entry) ---

  /*const createStock = async (stockData) => {
    try {
      const created = await stockAPI.create(stockData);
      await fetchStocks();
      return { success: true, data: created };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || err.message || 'Failed to create stock record' };
    }
  };

  const updateStock = async (id, stockData) => {
    try {
      const updated = await stockAPI.update(id, stockData);
      await fetchStocks();
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || err.message || 'Failed to update stock record' };
    }
  };

  const deleteStock = async (id) => {
    try {
      await stockAPI.delete(id);
      await fetchStocks();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || err.message || 'Failed to delete stock record' };
    }
  };*/

  // --- Inventory-movement operations (status transitions on existing units) ---

  const reserveStock = async (orderId, items) => {
    try {
      const result = await stockAPI.reserve(orderId, items);
      await fetchStocks();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || err.message || 'Failed to reserve stock' };
    }
  };

  const releaseStock = async (reservationId) => {
    try {
      const result = await stockAPI.release(reservationId);
      await fetchStocks();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || err.message || 'Failed to release reservation' };
    }
  };

  // Fulfill a reservation — moves a unit to stock-out/sold and records the tracking number
  const fulfillStock = async (reservationId, trackingNumber) => {
    try {
      const result = await stockAPI.fulfill(reservationId, trackingNumber);
      await fetchStocks();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || err.message || 'Failed to fulfill reservation' };
    }
  };

  // Manual quantity adjustment (returns, loss, found units, etc.)
  const adjustStock = async (sku, quantity, type, reason) => {
    try {
      const result = await stockAPI.adjust(sku, quantity, type, reason);
      await fetchStocks();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || err.message || 'Failed to adjust stock' };
    }
  };

  useEffect(() => {
    fetchStocks(initialParams);
  }, []);

  return {
    stocks,
    loading,
    error,
    fetchStocks,
    //createStock,
    //updateStock,
    //deleteStock,
    reserveStock,
    releaseStock,
    fulfillStock,
    adjustStock,
  };
};
