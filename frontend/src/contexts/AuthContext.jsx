// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, fetchUserProfile, registerUser, registerUserAlt, forgotPassword, resetPassword } from '../api/api.js';

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
                    
                    if (userData) {
                        localStorage.setItem('user', JSON.stringify(userData));
                        const role = userData.role?.toLowerCase() === 'administrator' ? 'admin' : 'staff';
                        localStorage.setItem('role', role);
                        localStorage.setItem('userRole', role);
                        if (userData.email) localStorage.setItem('email', userData.email);
                        if (userData.name) localStorage.setItem('userName', userData.name);
                        if (userData.staff_id) localStorage.setItem('staffId', userData.staff_id);
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        const savedUser = localStorage.getItem('user');
                        if (savedUser) {
                            try {
                                setUser(JSON.parse(savedUser));
                            } catch (e) {
                                console.error('Invalid user data in localStorage');
                            }
                        }
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
            
            if (response?.access_token) {
                setToken(response.access_token);
                localStorage.setItem('token', response.access_token);
                
                if (response.refresh_token) {
                    localStorage.setItem('refresh_token', response.refresh_token);
                }
                
                let userData = response.user;
                
                if (!userData && response.access_token) {
                    try {
                        userData = await fetchUserProfile(response.access_token);
                    } catch (profileError) {
                        console.warn('Could not fetch profile, using minimal data');
                        userData = { 
                            email: email,
                            role: 'staff',
                            name: email.split('@')[0]
                        };
                    }
                }
                
                if (userData) {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    
                    const userName = userData.name || email.split('@')[0];
                    localStorage.setItem('userName', userName);
                    
                    const role = userData.role?.toLowerCase() === 'administrator' ? 'admin' : 'staff';
                    localStorage.setItem('role', role);
                    localStorage.setItem('userRole', role);
                    
                    localStorage.setItem('email', userData.email || email);
                    localStorage.setItem('userEmail', userData.email || email);
                    
                    if (userData.staff_id) {
                        localStorage.setItem('staffId', userData.staff_id);
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

    // UPDATED: Register without staffId
    const register = async (fullName, email, password) => {
        try {
            const userData = {
                name: fullName,
                email: email,
                password: password,
                role: "STAFF"
                // staffId is NOT sent - backend will generate it
            };
            
            console.log('Registering user with data:', userData);
            
            let response;
            try {
                response = await registerUser(userData);
            } catch (firstError) {
                console.warn('Primary registration failed, trying alternative:', firstError.message);
                try {
                    response = await registerUserAlt(userData);
                } catch (secondError) {
                    console.error('Both registration endpoints failed');
                    throw secondError;
                }
            }
            
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