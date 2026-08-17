/**
 * El puente entre el hero y los beneficios: nombra el problema antes de
 * proponer la solución.
 *
 * La enumeración del desgaste va en gris y en frases cortas separadas por
 * puntos, para que se lea como lo que describe — un ciclo cansador — y la
 * respuesta de encuentra. queda en tinta plena. Esa diferencia de peso es la
 * que hace el trabajo; por eso la sección no necesita ni recuadros ni íconos.
 */
export function Manifiesto() {
  return (
    <section
      aria-labelledby="manifiesto-heading"
      className="border-y border-border bg-card"
    >
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2
          id="manifiesto-heading"
          className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl"
        >
          Buscar una propiedad no debería ser agotador.
        </h2>

        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Abrir publicaciones. Comparar precios. Volver atrás. Cambiar filtros.
          Guardar opciones. Empezar otra vez.
        </p>

        <p className="mt-5 text-lg leading-relaxed text-foreground">
          En <span className="font-semibold">encuentra.</span> hacemos el
          recorrido al revés: primero queremos saber qué estás buscando. Después
          buscamos las opciones que pueden encajar con vos.
        </p>
      </div>
    </section>
  );
}
