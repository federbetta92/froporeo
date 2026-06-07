import { Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { CategoryProvider } from "./context/CategoryContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home"
import Checkout from "./pages/Checkout"
import OrderSuccess from "./pages/OrderSuccess";

export default function App() {
  return (
    <CartProvider>
<CategoryProvider>
      <Header />

      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/categoria/:nombre" element={<Home />} />
        <Route path="/categoria/:categoria/:subcategoria" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />        
        <Route path="/pedido-confirmado" element={<OrderSuccess />} />

      </Routes>

      <Footer />
     <WhatsAppButton />
</CategoryProvider>
    </CartProvider>
  )
}