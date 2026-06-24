// P&L Reports

import apiClient from './client';
//import { REPORT_ENDPOINTS } from '../constants/apiEndpoints';

// Helper to transform P&L data
const transformPnLData = (data) => {
    if (!data) return null;

    return {
        period: data.period || {},
        costing_method: data.costing_method || 'WEIGHTED_AVERAGE',
        summary: {
            total_revenue: data.summary?.total_revenue || 0,
            total_cogs: data.summary?.total_cogs || 0,
            gross_profit: data.summary?.gross_profit || 0,
            gross_margin_percentage: data.summary?.gross_margin_percentage || 0,
            operating_expenses: data.summary?.operating_expenses || 0,
            net_income: data.summary?.net_income || 0,
        },
        breakdown_by_product: data.breakdown_by_product || [],
        breakdown_by_supplier: data.breakdown_by_supplier || [],
        monthly_breakdown: data.monthly || data.breakdown_by_month || [],
        cost_flow_summary: data.cost_flow_summary || null,
    };
};

// Helper to transform Order Volume Report data
const transformOrderVolumeReport = (data) => {
    if (!data) return { items: [], total: 0, summary: {} };

    return {
        items: data.items || data.orders || data.data || [],
        total: data.total || data.items?.length || 0,
        summary: {
            total_orders: data.summary?.total_orders || data.total || 0,
            total_order_value: data.summary?.total_order_value || 0,
            average_order_value: data.summary?.average_order_value || 0,
        },
        period: data.period || {},
    };
};

// Helper to transform Inventory Value Report data
const transformInventoryValueReport = (data) => {
    if (!data) return { items: [], total_value: 0, summary: {} };

    return {
        items: data.items || data.stocks || data.data || [],
        total_value: data.total_value || data.summary?.total_value || 0,
        summary: {
            total_products: data.summary?.total_products || 0,
            total_stock_units: data.summary?.total_stock_units || 0,
            average_value_per_unit: data.summary?.average_value_per_unit || 0,
        },
        period: data.period || {},
    };
};

export const reportsAPI = {
    /**
     * Get Profit & Loss Report
     * @param {Object} params - { from_date, to_date, interval, location_id }
     */
    getPnL: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/v1/reports/pnl', { params });
            return transformPnLData(response.data);
        } catch (error) {
            console.error('Failed to fetch P&L report:', error);
            return null;
        }
    },

    /**
     * Get Order Volume Report (for ReportOrder.jsx)
     * @param {Object} params - { from_date, to_date, month, year, platform, sku, status }
     */
    getOrderVolumeReport: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/v1/reports/order-volume', { params });
            return transformOrderVolumeReport(response.data);
        } catch (error) {
            console.error('Failed to fetch order volume report:', error);
            return { items: [], total: 0, summary: {} };
        }
    },

    /**
     * Get Inventory Value Report (for ReportProductValue.jsx)
     * @param {Object} params - { from_date, to_date, month, year, sku, product_type }
     */
    getInventoryValueReport: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/v1/reports/inventory-value', { params });
            return transformInventoryValueReport(response.data);
        } catch (error) {
            console.error('Failed to fetch inventory value report:', error);
            return { items: [], total_value: 0, summary: {} };
        }
    },

    /**
     * Get detailed order volume report with filters (ReportOrder.jsx) component
     * @param {Object} filters - { month, year, sku, status }
     */
    getOrderReport: async (filters = {}) => {
        const { month, year, sku, status } = filters;
        
        // Build query parameters
        const params = {};
        if (month && year) {
            params.from_date = `${year}-${month}-01`;
            // Calculate end date based on month
            const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
            params.to_date = `${year}-${month}-${lastDay}`;
        }
        if (sku) params.sku = sku;
        if (status) params.status = status;

        return reportsAPI.getOrderVolumeReport(params);
    },

    /**
     * Get detailed inventory value report with filters (ReportProductValue.jsx) component
     * @param {Object} filters - { month, year, sku, product_type }
     */
    getInventoryReport: async (filters = {}) => {
        const { month, year, sku, product_type } = filters;
        
        // Build query parameters
        const params = {};
        if (month && year) {
            params.from_date = `${year}-${month}-01`;
            const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
            params.to_date = `${year}-${month}-${lastDay}`;
        }
        if (sku) params.sku = sku;
        if (product_type) params.product_type = product_type;

        return reportsAPI.getInventoryValueReport(params);
    },

    /**
     * Get Inventory Valuation (current stock value)
     * Used for balance sheet reporting
     */
    getInventoryValuation: async () => {
        try {
            const response = await apiClient.get(REPORT_ENDPOINTS.INVENTORY_VALUATION);
            return {
                total_value: response.data?.total_value || 0,
                by_product: response.data?.by_product || [],
                by_category: response.data?.by_category || [],
                as_of_date: response.data?.as_of_date || new Date().toISOString(),
            };
        } catch (error) {
            console.error('Failed to fetch inventory valuation:', error);
            return { total_value: 0, by_product: [], by_category: [], as_of_date: null };
        }
    },

    /**
     * Export report as CSV/PDF
     * @param {string} reportType - 'pnl', 'order-volume', 'inventory-value'
     * @param {Object} params - filter parameters
     * @param {string} format - 'csv' or 'pdf'
     */
    exportReport: async (reportType, params = {}, format = 'csv') => {
        try {
            const response = await apiClient.get(`/reports/${reportType}/export`, {
                params: { ...params, format },
                responseType: 'blob',
            });
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${reportType}_report_${new Date().toISOString()}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            return { success: true };
        } catch (error) {
            console.error('Failed to export report:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Print report helper - opens print dialog
     * @param {string} elementId - ID of element to print
     */
    printReport: (elementId) => {
        const printContent = document.getElementById(elementId);
        if (printContent) {
            const originalTitle = document.title;
            document.title = 'Inventory Report';
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>AsiaByte Inventory Report</title>
                        <link rel="stylesheet" href="/src/styles/App.css">
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            @media print {
                                body { margin: 0; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                        ${printContent.innerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
            printWindow.close();
            
            document.title = originalTitle;
        }
    },
};

// Helper function to format P&L data for display (used by frontend components)
export const formatPnLForDisplay = (data) => {
    if (!data) return null;

    return {
        summary: [
            { label: 'Total Revenue', value: data.summary?.total_revenue || 0, type: 'revenue' },
            { label: 'Cost of Goods Sold (COGS)', value: data.summary?.total_cogs || 0, type: 'cost' },
            { label: 'Gross Profit', value: data.summary?.gross_profit || 0, type: 'profit' },
            { label: 'Gross Margin', value: `${data.summary?.gross_margin_percentage || 0}%`, type: 'percentage' },
            { label: 'Operating Expenses', value: data.summary?.operating_expenses || 0, type: 'cost' },
            { label: 'Net Income', value: data.summary?.net_income || 0, type: 'profit' },
        ],
        productBreakdown: data.breakdown_by_product || [],
        monthlyTrend: data.monthly_breakdown || [],
        costingMethod: data.costing_method,
    };
};

export default reportsAPI;