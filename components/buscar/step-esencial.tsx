"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PresupuestoRange } from "@/components/buscar/presupuesto-range";
import { Pastilla, Seccion, alternar } from "@/components/buscar/campos";
import { Button } from "@/components/ui/button";
import {
  DEPARTAMENTOS,
  OPERACIONES,
  OPERACION_LABEL,
  TIPOS_PROPIEDAD,
  TIPO_PROPIEDAD_LABEL,
  presupuestoCompleto,
  type Operacion,
  type SearchCriteria,
  type TipoPropiedad,
} from "@/lib/search/types";

/**
 * Un departamento desplegable con sus localidades adentro.
 *
 * Cerrado muestra cuántas hay tildadas, para que el estado siga siendo legible
 * sin tener que abrirlo.
 */
function Departamento({
  nombre,
  localidades,
  seleccionadas,
  abierto,
  onToggle,
  onSeleccionar,
  idPanel,
  namePrefix,
}: {
  nombre: string;
  localidades: string[];
  seleccionadas: string[];
  abierto: boolean;
  onToggle: () => void;
  onSeleccionar: (localidad: string) => void;
  idPanel: string;
  namePrefix: string;
}) {
  const cuantas = localidades.filter((l) => seleccionadas.includes(l)).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={abierto}
        aria-controls={idPanel}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-black/[0.02]"
      >
        <span className="font-medium text-foreground">{nombre}</span>

        {cuantas > 0 && (
          <span className="rounded-full bg-coral/10 px-2 py-0.5 text-xs font-semibold text-coral">
            {cuantas}
            <span className="sr-only">
              {" "}
              {cuantas === 1 ? "localidad tildada" : "localidades tildadas"}
            </span>
          </span>
        )}

        <ChevronDown
          size={18}
          aria-hidden
          className={`ml-auto shrink-0 text-muted-foreground transition-transform ${
            abierto ? "rotate-180" : ""
          }`}
        />
      </button>

      {abierto && (
        <div id={idPanel} className="border-t border-border px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {localidades.map((localidad) => (
              <Pastilla
                key={localidad}
                tipo="checkbox"
                name={`${namePrefix}-${localidad}`}
                checked={seleccionadas.includes(localidad)}
                onChange={() => onSeleccionar(localidad)}
              >
                {localidad}
              </Pastilla>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Paso 1 de 2: lo esencial. Es el único paso con un campo obligatorio. */
export function StepEsencial({
  criteria,
  onChange,
  onContinue,
}: {
  criteria: SearchCriteria;
  onChange: (criteria: SearchCriteria) => void;
  onContinue: () => void;
}) {
  const idBase = useId();
  const [error, setError] = useState<string | null>(null);

  // Arrancan abiertos los departamentos que ya tengan localidades tildadas,
  // para que al volver atrás se vea lo elegido y no una lista de acordeones
  // cerrados.
  const [abiertos, setAbiertos] = useState<string[]>(() =>
    DEPARTAMENTOS.filter((departamento) =>
      departamento.localidades.some((l) => criteria.zonas.includes(l))
    ).map((departamento) => departamento.nombre)
  );

  // Comprar y alquilar no comparten escala de precios, así que al cambiar de
  // operación el presupuesto vuelve al rango completo de la nueva.
  const cambiarOperacion = (operacion: Operacion) =>
    onChange({
      ...criteria,
      operacion,
      presupuesto: presupuestoCompleto(operacion, criteria.presupuesto.moneda),
    });

  const continuar = () => {
    if (criteria.tiposPropiedad.length === 0) {
      setError("Elegí al menos un tipo de propiedad.");
      return;
    }
    setError(null);
    onContinue();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
        ¿Qué estás <span className="text-coral">buscando?</span>
      </h1>
      <p className="mt-2 text-muted-foreground">Empecemos por lo esencial.</p>

      <div className="mt-7 space-y-6">
        <Seccion titulo="Operación">
          <div className="flex flex-wrap gap-2">
            {OPERACIONES.map((operacion) => (
              <Pastilla
                key={operacion}
                tipo="radio"
                name={`${idBase}-operacion`}
                checked={criteria.operacion === operacion}
                onChange={() => cambiarOperacion(operacion)}
              >
                {OPERACION_LABEL[operacion]}
              </Pastilla>
            ))}
          </div>
        </Seccion>

        <Seccion
          titulo="Tipo de propiedad"
          ayuda="Podés tildar varias."
          error={error ?? undefined}
        >
          <div className="flex flex-wrap gap-2">
            {TIPOS_PROPIEDAD.map((tipo) => (
              <Pastilla
                key={tipo}
                tipo="checkbox"
                name={`${idBase}-tipo-${tipo}`}
                checked={criteria.tiposPropiedad.includes(tipo)}
                onChange={() => {
                  setError(null);
                  onChange({
                    ...criteria,
                    tiposPropiedad: alternar<TipoPropiedad>(
                      criteria.tiposPropiedad,
                      tipo
                    ),
                  });
                }}
              >
                {TIPO_PROPIEDAD_LABEL[tipo]}
              </Pastilla>
            ))}
          </div>
        </Seccion>

        <Seccion
          titulo="Presupuesto"
          ayuda="Movés los dos extremos para marcar desde y hasta cuánto querés invertir."
        >
          <PresupuestoRange
            operacion={criteria.operacion}
            presupuesto={criteria.presupuesto}
            onChange={(presupuesto) => onChange({ ...criteria, presupuesto })}
          />
        </Seccion>

        <Seccion
          titulo="Zona"
          ayuda="Abrí un departamento y tildá las localidades. Si no tildás ninguna, buscamos en todas."
        >
          <div className="space-y-2">
            {DEPARTAMENTOS.map((departamento) => (
              <Departamento
                key={departamento.nombre}
                nombre={departamento.nombre}
                localidades={departamento.localidades}
                seleccionadas={criteria.zonas}
                abierto={abiertos.includes(departamento.nombre)}
                onToggle={() =>
                  setAbiertos((previos) =>
                    alternar(previos, departamento.nombre)
                  )
                }
                onSeleccionar={(localidad) =>
                  onChange({
                    ...criteria,
                    zonas: alternar(criteria.zonas, localidad),
                  })
                }
                idPanel={`${idBase}-dep-${departamento.nombre}`}
                namePrefix={`${idBase}-zona`}
              />
            ))}
          </div>

          {criteria.zonas.length > 0 && (
            <button
              type="button"
              onClick={() => onChange({ ...criteria, zonas: [] })}
              className="mt-3 text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              Limpiar zonas ({criteria.zonas.length})
            </button>
          )}
        </Seccion>
      </div>

      <div className="mt-9">
        <Button onClick={continuar} size="lg" className="w-full justify-center">
          Continuar →
        </Button>
      </div>
    </div>
  );
}
