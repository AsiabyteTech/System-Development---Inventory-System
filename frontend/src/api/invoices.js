import { apiClient } from "./api";

export const invoicesAPI = {
    /**
     * List all invoices
     * @param {Object} params - { page, limit, supplier_id, from_date, to_date }
     */
    getAll: async (params = { page: 1, limit: 20 }) => {
        try {
            const response = await apiClient.get('/api/v1/invoice', { params });
            return response.data;
        } catch (error) {
            console.error("Get invoices error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Get invoice by reference number
     * @param {string} ref_no - Invoice reference number
     */
    getByRefNo: async (ref_no) => {
        try {
            const response = await apiClient.get(`/api/v1/invoice/${ref_no}`);
            return response.data;
        } catch (error) {
            console.error("Get invoice by reference no error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Create invoice with stock items
     */
    create: async (invoiceData, stockItems = []) => {
        try {
            const formData = new FormData();
            
            // Map frontend fields to backend expected fields
            const backendInvoice = {
                RefNo: invoiceData.reference_no || invoiceData.refNo,
                InvoiceDate: invoiceData.invoice_date || invoiceData.date,
                Amount: invoiceData.amount,
                Remark: invoiceData.remark || '',
                SupplierID: invoiceData.supplier_id,
            };

            Object.keys(backendInvoice).forEach(key => {
                if (backendInvoice[key] !== undefined && backendInvoice[key] !== null) {
                    formData.append(key, backendInvoice[key]);
                }
            });
            
            if (invoiceData.image && invoiceData.image instanceof File) {
                formData.append('invoice_file', invoiceData.image);
            }

            // Add stock items if provided
            if (stockItems && stockItems.length > 0) {
                stockItems.forEach((item, index) => {
                    formData.append(`stock[${index}][serial_number]`, item.serial_number || '');
                    formData.append(`stock[${index}][sku]`, item.sku || '');
                    formData.append(`stock[${index}][product_id]`, item.product_id || '');
                    formData.append(`stock[${index}][purchase_cost]`, item.purchase_cost || 0);
                    formData.append(`stock[${index}][additional_cost]`, item.additional_cost || 0);
                });
            }
            
            const response = await apiClient.post('/api/v1/invoice', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error("Create invoice error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Update invoice
     */
    update: async (ref_no, invoiceData) => {
        try {
            const formData = new FormData();
            
            const updateInvoice = {
                InvoiceDate: invoiceData.invoice_date || invoiceData.date,
                Amount: invoiceData.amount,
                Remark: invoiceData.remark || '',
                SupplierID: invoiceData.supplier_id,
            };

            Object.keys(updateInvoice).forEach(key => {
                if (updateInvoice[key] !== undefined && updateInvoice[key] !== null) {
                    formData.append(key, updateInvoice[key]);
                }
            });

            if (invoiceData.image && invoiceData.image instanceof File) {
                formData.append('invoice_file', invoiceData.image);
            }

            const response = await apiClient.put(`/api/v1/invoice/${ref_no}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error("Update invoice error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Delete invoice
     */
    delete: async (ref_no) => {
        try {
            const response = await apiClient.delete(`/api/v1/invoice/${ref_no}`);
            return response.data;
        } catch (error) {
            console.error("Delete invoice error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Get invoice items (stock items associated with invoice)
     */
    getInvoiceItems: async (ref_no) => {
        try {
            const response = await apiClient.get(`/api/v1/invoice/${ref_no}/items`);
            return {
                items: response.data.items || [],
                total_value: response.data.total_value || 0,
                total_stock_units: response.data.total_stock_units || 0,
            };
        } catch (error) {
            console.error("Get invoice items error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Returns invoice stats (supplier count, total inventory value, etc.)
     * using get
     
    getInvoiceStats: async () => {
        try {
            const response = await apiClient.get('/api/v1/invoice/stats');
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
    },*/

    /**
     * Get all suppliers for dropdown
     */
    getSuppliers: async () => {
        try {
            const response = await apiClient.get('/api/v1/supplier');
            return response.data;
        } catch (error) {
            console.error("Get suppliers error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Get all products for dropdown
     */
    getProducts: async () => {
        try {
            const response = await apiClient.get('/api/v1/product');
            return response.data;
        } catch (error) {
            console.error("Get products error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * from get
     * Get products by SKU (for search/filter) /api/v1/product/search
     */
    getProductsBySKU: async (sku) => {
        try {
            const response = await apiClient.get('/api/v1/product/search', { params: { sku } });
            return response.data;
        } catch (error) {
            console.error("Get products by SKU error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Check if serial number already exists
     */
    checkSerialNumber: async (serialNumber) => {
        try {
            const response = await apiClient.get('/api/v1/stock/{serial_number}', { params: { serial_number: serialNumber } });
            return response.data;
        } catch (error) {
            console.error("Check serial number error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Scan barcode
     */
    scanBarcode: async (serialNumber, referenceNo = null) => {
        try {
            const response = await apiClient.post('/api/v1/invoice/scan', {
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
        } catch (error) {
            console.error("Scan barcode error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Upload invoice file
     */
    uploadFile: async (ref_no, file) => {
        try {
            const formData = new FormData();
            formData.append('invoice_file', file);
            
            const response = await apiClient.post(`/api/v1/invoice/${ref_no}/file`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error("Upload file error:", error.response?.data || error.message);
            throw error;
        }
    },
};

export default invoicesAPI;