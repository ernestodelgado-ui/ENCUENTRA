"use client";

import { useId } from "react";
import { Pastilla, Seccion, alternar } from "@/components/buscar/campos";
import { Button } from "@/components/ui/button";
import {
  CARACTERISTICAS,
  CARACTERISTICA_LABEL,
  OPCIONES_BANOS,
  OPCIONES_DORMITORIOS,
  formatBano,
  formatDormitorio,
  type Caracteristica,
  type SearchCriteria,
} from "@/lib/search/types";

/**
 * Paso 2 de 2: todo opcional.
 *
 * Nada acá bloquea el avance a propósito. Dormitorios y baños acotan la
 * búsqueda; las características sólo ordenan los resultados por relevancia, sin
 * descartar nada (ver `lib/propiedades/matching.ts`).
 */
export function StepAfinar({
  criteria,
  onChange,
  onContinue,
}: {
  criteria: SearchCriteria;
  onChange: (criteria: SearchCriteria) => void;
  onContinue: () => void;
}) {
  const idBase = useId();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
        Afinemos tu <span className="text-coral">búsqueda</span>
      </h1>
      <p className="mt-2 text-muted-foreground">
        Este paso es opcional. Marcá solamente lo que sea importante para vos.
      </p>

      <div className="mt-7 space-y-6">
        <Seccion titulo="Dormitorios">
          <div className="flex flex-wrap gap-2">
            {OPCIONES_DORMITORIOS.map((n) => (
              <Pastilla
                key={n}
                tipo="checkbox"
                name={`${idBase}-dorm-${n}`}
                checked={criteria.dormitorios.includes(n)}
                onChange={() =>
                  onChange({
                    ...criteria,
                    dormitorios: alternar(criteria.dormitorios, n),
                  })
                }
              >
                {formatDormitorio(n)}
              </Pastilla>
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Baños">
          <div className="flex flex-wrap gap-2">
            {OPCIONES_BANOS.map((n) => (
              <Pastilla
                key={n}
                tipo="checkbox"
                name={`${idBase}-bano-${n}`}
                checked={criteria.banos.includes(n)}
                onChange={() =>
                  onChange({
                    ...criteria,
                    banos: alternar(criteria.banos, n),
                  })
                }
              >
                {formatBano(n)}
              </Pastilla>
            ))}
          </div>
        </Seccion>

        <Seccion
          titulo="Características"
          ayuda="Las usamos para ordenar los resultados, no para descartar propiedades."
        >
          <div className="flex flex-wrap gap-2">
            {CARACTERISTICAS.map((caracteristica) => (
              <Pastilla
                key={caracteristica}
                tipo="checkbox"
                name={`${idBase}-carac-${caracteristica}`}
                checked={criteria.caracteristicas.includes(caracteristica)}
                onChange={() =>
                  onChange({
                    ...criteria,
                    caracteristicas: alternar<Caracteristica>(
                      criteria.caracteristicas,
                      caracteristica
                    ),
                  })
                }
              >
                {CARACTERISTICA_LABEL[caracteristica]}
              </Pastilla>
            ))}
          </div>
        </Seccion>
      </div>

      <div className="mt-9">
        <Button onClick={onContinue} size="lg" className="w-full justify-center">
          Ver opciones →
        </Button>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Es gratis y sin compromiso.
        </p>
      </div>
    </div>
  );
}
