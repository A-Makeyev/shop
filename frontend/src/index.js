// import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/bootstrap.custom.css'
import './assets/styles/index.css'
import App from './App'
import React from 'react'
import store from './store'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import OrderListScreen from './screens/admin/OrderListScreen'
import ProductListScreen from './screens/admin/ProductListScreen'
import ProductEditScreen from './screens/admin/ProductEditScreen'
import UserListScreen from './screens/admin/UserListScreen'
import UserEditScreen from './screens/admin/UserEditScreen'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="/" index={true} element={<HomeScreen />}></Route>
      <Route path="/search/:keyword" element={<HomeScreen />}></Route>
      <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />}></Route>
      <Route path="/page/:pageNumber" element={<HomeScreen />}></Route>
      <Route path="/product/:id" element={<ProductScreen />}></Route>
      <Route path="/cart" element={<CartScreen />}></Route>
      <Route path="/login" element={<LoginScreen />}></Route>
      <Route path="/register" element={<RegisterScreen />}></Route>

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />}></Route>
        <Route path="/shipping" element={<ShippingScreen />}></Route>
        <Route path="/payment" element={<PaymentScreen />}></Route>
        <Route path="/placeorder" element={<PlaceOrderScreen />}></Route>
        <Route path="/order/:id" element={<OrderScreen />}></Route>
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderlist" element={<OrderListScreen />}></Route>
        <Route path="/admin/productlist" element={<ProductListScreen />}></Route>
        <Route path="/admin/productlist/page/:pageNumber" element={<ProductListScreen />}></Route>
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />}></Route>
        <Route path="/admin/userlist" element={<UserListScreen />}></Route>
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />}></Route>
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
