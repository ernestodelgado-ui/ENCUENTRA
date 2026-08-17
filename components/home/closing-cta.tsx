import { Button } from "@/components/ui/button";

export function ClosingCta() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        ¿Listo para encontrar tu próximo hogar?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
        Contanos qué buscás y te mostramos opciones. Sin costo ni compromiso.
      </p>
      <div className="mt-7">
        <Button href="/buscar" size="lg">
          Comenzar búsqueda →
        </Button>
      </div>
    </section>
  );
}
