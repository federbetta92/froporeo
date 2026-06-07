import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCategory } from "../context/CategoryContext";
import logo from "../assets/logo.png";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const { cart, total, increaseQty, decreaseQty} = useCart();
  const { category, setCategory } = useCategory();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  /* =======================
     CERRAR CON ESC
  ======================= */
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsCartOpen(false);
      }
    }

    if (isCartOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen]);

  /* =======================
     CATEGORÍAS
  ======================= */
  const categories = [
    { name: "Todas" },
    {
      name: "Almacén",
      subcategories: [
        "Almacén",
        "Bebidas",
        "Desayuno y Merienda",
        "Dietética",
        "Meriendas Escolares",
        "Productos Naturales",
        "Snacks"
      ]
    },
    { name: "Bazar y Regalería" },
    {
      name: "Limpieza",
      subcategories: ["Higiene Personal", "Productos de Limpieza"]
    },
      ];

  const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, "-");

  const goToCategory = (name, parent = null) => {
    setCategory(name);
    setOpenCategories(false);
    setOpenCategory(null);

    if (parent) {
      navigate(`/categoria/${slugify(parent)}/${slugify(name)}`);
    } else {
      navigate(`/categoria/${slugify(name)}`);
    }
  };

  return (
    <>
      <header className="bg-brand-primary text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* CATEGORÍAS */}
          <div className="relative">
            <button
              onClick={() => setOpenCategories(v => !v)}
              className="px-4 py-2 rounded-full border border-white/40 text-sm"
            >
              Categorías ▾
            </button>

            {openCategories && (
              <div className="absolute left-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg z-50">
                {categories.map(cat => (
                  <div key={cat.name}>
                    <button
                      onClick={() => {
                        if (cat.subcategories) {
                          setOpenCategory(
                            openCategory === cat.name ? null : cat.name
                          );
                        } else {
                          goToCategory(cat.name);
                        }
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex justify-between
                        ${category === cat.name
                          ? "bg-brand-cream font-semibold"
                          : "hover:bg-brand-cream"}`}
                    >
                      {cat.name}
                      {cat.subcategories && "▸"}
                    </button>

                    {cat.subcategories && openCategory === cat.name && (
                      <div className="ml-2">
                        {cat.subcategories.map(sub => (
                          <button
                            key={sub}
                            onClick={() => goToCategory(sub, cat.name)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-brand-cream/60"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LOGO */}
          <Link
            to="/"
            onClick={() => {
              setCategory("Todas");
              setOpenCategories(false);
              setOpenCategory(null);
            }}
            className="flex items-center gap-2"
          >
            <img src={logo} alt="FROPOREO" className="h-8 w-8" />
            <h1 className="font-bold">
              <span className="hidden sm:inline">Almacén Virtual </span>
              <span className="text-brand-accent">FROPOREO</span>
            </h1>
          </Link>

          {/* BOTÓN CARRITO */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-brand-accent px-3 py-2 rounded-lg"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* =======================
          CARRITO LATERAL
      ======================= */}
      <div
        className={`
          fixed inset-0 z-50 transition-opacity duration-500
          ${isCartOpen
            ? "bg-black/40 opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsCartOpen(false)}
      >
        <aside
 
  onClick={(e) => e.stopPropagation()}
  className={`
    absolute right-4 top-20 w-80
    bg-white rounded-lg shadow-xl
    transform transition-transform duration-400 ease-in-out
    ${isCartOpen ? "translate-x-0" : "translate-x-full"}
  `}
>
  <div className="flex flex-col max-h-[70vh]"></div>

    {/* HEADER */}
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="font-semibold">Tu carrito</h2>
      <button
        onClick={() => setIsCartOpen(false)}
        className="text-gray-500 hover:text-black text-xl"
      >
        ✕
      </button>
    </div>

    {/* LISTA */}
    <div className="p-4 overflow-y-auto">
      {cart.length === 0 && (
        <p className="text-sm text-gray-500">El carrito está vacío</p>
      )}

{cart.map(p => (
  <div
    key={p.id}
    className="mb-3 text-sm flex justify-between items-center"
  >
    <div>
      <p className="font-medium">
        {p.name}
      </p>
      <p className="text-xs text-gray-600">
        ${p.price.toLocaleString()} × {p.qty}
      </p>
      <p className="text-xs font-semibold text-brand-accent">
        Subtotal: ${(p.price * p.qty).toLocaleString()}
      </p>
    </div>

    <div className="flex items-center gap-1">
      <button
        onClick={() => decreaseQty(p.id)}
        className="px-2 border rounded"
      >
        −
      </button>
      <span className="w-5 text-center">{p.qty}</span>
      <button
        onClick={() => increaseQty(p.id)}
        className="px-2 border rounded"
      >
        +
      </button>
    </div>
  </div>
))}


    {/* FOOTER */}
    {cart.length > 0 && (
      <div className="p-4 border-t">
        <p className="flex justify-between text-sm font-semibold mb-3">
          <span>Subtotal</span>
          <span>${total}</span>
        </p>

        <button
          onClick={() => {
            setIsCartOpen(false);
            navigate("/checkout");
          }}
          className="w-full bg-brand-accent text-white py-2 rounded"
        >
          Ir al checkout
        </button>

        <button
          onClick={() => setIsCartOpen(false)}
          className="w-full mt-2 text-sm text-gray-500"
        >
          Seguir comprando
        </button>
      </div>
    )}
  </div>
</aside>

      </div>
    </>
  );
}