// Package data fetching

import { useState, useEffect, useCallback } from 'react';
import { packageAPI } from '../api/package';

export const usePackage = (initialParams = {}) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await packageAPI.getAll({ ...initialParams, ...params });
      setPackages(response.data || response.items || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  }, []);

  const getPackage = async (packageId) => {
    try {
      const data = await packageAPI.getById(packageId);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error?.message || 'Failed to load package' };
    }
  };

  const createPackage = async (packageData) => {
    try {
      const created = await packageAPI.create(packageData);
      await fetchPackages();
      return { success: true, data: created };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || err.response?.data?.error?.message || 'Failed to create package',
      };
    }
  };

  const updatePackage = async (packageId, packageData) => {
    try {
      const updated = await packageAPI.update(packageId, packageData);
      await fetchPackages();
      return { success: true, data: updated };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || err.response?.data?.error?.message || 'Failed to update package',
      };
    }
  };

  const deletePackage = async (packageId) => {
    try {
      await packageAPI.delete(packageId);
      await fetchPackages();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || err.message || 'Failed to delete package',
      };
    }
  };

  const getPackageProducts = async (packageId) => {
    try {
      const data = await packageAPI.getPackageProducts(packageId);
      return { success: true, data: data.items || data.data || data || [] };
    } catch (err) {
      return { success: false, data: [], error: err.response?.data?.error?.message || 'Failed to load package products' };
    }
  };

  // Get packages that apply to the given SKU(s) — used by Inventory's
  // "Promotions & Packages" section
  const getApplicablePackages = async (skus) => {
    if (!skus || skus.length === 0) return { success: true, data: [] };
    try {
      const response = await packageAPI.getApplicablePackages(skus);
      return { success: true, data: response.data || response.items || response || [] };
    } catch (err) {
      return {
        success: false,
        data: [],
        error: err.response?.data?.error?.message || 'Failed to load applicable packages',
      };
    }
  };

  useEffect(() => {
    fetchPackages(initialParams);
  }, []);

  return {
    packages,
    loading,
    error,
    fetchPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage,
    getPackageProducts,
    getApplicablePackages,
  };
};
