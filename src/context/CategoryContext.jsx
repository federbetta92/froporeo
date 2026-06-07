import { createContext, useContext, useState } from "react"

const CategoryContext = createContext()

export function CategoryProvider({ children }) {
  const [category, setCategory] = useState("Todas")

  return (
    <CategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategory() {
  return useContext(CategoryContext)
}