import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Importamos ambos proveedores
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductProvider>
  </React.StrictMode>
)
