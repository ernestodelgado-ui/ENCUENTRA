import { Button } from "@/components/ui/button";

/**
 * El hero carga toda la propuesta: encuentra. no arranca por las propiedades,
 * arranca por la persona.
 *
 * Los tres beneficios que antes vivían acá se mudaron a su propia sección. En
 * celular empujaban el CTA fuera de la pantalla, y la idea es que se entienda
 * qué es, por qué es distinto y qué hacer sin tener que scrollear.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14 lg:px-8 lg:pt-20">
      <div>
        <h1 className="font-display text-[2rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl">
          Primero entendemos qué buscás.{" "}
          <span className="block">
            Después salimos a{" "}
            <span className="text-coral">encontrarlo.</span>
          </span>
        </h1>

        <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
          No empieces por cientos de propiedades. Empecemos por vos. Contanos qué
          necesitás y te ayudamos a encontrar opciones que realmente tengan
          sentido para tu búsqueda.
        </p>

        <div className="mt-8">
          <Button href="/buscar" size="lg" className="w-full justify-center sm:w-auto">
            Empezar mi búsqueda →
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            Gratis · Sin compromiso · En menos de 2 minutos
          </p>
        </div>
      </div>

      {/* La fotografía acompaña, no compite: va después del CTA en celular y con
          un tratamiento más suave que el del titular. Reemplazar por una foto
          real, luminosa, de una propiedad representativa de Uruguay. */}
      <div className="mt-12 lg:mt-0">
        <div
          role="img"
          aria-label="Living luminoso de un apartamento, con grandes ventanales, plantas y vista a la ciudad"
          className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-gradient-to-br from-orange/15 via-coral/[0.06] to-violet/10 sm:aspect-[16/11]"
        >
          <div className="absolute inset-0 flex items-center justify-center text-sm text-foreground/30">
            [ foto de propiedad — placeholder ]
          </div>
        </div>
      </div>
    </section>
  );
}
