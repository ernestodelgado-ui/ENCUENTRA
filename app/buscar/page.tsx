import type { Metadata } from "next";
import { SearchFlow } from "@/components/buscar/search-flow";

export const metadata: Metadata = {
  title: "Contanos qué estás buscando",
  description:
    "Elegí operación, tipo de propiedad, zona y presupuesto, y te mostramos opciones disponibles que pueden coincidir con tu búsqueda.",
};

export default function BuscarPage() {
  return <SearchFlow />;
}
