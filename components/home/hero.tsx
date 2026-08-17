import { SlidersHorizontal, HandCoins, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Beneficios reales, sin prometer nada que hoy no podamos cumplir.
 *
 * Los anteriores hablaban de IA ("Usamos IA para entender lo que buscás") y de
 * anticipación ("Recibí las opciones antes que nadie"): ninguna de las dos cosas
 * existe todavía.
 */
const BENEFICIOS = [
  {
    icon: SlidersHorizontal,
    title: "Búsqueda personalizada",
    description: "Filtramos las opciones según lo que realmente necesitás.",
    tint: "bg-violet/10 text-violet",
  },
  {
    icon: HandCoins,
    title: "Sin costo para vos",
    description: "Podés buscar y consultar sin compromiso.",
    tint: "bg-coral/10 text-coral",
  },
  {
    icon: UserRound,
    title: "Asesoramiento humano",
    description: "Si necesitás ayuda, hablás directamente con un asesor.",
    tint: "bg-foreground/[0.06] text-foreground",
  },
];

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:pt-20">
      <div>
        <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
          Tu próximo hogar empieza con una{" "}
          <span className="text-coral">búsqueda mejor.</span>
        </h1>

        <p className="mt-5 max-w-md text-lg text-muted-foreground">
          Contanos qué estás buscando y te mostramos opciones que pueden encajar
          con vos.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/buscar" size="lg" className="justify-center">
            Comenzar búsqueda →
          </Button>
        </div>

        <ul className="mt-10 space-y-5">
          {BENEFICIOS.map(({ icon: Icon, title, description, tint }) => (
            <li key={title} className="flex items-start gap-3.5">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tint}`}
              >
                <Icon size={20} aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 lg:mt-0">
        {/* Placeholder de fotografía inmobiliaria: reemplazar por foto real,
            luminosa y aspiracional de una propiedad representativa de Uruguay
            antes de publicar. */}
        <div
          role="img"
          aria-label="Living luminoso de un apartamento, con grandes ventanales, plantas y vista a la ciudad"
          className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-gradient-to-br from-orange/25 via-coral/10 to-violet/15 sm:aspect-[16/11]"
        >
          <div className="absolute inset-0 flex items-center justify-center text-sm text-foreground/40">
            [ foto de propiedad — placeholder ]
          </div>
        </div>
      </div>
    </section>
  );
}
