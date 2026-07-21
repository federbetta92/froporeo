import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext()

// ⚠️ Reemplazá esto con la URL exacta de tu API de SheetDB
const SHEETDB_URL = "https://sheetdb.io/api/v1/aqkmgpiukrb2k"

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
      const qtyInCart = existing ? existing.qty : 0

      // Mapea con la columna exactas 'Stock Actual' de tu planilla
      const currentStock = Number(product["Stock Actual"] ?? product.stock ?? 0)

      if (qtyInCart >= currentStock) {
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
      prev.map(p => {
        if (p.id === id) {
          const currentStock = Number(p["Stock Actual"] ?? p.stock ?? 0)
          if (p.qty < currentStock) {
            return { ...p, qty: p.qty + 1 }
          }
        }
        return p
      })
    )
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

  // 🚀 Descuenta el stock de la compra en SheetDB
  async function confirmOrder() {
    try {
      const updatePromises = cart.map(async (item) => {
        const initialStock = Number(item["Stock Actual"] ?? item.stock ?? 0)
        const newStock = Math.max(0, initialStock - item.qty)

        return fetch(`${SHEETDB_URL}/id/${item.id}`, {
          method: "PATCH",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: {
              "Stock Actual": newStock
            }
          })
        })
      })

      await Promise.all(updatePromises)
      clearCart()
      return true
    } catch (error) {
      console.error("Error al actualizar 'Stock Actual' en SheetDB:", error)
      return false
    }
  }

  // Soporta los nombres 'Precio' o 'price'
  const total = cart.reduce(
    (sum, p) => {
      const price = Number(p["Precio"] ?? p.price ?? 0)
      return sum + (price * p.qty)
    },
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
        confirmOrder,
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
