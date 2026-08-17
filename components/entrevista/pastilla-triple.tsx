"use client";

import { Check, Circle } from "lucide-react";

/**
 * Pastilla de tres estados, para separar lo imprescindible de lo deseable sin
 * duplicar la lista en pantalla.
 *
 * Cada toque avanza un estado: apagada → imprescindible → me gustaría → apagada.
 * Los símbolos (✓ y ○) son los mismos que después usa la síntesis, así que el
 * gesto y el resumen hablan el mismo idioma.
 *
 * No se usa un checkbox porque no hay dos estados sino tres. Es un botón común
 * cuyo nombre accesible incluye el estado actual, de modo que un lector de
 * pantalla anuncia "Garaje, imprescindible" al enfocarlo.
 */
export type EstadoTriple = "no" | "imprescindible" | "deseable";

export const SIGUIENTE_ESTADO: Record<EstadoTriple, EstadoTriple> = {
  no: "imprescindible",
  imprescindible: "deseable",
  deseable: "no",
};

const ESTILOS: Record<EstadoTriple, string> = {
  no: "border-border bg-card text-foreground hover:border-foreground/25",
  imprescindible:
    "border-coral bg-coral/10 font-semibold text-coral hover:bg-coral/15",
  deseable: "border-violet bg-violet/10 font-medium text-violet hover:bg-violet/15",
};

const DICHO: Record<EstadoTriple, string> = {
  no: "sin marcar",
  imprescindible: "imprescindible",
  deseable: "me gustaría",
};

export function PastillaTriple({
  etiqueta,
  estado,
  onCiclar,
}: {
  etiqueta: string;
  estado: EstadoTriple;
  onCiclar: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCiclar}
      className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm transition-colors ${ESTILOS[estado]}`}
    >
      {estado === "imprescindible" && (
        <Check size={14} strokeWidth={3} aria-hidden />
      )}
      {estado === "deseable" && <Circle size={12} aria-hidden />}
      {etiqueta}
      <span className="sr-only">: {DICHO[estado]}</span>
    </button>
  );
}

/** Leyenda que explica el gesto antes de mostrar las pastillas. */
export function LeyendaTriple() {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Check size={13} strokeWidth={3} className="text-coral" aria-hidden />
        Un toque: imprescindible
      </span>
      <span className="flex items-center gap-1.5">
        <Circle size={11} className="text-violet" aria-hidden />
        Dos toques: me gustaría
      </span>
    </p>
  );
}
