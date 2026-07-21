import { useState } from "react";
import placeholder from "../assets/placeholder.png";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, cart, increaseQty, decreaseQty } = useCart();

  // 1. Nombre
  const name = product.name || product.Producto || "Producto sin nombre";

  // 2. Formateo y parseo correcto del precio (soporta "$ 3.200,00", "$ 3,200.00", etc.)
  const rawPrice = product.price ?? product.Precio ?? 0;
  const parsePrice = (val) => {
    if (typeof val === "number") return val;
    // Eliminamos todo lo que no sea un número para evitar problemas con la coma decimal
    const cleanStr = String(val).replace(/[^0-9]/g, "");
    return Number(cleanStr) || 0;
  };
  const price = parsePrice(rawPrice);

  // 3. Stock
  const stock = Number(product.stock ?? product["Stock Actual"] ?? 0);

  // 4. Normalizamos las rutas de imágenes
  const validImages = product.images?.filter(img => !img.endsWith("/.png")) ?? [];
  
  // Si en la planilla tenés la columna "Imagen", la toma; sino intenta con el ID local o el placeholder
  const initialImage = product.Imagen 
    ? product.Imagen 
    : validImages.length 
      ? validImages[0] 
      : `/products/${product.id}.png`;

  const [imageSrc, setImageSrc] = useState(initialImage);
  const [pulse, setPulse] = useState(false);

  // Normalizamos el objeto de producto para el carrito
  const normalizedProduct = {
    ...product,
    id: product.id,
    name,
    price,
    stock
  };

  const itemInCart = cart.find(p => p.id === product.id);
  const availableStock = stock - (itemInCart?.qty || 0);

  const handleAdd = () => {
    addToCart(normalizedProduct);
  };

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
          onError={() => setImageSrc(placeholder)} // Si no existe la imagen en la carpeta, usa el placeholder
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

      {/* Precio con formato en pesos ($ 3.200) */}
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
          <button
            onClick={handleDecrease}
            className="px-3 py-1 border rounded"
          >
            −
          </button>

          <span
            className={`font-semibold transition-transform ${
              pulse ? "scale-110" : "scale-100"
            }`}
          >
            {itemInCart.qty}
          </span>

          <button
            onClick={handleIncrease}
            className="px-3 py-1 border rounded"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
