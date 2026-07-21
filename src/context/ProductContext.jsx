import { createContext, useContext, useEffect, useState } from "react"

const ProductContext = createContext()

// ⚠️ Poné la URL real de tu API de SheetDB
const SHEETDB_URL = "https://sheetdb.io/api/v1/aqkmgpiukrb2k" 

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const refreshProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(SHEETDB_URL)
      const data = await res.json()
      
      // Aseguramos que sea un array
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error("Error al cargar productos:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshProducts()
  }, [])

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        refreshProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

// ⚠️ ¡CLAVE AQUÍ! Asegúrate de que tenga el 'return'
export function useProducts() {
  return useContext(ProductContext)
}
