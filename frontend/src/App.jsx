import './App.css'
import "./styles/animations.css";
import React, { useEffect } from 'react'
import {BrowserRouter, Routes, Route, useLocation, Navigate} from 'react-router-dom'
import Home from './Home'
import Register from './Register'
import Login from './Login'
import Invoice from './Invoice'
import Product from './Product'
import Stock from './Stock'
import Order from './Order'
import Inventory from './Inventory'
import Supplier from './Supplier'
import Customer from './Customer'
import ProductValue from './ReportProductValue'
import ReportOrder from './ReportOrder'
import Dashboard from './Dashboard'
import AddEditPackage from './AddEditPackage'
import AddEditPromo from './AddEditPromo'
import RegisterStaff from './RegisterStaff'
import { AuthProvider } from './contexts/AuthContext.jsx';  // ✅ Remove .jsx extension (optional)

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
          <Route path="/registerstaff" element={<RegisterStaff />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;