import apiClient from './client';
import { productsAPI } from './products';
import { stockAPI } from './stock';
import { ordersAPI } from './orders';
import { promoPackageAPI } from './promo_package';

export const inventoryAPI = {
    /**
     * Real-time inventory view 
     * Combines product, stock, and order data
     */
    getRealTimeInventory: async (params = {}) => {
        // Fetch all data in parallel
        const [products, availableStock, reservedStock, pendingOrders] = await Promise.all([
            productsAPI.getAll({ limit: 999 }),
            stockAPI.getAvailable(),
            stockAPI.getReserved(),
            ordersAPI.getAll({ status: 'pending,processing,packing', limit: 999 }),
        ]);

        // Transform into inventory view
        const inventoryItems = products.items.map(product => {
            const available = availableStock.find(s => s.sku === product.sku)?.available_quantity || 0;
            const reserved = reservedStock.find(s => s.sku === product.sku)?.reserved_quantity || 0;
            const pendingForProduct = pendingOrders.items?.filter(order => 
                order.items?.some(item => item.sku === product.sku)
            ).length || 0;

            return {
                sku: product.sku,
                product_name: product.product_name,
                product_type: product.product_type,
                product_image: product.product_image,
                quantity_on_hand: product.quantity_on_hand,
                available_stock: available,
                reserved_stock: reserved,
                pending_orders: pendingForProduct,
                low_stock_threshold: product.low_stock_threshold || 5,
                is_low_stock: available < (product.low_stock_threshold || 5),
                current_avg_cost: product.current_avg_cost,
                current_stock_value: product.current_stock_value,
            };
        });

        return {
            items: inventoryItems,
            total_products: products.total,
            total_stock_value: inventoryItems.reduce((sum, i) => sum + (i.current_stock_value || 0), 0),
            total_available_stock: inventoryItems.reduce((sum, i) => sum + i.available_stock, 0),
            total_reserved_stock: inventoryItems.reduce((sum, i) => sum + i.reserved_stock, 0),
            last_updated: new Date().toISOString(),
        };
    },

    /**
     * Get inventory by location (if multi-warehouse)
     * @param {string} locationId - Warehouse location ID
     */
    getInventoryByLocation: async (locationId) => {
        const response = await apiClient.get(`/inventory/location/${locationId}`);
        return response.data;
    },

    /**
     * Get inventory movement history
     * @param {Object} params - { from_date, to_date, sku, type }
     */
    getInventoryMovement: async (params = {}) => {
        const response = await apiClient.get('/inventory/movements', { params });
        return response.data;
    },

    /**
     * Get low stock alerts (for dashboard notification)
     * @param {number} threshold - Custom threshold (default: 5)
     */
    getLowStockAlerts: async (threshold = 5) => {
        const inventory = await inventoryAPI.getRealTimeInventory();
        const lowStockItems = inventory.items.filter(item => item.is_low_stock);
        
        return {
            count: lowStockItems.length,
            items: lowStockItems,
            recommended_reorder: lowStockItems.map(item => ({
                sku: item.sku,
                product_name: item.product_name,
                current_stock: item.available_stock,
                recommended_order: Math.max(10, item.available_stock * 2),
            })),
        };
    },
};

export default inventoryAPI;
