import { useState } from "react";
import placeholder from "../assets/placeholder.png";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, cart, increaseQty, decreaseQty } = useCart();

  const itemInCart = cart.find(p => p.id === product.id);
  const availableStock = product.stock - (itemInCart?.qty || 0);

  // Filtra rutas inválidas como "/products/.png" y usa placeholder si no hay imágenes válidas
  const validImages = product.images?.filter(img => !img.endsWith("/.png")) ?? [];
  const images = validImages.length ? validImages : [placeholder];

  const [currentImage, setCurrentImage] = useState(0);
  const [pulse, setPulse] = useState(false);

  const handleAdd = () => {
    addToCart(product);
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

  const nextImage = () => {
    setCurrentImage(i => (i + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage(i => (i === 0 ? images.length - 1 : i - 1));
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
          src={images[currentImage]}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 -translate-y-1/2
                         bg-white/80 hover:scale-110 transition-transform
                         text-black text-3xl font-bold leading-none
                         rounded-full w-7 h-7 flex items-center justify-center shadow"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 -translate-y-1/2
                         bg-white/80 hover:scale-110 transition-transform
                         text-black text-3xl font-bold leading-none
                         rounded-full w-7 h-7 flex items-center justify-center shadow"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* INFO */}
      {itemInCart && (
        <span className="inline-block text-xs mb-1 px-2 py-0.5 rounded-full bg-brand-accent text-white">
          En carrito
        </span>
      )}

      <h3 className="font-semibold text-sm sm:text-base mb-1">
        {product.name}
      </h3>

      <p className="text-gray-600 text-sm mb-2">
        ${product.price.toLocaleString()}
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

      {availableStock === 0 && (
        <p className="text-xs text-red-600 font-semibold mb-2">
          Sin stock
        </p>
      )}

      {/* ACCIÓN */}
      {!itemInCart ? (
        <button
          onClick={handleAdd}
          disabled={availableStock === 0}
          className={`
            mt-auto w-full py-2 text-sm sm:text-base rounded-md transition
            ${availableStock === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-brand-accent text-white hover:opacity-90"}
          `}
        >
          {availableStock === 0 ? "Sin stock" : "Agregar"}
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
