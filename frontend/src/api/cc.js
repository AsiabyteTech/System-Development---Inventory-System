import { DASHBOARD_ENDPOINTS } from '../constants/apiEndpoints';
            const response = await apiClient.get(DASHBOARD_ENDPOINTS.METRICS);
            const response = await apiClient.get(DASHBOARD_ENDPOINTS.LOW_STOCK, { params });
            const response = await apiClient.get(DASHBOARD_ENDPOINTS.ORDER_VOLUME, { params });

import { REPORT_ENDPOINTS } from '../constants/apiEndpoints';
            const response = await apiClient.get(REPORT_ENDPOINTS.PNL, { params });
            const response = await apiClient.get(REPORT_ENDPOINTS.ORDER_VOLUME, { params });
            const response = await apiClient.get(REPORT_ENDPOINTS.INVENTORY_VALUE, { params });
            const response = await apiClient.get(REPORT_ENDPOINTS.INVENTORY_VALUATION);
            const response = await apiClient.get(`/reports/${reportType}/export`, {  });

import { INVOICE_ENDPOINTS } from '../constants/apiEndpoints';
        const response = await apiClient.get(INVOICE_ENDPOINTS.BASE, { params });
        const response = await apiClient.get(`/invoice/${refNo}`);
        const response = await apiClient.post(INVOICE_ENDPOINTS.BASE, formData, { });
        const response = await apiClient.put(`/invoice/${refNo}`, invoiceData);
        const response = await apiClient.delete(`/invoice/${refNo}`);
        const response = await apiClient.get(`${INVOICE_ENDPOINTS.BASE}/stats`);
        const response = await apiClient.get(`${INVOICE_ENDPOINTS.BASE}/suppliers`);




