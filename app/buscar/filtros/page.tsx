import type { Metadata } from "next";
import { HeaderMinimo } from "@/components/buscar/header-minimo";
import { SearchFlow } from "@/components/buscar/search-flow";

export const metadata: Metadata = {
  title: "Buscar con filtros",
  description:
    "Elegí operación, tipo de propiedad, zona y presupuesto, y te mostramos opciones disponibles que pueden coincidir con tu búsqueda.",
};

/**
 * El camino tradicional, para quien prefiere filtrar en lugar de responder
 * preguntas. Produce exactamente los mismos criterios que la entrevista y
 * termina en la misma pantalla de resultados.
 */
export default function FiltrosPage() {
  return (
    <>
      <HeaderMinimo />
      <SearchFlow />
    </>
  );
}
