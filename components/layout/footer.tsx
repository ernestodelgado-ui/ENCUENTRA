import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { NUMERO_ASESOR } from "@/lib/whatsapp";
import { InstagramIcon, FacebookIcon } from "@/components/layout/social-icons";

const COLUMNS = [
  {
    title: "encuentra.",
    links: [
      { href: "/como-funciona", label: "Cómo funciona" },
      { href: "/para-quien-es", label: "Para quién es" },
      { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
  {
    title: "Legales",
    links: [
      { href: "/terminos", label: "Términos y condiciones" },
      { href: "/politica-de-privacidad", label: "Política de privacidad" },
      { href: "/proteccion-de-datos", label: "Protección de datos" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Tu búsqueda. Nuestra prioridad.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <SocialLink href="https://instagram.com" label="Instagram">
                <InstagramIcon size={18} />
              </SocialLink>
              <SocialLink href="https://facebook.com" label="Facebook">
                <FacebookIcon size={18} />
              </SocialLink>
              <SocialLink href={`https://wa.me/${NUMERO_ASESOR}`} label="WhatsApp">
                <MessageCircle size={18} aria-hidden />
              </SocialLink>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Acá vivía un formulario de newsletter. Se quitó: pedía email, que
              es justamente lo que esta versión no recolecta, y además no tenía
              a dónde enviarlo. */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              ¿Necesitás ayuda?
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Escribinos por WhatsApp y un asesor te responde.
            </p>
            <div className="mt-4">
              <Button href={`https://wa.me/${NUMERO_ASESOR}`} size="sm">
                Hablar con un asesor
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} encuentra. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-coral hover:text-coral"
    >
      {children}
    </a>
  );
}
