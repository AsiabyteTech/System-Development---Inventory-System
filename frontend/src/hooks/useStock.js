import { useState, useEffect, useCallback } from 'react';
import { stockAPI } from '../api/stock';
import { handleApiError, displayError } from '../utils/errorHandler';

export const useStock = () => {
    const [stock, setStock] = useState([]);
    const [availableStock, setAvailableStock] = useState([]);
    const [reservedStock, setReservedStock] = useState([]);
    const [loading, setLoading] = useState({ stock: true, available: false, reserved: false });
    const [error, setError] = useState(null);

    // Get all stock
    const fetchStock = useCallback(async (params = {}) => {
        setLoading(prev => ({ ...prev, stock: true }));
        try {
            const response = await stockAPI.getAll(params);
            setStock(response.items || response.data || []);
            setError(null);
        } catch (err) {
            const errorObj = handleApiError(err);
            setError(errorObj);
            displayError(errorObj);
        } finally {
            setLoading(prev => ({ ...prev, stock: false }));
        }
    }, []);

    // Get available stock (for inventory check)
    const fetchAvailableStock = useCallback(async (sku = null) => {
        setLoading(prev => ({ ...prev, available: true }));
        try {
            const response = await stockAPI.getAvailable(sku);
            setAvailableStock(response.items || response.data || []);
            return response;
        } catch (err) {
            const errorObj = handleApiError(err);
            setError(errorObj);
            displayError(errorObj);
            return null;
        } finally {
            setLoading(prev => ({ ...prev, available: false }));
        }
    }, []);

    // Get available stock for a specific SKU (for Inventory page)
    const getAvailableStock = useCallback(async (sku) => {
        try {
            const response = await stockAPI.getAvailable(sku);
            return {
                sku: sku,
                available_quantity: response.available_quantity || 0,
                details: response,
            };
        } catch (err) {
            const errorObj = handleApiError(err);
            displayError(errorObj);
            return { sku, available_quantity: 0, error: errorObj };
        }
    }, []);

    // Get reserved stock
    const fetchReservedStock = useCallback(async () => {
        setLoading(prev => ({ ...prev, reserved: true }));
        try {
            const response = await stockAPI.getReserved();
            setReservedStock(response.items || response.data || []);
        } catch (err) {
            const errorObj = handleApiError(err);
            setError(errorObj);
            displayError(errorObj);
        } finally {
            setLoading(prev => ({ ...prev, reserved: false }));
        }
    }, []);

    // Reserve stock for order
    const reserveStock = useCallback(async (orderId, items) => {
        try {
            const response = await stockAPI.reserve(orderId, items);
            return response;
        } catch (err) {
            const errorObj = handleApiError(err);
            displayError(errorObj);
            throw errorObj;
        }
    }, []);

    // Release stock (for cancelled orders)
    const releaseStock = useCallback(async (reservationId) => {
        try {
            const response = await stockAPI.release(reservationId);
            return response;
        } catch (err) {
            const errorObj = handleApiError(err);
            displayError(errorObj);
            throw errorObj;
        }
    }, []);

    // Fulfill reservation
    const fulfillReservation = useCallback(async (reservationId, trackingNumber) => {
        try {
            const response = await stockAPI.fulfill(reservationId, trackingNumber);
            return response;
        } catch (err) {
            const errorObj = handleApiError(err);
            displayError(errorObj);
            throw errorObj;
        }
    }, []);

    // Manual stock adjustment
    const adjustStock = useCallback(async (sku, quantity, type, reason) => {
        try {
            const response = await stockAPI.adjust(sku, quantity, type, reason);
            await fetchStock(); // Refresh stock list
            return response;
        } catch (err) {
            const errorObj = handleApiError(err);
            displayError(errorObj);
            throw errorObj;
        }
    }, [fetchStock]);

    // Initial load
    useEffect(() => {
        fetchStock();
        fetchAvailableStock();
    }, []);

    return {
        // Data
        stock,
        availableStock,
        reservedStock,
        
        // Loading states
        loading,
        
        // Error
        error,
        
        // Actions
        fetchStock,
        fetchAvailableStock,
        getAvailableStock,      
        fetchReservedStock,
        reserveStock,
        releaseStock,
        fulfillReservation,
        adjustStock,
    };
};

export default useStock;
