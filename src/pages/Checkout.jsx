import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import mpLogo from "../assets/mercadopago.svg";
import whatsappLogo from "../assets/whatsapp.svg"

export default function Checkout() {
  const [processing, setProcessing] = useState(false);

  const {
    cart,
    total,
    increaseQty,
    decreaseQty,
    clearCart
  } = useCart();

  const navigate = useNavigate();

  /* =====================
     WHATSAPP
  ===================== */
  const whatsappMessage = cart
    .map(
      p =>
        `• ${p.name}\n  Cantidad: ${p.qty}\n  Subtotal: $${(
          p.qty * p.price
        ).toLocaleString()}`
    )
    .join("\n\n");

  const whatsappUrl = `https://wa.me/5493436237454?text=${encodeURIComponent(
    `🛒 Pedido FROPOREO\n\n${whatsappMessage}\n\n💰 Total: $${total.toLocaleString()}`
  )}`;

  /* =====================
     MERCADOPAGO (SIMULADO)
  ===================== */
  function handleMercadoPago() {
    const ok = confirm(
      `Vas a simular el pago por $${total.toLocaleString()}.\n\n¿Confirmar pedido?`
    );
    if (!ok) return;

    setProcessing(true);

    setTimeout(() => {
      alert("💳 Pago simulado con MercadoPago\n(Integración real más adelante)");
      clearCart();
      navigate("/pedido-confirmado");
    }, 1500);
  }

  /* =====================
     VALIDACIONES
  ===================== */
  const invalidItems = cart.filter(p => p.qty <= 0);

  if (invalidItems.length > 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-xl font-bold mb-4">
          Hay un problema con tu carrito
        </h1>
        <p className="text-gray-600 mb-6">
          Revisá las cantidades antes de continuar.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-brand-accent text-white px-6 py-3 rounded-lg"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-brand-primary mb-4">
          Checkout
        </h1>
        <p className="text-gray-600 mb-6">
          No hay productos en el carrito.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-brand-accent text-white px-6 py-3 rounded-lg"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  /* =====================
     RENDER
  ===================== */
  return (
<main className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">

  {/* COLUMNA IZQUIERDA */}
  <section className="md:col-span-2">
    <h1 className="text-2xl font-bold text-brand-primary mb-4">
      Finalizar compra
    </h1>

    <div className="space-y-4">
      {cart.map(product => (
        <div
          key={product.id}
          className="flex items-center gap-4 border rounded-md p-3 bg-brand-background"
        >
          {/* IMAGEN */}
      
<div className="w-16 h-16 bg-white rounded flex items-center justify-center overflow-hidden">
  <img
    src={product.images?.[0]}
    alt={product.name}
    className="w-full h-full object-contain"
  />
</div>


          {/* INFO */}
          <div className="flex-1">
            <p className="font-semibold text-sm">
              {product.name}
            </p>
            <p className="text-xs text-gray-600">
              ${product.price.toLocaleString()} c/u
            </p>

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => decreaseQty(product.id)}
                className="px-2 border rounded text-sm"
              >
                −
              </button>
              <span className="text-sm">{product.qty}</span>
              <button
                onClick={() => increaseQty(product.id)}
                className="px-2 border rounded text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* SUBTOTAL */}
          <div className="text-right">
            <p className="font-semibold text-brand-accent text-sm">
              ${(product.qty * product.price).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* COLUMNA DERECHA */}
  <section className="md:col-span-1">
    <div className="bg-white rounded-lg shadow p-4 md:sticky md:top-24">
      <div className="text-xl font-bold text-brand-primary mb-4">
        Total: ${total.toLocaleString()}
      </div>

<button
  onClick={handleMercadoPago}
  disabled={processing}
  className={`
    w-full
    flex items-center justify-center gap-3
    py-3 px-4
    rounded-lg
    text-lg font-semibold
    transition
    shadow
    ${processing
      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
      : "bg-[#009ee3] hover:bg-[#007eb5] text-white"}
  `}
>
  <img
    src={mpLogo}
    alt="MercadoPago"
    className="h-6"
  />
  {processing ? "Procesando pago..." : "Pagar con MercadoPago"}
</button>


      <p className="text-xs text-gray-500 text-center mt-2">
        Pago seguro. Podés usar tarjeta, transferencia o dinero en cuenta.
      </p>

<a
  href={whatsappUrl}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => setTimeout(() => navigate("/pedido-confirmado"), 500)}

  className="
    w-full
    flex items-center justify-center gap-3
    py-3 px-4
    rounded-lg
    text-lg font-semibold
    bg-[#25D366]
    hover:bg-[#1EBE57]
    text-white
    transition
    shadow
    mt-3
  "
>
  <img
    src={whatsappLogo}
    alt="WhatsApp"
    className="h-6"
  />
  Pedir por WhatsApp
</a>

      <button
        onClick={() => {
          if (confirm("¿Seguro que querés vaciar el carrito?")) {
            clearCart();
          }
        }}
        className="w-full bg-white border py-2 rounded-lg mt-3"
      >
        Vaciar carrito
      </button>
    </div>
  </section>

</main>
  );
}