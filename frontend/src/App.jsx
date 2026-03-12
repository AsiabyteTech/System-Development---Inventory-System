import './App.css'
import React, { useEffect } from 'react'
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'
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

// ScrollToTop component that scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/invoice' element={<Invoice />}></Route>
        <Route path='/product' element={<Product />}></Route>
        <Route path='/stock' element={<Stock />}></Route>
        <Route path='/order' element={<Order />}></Route>
        <Route path='/inventory' element={<Inventory />}></Route>
        <Route path='/supplier' element={<Supplier />}></Route>
        <Route path='/customer' element={<Customer />}></Route>
        <Route path='/reportproductvalue' element={<ProductValue />}></Route>
        <Route path='/reportorder' element={<ReportOrder />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/addeditpackage' element={<AddEditPackage />}></Route>
        <Route path='/addeditpromo' element={<AddEditPromo />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App