import { PuertasGrandes } from "@/components/home/puertas";
import { asset } from "@/lib/assets";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Decorativa: lo que hay que leer está en el texto. El `alt` vacío ya la
          saca del árbol de accesibilidad. Se sirve en WebP con una versión
          chica para celular (43 KB) y otra para pantallas grandes (116 KB). */}
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
          que la foto siga siendo una foto. Medido, el peor contraste de la
          bajada queda en torno a 7:1 sobre el mínimo legible de 4,5:1. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/78 to-background/25 sm:bg-gradient-to-r sm:from-background sm:via-background/88 sm:to-transparent"
      />

      {/* Los espacios verticales van ajustados en celular: con los originales,
          la tercera puerta caía 26px por debajo del pliegue en un iPhone SE
          (375x667). Que las tres se vean sin scrollear es el punto de la
          pantalla. */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="max-w-xl">
          <h1 className="font-display text-[1.9rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl">
            Primero entendemos qué necesitás.{" "}
            <span className="block">
              Después te ayudamos a{" "}
              <span className="text-coral">resolverlo.</span>
            </span>
          </h1>

          {/* Más oscura que el gris habitual de bajadas: acá va sobre una
              fotografía, no sobre el fondo plano del resto del sitio. */}
          <p className="mt-4 max-w-md leading-relaxed text-foreground/80 sm:mt-5 sm:text-lg">
            Comprar, alquilar o vender una propiedad puede ser mucho más simple
            cuando el proceso empieza por vos.
          </p>

          <div className="mt-6 sm:mt-8">
            <p className="font-display text-lg font-bold text-foreground">
              ¿Qué necesitás hoy?
            </p>

            <div className="mt-3 sm:mt-4">
              <PuertasGrandes />
            </div>

            <p className="mt-3 text-sm text-foreground/70 sm:mt-4">
              Menos de 2 minutos · Sin registro
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
