// Product data fetching

import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../api/products';
import { stockAPI } from '../api/stock';

export const useProducts = (initialParams = {}) => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapProduct = (item, stockCountBySku) => {
    const sku = item.SKU || item.sku || item.product_sku || '';
    const productName = item.ProductName || item.product_name || item.name || item.inventory_name || '';
    const type = item.ProductType || item.product_type || item.type || item.inventory_type || '';
    const description = item.ProductDetail || item.description || item.productDetails || item.inventory_detail || '';
    const vendorPrice = item.InitialVendorPrice || item.vendor_price || item.cost_price || item.vendorPrice || 0;
    const sellingPrice = item.InitialSellingPrice || item.selling_price || item.sellingPrice || 0;
    const margin = item.Margin || item.margin || 0;
    const status = item.Stat || item.status || 'ACTIVE';
    const staffId = item.StaffID || item.staff_id || item.staffId || '';
    const quantityOnHand = item.QuantityOnHand || item.quantity_on_hand || stockCountBySku[sku] || 0;
    const reservedQuantity = item.ReservedQuantity || item.reserved_quantity || 0;
    const currentAvgCost = item.CurrentAvgCost || item.current_avg_cost || 0;
    const currentStockValue = item.CurrentStockValue || item.current_stock_value || 0;
    const image = item.product_image || item.image || item.inventory_image || null;
    const id = item.id || item.ProductID || item.product_id || item.SKU || item.sku || `prod-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      sku,
      productName,
      type,
      productDetails: description,
      vendorPrice: parseFloat(vendorPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      margin: parseFloat(margin) || 0,
      status,
      staffId,
      quantityOnHand: parseInt(quantityOnHand) || 0,
      reservedQuantity: parseInt(reservedQuantity) || 0,
      currentAvgCost: parseFloat(currentAvgCost) || 0,
      currentStockValue: parseFloat(currentStockValue) || 0,
      image,
    };
  };

  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.getAll({ 
        page: currentPage, 
        limit: itemsPerPage 
      });
      
      console.log('Fetching page:', currentPage, 'with limit:', itemsPerPage);
      
      // Extract data from response
      let productsData = [];
      let total = 0;
      
      // Check if response is an object with pagination metadata
      if (response && typeof response === 'object') {
        // Check for different response structures
        
        // Structure 1: { items: [], total: 100 }
        if (response.items && Array.isArray(response.items)) {
          productsData = response.items;
          total = response.total || response.count || productsData.length;
          console.log('Found items array, total:', total);
        }
        // Structure 2: { results: [], count: 100 } (Django REST Framework)
        else if (response.results && Array.isArray(response.results)) {
          productsData = response.results;
          total = response.count || response.total || productsData.length;
          console.log('Found results array, count:', total);
        }
        // Structure 3: { data: { items: [], total: 100 } }
        else if (response.data && response.data.items && Array.isArray(response.data.items)) {
          productsData = response.data.items;
          total = response.data.total || response.data.count || productsData.length;
          console.log('Found data.items array, total:', total);
        }
        // Structure 4: { data: [], total: 100 }
        else if (response.data && Array.isArray(response.data)) {
          productsData = response.data;
          total = response.total || response.count || productsData.length;
          console.log('Found data array, total:', total);
        }
        // Structure 5: Direct array response
        else if (Array.isArray(response)) {
          productsData = response;
          total = response.length;
          console.log('Found direct array, length:', total);
        }
        // Structure 6: Response has a property that's an array
        else {
          for (const key in response) {
            if (Array.isArray(response[key]) && response[key].length > 0) {
              productsData = response[key];
              total = response.total || response.count || response.pagination?.total || productsData.length;
              console.log(`Found array in response.${key}, total:`, total);
              break;
            }
          }
        }
      }
      
      // If we still don't have data, try to find any array in the response
      if (productsData.length === 0 && response && typeof response === 'object') {
        for (const key in response) {
          if (Array.isArray(response[key])) {
            productsData = response[key];
            total = response.total || response.count || productsData.length;
            console.log(`Fallback: Found array in response.${key}`);
            break;
          }
        }
      }
      
      console.log(`Page ${currentPage}: Retrieved ${productsData.length} items out of ${total} total`);
      
      // Merge in stock counts
      let stockCountBySku = {};
      try {
        const stockResponse = await stockAPI.getAll();
        const stockData = stockResponse.data || stockResponse.stocks || [];
        if (Array.isArray(stockData)) {
          stockData.forEach((item) => {
            const sku = item.SKU || item.sku;
            if (!sku) return;
            if (!stockCountBySku[sku]) stockCountBySku[sku] = 0;
            const status = item.Stat || item.status || '';
            if (status.toUpperCase() === 'AVAILABLE') stockCountBySku[sku]++;
          });
        }
      } catch (stockErr) {
        console.warn('Could not fetch stock data:', stockErr);
      }

      // Map the products
      const mapped = productsData.map((item) => mapProduct(item, stockCountBySku));

      // Dedupe by SKU
      const seen = new Set();
      const unique = mapped.filter((p) => {
        if (seen.has(p.sku)) return false;
        seen.add(p.sku);
        return true;
      });

      // Update state
      setAllProducts(unique);
      setTotalProductsCount(total);
      
      // Calculate total pages
      const calculatedTotalPages = Math.ceil(total / itemsPerPage) || 1;
      setTotalPages(calculatedTotalPages);
      
      console.log(`Page ${currentPage}: Mapped ${unique.length} unique products`);
      console.log(`Total pages: ${calculatedTotalPages}`);
      
    } catch (err) {
      console.error('Failed to fetch products:', err);
      let errorMsg = 'Failed to load products. ';
      if (err.response?.status === 404) {
        errorMsg += 'Product endpoint not found. Please check if the backend is running.';
      } else if (err.response?.status === 422) {
        errorMsg += 'Invalid request parameters. Please check the API configuration.';
      } else if (err.response?.status === 500) {
        errorMsg += 'Server error. Please check backend logs.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg += 'Network error. Please check if the backend server is running.';
      } else {
        errorMsg += err.message || 'Please try again.';
      }
      setError(errorMsg);
      setAllProducts([]);
      setTotalProductsCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  const goToPage = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  const changeItemsPerPage = useCallback((newPerPage) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, [currentPage, itemsPerPage]);

  const displayedProducts = allProducts;
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

  const createProduct = async (productData) => {
    try {
      const newProduct = await productsAPI.create(productData);
      await fetchAllProducts();
      return newProduct;
    } catch (err) {
      throw err;
    }
  };

  const updateProduct = async (sku, productData) => {
    try {
      const updated = await productsAPI.update(sku, productData);
      await fetchAllProducts();
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteProduct = async (sku) => {
    try {
      await productsAPI.delete(sku);
      await fetchAllProducts();
    } catch (err) {
      throw err;
    }
  };

  return {
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
    loading,
    error,
    getProductStock,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};