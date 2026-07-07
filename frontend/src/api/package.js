import { apiClient } from "./api";

export const packageAPI = {
    /**
     * Get all packages
     */
    getAll: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/v1/package', { params });
            return response.data;
        } catch (error) {
            console.error("Get package error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Get single package by ID
     */
    getById: async (id) => {
        try {
            const response = await apiClient.get(`/api/v1/package/${id}`);
            return response.data;
        } catch (error) {
            console.error("Get package by ID error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Create new package
     * Matches your table structure: PackageID, PackageName, Dateline, Price, Remark
     */
    create: async (packageData) => {
        try {
            const formData = new FormData();
            
            // Map frontend fields to backend expected fields (matching your table)
            const backendPackage = {
                PackageName: packageData.PackageName || packageData.package_name || packageData.name,
                Dateline: packageData.Dateline || packageData.dateline,
                Price: packageData.Price || packageData.price,
                Remark: packageData.Remark || packageData.remark || '',
            };

            Object.keys(backendPackage).forEach(key => {
                if (backendPackage[key] !== undefined && backendPackage[key] !== null) {
                    formData.append(key, backendPackage[key]);
                }
            });
            
            // If there's an image
            if (packageData.image && packageData.image instanceof File) {
                formData.append('package_image', packageData.image);
            }
            
            const response = await apiClient.post('/api/v1/package', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error("Create package error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Update package
     */
    update: async (id, packageData) => {
        try {
            const formData = new FormData();
            
            const updatePackage = {
                PackageName: packageData.PackageName || packageData.package_name || packageData.name,
                Dateline: packageData.Dateline || packageData.dateline,
                Price: packageData.Price || packageData.price,
                Remark: packageData.Remark || packageData.remark || '',
            };

            Object.keys(updatePackage).forEach(key => {
                if (updatePackage[key] !== undefined && updatePackage[key] !== null) {
                    formData.append(key, updatePackage[key]);
                }
            });

            if (packageData.image && packageData.image instanceof File) {
                formData.append('package_image', packageData.image);
            }

            const response = await apiClient.put(`/api/v1/package/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error("Update package error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Delete package
     */
    delete: async (id) => {
        try {
            const response = await apiClient.delete(`/api/v1/package/${id}`);
            return response.data;
        } catch (error) {
            console.error("Delete package error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Get products in package - FIXED: removed extra { params }
     */
    getPackageProducts: async (id) => {
        try {
            const response = await apiClient.get(`/api/v1/package/${id}/products`);
            return response.data;
        } catch (error) {
            console.error("Get package products error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Get packages that apply to a product (for Order Page dropdown)
     * FIXED: Added /api/v1 prefix
     */
    getApplicablePackages: async (skus) => {
        try {
            const skuParam = Array.isArray(skus) ? skus.join(',') : skus;
            const response = await apiClient.get('/api/v1/package/applicable', {
                params: { skus: skuParam }
            });
            return response.data;
        } catch (error) {
            console.error("Get applicable packages error:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Get products for package dropdown/selection
     */
    getProducts: async () => {
        try {
            const response = await apiClient.get('/api/v1/product');
            return response.data;
        } catch (error) {
            console.error("Get products error:", error.response?.data || error.message);
            throw error;
        }
    }
};

export default packageAPI;