// src/api/api.js
import axios from 'axios';

// Make this configurable for different environments
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
        // Try different possible endpoint structures
        const response = await apiClient.post('/api/v1/auth/login', {
            email: credentials.email,
            password: credentials.password
        });
        
        // Log response for debugging
        console.log('Login response:', response.data);
        
        return response.data;
    } catch (error) {
        console.error("Login API error:", error.response?.data || error.message);
        throw error;
    }
};

// Register user (staff)
const registerUser = async (userData) => {
    try {
        // Map frontend field names to backend expected names
        const payload = {
            name: userData.name,        // Backend expects 'name'
            email: userData.email,
            password: userData.password,
            staff_id: userData.staffId, // Add staff_id if backend needs it
            role: userData.role || "STAFF"
        };
        
        console.log('Registration payload:', payload);
        
        // Try multiple possible endpoints
        let response;
        try {
            response = await apiClient.post('/api/v1/auth/login', payload);
        } catch (err) {
            // Fallback to staff register endpoint
            response = await apiClient.post('/api/v1/staff/register', payload);
        }
        
        console.log('Registration response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Registration API error:", error.response?.data || error.message);
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

// Optional: Test connection function
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

export { loginUser, registerUser, fetchUserProfile, testConnection, apiClient };