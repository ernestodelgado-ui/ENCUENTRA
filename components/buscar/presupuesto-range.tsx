"use client";

import { useId } from "react";
import {
  MONEDAS,
  MONEDA_LABEL,
  formatMoneda,
  presupuestoCompleto,
  rangoDe,
  simboloDe,
  type Moneda,
  type Operacion,
  type Presupuesto,
} from "@/lib/search/types";

function porcentaje(valor: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((valor - min) / (max - min)) * 100;
}

/**
 * Barra de presupuesto con dos controles: desde y hasta.
 *
 * Los topes salen de `rangoDe(operacion, moneda)`, así que la escala se adapta
 * a lo que la persona esté buscando: comprar en dólares y alquilar en pesos no
 * comparten orden de magnitud.
 */
export function PresupuestoRange({
  operacion,
  presupuesto,
  onChange,
}: {
  operacion: Operacion;
  presupuesto: Presupuesto;
  onChange: (presupuesto: Presupuesto) => void;
}) {
  const idBase = useId();
  const { moneda, desde, hasta } = presupuesto;
  const rango = rangoDe(operacion, moneda);

  const izquierda = porcentaje(desde, rango.min, rango.max);
  const derecha = porcentaje(hasta, rango.min, rango.max);

  // Con ambos controles pegados al extremo derecho, el de "hasta" taparía al de
  // "desde" y no habría forma de volver a agarrarlo. Cuando "desde" pasa la
  // mitad, se lo pone por encima.
  const desdeArriba = izquierda > 50;

  const cambiarDesde = (valor: number) =>
    onChange({ ...presupuesto, desde: Math.min(valor, hasta - rango.paso) });

  const cambiarHasta = (valor: number) =>
    onChange({ ...presupuesto, hasta: Math.max(valor, desde + rango.paso) });

  // Cambiar de moneda no convierte: se vuelve al rango completo de la nueva.
  // Convertir a una cotización cableada envejecería mal y daría una precisión
  // que no tenemos.
  const cambiarMoneda = (nueva: Moneda) =>
    onChange(presupuestoCompleto(operacion, nueva));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base font-semibold text-foreground">
          {formatMoneda(desde, moneda)} – {formatMoneda(hasta, moneda)}
        </p>

        <div
          role="group"
          aria-label="Moneda del presupuesto"
          className="flex gap-1 rounded-full border border-border bg-card p-1"
        >
          {MONEDAS.map((m) => (
            <label
              key={m}
              className="cursor-pointer rounded-full px-3 py-1.5 text-sm transition-colors has-[:checked]:bg-coral has-[:checked]:font-semibold has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet"
            >
              <input
                type="radio"
                name={`${idBase}-moneda`}
                value={m}
                checked={moneda === m}
                onChange={() => cambiarMoneda(m)}
                className="sr-only"
              />
              {simboloDe(m)}{" "}
              <span className="sr-only">{MONEDA_LABEL[m]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rango mt-4">
        <div className="rango-pista" />
        <div
          className="rango-relleno"
          style={{ left: `${izquierda}%`, right: `${100 - derecha}%` }}
        />

        <input
          type="range"
          className="rango-input"
          style={{ zIndex: desdeArriba ? 4 : 3 }}
          min={rango.min}
          max={rango.max}
          step={rango.paso}
          value={desde}
          onChange={(event) => cambiarDesde(Number(event.target.value))}
          aria-label="Presupuesto desde"
          aria-valuetext={formatMoneda(desde, moneda)}
        />
        <input
          type="range"
          className="rango-input"
          style={{ zIndex: desdeArriba ? 3 : 4 }}
          min={rango.min}
          max={rango.max}
          step={rango.paso}
          value={hasta}
          onChange={(event) => cambiarHasta(Number(event.target.value))}
          aria-label="Presupuesto hasta"
          aria-valuetext={formatMoneda(hasta, moneda)}
        />
      </div>

      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{formatMoneda(rango.min, moneda)}</span>
        <span>{formatMoneda(rango.max, moneda)}+</span>
      </div>
    </div>
  );
}
