import { useState, useEffect } from "react";
import placeholder from "../assets/placeholder.png";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, cart, increaseQty, decreaseQty } = useCart();

  // 1. Nombre
  const name = product.name || product.Producto || "Producto sin nombre";

  // 2. Precio
  const rawPrice = product.price ?? product.Precio ?? 0;
  const price = typeof rawPrice === "number" 
    ? rawPrice 
    : Number(String(rawPrice).replace(/[^0-9]/g, "")) || 0;

  // 3. Stock
  const stock = Number(product.stock ?? product["Stock Actual"] ?? 0);

  // 4. Categoría para armar la subcarpeta
  const category = product.category || product.Categoría || "";

  // Normalizamos rutas posibles
  // Intenta: 
  // 1. Columna "Imagen" si existe en SheetDB
  // 2. /products/CATEGORIA/ID.png
  // 3. /products/ID.png
  const getInitialImagePath = () => {
    if (product.Imagen) return product.Imagen;
    if (product.images && product.images.length > 0 && !product.images[0].endsWith("/.png")) {
      return product.images[0];
    }
    if (category) {
      return `/products/${category}/${product.id}.png`;
    }
    return `/products/${product.id}.png`;
  };

  const [imageSrc, setImageSrc] = useState(getInitialImagePath());
  const [pulse, setPulse] = useState(false);

  // Si cambia el producto/id, actualizamos la imagen
  useEffect(() => {
    setImageSrc(getInitialImagePath());
  }, [product.id, category]);

  // Manejador de error para probar extensión alternativa (.jpg) antes de ir al placeholder
  const handleImageError = () => {
    if (imageSrc.endsWith(".png")) {
      // Si falló .png, probamos .jpg en la misma carpeta
      setImageSrc(imageSrc.replace(".png", ".jpg"));
    } else {
      // Si también falló o no era .png, mostramos el placeholder
      setImageSrc(placeholder);
    }
  };

  const normalizedProduct = {
    ...product,
    id: product.id,
    name,
    price,
    stock
  };

  const itemInCart = cart.find(p => p.id === product.id);
  const availableStock = stock - (itemInCart?.qty || 0);

  const handleAdd = () => addToCart(normalizedProduct);
  const handleIncrease = () => {
    increaseQty(product.id);
    setPulse(true);
    setTimeout(() => setPulse(false), 150);
  };
  const handleDecrease = () => {
    decreaseQty(product.id);
    setPulse(true);
    setTimeout(() => setPulse(false), 150);
  };

  return (
    <div
      className={`
        rounded-lg shadow p-3 sm:p-4 flex flex-col transition
        ${availableStock > 0 && availableStock <= 5
          ? "bg-yellow-50 border-2 border-yellow-400"
          : "bg-white"}
      `}
    >
      {/* IMAGEN */}
      <div className="relative w-full h-48 mb-3 overflow-hidden rounded-md bg-white flex items-center justify-center">
        <img
          src={imageSrc}
          alt={name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
          onError={handleImageError}
        />
      </div>

      {/* INFO */}
      {itemInCart && (
        <span className="inline-block text-xs mb-1 px-2 py-0.5 rounded-full bg-brand-accent text-white">
          En carrito
        </span>
      )}

      <h3 className="font-semibold text-sm sm:text-base mb-1">
        {name}
      </h3>

      <p className="text-gray-600 text-sm mb-2">
        ${price.toLocaleString("es-AR")}
      </p>

      {/* STOCK */}
      {availableStock > 5 && (
        <p className="text-xs text-green-700 mb-2">
          Stock disponible: {availableStock}
        </p>
      )}

      {availableStock > 0 && availableStock <= 5 && (
        <p className="text-xs text-yellow-600 font-semibold mb-2">
          ⚠️ Últimas unidades
        </p>
      )}

      {availableStock <= 0 && (
        <p className="text-xs text-red-600 font-semibold mb-2">
          Sin stock
        </p>
      )}

      {/* ACCIÓN */}
      {!itemInCart ? (
        <button
          onClick={handleAdd}
          disabled={availableStock <= 0}
          className={`
            mt-auto w-full py-2 text-sm sm:text-base rounded-md transition
            ${availableStock <= 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-brand-accent text-white hover:opacity-90"}
          `}
        >
          {availableStock <= 0 ? "Sin stock" : "Agregar"}
        </button>
      ) : (
        <div className="mt-auto flex items-center justify-center gap-3">
          <button onClick={handleDecrease} className="px-3 py-1 border rounded">
            −
          </button>
          <span className={`font-semibold transition-transform ${pulse ? "scale-110" : "scale-100"}`}>
            {itemInCart.qty}
          </span>
          <button onClick={handleIncrease} className="px-3 py-1 border rounded">
            +
          </button>
        </div>
      )}
    </div>
  );
}
