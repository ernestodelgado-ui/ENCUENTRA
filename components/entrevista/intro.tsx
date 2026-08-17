"use client";

import Link from "next/link";
import { Heart, Search, UserRound } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/assets";

const PROMESAS = [
  { icon: UserRound, texto: "Empezamos por vos" },
  { icon: Search, texto: "Buscamos coincidencias" },
  { icon: Heart, texto: "Hay una persona detrás" },
];

/**
 * La puerta de entrada a la entrevista, a sangre completa sobre la fotografía.
 *
 * El degradé cambia de dirección según el ancho: en celular la foto se ve
 * arriba y el texto baja sobre un velo vertical; en desktop la persona de la
 * foto queda a la derecha y el texto se apoya sobre un velo horizontal. En los
 * dos casos el objetivo es el mismo: que la foto acompañe sin pelearle
 * legibilidad al titular.
 */
export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Decorativa: lo que hay que leer está en el texto, no en la imagen. El
          `alt` vacío ya la saca del árbol de accesibilidad — `aria-hidden` no
          corresponde acá porque <picture> no admite roles ARIA.

          Se sirve en WebP con una versión chica para celular (43 KB) y otra
          para pantallas grandes (116 KB), con JPG de respaldo. El original
          pesaba 2,2 MB. */}
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

      {/* El velo cambia de dirección y de fuerza según el ancho.
          En celular la columna de texto ocupa todo, así que baja en vertical:
          firme arriba —donde está el titular— y casi transparente abajo, para
          que la foto se vea y no quede un fondo pálido.
          En desktop el texto va a la izquierda y el velo corre en horizontal,
          dejando limpia la mitad derecha donde está la persona. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/70 to-background/10 sm:bg-gradient-to-r sm:from-background sm:via-background/85 sm:to-transparent"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Logo />

        <div className="flex flex-1 flex-col justify-center py-10 sm:py-14">
          <div className="max-w-xl">
            {/* La frase de marca vive en la Home. Acá, a un toque de distancia,
                repetirla sonaba a eco: quien llega ya la leyó. Este titular
                retoma el hilo en lugar de repetirlo. */}
            <h1 className="font-display text-[2.25rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
              Empecemos por <span className="text-coral">vos.</span>
            </h1>

            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Para encontrar una propiedad, primero necesitamos entender qué
              estás buscando.
            </p>
            <p className="mt-2 max-w-md text-lg font-medium text-foreground">
              Son 5 preguntas. Te lleva menos de 2 minutos.
            </p>

            <div className="mt-8">
              <Button
                onClick={onStart}
                size="lg"
                className="w-full justify-center sm:w-auto"
              >
                Empezar →
              </Button>

              <div className="mt-4">
                <Link
                  href="/buscar/filtros"
                  className="inline-block rounded-full text-sm font-medium text-foreground/75 underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/60"
                >
                  Prefiero buscar con filtros
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Velo propio: esta franja cae sobre la parte más texturada de la foto
            y el texto es chico. Con el degradé solo aguantaba a duras penas, y
            dejaría de aguantar apenas se cambie la fotografía. */}
        <ul className="-mx-3 flex flex-col gap-4 rounded-2xl bg-background/70 px-3 py-5 backdrop-blur-[2px] sm:mx-0 sm:flex-row sm:items-center sm:gap-0 sm:px-2">
          {PROMESAS.map(({ icon: Icon, texto }, i) => (
            <li
              key={texto}
              className={`flex items-center gap-3 sm:flex-1 sm:px-5 ${
                i > 0 ? "sm:border-l sm:border-border/70" : "sm:pl-0"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-coral/30 bg-background/70 text-coral">
                <Icon size={17} aria-hidden />
              </span>
              <span className="text-sm font-medium leading-tight text-foreground">
                {texto}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
