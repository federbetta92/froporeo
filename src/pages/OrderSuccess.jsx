import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <main className="max-w-3xl mx-auto p-6 text-center">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ ¡Pedido confirmado!
        </h1>

        <p className="text-gray-700 mb-6">
          Gracias por tu compra. En breve nos comunicaremos para coordinar
          la entrega o el retiro.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-brand-accent text-white px-6 py-3 rounded-lg font-semibold"
        >
          Volver al catálogo
        </button>
      </div>
    </main>
  );
}