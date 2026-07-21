import { createContext, useContext, useEffect, useState } from "react"

const ProductContext = createContext()

// ⚠️ Reemplazá esto con la URL exacta de tu API en SheetDB
const SHEETDB_URL = "https://sheetdb.io/api/v1/aqkmgpiukrb2k"

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Función para obtener/refrescar los productos desde SheetDB
const refreshProducts = async () => {
  setLoading(true)
  try {
    const res = await fetch(SHEETDB_URL)
    const data = await res.json()
    
    // Validamos que 'data' sea realmente una lista/array
    if (Array.isArray(data)) {
      setProducts(data)
    } else {
      console.error("SheetDB no devolvió un array:", data)
      setProducts([])
    }
  } catch (error) {
    console.error("Error al cargar productos desde SheetDB:", error)
    setProducts([])
  } finally {
    setLoading(false)
  }
}

  // Carga inicial al montar la aplicación
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

export function useProducts() {
  return useContext(ProductContext)
}
