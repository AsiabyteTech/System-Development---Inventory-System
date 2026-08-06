// src/api/api.js
import axios from 'axios';

// Make this configurable for different environments
const API_URL = 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for auth tokens
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Handle token refresh if needed
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
                    refresh_token: refreshToken
                });
                
                if (response.data.access_token) {
                    localStorage.setItem('token', response.data.access_token);
                    originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Redirect to login on refresh failure
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Login user
const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post('/api/v1/auth/login', {
            email: credentials.email,
            password: credentials.password
        });
        
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Login API error:", error.response?.data || error.message);
        throw error;
    }
};

// Register user (staff) - FIXED
const registerUser = async (userData) => {
    try {
        const payload = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role || "STAFF"
            // staff_id is omitted - backend will generate it
        };
        
        console.log('Registration payload:', payload);
        const response = await apiClient.post('/api/v1/staff/register', payload);
        console.log('Registration response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Registration API error:", error.response?.data || error.message);
        throw error;
    }
};

// Alternative register endpoint if the above fails
const registerUserAlt = async (userData) => {
    try {
        const payload = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role || "STAFF"
        };
        
        const response = await apiClient.post('/api/v1/staff/register', payload);
        return response.data;
    } catch (error) {
        console.error("Alternative registration failed:", error);
        throw error;
    }
};

// Fetch user profile
const fetchUserProfile = async (token) => {
    try {
        const response = await apiClient.get('/api/v1/staff/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Fetch user profile error:", error.response?.data || error.message);
        throw error;
    }
};

// Test connection function
const testConnection = async () => {
    try {
        const response = await apiClient.get('/health');
        console.log('API connection successful:', response.data);
        return true;
    } catch (error) {
        console.error('API connection failed:', error.message);
        return false;
    }
};

// Forgot password
const forgotPassword = async (email) => {
    try {
        const response = await apiClient.post('/api/v1/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        console.error("Forgot password error:", error.response?.data || error.message);
        throw error;
    }
};

// Reset password
const resetPassword = async (token, newPassword, confirmPassword) => {
    try {
        const response = await apiClient.post('/api/v1/auth/reset-password', {
            token,
            new_password: newPassword,
            confirm_password: confirmPassword
        });
        return response.data;
    } catch (error) {
        console.error("Reset password error:", error.response?.data || error.message);
        throw error;
    }
};

// Validate reset token
const validateResetToken = async (token) => {
    try {
        const response = await apiClient.get('/api/v1/auth/validate-reset-token', {
            params: { token }
        });
        return response.data;
    } catch (error) {
        console.error("Validate token error:", error.response?.data || error.message);
        throw error;
    }
};

export { 
    loginUser, 
    registerUser, 
    registerUserAlt,
    fetchUserProfile, 
    testConnection, 
    forgotPassword,
    resetPassword,
    validateResetToken,
    apiClient 
};