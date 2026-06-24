// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, fetchUserProfile, registerUser } from '../api/api.js';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const userData = await fetchUserProfile(token);
                    setUser(userData);
                    
                    // Update localStorage with user data
                    if (userData) {
                        localStorage.setItem('user', JSON.stringify(userData));
                        const role = userData.role?.toLowerCase() === 'administrator' ? 'admin' : 'staff';
                        localStorage.setItem('role', role);
                        if (userData.email) localStorage.setItem('email', userData.email);
                        //if (userData.staff_id) localStorage.setItem('staffId', userData.staff_id);
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    if (error.response?.status === 401) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };
        
        initAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await loginUser({ email, password });
            
            console.log('Login response in context:', response);
            
            if (response?.access_token) {
                // Store tokens
                setToken(response.access_token);
                localStorage.setItem('token', response.access_token);
                
                if (response.refresh_token) {
                    localStorage.setItem('refresh_token', response.refresh_token);
                }
                
                // Store user data
                let userData = response.user;
                
                // If user data not in response, fetch it separately
                if (!userData && response.access_token) {
                    userData = await fetchUserProfile(response.access_token);
                }
                
                if (userData) {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    
                    // Store additional user info
                    const role = userData.role?.toLowerCase() === 'administrator' ? 'admin' : 'staff';
                    localStorage.setItem('role', role);
                    localStorage.setItem('email', userData.email || email);
                    
                    /*if (userData.staff_id) {
                        localStorage.setItem('staffId', userData.staff_id);
                    }*/
                    if (userData.name) {
                        localStorage.setItem('userName', userData.name);
                    }
                }
                
                return response;
            }
            throw new Error(response?.message || 'No access token received');
        } catch (error) {
            console.error("Login error in context:", error);
            throw error;
        }
    };

    const register = async (fullName, email, staffId, password) => {
        try {
            const userData = {
                name: fullName,
                email: email,
                password: password,
                staffId: staffId,
                role: "STAFF"
            };
            
            const response = await registerUser(userData);
            console.log('Registration response in context:', response);
            
            return response;
        } catch (error) {
            console.error("Registration error in context:", error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        
        // Clear all auth-related localStorage items
        const authKeys = [
            'token', 'refresh_token', 'token_type', 'role', 'staffId', 
            'email', 'user', 'loginRole', 'userRole', 'userName', 
            'googleLogin', 'googleRegister', 'isStaffRegistered'
        ];
        
        authKeys.forEach(key => localStorage.removeItem(key));
        
        navigate('/login');
    };

    const value = {
        token,
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };