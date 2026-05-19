// Product data fetching

import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../api/products';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ total_products: 0, total_margin: 0 });
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });

  // Display card summary
  const fetchSummary = useCallback(async () => {
    try {
      const data = await productsAPI.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  }, []);
  
  // List all products
  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll({ ...pagination, ...params });
      setProducts(response.items || []);
      setPagination({
        page: response.page || 1,
        total: response.total || 0,
        limit: response.limit || 20,
      });
      setError(null);
      await fetchSummary();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [fetchSummary]);

  const getProductStock = async (sku) => {
    try {
      const stockInfo = await productsAPI.getStockInfo(sku);
      return stockInfo;
    } catch (err) {
      throw err;
    }
  };

  // Create product (Admin only)
  const createProduct = async (productData) => {
    try {
      const newProduct = await productsAPI.create(productData);
      await fetchProducts(); // Refresh list
      return newProduct;
    } catch (err) {
      throw err;
    }
  };

  // Update product (Admin only)
  const updateProduct = async (sku, productData) => {
    try {
      const updated = await productsAPI.update(sku, productData);
      await fetchProducts();
      return updated;
    } catch (err) {
      throw err;
    }
  };

  // Delete product (Admin only)
  const deleteProduct = async (sku) => {
    try {
      await productsAPI.delete(sku);
      await fetchProducts();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts(initialParams);
  }, []);

  return {
    products,
    loading,
    error,
    summary,
    pagination,
    fetchProducts,
    fetchSummary,
    getProductStock,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
