import { useState, useEffect, useCallback } from 'react';
import ordersAPI from '../api/orders';
import { handleApiError, displayError } from '../utils/errorHandler';

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState({ orders: true, order: false });
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });

    const fetchOrders = useCallback(async (params = {}) => {
        setLoading(prev => ({ ...prev, orders: true }));
        try {
            const response = await ordersAPI.getAll(params);
            setOrders(response.items || response.data || []);
            setPagination({
                page: response.page || 1,
                total: response.total || 0,
                limit: response.limit || 20,
            });
            setError(null);
        } catch (err) {
            const errorObj = handleApiError(err);
            setError(errorObj);
            displayError(errorObj);
        } finally {
            setLoading(prev => ({ ...prev, orders: false }));
        }
    }, []);

    const createOrder = useCallback(async (orderData) => {
        setLoading(prev => ({ ...prev, order: true }));
        try {
            const newOrder = await ordersAPI.create(orderData);
            await fetchOrders();
            return { success: true, order: newOrder };
        } catch (err) {
            const errorObj = handleApiError(err);
            displayError(errorObj);
            return { success: false, error: errorObj };
        } finally {
            setLoading(prev => ({ ...prev, order: false }));
        }
    }, [fetchOrders]);

    const checkInventoryForOrder = useCallback(async (items) => {
        try {
            return await ordersAPI.checkInventoryBeforeOrder(items);
        } catch (err) {
            const errorObj = handleApiError(err);
            displayError(errorObj);
            return null;
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        selectedOrder,
        loading,
        error,
        pagination,
        fetchOrders,
        createOrder,
        checkInventoryForOrder,
    };
};

export default useOrders;
