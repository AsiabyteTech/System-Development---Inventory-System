// Product data fetching

import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../api/products';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll({ ...pagination, ...params });
      setProducts(response.data || response.items || []);
      setPagination({
        page: response.page || 1,
        total: response.total || 0,
        limit: response.limit || 20,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (productData) => {
    try {
      const newProduct = await productsAPI.create(productData);
      await fetchProducts(); // Refresh list
      return newProduct;
    } catch (err) {
      throw err;
    }
  };

  const updateProduct = async (sku, productData) => {
    try {
      const updated = await productsAPI.update(sku, productData);
      await fetchProducts();
      return updated;
    } catch (err) {
      throw err;
    }
  };

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
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};