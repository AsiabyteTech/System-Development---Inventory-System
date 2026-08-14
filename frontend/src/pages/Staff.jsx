// Staff Management Page - Admin only

import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useStaff } from '../hooks/useStaff';
import { isAdmin } from "../shared/role";
import Sidebar from '../components/Sidebar';
import '../App.css';
import '../styles/animations.css';

const Staff = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const {
    staff,
    loading,
    error,
    pagination,
    fetchStaff,
    deleteStaff,
    updateStaffRole,
    toggleStaffStatus,
    goToPage,
    changeItemsPerPage,
  } = useStaff();

  // Filter staff based on search term
  const filteredStaff = staff.filter(member => {
    const matchesSearch = searchTerm === '' ||
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.staff_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === '' || member.role === selectedRole;
    const matchesStatus = selectedStatus === '' || 
      (selectedStatus === 'Active' && member.is_active !== false) ||
      (selectedStatus === 'Inactive' && member.is_active === false);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle delete
  const handleDelete = async (staffId, name) => {
    if (window.confirm(`Are you sure you want to delete staff member: ${name}?`)) {
      const result = await deleteStaff(staffId);
      if (result.success) {
        alert('Staff member deleted successfully');
      } else {
        alert(result.error || 'Failed to delete staff member');
      }
    }
  };

  // Handle role change
  const handleRoleChange = async (staffId, newRole) => {
    const result = await updateStaffRole(staffId, newRole);
    if (result.success) {
      alert('Staff role updated successfully');
    } else {
      alert(result.error || 'Failed to update staff role');
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (staffId) => {
    const result = await toggleStaffStatus(staffId);
    if (result.success) {
      alert('Staff status toggled successfully');
    } else {
      alert(result.error || 'Failed to toggle staff status');
    }
  };

  // Get role badge color
  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800';
      case 'STAFF':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    return isActive !== false 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Redirect if not admin
  if (!isAdmin()) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              <h3 className="text-lg font-semibold">Access Denied</h3>
              <p className="text-sm mt-1">You don't have permission to view this page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading staff members...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar />
      <div className='flex-1 min-w-0 ml-16 md:ml-64 transition-all duration-300 overflow-x-hidden'>
        <main className="all-main-content w-full max-w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          
          {/* Page Title Banner */}
          <div className="page-banner flex justify-center items-center mb-4 sm:mb-6 w-full">
            <h2 className="bg-[#00008B] text-white px-6 sm:px-8 md:px-12 py-1.5 sm:py-2 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-md whitespace-nowrap">Staff Management</h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 w-full">
            <div className="group bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full">
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{pagination.total || staff.length}</h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-blue-100">Total Staff</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full">
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      {staff.filter(m => m.is_active !== false).length}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-emerald-100">Active Staff</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full">
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      {staff.filter(m => m.role === 'ADMIN').length}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-purple-100">Admins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] sm:text-xs text-slate-400 mb-3 sm:mb-4 md:mb-6 font-medium italic">*All staff members</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{error}</p>
              <button 
                onClick={fetchStaff}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Search & Add Section */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-slate-100 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 md:gap-6">
              <div className="w-full md:flex-1">
                <label className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">Search</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative flex-1 min-w-0">
                    <input 
                      type="text" 
                      placeholder="Search by Name, Email or Staff ID..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-8 sm:pl-10 text-xs sm:text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-2 sm:left-3 top-2 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                    </svg>
                  </div>
                  <button 
                    onClick={fetchStaff}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                    </svg>
                    <span>Search</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-start md:justify-end">
                <button 
                  onClick={() => navigate('/register')}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
                  title="Add New Staff"
                >
                  <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6 w-full">
            <div className="relative min-w-[110px] sm:min-w-[120px]">
              <select 
                className="w-full bg-white border border-slate-200 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg appearance-none focus:outline-none cursor-pointer hover:border-blue-300 transition-colors"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="STAFF">Staff</option>
              </select>
              <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            
            <div className="relative min-w-[90px] sm:min-w-[100px]">
              <select 
                className="w-full bg-white border border-slate-200 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg appearance-none focus:outline-none cursor-pointer hover:border-blue-300 transition-colors"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            
            <button 
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('');
                setSelectedStatus('');
              }}
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>

          {/* Staff Table */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden w-full">
            {filteredStaff.length > 0 ? (
              <>
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[800px] md:min-w-0">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Staff</th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Staff ID</th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Email</th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Role</th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Status</th>
                        <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStaff.map((member) => (
                        <tr key={member.id || member.staff_id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {member.name?.[0] || member.email?.[0] || 'U'}
                                </span>
                              </div>
                              <span className="font-medium text-slate-800 text-xs sm:text-sm md:text-base">
                                {member.name || member.fullName || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                            <span className="font-mono text-xs sm:text-sm text-slate-600">
                              {member.staff_id || member.staffId || 'N/A'}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                            <span className="text-slate-600 text-xs sm:text-sm md:text-base">
                              {member.email || 'N/A'}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
                              {member.role || 'STAFF'}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(member.is_active)}`}>
                                {member.is_active !== false ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => navigate(`/staff/edit/${member.id || member.staff_id}`)}
                                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                                title="Edit Staff"
                              >
                                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleToggleStatus(member.id || member.staff_id)}
                                className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${member.is_active !== false ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}
                                title={member.is_active !== false ? 'Deactivate' : 'Activate'}
                              >
                                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  {member.is_active !== false ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  )}
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDelete(member.id || member.staff_id, member.name)}
                                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                                title="Delete Staff"
                              >
                                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {Math.ceil(pagination.total / pagination.limit) > 1 && (
                  <div className="border-t border-slate-200 px-4 sm:px-6 py-3 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="text-xs sm:text-sm text-slate-600">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} staff
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <select
                            value={pagination.limit}
                            onChange={(e) => changeItemsPerPage(parseInt(e.target.value))}
                            className="px-2 py-1 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                          <span className="text-xs text-slate-500">per page</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => goToPage(1)}
                            disabled={pagination.page === 1}
                            className={`px-2 py-1 rounded-lg text-xs sm:text-sm ${
                              pagination.page === 1
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => goToPage(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className={`px-2 py-1 rounded-lg text-xs sm:text-sm ${
                              pagination.page === 1
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>

                          {getPageNumbers().map(page => (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${
                                pagination.page === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            onClick={() => goToPage(pagination.page + 1)}
                            disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                            className={`px-2 py-1 rounded-lg text-xs sm:text-sm ${
                              pagination.page === Math.ceil(pagination.total / pagination.limit)
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => goToPage(Math.ceil(pagination.total / pagination.limit))}
                            disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                            className={`px-2 py-1 rounded-lg text-xs sm:text-sm ${
                              pagination.page === Math.ceil(pagination.total / pagination.limit)
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-20 px-4 w-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-700 mb-1 sm:mb-2 text-center">No staff members found</h3>
                <p className="text-xs sm:text-sm md:text-base text-slate-500 mb-3 sm:mb-4 text-center">
                  {searchTerm || selectedRole || selectedStatus ? 'Try adjusting your search or filter criteria' : 'No staff members available'}
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRole('');
                    setSelectedStatus('');
                    fetchStaff();
                  }} 
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Staff;