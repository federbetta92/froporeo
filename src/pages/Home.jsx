
import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useCategory } from "../context/CategoryContext";

const ITEMS_PER_PAGE = 12;
const MAX_VISIBLE_PAGES = 5;

export default function Home() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");
  const [page, setPage] = useState(1);

  const { categoria, subcategoria } = useParams();
  const { category, setCategory } = useCategory();


useEffect(() => {
  if (subcategoria) {
    const formattedSub = subcategoria
      .replace(/-/g, " ")
      .replace(/\b\w/g, l => l.toUpperCase());

    setCategory(formattedSub);
    setPage(1);
    return;
  }

  if (categoria) {
    const formattedCat = categoria
      .replace(/-/g, " ")
      .replace(/\b\w/g, l => l.toUpperCase());

    setCategory(formattedCat);
    setPage(1);
    return;
  }

  setCategory("Todas");
  setPage(1);
}, [categoria, subcategoria, setCategory]);



  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "Todas") {
      result = result.filter(p => p.category === category);
    }

    if (search.trim() !== "") {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    
if (sort === "price-asc") {
  result.sort((a, b) => a.price - b.price);
}

if (sort === "price-desc") {
  result.sort((a, b) => b.price - a.price);
}

if (sort === "name-asc") {
  result.sort((a, b) => a.name.localeCompare(b.name));
}

if (sort === "name-desc") {
  result.sort((a, b) => b.name.localeCompare(a.name));
}

if (sort === "bestsellers") {
  result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
}

if (sort === "featured") {
  result.sort((a, b) => (b.featured === true) - (a.featured === true));
}


    return result;
  }, [category, search, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filteredProducts.slice(start, start + ITEMS_PER_PAGE);

  /* === LÓGICA DE PAGINACIÓN (3–5 páginas visibles) === */
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  const startPage = Math.max(1, page - half);
  const endPage = Math.min(totalPages, page + half);

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return (
    <main className="bg-brand-cream min-h-screen px-3 sm:px-4 py-6">
      <div className="max-w-7xl mx-auto">

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 items-end">
  {/* ORDENAR (izquierda) */}
  
<div className="justify-self-start w-full sm:max-w-xs">
  <label className="block text-xs font-medium mb-1">
    Ordenar por
  </label>
  <select
    value={sort}
    onChange={e => {
      setSort(e.target.value);
      setPage(1);
    }}
    className="
  w-full
  px-2 py-1.5
  rounded-full
  border border-green-500/40 hover:border-green-600/60 transition-colors
  bg-white/90
  text-sm
  focus:outline-none
  focus:ring-0
  focus:border-green-600"
  >
    …
 
      <option value="none">Sin ordenar</option>
      <option value="price-asc">Precio: menor a mayor</option>
      <option value="price-desc">Precio: mayor a menor</option>
      <option value="name-asc">Nombre: A → Z</option>
      <option value="name-desc">Nombre: Z → A</option>
      <option value="bestsellers">Más vendidos</option>
      <option value="featured">Destacados</option>
    </select>
  </div>

  {/* BUSCADOR (derecha) */}
  
<div className="justify-self-end w-full sm:max-w-xs">
  <label className="block text-xs font-medium mb-1">
    Buscar
  </label>
  <input
    type="text"
    placeholder="Buscar productos..."
    value={search}
    onChange={e => {
      setSearch(e.target.value);
      setPage(1);
    }}
    className="w-full
  px-2 py-1.5
  rounded-full
  border border-green-500/40 hover:border-green-600/60 transition-colors
  bg-white/90
  text-sm
  focus:outline-none
  focus:ring-0
  focus:border-green-600"

  />
</div>

</div>


        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {paginated.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CIERRE DE CONTENIDO */}
        <div className="mt-8 mb-4 text-center text-sm text-gray-500 px-4">
          <p className="font-medium">¿No encontraste lo que buscabas?</p>
          <p className="mt-1">
            Escribinos por WhatsApp y te ayudamos 🙂
          </p>
        </div>

        {/* PAGINACIÓN */}
        <div className="mt-6 flex justify-center items-center gap-2 text-sm flex-wrap">

          {/* Anterior */}
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 rounded border disabled:opacity-40 bg-white"
          >
            ‹
          </button>

          {/* Primera + puntos */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => setPage(1)}
                className="px-2 py-1 rounded border bg-white"
              >
                1
              </button>
              <span className="px-1">…</span>
            </>
          )}

          {/* Páginas visibles */}
          {visiblePages.map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-2 py-1 rounded border ${
                p === page
                  ? "bg-brand-accent text-white"
                  : "bg-white"
              }`}
            >
              {p}
            </button>
          ))}

          {/* Última + puntos */}
          {endPage < totalPages && (
            <>
              <span className="px-1">…</span>
              <button
                onClick={() => setPage(totalPages)}
                className="px-2 py-1 rounded border bg-white"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Siguiente */}
          <button
            onClick={() =>
              setPage(p => Math.min(totalPages, p + 1))
            }
            disabled={page === totalPages}
            className="px-2 py-1 rounded border disabled:opacity-40 bg-white"
          >
            ›
          </button>
        </div>

        {/* INFO */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Mostrando {paginated.length} de {filteredProducts.length} productos
        </p>

      </div>
    </main>
  );
}