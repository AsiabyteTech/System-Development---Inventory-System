// src/UserProfile.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { FiArrowLeft } from 'react-icons/fi';

const UserProfile = () => {
    const navigate = useNavigate();
    const { user, token, loading } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Try to get user from multiple sources
        if (user) {
            setProfileData(user);
        } else if (localStorage.getItem('user')) {
            try {
                const savedUser = JSON.parse(localStorage.getItem('user'));
                setProfileData(savedUser);
            } catch (e) {
                console.error('Failed to parse user data:', e);
            }
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                    <p className="font-semibold">Error loading profile</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">No user data available</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Back button */}
            <button 
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
            >
                <FiArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h2>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                            <span className="text-2xl text-white font-bold">
                                {profileData.name?.[0] || profileData.email?.[0] || 'U'}
                            </span>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-800">
                                {profileData.name || profileData.fullName || 'User'}
                            </p>
                            <p className="text-sm text-gray-600">
                                {profileData.email || 'No email provided'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="font-semibold text-gray-800">
                                {profileData.role || profileData.user_type || 'STAFF'}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Staff ID</p>
                            <p className="font-semibold text-gray-800">
                                {profileData.staff_id || profileData.staffId || profileData.id || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {profileData.created_at && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Member Since</p>
                            <p className="font-semibold text-gray-800">
                                {new Date(profileData.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;