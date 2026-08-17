import Link from "next/link";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/assets";

/**
 * El hero carga toda la propuesta y además es la puerta de entrada a la
 * entrevista.
 *
 * Antes había dos pantallas para esto: esta y una introducción dentro de
 * /buscar. Hacían el mismo trabajo —mismo titular, mismo botón, las mismas tres
 * promesas— así que se fundieron acá. "Empezar mi búsqueda" ahora va derecho a
 * la primera pregunta, sin escala intermedia.
 *
 * El velo cambia de dirección según el ancho: en celular baja en vertical,
 * firme arriba donde está el titular y casi transparente abajo, para que la
 * foto se vea; en desktop corre en horizontal y deja limpia la mitad derecha,
 * donde está la persona.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Decorativa: lo que hay que leer está en el texto. El `alt` vacío ya la
          saca del árbol de accesibilidad.

          Se sirve en WebP con una versión chica para celular (43 KB) y otra
          para pantallas grandes (116 KB), con JPG de respaldo. */}
      <picture>
        <source
          media="(max-width: 640px)"
          srcSet={asset("/hero-800.webp")}
          type="image/webp"
        />
        <source srcSet={asset("/hero-1600.webp")} type="image/webp" />
        <img
          src={asset("/hero-1600.jpg")}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center]"
        />
      </picture>

      {/* Velo justo: el suficiente para que el texto se lea, y ni uno más, para
          que la foto siga siendo una foto.

          La bajada va sobre la zona más contrastada de la imagen —de cielo
          claro a pelo oscuro—. Con el gris habitual de bajadas quedaba en
          2,5:1, por debajo del mínimo legible de 4,5:1. Se resolvió oscureciendo
          la tipografía (ver abajo) en lugar de tapar la fotografía: así queda
          en torno a 7:1 sin apagarla. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/72 to-background/15 sm:bg-gradient-to-r sm:from-background sm:via-background/85 sm:to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="max-w-xl">
          <h1 className="font-display text-[2rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl">
            Primero entendemos qué buscás.{" "}
            <span className="block">
              Después salimos a <span className="text-coral">encontrarlo.</span>
            </span>
          </h1>

          {/* Más oscura que el gris habitual de bajadas: acá va sobre una
              fotografía, no sobre el fondo plano del resto del sitio. */}
          <p className="mt-5 max-w-md text-lg leading-relaxed text-foreground/80">
            No empieces por cientos de propiedades. Empecemos por vos. Contanos
            qué necesitás y te ayudamos a encontrar opciones que realmente
            tengan sentido para tu búsqueda.
          </p>

          <div className="mt-8">
            <Button
              href="/buscar"
              size="lg"
              className="w-full justify-center sm:w-auto"
            >
              Empezar mi búsqueda →
            </Button>

            <p className="mt-3 text-sm text-foreground/70">
              Son 5 preguntas · Menos de 2 minutos · Gratis y sin compromiso
            </p>

            <div className="mt-4">
              <Link
                href="/buscar/filtros"
                className="inline-block text-sm font-medium text-foreground/75 underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/60"
              >
                Prefiero buscar con filtros
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
