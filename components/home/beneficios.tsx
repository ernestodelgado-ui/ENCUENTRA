import { Handshake, Target, UserRound } from "lucide-react";

/**
 * Los tres beneficios, en el orden en que ocurren: primero vos, después la
 * búsqueda, y una persona al final si hace falta.
 *
 * Salieron del hero para que el CTA quede a la vista en celular sin scrollear.
 */
const BENEFICIOS = [
  {
    icon: UserRound,
    title: "Empezamos por vos",
    description:
      "Primero entendemos qué necesitás antes de mostrarte propiedades.",
    tint: "bg-violet/10 text-violet",
  },
  {
    icon: Target,
    title: "Buscamos coincidencias",
    description:
      "Usamos tus preferencias para seleccionar opciones que pueden encajar con tu búsqueda.",
    tint: "bg-coral/10 text-coral",
  },
  {
    icon: Handshake,
    title: "Hay una persona detrás",
    description:
      "Si ninguna termina de convencerte, un asesor puede continuar buscando con vos.",
    tint: "bg-foreground/[0.06] text-foreground",
  },
];

export function Beneficios() {
  return (
    <section
      aria-label="Por qué encuentra. es distinto"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {BENEFICIOS.map(({ icon: Icon, title, description, tint }) => (
          <li key={title} className="flex gap-4 sm:flex-col sm:gap-3">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tint}`}
            >
              <Icon size={20} aria-hidden />
            </span>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
