import apiClient from './client';
import { INVOICE_ENDPOINTS } from '../constants/apiEndpoints';

export const invoicesAPI = {
    // ============ INVOICE CRUD ============

    /**
     * List all invoices
     * @param {Object} params - { page, limit, supplier_id, from_date, to_date }
     */
    getAll: async (params = {}) => {
        const response = await apiClient.get(INVOICE_ENDPOINTS.BASE, { params });
        return response.data;
    },

    /**
     * Get invoice by reference number
     * @param {string} refNo - Invoice reference number
     */
    getByRefNo: async (refNo) => {
        const response = await apiClient.get(`/invoice/${refNo}`);
        return response.data;
    },

    create: async (invoiceData, stockItems = []) => {
        const formData = new FormData();
        formData.append('reference_no', invoiceData.reference_no);
        formData.append('supplier_name', invoiceData.supplier_name);
        formData.append('supplier_id', invoiceData.supplier_id || ''); 
        formData.append('invoice_date', invoiceData.invoice_date);
        formData.append('amount', invoiceData.amount);
        formData.append('remark', invoiceData.remark || '');
        
        if (invoiceData.file) {
            formData.append('invoice_file', invoiceData.file);
        }
        
        stockItems.forEach((item, index) => {
            formData.append(`stock[${index}][serial_number]`, item.serial_number);
            formData.append(`stock[${index}][sku]`, item.sku);
            formData.append(`stock[${index}][product_id]`, item.product_id || '');
            formData.append(`stock[${index}][purchase_cost]`, item.purchase_cost);
            formData.append(`stock[${index}][additional_cost]`, item.additional_cost || 0);
        });
        
        const response = await apiClient.post(INVOICE_ENDPOINTS.BASE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        return response.data;
    },

    update: async (refNo, invoiceData) => {
        const response = await apiClient.put(`/invoice/${refNo}`, invoiceData);
        return response.data;
    },

    delete: async (refNo) => {
        const response = await apiClient.delete(`/invoice/${refNo}`);
        return response.data;
    },

    // ============ SUPPLIER METHODS ============

    /**
     * Returns supplier count and total inventory value (sum of all invoices)
     */
    getInvoiceStats: async () => {
        try {
            const response = await apiClient.get(`${INVOICE_ENDPOINTS.BASE}/stats`);
            return {
                success: true,
                supplier_count: response.data.supplier_count || 0,
                total_inventory_value: response.data.total_inventory_value || 0,
                total_invoices: response.data.total_invoices || 0,
                average_invoice_value: response.data.average_invoice_value || 0,
            };
        } catch (error) {
            console.error('Failed to fetch invoice stats:', error);
            return {
                success: false,
                supplier_count: 0,
                total_inventory_value: 0,
                total_invoices: 0,
                average_invoice_value: 0,
                error: error.response?.data?.error?.message || 'Failed to load stats'
            };
        }
    },

    getSuppliers: async () => {
        try {
            const response = await apiClient.get(`${INVOICE_ENDPOINTS.BASE}/suppliers`);
            return {
                success: true,
                suppliers: response.data.suppliers || [],
                count: response.data.count || 0,
            };
        } catch (error) {
            console.error('Failed to fetch suppliers:', error);
            return {
                success: false,
                suppliers: [],
                count: 0,
                error: error.response?.data?.error?.message || 'Failed to load suppliers'
            };
        }
    },

    /*getSuppliers: async () => {
        const response = await apiClient.get('/supplier');
        return response.data;
    },*/

    // ============ PRODUCT METHODS  ============
    /**
     * Get all products for dropdown
     */
    getProducts: async () => {
        const response = await apiClient.get('/product');
        return response.data;
    },

    /**
     * Get products by SKU (for search/filter)
     */
    getProductsBySKU: async (sku) => {
        const response = await apiClient.get(`/product/search`, { params: { sku } });
        return response.data;
    },

    // ============ STOCK METHODS ============
    getInvoiceItems: async (refNo) => {
        const response = await apiClient.get(INVOICE_ENDPOINTS.GET_ITEMS(refNo));
        return {
            items: response.data.items || [],
            total_value: response.data.total_value || 0,
            total_stock_units: response.data.total_stock_units || 0,
        };
    },

    /**
     * Check if serial number already exists
     */
    checkSerialNumber: async (serialNumber) => {
        const response = await apiClient.get('/stock/check-sn', { params: { serial_number: serialNumber } });
        return response.data;
    },

    // ============ BARCODE SCAN ============
    scanBarcode: async (serialNumber, referenceNo = null) => {
        const response = await apiClient.post(INVOICE_ENDPOINTS.SCAN, {
            serial_number: serialNumber,
            reference_no: referenceNo,
        });
        
        return {
            success: true,
            product: response.data.product,
            suggested_cost: response.data.suggested_cost || response.data.last_purchase_price,
            sku: response.data.product.sku,
            product_id: response.data.product.product_id || response.data.product.id,
            serial_number: serialNumber,
            is_duplicate: response.data.is_duplicate || false,
            warning: response.data.warning || null,
        };
    },

    // ============ PURCHASE ORDER MATCHING ============
    matchPurchaseOrder: async (refNo, receivedItems) => {
        const response = await apiClient.post(INVOICE_ENDPOINTS.MATCH(refNo), {
            received_items: receivedItems,
        });
        
        return {
            match_status: response.data.match_status,
            matched_items: response.data.matched_items,
            unmatched_items: response.data.unmatched_items,
            missing_items: response.data.missing_items,
        };
    },

    uploadFile: async (refNo, file) => {
        const formData = new FormData();
        formData.append('invoice_file', file);
        
        const response = await apiClient.post(INVOICE_ENDPOINTS.UPLOAD_FILE(refNo), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        return response.data;
    },
};

export default invoicesAPI;
