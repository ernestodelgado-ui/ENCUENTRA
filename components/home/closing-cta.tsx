import { PuertasCompactas } from "@/components/home/puertas";

/**
 * Cierre. Es la única parte de la Home donde encuentra. se permite hablar de la
 * intención en lugar de la mecánica, y por eso va sola: sin íconos, sin tarjeta
 * y sin nada alrededor que le reste peso.
 *
 * Debajo repite las tres puertas en vez de un botón único: con tres caminos
 * posibles, un solo CTA tendría que elegir uno por la persona.
 */
export function ClosingCta() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
      <p className="font-display text-2xl font-bold leading-tight tracking-tight text-muted-foreground sm:text-3xl">
        No buscamos mostrarte más propiedades.
      </p>
      <p className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
        Queremos ayudarte a resolver{" "}
        <span className="text-coral">lo que necesitás.</span>
      </p>

      <div className="mt-8">
        <PuertasCompactas />
      </div>
    </section>
  );
}
