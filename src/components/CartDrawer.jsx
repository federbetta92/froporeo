import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"

export default function CartDrawer({ open, onClose }) {
  const {
    cart,
    increaseQty,
    decreaseQty,
    clearCart,
    total
  } = useCart()

  const navigate = useNavigate()

  return (
    <div
      className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className="flex-1 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`w-96 max-w-full bg-white flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold text-brand-primary">
            Tu carrito
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-brand-primary text-xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-8">
              🛒 El carrito está vacío
            </p>
          )}

          {cart.map(item => (
            <div
              key={item.id}
              className="border border-brand-soft rounded-lg p-3 bg-white"
            >
              <p className="font-semibold text-sm text-brand-text">
                {item.name}
              </p>

              <div className="flex justify-between items-center mt-3">
                {/* CONTROLES */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="min-w-[20px] text-center text-sm">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* PRECIO */}
                <span className="font-bold text-brand-accent text-sm">
                  ${(item.qty * item.price).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="border-t px-5 py-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-brand-primary">
              Total
            </span>
            <span className="text-lg font-bold text-brand-primary">
              ${total.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => {
              onClose()
              navigate("/checkout")
            }}
            disabled={cart.length === 0}
            className="
              w-full
              bg-brand-accent
              hover:bg-orange-600
              text-white
              font-semibold
              py-2
              rounded-lg
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Ir a checkout
          </button>

          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            className="
              w-full
              bg-white
              border
              text-sm
              py-2
              rounded-lg
              hover:bg-gray-100
              transition
              disabled:opacity-50
            "
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  )
}