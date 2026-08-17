import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ResultadosContenido } from "@/components/resultados/resultados-contenido";

export const metadata: Metadata = {
  title: "Opciones para tu búsqueda",
  description:
    "Propiedades disponibles que pueden coincidir con lo que estás buscando.",
  // Cada combinación de filtros es una URL distinta: no tiene sentido indexarlas.
  robots: { index: false, follow: true },
};

/**
 * El contenido va en un componente cliente porque los filtros viajan en la
 * query string y el sitio se publica estático. `useSearchParams` obliga a
 * envolverlo en Suspense: el HTML prerenderizado muestra el esqueleto y el
 * navegador completa los resultados.
 */
export default function ResultadosPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<EsqueletoResultados />}>
          <ResultadosContenido />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function EsqueletoResultados() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <p className="text-muted-foreground">Buscando opciones…</p>
      <div
        aria-hidden
        className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-card border border-border bg-card"
          />
        ))}
      </div>
    </div>
  );
}
