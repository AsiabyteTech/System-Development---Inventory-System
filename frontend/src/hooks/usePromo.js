// Promotion data fetching

import { useState, useEffect, useCallback } from 'react';
import { promoAPI } from '../api/promo';

export const usePromo = (initialParams = {}) => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromos = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await promoAPI.getAll({ ...initialParams, ...params });
      setPromos(response.data || response.items || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load promotions');
    } finally {
      setLoading(false);
    }
  }, []);

  const getPromo = async (promoId) => {
    try {
      const data = await promoAPI.getByPromoId(promoId);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error?.message || 'Failed to load promotion' };
    }
  };

  const createPromo = async (promoData) => {
    try {
      const created = await promoAPI.create(promoData);
      await fetchPromos();
      return { success: true, data: created };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || err.response?.data?.error?.message || 'Failed to create promotion',
      };
    }
  };

  const updatePromo = async (promoId, promoData) => {
    try {
      const updated = await promoAPI.update(promoId, promoData);
      await fetchPromos();
      return { success: true, data: updated };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || err.response?.data?.error?.message || 'Failed to update promotion',
      };
    }
  };

  const deletePromo = async (promoId) => {
    try {
      await promoAPI.delete(promoId);
      await fetchPromos();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || err.message || 'Failed to delete promotion',
      };
    }
  };

  // Get promos that apply to the given SKU(s) — used by Inventory's
  // "Promotions & Packages" section
  const getApplicablePromos = async (skus) => {
    if (!skus || skus.length === 0) return { success: true, data: [] };
    try {
      const response = await promoAPI.getApplicablePromos(skus);
      return { success: true, data: response.data || response.items || response || [] };
    } catch (err) {
      return {
        success: false,
        data: [],
        error: err.response?.data?.error?.message || 'Failed to load applicable promotions',
      };
    }
  };

  useEffect(() => {
    fetchPromos(initialParams);
  }, []);

  return {
    promos,
    loading,
    error,
    fetchPromos,
    getPromo,
    createPromo,
    updatePromo,
    deletePromo,
    getApplicablePromos,
  };
};
