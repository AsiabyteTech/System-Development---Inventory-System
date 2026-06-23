import apiClient from './client';
import { STOCK_ENDPOINTS } from '../constants/apiEndpoints';
import promoAPI from './promo';
import packageAPI from './package';

export const stockAPI = {
    /**
     * Get all stock units
     * @param {Object} params - { page, limit, sku, status, promo_id, package_id }
     */
    getAll: async (params = {}) => {
        const response = await apiClient.get(STOCK_ENDPOINTS.BASE, { params });
        return response.data;
    },

    /**
     * Get available stock (not reserved)
     * @param {string} sku - SKU filter
     */
    getAvailable: async (sku = null) => {
        const params = sku ? { sku } : {};
        const response = await apiClient.get(STOCK_ENDPOINTS.AVAILABLE, { params });
        return response.data;
    },

    // Get reserved stock
    getReserved: async () => {
        const response = await apiClient.get(STOCK_ENDPOINTS.RESERVED);
        return response.data;
    },

    /**
     * Get stock by serial number
     * @param {string} serialNumber - Unique serial number
     */
    getBySerialNumber: async (serialNumber) => {
        const response = await apiClient.get(STOCK_ENDPOINTS.GET_BY_SERIAL(serialNumber));
        return response.data;
    },

    create: async (stockData) => {
        const payload = {
            serial_number: stockData.serial_number,
            sku: stockData.sku,
            ref_no: stockData.ref_no,        // From invoice dropdown
            order_id: stockData.order_id,     // From order dropdown
            purchase_cost: stockData.purchase_cost,
            promo_id: stockData.selected_promo_id,
            package_id: stockData.selected_package_id,
            remark: stockData.remark,
        };
        
        const response = await apiClient.post(STOCK_ENDPOINTS.BASE, payload);
        return response.data;
    },

    /**
     * PROMO/PACKAGE DROPDOWN FUNCTION
     * Get available promo/package options for a specific SKU in Stock page
     * Flow: User selects SKU → This function returns applicable promos/packages → Dropdown populated
     * @param {string} sku - Product SKU
     */
    getApplicablePromosAndPackagesForSKU: async (sku) => {
        if (!sku) return { promos: [], packages: [] };
        
        // Fetch all active promos and packages
        const [allPromos, allPackages] = await Promise.all([
            promoAPI.getAll({ is_active: true, limit: 999 }),
            packageAPI.getAll({ is_active: true, limit: 999 }),
        ]);
        
        // Filter promos that apply to this SKU
        const applicablePromos = (allPromos.items || allPromos || []).filter(promo => {
            // If promo has no specific products, it applies to all
            if (!promo.product_skus || promo.product_skus.length === 0) return true;
            return promo.product_skus.includes(sku);
        });
        
        // Filter packages that include this SKU
        const applicablePackages = [];
        const packagesList = allPackages.items || allPackages || [];
        
        for (const pkg of packagesList) {
            const products = await packageAPI.getPackageProducts(pkg.id);
            const includesSKU = (products.items || products || []).some(p => p.sku === sku);
            if (includesSKU) {
                applicablePackages.push(pkg);
            }
        }
        
        // Format for dropdown
        const formatPromoForDropdown = (promo) => ({
            id: promo.id,
            name: promo.promo_name,
            type: 'promo',
            reduction: promo.reduction,
            reduction_type: promo.reduction_type || 'percentage',
            new_price: promo.price,
            dateline: promo.dateline,
            description: `${promo.reduction}% OFF → RM ${promo.price}`,
        });
        
        const formatPackageForDropdown = (pkg) => ({
            id: pkg.id,
            name: pkg.package_name,
            type: 'package',
            price: pkg.price,
            dateline: pkg.dateline,
            description: `Bundle: RM ${pkg.price}`,
        });
        
        return {
            promos: applicablePromos.map(formatPromoForDropdown),
            packages: applicablePackages.map(formatPackageForDropdown),
        };
    },

    /**
     * Reserve stock with promo/package applied
     * Called when user selects a promo/package from dropdown and confirms
     */
    reserveWithPromoOrPackage: async (orderId, items, appliedPromoId = null, appliedPackageId = null) => {
        let finalItems = [...items];
        
        // If package is applied, expand to individual products
        if (appliedPackageId) {
            const packageProducts = await packageAPI.getPackageProducts(appliedPackageId);
            finalItems = [];
            for (const pkgProduct of packageProducts.items || packageProducts || []) {
                finalItems.push({
                    sku: pkgProduct.sku,
                    quantity: pkgProduct.quantity * (items[0]?.quantity || 1),
                    package_id: appliedPackageId,
                });
            }
        }
        
        // Apply promo discount calculation
        let discountMultiplier = 1;
        if (appliedPromoId) {
            const promo = await promoAPI.getById(appliedPromoId);
            if (promo.reduction_type === 'percentage') {
                discountMultiplier = 1 - (promo.reduction / 100);
            }
        }
        
        const response = await apiClient.post(STOCK_ENDPOINTS.RESERVE, {
            order_id: orderId,
            items: finalItems,
            promo_id: appliedPromoId,
            package_id: appliedPackageId,
            discount_multiplier: discountMultiplier,
        });
        
        return response.data;
    },

    /**
     * Release a reservation (cancellation)
     * @param {string} customerId - Reservation ID
     */
    release: async (customerId) => {
        const response = await apiClient.post(STOCK_ENDPOINTS.RELEASE, {
            reservation_id: customerId,
        });
        return response.data;
    },

    /**
     * Fulfill reservation (move to actual stock out)
     * @param {string} customerId - Reservation ID
     * @param {string} trackingNumber - Order tracking number
     */
    fulfill: async (customerId, trackingNumber) => {
        const response = await apiClient.post(STOCK_ENDPOINTS.FULFILL, {
            customer_id: customerId,
            tracking_number: trackingNumber,
        });
        return response.data;
    },

    /**
     * Manual stock adjustment (Admin only)
     * @param {string} sku - Product SKU
     * @param {number} quantity - Quantity to adjust
     * @param {string} type - 'RETURN_GOOD', 'RETURN_DAMAGED', 'LOSS', 'FOUND'
     * @param {string} reason - Adjustment reason
     */
    adjust: async (sku, quantity, type, reason) => {
        const response = await apiClient.post(STOCK_ENDPOINTS.ADJUST, {
            sku,
            quantity: Math.abs(quantity),
            adjustment_type: type,
            reason,
        });
        return response.data;
    },

    /**
     * Get available promo/package dropdown options from Add Edit Promo/Package page
     * @param {string} sku - Product SKU to check applicable promos/packages
     */
    getApplicablePromosAndPackages: async (sku = null) => {
        const [promos, packages] = await Promise.all([
            getAllPromos(),
            getAllPackages(),
        ]);
        
        let applicablePromos = promos;
        let applicablePackages = packages;
        
        // Filter by SKU if provided
        if (sku) {
            applicablePromos = promos.filter(promo => 
                !promo.product_skus || promo.product_skus.includes(sku)
            );
            
            applicablePackages = packages.filter(pkg => 
                !pkg.product_skus || pkg.product_skus.includes(sku)
            );
        }
        
        // Format for dropdown
        const formatForDropdown = (items, type) => items.map(item => ({
            id: item.id,
            name: item.name,
            type: type,
            value: type === 'promo' ? item.reduction : item.price,
            original_value: type === 'promo' ? 'Discount' : 'Bundle',
            applicable_skus: item.product_skus || [],
        }));
        
        return {
            promos: formatForDropdown(applicablePromos, 'promo'),
            packages: formatForDropdown(applicablePackages, 'package'),
        };
    },
};

// Create promo in AddEditPromo.jsx and package in AddEditPackage.jsx then in 
// stock page for choosen sku (promo/package) will available dropdown section 
const getAllPromos = async () => {
    try {
        const response = await apiClient.get('/promotion');
        return response.data.items || response.data || [];
    } catch (error) {
        console.error('Failed to fetch promos:', error);
        return [];
    }
};

const getAllPackages = async () => {
    try {
        const response = await apiClient.get('/package');
        return response.data.items || response.data || [];
    } catch (error) {
        console.error('Failed to fetch packages:', error);
        return [];
    }
};

const getPackageProducts = async (packageId) => {
    try {
        const response = await apiClient.get(`/package/${packageId}/products`);
        return response.data.items || response.data || [];
    } catch (error) {
        console.error('Failed to fetch package products:', error);
        return [];
    }
};

const getPromoDetails = async (promoId) => {
    try {
        const response = await apiClient.get(`/promotion/${promoId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch promo details:', error);
        return null;
    }
};

export default stockAPI;
