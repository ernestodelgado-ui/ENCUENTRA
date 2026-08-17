import { Button } from "@/components/ui/button";

/**
 * Los tres pasos van numerados porque son una secuencia real: el orden importa
 * y es parte de lo que se quiere comunicar (primero vos, después las
 * propiedades).
 */
const PASOS = [
  {
    numero: "01",
    title: "Contanos qué buscás",
    description:
      "Zona, presupuesto, tipo de propiedad y aquello que para vos es importante.",
  },
  {
    numero: "02",
    title: "Te mostramos coincidencias",
    description:
      "Seleccionamos propiedades disponibles que se acercan a lo que estás buscando.",
  },
  {
    numero: "03",
    title: "Seguimos buscando con vos",
    description:
      "¿Ninguna era la indicada? Podés hablar con un asesor para continuar la búsqueda.",
  },
];

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="border-y border-border bg-card"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2
          id="how-it-works-heading"
          className="text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Cómo funciona
        </h2>

        <ol className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 sm:grid-cols-3 sm:gap-8">
          {PASOS.map(({ numero, title, description }) => (
            <li key={numero} className="border-t-2 border-coral/25 pt-5">
              <p
                aria-hidden
                className="font-display text-sm font-bold tabular-nums tracking-widest text-coral"
              >
                {numero}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Button href="/buscar" size="lg">
            Empezar mi búsqueda →
          </Button>
        </div>
      </div>
    </section>
  );
}
