import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext()

// ⚠️ Reemplazá esto con la URL de tu API en SheetDB
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
        p.id === id && p.qty < p.stock
          ? { ...p, qty: p.qty + 1 }
          : p
      )
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

  // 🚀 NUEVA FUNCIÓN: Impacta el descuento de stock en SheetDB
  async function confirmOrder() {
    try {
      // Recorremos cada producto del carrito para descontar su stock
      const updatePromises = cart.map(async (item) => {
        // Calculamos el nuevo stock (asegurando que no baje de 0)
        const newStock = Math.max(0, Number(item.stock) - item.qty)

        // Hacemos el PATCH a SheetDB buscando por la columna 'id'
        // IMPORTANTE: Asegurate de que en SheetDB la columna de stock se llame igual
        // (por ejemplo: 'stock' o 'Stock Actual')
        return fetch(`${SHEETDB_URL}/id/${item.id}`, {
          method: "PATCH",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: {
              stock: newStock // O 'Stock Actual' según cómo nombraste la columna
            }
          })
        })
      })

      // Esperamos a que se actualicen todos los ítems en Google Sheets
      await Promise.all(updatePromises)

      // Una vez que impactó correctamente, vaciamos el carrito local
      clearCart()
      return true
    } catch (error) {
      console.error("Error al descontar stock en SheetDB:", error)
      return false
    }
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
        confirmOrder, // Exportamos la función
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
