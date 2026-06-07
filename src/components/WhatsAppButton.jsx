import whatsappIcon from "../assets/whatsapp.png";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5493436237454"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-50"
    >
      <img
        src={whatsappIcon}
        alt="WhatsApp"
        className="w-14 h-14 hover:scale-105 transition-transform"
      />
    </a>
  );
}