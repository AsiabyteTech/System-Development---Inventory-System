// Dashboard metrics

import apiClient from './client';
// import { DASHBOARD_ENDPOINTS } from '../constants/apiEndpoints';

// Helper to transform dashboard data from backend to frontend format
const transformMetrics = (data) => {
    return {
        total_products: data.total_products || 0,
        total_orders: data.total_orders || 0,
        total_inventory_value: data.total_inventory_value || 0,
        total_product_value: data.total_product_value || data.total_inventory_value || 0,
        low_stock_count: data.low_stock_count || 0,
    };
};

const transformOrderVolume = (data) => {
    // Transform backend data to format expected by BarChart
    // Backend: [{ sku: "EZ-C8C-2MP", order_count: 28 }, ...]
    // Frontend expects: [{ name: "EZ-C8C-2MP", orders: 28 }, ...]
    if (Array.isArray(data)) {
        return data.map(item => ({
            name: item.sku || item.product_name || item.name,
            orders: item.order_count || item.total_orders || item.orders || 0,
            product_id: item.product_id,
        }));
    }
    return [];
};

const transformInventoryValue = (data) => {
    // Transform backend data to format expected by LineChart
    // Backend: [{ sku: "EZ-C8C-2MP", total_value: 260 }, ...]
    // Frontend expects: [{ name: "EZ-C8C-2MP", price: 260 }, ...]
    if (Array.isArray(data)) {
        return data.map(item => ({
            name: item.sku || item.product_name || item.name,
            price: item.total_value || item.current_value || item.value || 0,
            product_id: item.product_id,
        }));
    }
    return [];
};

const transformLowStock = (data) => {
    // Transform backend data to format expected by Traffic Light Table
    // Backend: [{ sku, product_name, current_stock, reserved_stock, ... }]
    // Frontend expects: [{ id, image, sku, level, status }, ...]
    if (Array.isArray(data)) {
        return data.map(item => ({
            id: item.sku || item.id,
            sku: item.sku,
            product_name: item.product_name,
            level: item.current_stock || item.quantity_on_hand || 0,
            status: getStockStatusText(item.current_stock || item.quantity_on_hand || 0),
            image: item.image_url || '/Pictures/placeholder.png',
        }));
    }
    return [];
};

const getStockStatusText = (stockLevel) => {
    if (stockLevel <= 0) return 'Out';
    if (stockLevel < 5) return 'Low';
    if (stockLevel < 10) return 'Initial Stock';
    return 'Good';
};

export const dashboardAPI = {
    /**
     * Get dashboard metrics (cards data)
     * Returns: total_orders, low_stock_count, total_inventory_value, total_products
     */
    getMetrics: async () => {
        try {
            const response = await apiClient.get('/api/v1/dashboard/metrics');
            return transformMetrics(response.data);
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
            // Return default values on error
            return {
                total_products: 0,
                total_orders: 0,
                total_inventory_value: 0,
                total_product_value: 0,
                low_stock_count: 0,
            };
        }
    },

    /**
     * Get order volume data for bar chart
     * @param {Object} params - { product_id, platform, month, year }
     */
    getOrderVolume: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/v1/dashboard/order-volume', { params });
            return {
                data: transformOrderVolume(response.data?.items || response.data || []),
                total: response.data?.total || 0,
                summary: response.data?.summary || null,
            };
        } catch (error) {
            console.error('Failed to fetch order volume:', error);
            return { data: [], total: 0, summary: null };
        }
    },

    /**
     * Get inventory value data for line chart
     * @param {Object} params - { product_id, month, year, category }
     */
    getInventoryValue: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/v1/dashboard/inventory-value', { params });
            return {
                data: transformInventoryValue(response.data?.items || response.data || []),
                total_value: response.data?.total_value || 0,
                summary: response.data?.summary || null,
            };
        } catch (error) {
            console.error('Failed to fetch inventory value:', error);
            return { data: [], total_value: 0, summary: null };
        }
    },

    /**
     * Get low stock items for traffic light table
     * @param {Object} params - { status, product, page, limit }
     */
    getLowStock: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/v1/dashboard/low-stock', { params });
            return {
                items: transformLowStock(response.data?.items || response.data || []),
                total: response.data?.total || 0,
            };
        } catch (error) {
            console.error('Failed to fetch low stock items:', error);
            return { items: [], total: 0 };
        }
    },

    /**
     * Get packages data for dashboard table
     */
    getPackages: async () => {
        try {
            const response = await apiClient.get('/api/v1/package', { params });
            return response.data?.items || response.data || [];
        } catch (error) {
            console.error('Failed to fetch packages:', error);
            return [];
        }
    },

    /**
     * Get promotions data for dashboard table
     */
    getPromotions: async () => {
        try {
            const response = await apiClient.get('/api/v1/promotion', { params });
            return response.data?.items || response.data || [];
        } catch (error) {
            console.error('Failed to fetch promotions:', error);
            return [];
        }
    },

    /**
     * Get all dashboard data in one request (for initial load)
     */
    getAllDashboardData: async (filters = {}) => {
        try {
            const [metrics, orderVolume, inventoryValue, lowStock, packages, promotions] = await Promise.all([
                dashboardAPI.getMetrics(),
                dashboardAPI.getOrderVolume(filters.orderVolume || {}),
                dashboardAPI.getInventoryValue(filters.inventoryValue || {}),
                dashboardAPI.getLowStock(filters.lowStock || {}),
                dashboardAPI.getPackages(),
                dashboardAPI.getPromotions(),
            ]);

            return {
                metrics,
                orderVolume: orderVolume.data,
                orderVolumeTotal: orderVolume.total,
                inventoryValue: inventoryValue.data,
                inventoryTotalValue: inventoryValue.total_value,
                lowStockItems: lowStock.items,
                lowStockTotal: lowStock.total,
                packages,
                promotions,
            };
        } catch (error) {
            console.error('Failed to fetch all dashboard data:', error);
            throw error;
        }
    },

    /**
     * Helper: Get status badge class for frontend
     */
    getStatusBadgeClass: (status) => {
        switch (status) {
            case 'Good':
                return 'bg-green-50 text-green-700';
            case 'Low':
                return 'bg-yellow-50 text-yellow-700';
            case 'Out':
                return 'bg-red-50 text-red-700';
            case 'Initial Stock':
                return 'bg-blue-50 text-blue-700';
            default:
                return 'bg-green-50 text-green-700';
        }
    },

    /**
     * Helper: Get stock level and status for product
     */
    getStockStatus: (stockLevel) => {
        if (stockLevel <= 0) return { status: 'Out', color: '#dc3545', badgeClass: 'bg-red-50 text-red-700' };
        if (stockLevel < 5) return { status: 'Low', color: '#ffc107', badgeClass: 'bg-yellow-50 text-yellow-700' };
        if (stockLevel < 10) return { status: 'Initial Stock', color: '#17a2b8', badgeClass: 'bg-blue-50 text-blue-700' };
        return { status: 'Good', color: '#28a745', badgeClass: 'bg-green-50 text-green-700' };
    },
};

export default dashboardAPI;