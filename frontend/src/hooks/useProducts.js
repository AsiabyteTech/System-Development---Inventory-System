// Product data fetching

import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../api/products';
import { stockAPI } from '../api/stock';

export const useProducts = (initialParams = {}) => {
  // --- Single-page (server-side pagination) state — kept for any other consumers ---
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });
  const [summary, setSummary] = useState({ total_products: 0, total_margin: 0 });

  // --- Full-catalog state (fetches every page, merges stock, dedupes by SKU) ---
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  // --- Shared state ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Display card summary (backend summary endpoint)
  const fetchSummary = useCallback(async () => {
    try {
      const data = await productsAPI.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  }, []);

  // List a single page of products (server-side pagination)
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

  // Map one backend product record to the shape the UI expects
  const mapProduct = (item, stockCountBySku) => {
    const sku = item.SKU || item.sku || '';
    return {
      id: item.id || item.SKU || item.sku || `prod-${Math.random().toString(36).substr(2, 9)}`,
      sku,
      productName: item.ProductName || item.product_name || item.productName || '',
      type: item.ProductType || item.product_type || item.type || '',
      productDetails: item.ProductDetail || item.description || item.productDetails || '',
      vendorPrice: item.InitialVendorPrice || item.cost_price || item.vendorPrice || 0,
      sellingPrice: item.InitialSellingPrice || item.selling_price || item.sellingPrice || 0,
      margin: item.Margin || item.margin || 0,
      status: item.Stat || item.status || 'ACTIVE',
      staffId: item.StaffID || item.staff_id || item.staffId || '',
      quantityOnHand: item.QuantityOnHand || stockCountBySku[sku] || 0,
      reservedQuantity: item.ReservedQuantity || 0,
      currentAvgCost: item.CurrentAvgCost || 0,
      currentStockValue: item.CurrentStockValue || 0,
      image: item.product_image || item.image || null,
    };
  };

  // Fetch EVERY product across all backend pages, merge in stock counts, dedupe by SKU.
  // This replaces the manual pagination loop that used to live inside Product.jsx.
  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let all = [];
      let page = 1;
      const pageSize = 100;
      let hasMore = true;

      while (hasMore) {
        const response = await productsAPI.getAll({ page, limit: pageSize });
        const pageData =
          response?.items ||
          response?.data?.items ||
          (Array.isArray(response?.data) ? response.data : null) ||
          (Array.isArray(response) ? response : []);

        if (!pageData || pageData.length === 0) {
          hasMore = false;
        } else {
          all = [...all, ...pageData];
          if (pageData.length < pageSize) hasMore = false;
          page++;
        }
      }

      // Merge in stock counts (AVAILABLE units per SKU)
      let stockCountBySku = {};
      try {
        const stockResponse = await stockAPI.getAll();
        const stockData = stockResponse.data || stockResponse.stocks || [];
        stockData.forEach((item) => {
          const sku = item.SKU || item.sku;
          if (!sku) return;
          if (!stockCountBySku[sku]) stockCountBySku[sku] = 0;
          const status = item.Stat || item.status || '';
          if (status.toUpperCase() === 'AVAILABLE') stockCountBySku[sku]++;
        });
      } catch (stockErr) {
        console.warn('Could not fetch stock data:', stockErr);
      }

      const mapped = all.map((item) => mapProduct(item, stockCountBySku));

      // Dedupe by SKU
      const seen = new Set();
      const unique = mapped.filter((p) => {
        if (seen.has(p.sku)) return false;
        seen.add(p.sku);
        return true;
      });

      setAllProducts(unique);
      setTotalProductsCount(unique.length);
      setTotalPages(Math.ceil(unique.length / itemsPerPage) || 1);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch all products:', err);
      let errorMsg = 'Failed to load products. ';
      if (err.response?.status === 422) errorMsg += 'Invalid request parameters. Please check the API configuration.';
      else if (err.response?.status === 404) errorMsg += 'Product endpoint not found. Please check if the backend is running.';
      else if (err.response?.status === 500) errorMsg += 'Server error. Please check backend logs.';
      else if (err.code === 'ERR_NETWORK') errorMsg += 'Network error. Please check if the backend server is running.';
      else errorMsg += err.message || 'Please try again.';
      setError(errorMsg);
      setAllProducts([]);
      setTotalProductsCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  // Change page (client-side slice of allProducts)
  const goToPage = useCallback((page) => {
    setCurrentPage((prev) => {
      if (page < 1) return prev;
      return page;
    });
  }, []);

  // Change items-per-page and recompute total pages
  const changeItemsPerPage = useCallback((newPerPage) => {
    setItemsPerPage(newPerPage);
    setTotalPages(Math.ceil(allProducts.length / newPerPage) || 1);
    setCurrentPage(1);
  }, [allProducts.length]);

  // Derived: current page slice of the full catalog
  const displayedProducts = allProducts.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  );

  // Derived totals across the FULL catalog (not just the current page)
  const totalMargin = allProducts.reduce((sum, p) => sum + (parseFloat(p.margin) || 0), 0);
  const totalStockValue = allProducts.reduce((sum, p) => sum + (parseFloat(p.currentStockValue) || 0), 0);

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
      await fetchAllProducts();
      return newProduct;
    } catch (err) {
      throw err;
    }
  };

  // Update product (Admin only)
  const updateProduct = async (sku, productData) => {
    try {
      const updated = await productsAPI.update(sku, productData);
      await fetchAllProducts();
      return updated;
    } catch (err) {
      throw err;
    }
  };

  // Delete product (Admin only)
  const deleteProduct = async (sku) => {
    try {
      await productsAPI.delete(sku);
      await fetchAllProducts();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return {
    // Single-page API (kept for any other consumers of this hook)
    products,
    pagination,
    summary,
    fetchProducts,
    fetchSummary,

    // Full-catalog API (used by Product.jsx)
    allProducts,
    displayedProducts,
    currentPage,
    totalPages,
    itemsPerPage,
    totalProductsCount,
    totalMargin,
    totalStockValue,
    fetchAllProducts,
    goToPage,
    changeItemsPerPage,

    // Shared
    loading,
    error,
    getProductStock,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
