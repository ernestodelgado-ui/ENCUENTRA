import { SlidersHorizontal, ListChecks, Search } from "lucide-react";

const PASOS = [
  {
    number: "1",
    icon: SlidersHorizontal,
    title: "Contá qué buscás",
    description:
      "Elegí operación, tipo de propiedad, zona y presupuesto.",
  },
  {
    number: "2",
    icon: ListChecks,
    title: "Afiná tu búsqueda",
    description:
      "Sumá dormitorios, baños y las características que sean importantes para vos.",
  },
  {
    number: "3",
    icon: Search,
    title: "Encontrá opciones",
    description:
      "Te mostramos propiedades disponibles que pueden coincidir con tu búsqueda, y podés hablar con un asesor cuando quieras.",
  },
];

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <h2
        id="how-it-works-heading"
        className="text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
      >
        Así de simple funciona <span className="text-coral">encuentra.</span>
      </h2>

      <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PASOS.map(({ number, icon: Icon, title, description }) => (
          <li
            key={number}
            className="relative rounded-card border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet/10 text-violet">
                <Icon size={20} aria-hidden />
              </span>
              <span
                aria-hidden
                className="text-sm font-semibold text-muted-foreground"
              >
                Paso {number}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
