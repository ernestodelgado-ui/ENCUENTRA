"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

/**
 * Vuelve a donde la persona venía.
 *
 * Antes esto era un enlace fijo a la búsqueda, que perdía los resultados: quien
 * llegaba desde una grilla de opciones tenía que rehacer la búsqueda para ver
 * la siguiente. Con el historial vuelve a la lista tal como la dejó.
 *
 * Si la ficha fue la primera pantalla de la visita (alguien abrió un enlace
 * compartido) no hay a dónde volver, así que se cae al inicio.
 */
export function VolverAtras() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
      className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ChevronLeft size={18} aria-hidden />
      Volver
    </button>
  );
}
