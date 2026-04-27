import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FiFileText, FiPackage, FiGift, FiPlus, FiEdit2 } from 'react-icons/fi';
import { BsBoxSeam, BsGraphUp, BsCurrencyDollar } from 'react-icons/bs';
// ✅ ADDED: role-based condition import
import { isAdmin } from "./shared/role";

const Dashboard = () => {
    const navigate = useNavigate();

    // Mock Data for the Chart
    const [data, setData] = useState([
        { name: 'EZ-C8C-2MP', orders: 28 },
        { name: 'EZ-C8C-5MP', orders: 26 },
        { name: 'EZ-H1C', orders: 12 },
        { name: 'EZ-TY1-PRO', orders: 8 },
        { name: 'EZ-H6C-PRO', orders: 6 },
        { name: 'EZ-H9C-DL', orders: 20 },
        { name: 'EZ-C6N', orders: 26 },
    ]);

    // Gradient Colors for Bars
    const colors = ['#2563eb', '#3b82f6', '#4f46e5', '#6366f1', '#818cf8', '#93c5fd', '#1e3a8a'];

    const [inventoryData] = useState([
        { name: 'EZ-C8C-2MP', price: 260 },
        { name: 'EZ-C8C-5MP', price: 135 },
        { name: 'EZ-H1C', price: 160 },
        { name: 'EZ-TY1-PRO', price: 200 },
        { name: 'EZ-H6C-PRO', price: 85 },
        { name: 'EZ-H9C-DL', price: 120 },
        { name: 'EZ-C6N', price: 170 },
        { name: 'TP-C200', price: 110 },
        { name: 'TP-C500', price: 50 },
        { name: 'HS-SD-64G', price: 85 },
        { name: 'TP-C120', price: 10 },
    ]);

    // Generate random stock levels and statuses for products
    const generateRandomStock = () => {
        const randomLevel = Math.floor(Math.random() * 6); // 0-5
        let status;
        if (randomLevel >= 4) status = "Good";
        else if (randomLevel >= 2) status = "Low";
        else status = "Out";
        return { level: randomLevel, status };
    };

    const products = [
        { 
            id: '1', 
            image: '/Pictures/EZC8C.jpg', 
            sku: 'EZ-C8C-2MP', 
            ...generateRandomStock()
        },
        { 
            id: '2', 
            image: '/Pictures/C8C5MP.png', 
            sku: 'EZ-C8C-5MP', 
            ...generateRandomStock()
        },
        { 
            id: '3', 
            image: '/Pictures/Ezviz-H1C front.jpg', 
            sku: 'EZ-H1C', 
            ...generateRandomStock()
        },
        { 
            id: '4', 
            image: '/Pictures/ez ty1pro.jpg', 
            sku: 'EZ-TY1-PRO', 
            ...generateRandomStock()
        },
        { 
            id: '5', 
            image: '/Pictures/ez h6cpro.png', 
            sku: 'EZ-H6C-PRO', 
            ...generateRandomStock()
        },
        { 
            id: '6', 
            image: '/Pictures/H9c.png', 
            sku: 'EZ-H9C-DL', 
            ...generateRandomStock()
        },
        { 
            id: '7', 
            image: '/Pictures/c6n.jpg', 
            sku: 'EZ-C6N', 
            ...generateRandomStock()
        },
    ];

    const packages = [
        { id: '1', name: 'Duo Package', product: ['EZ-C8C-2MP', 'EZ-H1C'], quantity: 2, price: '330.00', dateline: '2025-10-26' },
    ];

    const promos = [
        { id: '1', name: 'New Year', product: ['EZ-C8C-2MP', 'EZ-H1C'], quantity: 2, reduct: '30%', price: '150.00', dateline: '2025-10-26' },
    ];

    // Function to get status badge color
    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'Good':
                return 'bg-green-50 text-green-700';
            case 'Low':
                return 'bg-yellow-50 text-yellow-700';
            case 'Out':
                return 'bg-red-50 text-red-700';
            default:
                return 'bg-green-50 text-green-700';
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 ml-16 md:ml-64 transition-all duration-300">
                <main className="all-main-content">
                    {/* ✅ RESPONSIVE FIX: Page Title Banner with responsive padding */}
                    <div className="page-banner flex justify-center items-center mb-6 sm:mb-8">
                        <h2 className="bg-[#00008B] text-white px-8 sm:px-12 py-1.5 sm:py-2 rounded-full text-lg sm:text-xl font-bold shadow-md">Dashboard</h2>
                    </div>

                    {/* ✅ RESPONSIVE FIX: Stats Cards Row - responsive grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-slate-100 hover:border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Total Products</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800">12</h3>
                                    <p className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2">+2.5% from last month</p>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <BsBoxSeam className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-slate-100 hover:border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Total Order</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800">8</h3>
                                    <p className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2">+5% from last month</p>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FiPackage className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-slate-100 hover:border-blue-200 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Total Product Value</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800">RM1000</h3>
                                    <p className="text-[10px] sm:text-xs text-blue-600 mt-1 sm:mt-2">Updated this month</p>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FiGift className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ✅ RESPONSIVE FIX: Charts Grid - responsive layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        {/* Order Volume Chart */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-slate-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <BsGraphUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                        <p className="text-xs sm:text-sm font-medium text-slate-500">Order Volume</p>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">8</h2>
                                </div>
                                <button
                                    onClick={() => navigate('/reportorder')}
                                    className="add-button p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-105 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                                    title="View Detailed Report"
                                >
                                    <FiFileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </button>
                            </div>

                            {/* ✅ RESPONSIVE FIX: Filter controls - responsive layout */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs sm:text-sm text-slate-500">Month</label>
                                    <input
                                        type="month"
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* ✅ RESPONSIVE FIX: Chart container with responsive height */}
                            <div style={{ width: '100%', height: 200 }} className="min-w-[200px]">
                                <ResponsiveContainer>
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="name" tick={false} axisLine={false} />
                                        <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#64748B' }} />
                                        <Tooltip
                                            cursor={{ fill: '#F1F5F9' }}
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                                padding: '6px 10px',
                                                fontSize: '12px'
                                            }}
                                        />
                                        <Bar dataKey="orders" radius={[4, 4, 0, 0]} barSize={20}>
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Total Product Value Chart */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-slate-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <BsCurrencyDollar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                                        <p className="text-xs sm:text-sm font-medium text-slate-500">Total Product Value</p>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">1000</h2>
                                </div>
                                <button
                                    onClick={() => navigate('/reportproductvalue')}
                                    className="add-button p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-105 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                                    title="View Detailed Report"
                                >
                                    <FiFileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </button>
                            </div>

                            {/* ✅ RESPONSIVE FIX: Filter controls - responsive stacking */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs sm:text-sm text-slate-500">Month</label>
                                    <input
                                        type="month"
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs sm:text-sm text-slate-500">Type</label>
                                    <select className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                        <option>All Types</option>
                                        <option>Camera</option>
                                        <option>Storage</option>
                                    </select>
                                </div>
                            </div>

                            {/* ✅ RESPONSIVE FIX: Chart container */}
                            <div style={{ width: '100%', height: 250 }} className="min-w-[200px]">
                                <ResponsiveContainer>
                                    <LineChart data={inventoryData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis
                                            dataKey="name"
                                            fontSize={8}
                                            tick={{ fill: '#64748B' }}
                                            axisLine={false}
                                            tickLine={false}
                                            interval={0}
                                            angle={-45}
                                            textAnchor="end"
                                            height={50}
                                        />
                                        <YAxis
                                            fontSize={10}
                                            tick={{ fill: '#64748B' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                                padding: '6px 10px',
                                                fontSize: '12px'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }}
                                            activeDot={{ r: 5, fill: '#2563eb', stroke: 'white', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* ✅ RESPONSIVE FIX: Tables Grid - responsive height management */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Left Column - Low Product Items Table */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden h-auto lg:h-[500px] flex flex-col">
                            <div className="p-4 sm:p-6 pb-2 sm:pb-4 flex-shrink-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 sm:mb-4">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Low Stock Items</p>
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">4</h2>
                                    </div>
                                    <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] sm:text-xs font-medium rounded-full self-start sm:self-auto">Needs attention</span>
                                </div>
                            </div>
                            {/* ✅ RESPONSIVE FIX: Table with horizontal scroll on mobile */}
                            <div className="overflow-x-auto flex-1">
                                <div className="min-w-[500px]">
                                    <table className="w-full">
                                        <thead className="sticky top-0 bg-slate-50">
                                            <tr className="bg-slate-50">
                                                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
                                                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                                                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {products.map((item) => (
                                                <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                                                    <td className="px-4 sm:px-6 py-2 sm:py-3">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
                                                            <img src={item.image} alt="Product" className="w-full h-full object-cover" />
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-2 sm:py-3">
                                                        <span className="text-xs sm:text-sm font-medium text-slate-900">{item.sku}</span>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-2 sm:py-3">
                                                        <span className="text-xs sm:text-sm text-slate-600">{item.level}</span>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-2 sm:py-3">
                                                        <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Stacked Tables */}
                        <div className="flex flex-col gap-4 sm:gap-6 h-auto lg:h-[500px]">
                            {/* Package Table */}
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex-1 flex flex-col">
                                <div className="p-4 sm:p-6 pb-2 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Packages</p>
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">1</h2>
                                    </div>
                                    {isAdmin() && (
                                        <button
                                            onClick={() => navigate('/addeditpackage')}
                                            className="add-button p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-105 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center self-start sm:self-auto"
                                            title="Add Package"
                                        >
                                            <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </button>
                                    )}
                                </div>
                                {/* ✅ RESPONSIVE FIX: Table with horizontal scroll */}
                                <div className="overflow-x-auto flex-1">
                                    <div className="min-w-[600px]">
                                        <table className="w-full">
                                            <thead className="sticky top-0 bg-slate-50">
                                                <tr className="bg-slate-50">
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Package</th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Products</th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Qty</th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Dateline</th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {packages.map((item) => (
                                                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                                                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                                                            <span className="text-xs sm:text-sm font-medium text-slate-900">{item.name}</span>
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                                                            <div className="text-xs sm:text-sm text-slate-600">
                                                                {item.product.map((p, i) => (
                                                                    <span key={i} className="block">{p}</span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600">{item.quantity}</td>
                                                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-slate-900">RM {item.price}</td>
                                                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600">{item.dateline}</td>
                                                        {isAdmin() && (
                                                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                                                                <button
                                                                    onClick={() => navigate(item.id)}
                                                                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                                >
                                                                    <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 hover:text-blue-600" />
                                                                </button>
                                                            </td>
                                                        )}
                                                        {!isAdmin() && <td className="px-3 sm:px-4 py-2 sm:py-3"></td>}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Promotion Table */}
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex-1 flex flex-col">
                                <div className="p-4 sm:p-6 pb-2 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Promotions</p>
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">1</h2>
                                    </div>
                                    {isAdmin() && (
                                        <button
                                            onClick={() => navigate('/addeditpromo')}
                                            className="add-button p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-105 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center self-start sm:self-auto"
                                            title="Add Promotion"
                                        >
                                            <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </button>
                                    )}
                                </div>
                                {/* ✅ RESPONSIVE FIX: Table with horizontal scroll */}
                                <div className="overflow-x-auto flex-1">
                                    <div className="min-w-[700px]">
                                        <table className="w-full">
                                            <thead className="sticky top-0 bg-slate-50">
                                                <tr className="bg-slate-50">
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Promo</th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Products</th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Qty</th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Reduction</th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Dateline</th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {promos.map((item) => (
                                                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                                                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                                                            <span className="text-xs sm:text-sm font-medium text-slate-900">{item.name}</span>
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                                                            <div className="text-xs sm:text-sm text-slate-600">
                                                                {item.product.map((p, i) => (
                                                                    <span key={i} className="block">{p}</span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600">{item.quantity}</td>
                                                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                                                            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-purple-50 text-purple-700">
                                                                {item.reduct}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-slate-900">RM {item.price}</td>
                                                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600">{item.dateline}</td>
                                                        {isAdmin() && (
                                                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                                                                <button
                                                                    onClick={() => navigate(item.id)}
                                                                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                                >
                                                                    <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 hover:text-blue-600" />
                                                                </button>
                                                            </td>
                                                        )}
                                                        {!isAdmin() && <td className="px-3 sm:px-4 py-2 sm:py-3"></td>}
                                                    </tr>
                                                ))} 
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;