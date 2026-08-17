import Link from "next/link";
import { Home, Key, Tag } from "lucide-react";

/**
 * Las tres entradas a la plataforma.
 *
 * Viven en un solo lugar porque aparecen en el hero y otra vez al cierre de la
 * Home. Con tres puertas, cualquier CTA único tendría que elegir una por la
 * persona, que es exactamente lo que no queremos.
 */
export const PUERTAS = [
  {
    href: "/buscar/comprar",
    icon: Home,
    titulo: "Comprar",
    detalle: "Encontrá tu próxima propiedad",
  },
  {
    href: "/buscar/alquilar",
    icon: Key,
    titulo: "Alquilar",
    detalle: "Buscá dónde vivir",
  },
  {
    href: "/vender",
    icon: Tag,
    titulo: "Vender",
    detalle: "Empezá a pensar la venta",
  },
] as const;

/** Versión grande, con explicación. Para el hero. */
export function PuertasGrandes() {
  return (
    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
      {PUERTAS.map(({ href, icon: Icon, titulo, detalle }) => (
        <li key={href}>
          {/* `h-full` es lo que empareja las tres tarjetas. La grilla estira el
              <li> a la altura de la fila, pero el enlace de adentro se quedaba
              con el alto de su contenido: "Alquilar", cuya descripción entra en
              una línea, medía 134px contra 153px de las otras dos. */}
          <Link
            href={href}
            className="flex h-full min-h-15 items-center gap-3 rounded-card border border-border bg-card/95 px-4 py-3 transition-colors hover:border-coral hover:bg-card sm:min-h-16 sm:flex-col sm:items-start sm:justify-center sm:gap-2 sm:py-5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">
              <Icon size={19} aria-hidden />
            </span>
            <span>
              <span className="block font-display text-lg font-bold leading-tight text-foreground">
                {titulo}
              </span>
              <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                {detalle}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Versión al pie de la Home: sólo los nombres.
 *
 * Va en contorno y no en coral pleno. Tres botones sólidos seguidos pesan
 * demasiado y le comen protagonismo al hero, que es donde la elección importa;
 * acá la función es recordar que las opciones siguen disponibles.
 */
export function PuertasCompactas() {
  return (
    <ul className="flex flex-col justify-center gap-3 sm:flex-row">
      {PUERTAS.map(({ href, icon: Icon, titulo }) => (
        <li key={href}>
          <Link
            href={href}
            className="flex min-h-13 items-center justify-center gap-2 rounded-full border border-coral/40 bg-card px-7 text-base font-semibold text-coral transition-colors hover:border-coral hover:bg-coral/[0.06] sm:min-w-[9rem]"
          >
            <Icon size={18} aria-hidden />
            {titulo}
          </Link>
        </li>
      ))}
    </ul>
  );
}
