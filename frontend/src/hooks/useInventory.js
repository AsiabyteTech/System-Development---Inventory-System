import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../api/products';
import { stockAPI } from '../api/stock';
import { ordersAPI } from '../api/orders';
import { promoAPI } from '../api/promo';
import { packageAPI } from '../api/package';
import { handleApiError, displayError } from '../utils/errorHandler';
import { formatCurrency, formatStockStatus } from '../utils/formatters';

export const useInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [availablePromos, setAvailablePromos] = useState([]);
    const [availablePackages, setAvailablePackages] = useState([]);
    const [stockMovements, setStockMovements] = useState([]);
    const [loading, setLoading] = useState({
        inventory: true,
        details: false,
        movements: false,
    });
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState({
        total_products: 0,
        total_stock_value: 0,
        total_available_stock: 0,
        total_reserved_stock: 0,
        low_stock_count: 0,
    });

    /**
     * Fetch complete real-time inventory
     * Combines product, stock, order, promo, and package data
     */
    const fetchInventory = useCallback(async (filters = {}) => {
        setLoading(prev => ({ ...prev, inventory: true }));
        try {
            // Fetch all data in parallel
            const [products, availableStock, reservedStock, pendingOrders, allPromos, allPackages] = await Promise.all([
                productsAPI.getAll({ limit: 999, ...filters }),
                stockAPI.getAvailable(),
                stockAPI.getReserved(),
                ordersAPI.getAll({ status: 'pending,processing,packing', limit: 999 }),
                promoAPI.getAll({ is_active: true, limit: 999 }),
                packageAPI.getAll({ is_active: true, limit: 999 }),
            ]);

            // Build inventory items with all relationships
            const inventoryItems = (products.items || products || []).map(product => {
                const available = availableStock.find(s => s.sku === product.sku)?.available_quantity || 0;
                const reserved = reservedStock.find(s => s.sku === product.sku)?.reserved_quantity || 0;
                
                // Find applicable promos for this product
                const applicablePromos = (allPromos.items || allPromos || []).filter(promo => {
                    if (!promo.product_skus || promo.product_skus.length === 0) return true;
                    return promo.product_skus.includes(product.sku);
                });
                
                // Find packages that include this product
                const applicablePackages = (allPackages.items || allPackages || []).filter(pkg => 
                    pkg.product_skus?.includes(product.sku)
                );
                
                // Calculate effective price with best available promo
                let effectivePrice = product.initial_selling_price;
                let bestPromo = null;
                
                for (const promo of applicablePromos) {
                    let discountedPrice = effectivePrice;
                    if (promo.reduction_type === 'percentage') {
                        discountedPrice = effectivePrice * (1 - promo.reduction / 100);
                    } else if (promo.reduction_type === 'fixed') {
                        discountedPrice = Math.max(0, effectivePrice - promo.reduction);
                    }
                    if (discountedPrice < effectivePrice) {
                        effectivePrice = discountedPrice;
                        bestPromo = promo;
                    }
                }
                
                // Get stock status
                const stockStatus = formatStockStatus(available);
                
                return {
                    sku: product.sku,
                    product_name: product.product_name,
                    product_type: product.product_type,
                    product_image: product.product_image,
                    quantity_on_hand: product.quantity_on_hand,
                    available_stock: available,
                    reserved_stock: reserved,
                    original_price: product.initial_selling_price,
                    effective_price: effectivePrice,
                    current_avg_cost: product.current_avg_cost,
                    current_stock_value: product.current_stock_value,
                    margin: product.margin,
                    status: product.status,
                    stock_status: stockStatus.status,
                    stock_badge_class: stockStatus.badgeClass,
                    applicable_promos: applicablePromos.map(p => ({
                        id: p.id,
                        name: p.promo_name,
                        reduction: p.reduction,
                        reduction_type: p.reduction_type,
                        new_price: p.price,
                    })),
                    applicable_packages: applicablePackages.map(p => ({
                        id: p.id,
                        name: p.package_name,
                        price: p.price,
                    })),
                    is_low_stock: available < (product.low_stock_threshold || 5),
                    last_updated: new Date().toISOString(),
                };
            });
            
            // Calculate summary
            const totalStockValue = inventoryItems.reduce((sum, i) => sum + (i.current_stock_value || 0), 0);
            const totalAvailable = inventoryItems.reduce((sum, i) => sum + i.available_stock, 0);
            const totalReserved = inventoryItems.reduce((sum, i) => sum + i.reserved_stock, 0);
            const lowStockCount = inventoryItems.filter(i => i.is_low_stock).length;
            
            setInventory(inventoryItems);
            setSummary({
                total_products: inventoryItems.length,
                total_stock_value: totalStockValue,
                total_available_stock: totalAvailable,
                total_reserved_stock: totalReserved,
                low_stock_count: lowStockCount,
            });
            setError(null);
            
        } catch (err) {
            const errorObj = handleApiError(err);
            setError(errorObj);
            displayError(errorObj);
        } finally {
            setLoading(prev => ({ ...prev, inventory: false }));
        }
    }, []);

    /**
     * Get product details with promos and packages
     * @param {string} sku - Product SKU
     */
    fetchProductDetails = useCallback(async (sku) => {
        setLoading(prev => ({ ...prev, details: true }));
        try {
            const [product, promos, packages, stockInfo] = await Promise.all([
                productsAPI.getBySKU(sku),
                stockAPI.getApplicablePromosAndPackagesForSKU(sku),
                packageAPI.getAll({ limit: 999 }),
                stockAPI.getAvailable(sku),
            ]);
            
            // Find packages that include this product
            const allPackages = packages.items || packages || [];
            const productPackages = [];
            for (const pkg of allPackages) {
                const pkgProducts = await packageAPI.getPackageProducts(pkg.id);
                if ((pkgProducts.items || pkgProducts || []).some(p => p.sku === sku)) {
                    productPackages.push(pkg);
                }
            }
            
            const productDetail = {
                ...product,
                available_stock: stockInfo.available_quantity || 0,
                applicable_promos: promos.promos,
                applicable_packages: productPackages.map(p => ({
                    id: p.id,
                    name: p.package_name,
                    price: p.price,
                    products: p.product_skus,
                })),
            };
            
            setSelectedProduct(productDetail);
            setAvailablePromos(promos.promos);
            setAvailablePackages(productPackages);
            
            return productDetail;
        } catch (err) {
            const errorObj = handleApiError(err);
            setError(errorObj);
            displayError(errorObj);
            return null;
        } finally {
            setLoading(prev => ({ ...prev, details: false }));
        }
    }, []);

    /**
     * Get stock movement history for a product
     * @param {string} sku - Product SKU
     * @param {Object} params - { from_date, to_date, limit }
     */
    fetchStockMovements = useCallback(async (sku, params = {}) => {
        setLoading(prev => ({ ...prev, movements: true }));
        try {
            const response = await stockAPI.getStockMovements(sku, params);
            setStockMovements(response.items || response || []);
            return response;
        } catch (err) {
            const errorObj = handleApiError(err);
            displayError(errorObj);
            return null;
        } finally {
            setLoading(prev => ({ ...prev, movements: false }));
        }
    }, []);

    /**
     * Apply promo to a product (for stock page dropdown selection)
     * @param {string} sku - Product SKU
     * @param {number} promoId - Promotion ID
     */
    applyPromoToProduct = useCallback(async (sku, promoId) => {
        try {
            const promo = await promoAPI.getById(promoId);
            const product = await productsAPI.getBySKU(sku);
            
            // Calculate new price
            let newPrice = product.initial_selling_price;
            if (promo.reduction_type === 'percentage') {
                newPrice = newPrice * (1 - promo.reduction / 100);
            } else if (promo.reduction_type === 'fixed') {
                newPrice = Math.max(0, newPrice - promo.reduction);
            }
            
            // Update inventory with new effective price
            setInventory(prev => prev.map(item => 
                item.sku === sku 
                    ? { ...item, effective_price: newPrice }
                    : item
            ));
            
            return { success: true, new_price: newPrice };
        } catch (err) {
            const errorObj = handleApiError(err);
            displayError(errorObj);
            return { success: false, error: errorObj };
        }
    }, []);

    /**
     * Get low stock alerts for dashboard
     * @param {number} threshold - Custom threshold (default: 5)
     */
    getLowStockAlerts = useCallback(async (threshold = 5) => {
        if (inventory.length === 0) {
            await fetchInventory();
        }
        
        const lowStockItems = inventory.filter(item => item.available_stock < threshold);
        
        return {
            count: lowStockItems.length,
            items: lowStockItems,
            recommended_reorder: lowStockItems.map(item => ({
                sku: item.sku,
                product_name: item.product_name,
                current_stock: item.available_stock,
                recommended_order: Math.max(threshold * 2, item.available_stock * 2),
                estimated_cost: item.current_avg_cost * Math.max(threshold * 2, item.available_stock * 2),
            })),
        };
    }, [inventory, fetchInventory]);

    /**
     * Export inventory report
     * @param {string} format - 'csv' or 'pdf'
     */
    exportInventoryReport = useCallback(async (format = 'csv') => {
        try {
            const response = await apiClient.get('/reports/inventory/export', {
                params: { format },
                responseType: 'blob',
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `inventory_report_${new Date().toISOString()}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            return { success: true };
        } catch (err) {
            const errorObj = handleApiError(err);
            displayError(errorObj);
            return { success: false, error: errorObj };
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    return {
        // Data
        inventory,
        selectedProduct,
        availablePromos,
        availablePackages,
        stockMovements,
        summary,
        
        // Loading states
        loading,
        isLoading: Object.values(loading).some(Boolean),
        
        // Error
        error,
        
        // Actions
        fetchInventory,
        fetchProductDetails,
        fetchStockMovements,
        applyPromoToProduct,
        getLowStockAlerts,
        exportInventoryReport,
        
        // Helpers
        formatCurrency,
        formatStockStatus: (stockLevel) => formatStockStatus(stockLevel).status,
        getStockBadgeClass: (stockLevel) => formatStockStatus(stockLevel).badgeClass,
    };
};

export default useInventory;
