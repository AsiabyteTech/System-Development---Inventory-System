import './App.css'
import "./styles/animations.css";
import React, { useEffect } from 'react'
import {BrowserRouter, Routes, Route, useLocation, Navigate} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register'
import Login from './pages/Login'
import Invoice from './pages/Invoice'
import Product from './pages/Product'
import Stock from './pages/Stock'
import Order from './pages/Order'
import Inventory from './pages/Inventory'
import Supplier from './pages/Supplier.jsx'
import Customer from './pages/Customer'
import ProductValue from './pages/ReportProductValue.jsx'
import ReportOrder from './pages/ReportOrder.jsx'
import Dashboard from './pages/Dashboard'
import AddEditPackage from './pages/AddEditPackage'
import AddEditPromo from './pages/AddEditPromo'
import { AuthProvider } from './contexts/AuthContext.jsx';  // ✅ Remove .jsx extension (optional)
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword';
import UserProfile from './pages/UserProfile';

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>                    {/* ✅ Router must be OUTERMOST */}
      <AuthProvider>                   {/* ✅ AuthProvider INSIDE Router */}
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Navigate to="/login" replace />} />
          <Route path='/home' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/invoice' element={<Invoice />} />
          <Route path='/product' element={<Product />} />
          <Route path='/stock' element={<Stock />} />
          <Route path='/order' element={<Order />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/supplier' element={<Supplier />} />
          <Route path='/customer' element={<Customer />} />
          <Route path='/reportproductvalue' element={<ProductValue />} />
          <Route path='/reportorder' element={<ReportOrder />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/addeditpackage' element={<AddEditPackage />} />
          <Route path='/addeditpromo' element={<AddEditPromo />} /> 
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;