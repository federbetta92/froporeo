import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart")
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])


function addToCart(product) {
  setCart(prev => {
    const existing = prev.find(p => p.id === product.id)

    // cantidad ya en carrito
    const qtyInCart = existing ? existing.qty : 0

    // si ya alcanzó el stock máximo, no agregar
    if (qtyInCart >= product.stock) {
      return prev
    }

    if (existing) {
      return prev.map(p =>
        p.id === product.id
          ? { ...p, qty: p.qty + 1 }
          : p
      )
    }

    return [...prev, { ...product, qty: 1 }]
  })
}


function increaseQty(id) {
  setCart(prev =>
    prev.map(p =>
      p.id === id
        ? { ...p, qty: p.qty + 1 }
        : p
    )
  );
}


  function decreaseQty(id) {
    setCart(prev =>
      prev
        .map(p =>
          p.id === id ? { ...p, qty: p.qty - 1 } : p
        )
        .filter(p => p.qty > 0)
    )
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(p => p.id !== id))
  }

  function clearCart() {
    setCart([])
  }

  const total = cart.reduce(
    (sum, p) => sum + p.price * p.qty,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}