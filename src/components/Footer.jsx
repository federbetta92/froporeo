import whatsappIcon from "../assets/whatsapp.png";
import instagramIcon from "../assets/instagram.png";

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

        {/* INFO */}
        <div>
          <h3 className="font-semibold uppercase tracking-wide mb-3 text-brand-accent">
            Almacén FROPOREO (PREVIEW)
          </h3>
          <p>Almacén de barrio con envío a domicilio.</p>
          <p className="mt-1">📍 Zona de entregas locales</p>
        </div>

        {/* HORARIOS */}
        <div>
          <h3 className="font-semibold uppercase tracking-wide mb-3 text-brand-accent">
            Horarios
          </h3>
          <p>Lunes, Martes, Jueves y Viernes: 17:00 a 21:30</p>
          <p>Miércoles: 16:00 a 20:00</p>
          <p>Sábados: 9:00 a 13:00</p>
          
        </div>

        {/* CONTACTO */}
        <div>
          <h3 className="font-semibold uppercase tracking-wide mb-3 text-brand-accent">
            Contacto
          </h3>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/5493436237454"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={whatsappIcon}
                alt="WhatsApp"
                className="w-10 h-10"
              />
            </a>

            <a
              href="https://instagram.com/froporeo_almacen"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={instagramIcon}
                alt="Instagram"
                className="w-10 h-10"
              />
            </a>
          </div>

          <p className="mt-3 text-sm">
            🚚 Envíos en el día en Paraná (gratis) y alrededores
          </p>
        </div>
      </div>

      <div className="text-center text-xs py-4 border-t border-white/10">
        © {new Date().getFullYear()} FROPOREO · Todos los derechos reservados
      </div>
    </footer>
  );
}