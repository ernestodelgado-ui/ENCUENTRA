"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Pastilla, alternar } from "@/components/buscar/campos";
import { DEPARTAMENTOS } from "@/lib/search/types";

/**
 * Departamentos desplegables con sus localidades adentro.
 *
 * Son más de cincuenta localidades: mostrarlas todas juntas sería una pared.
 * Cerrado, cada departamento muestra cuántas hay tildadas, para que el estado
 * siga siendo legible sin abrirlo.
 *
 * Lo comparten el recorrido guiado y los filtros tradicionales, así los dos
 * caminos producen exactamente el mismo dato.
 */
export function SelectorZonas({
  seleccionadas,
  onChange,
}: {
  seleccionadas: string[];
  onChange: (zonas: string[]) => void;
}) {
  const idBase = useId();

  // Arrancan abiertos los que ya tengan localidades tildadas, para que al
  // volver atrás se vea lo elegido y no una lista de acordeones cerrados.
  const [abiertos, setAbiertos] = useState<string[]>(() =>
    DEPARTAMENTOS.filter((d) =>
      d.localidades.some((l) => seleccionadas.includes(l))
    ).map((d) => d.nombre)
  );

  return (
    <div>
      <div className="space-y-2">
        {DEPARTAMENTOS.map(({ nombre, localidades }) => {
          const abierto = abiertos.includes(nombre);
          const cuantas = localidades.filter((l) =>
            seleccionadas.includes(l)
          ).length;
          const idPanel = `${idBase}-${nombre}`;

          return (
            <div
              key={nombre}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <button
                type="button"
                onClick={() => setAbiertos((p) => alternar(p, nombre))}
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
                      {cuantas === 1
                        ? "localidad tildada"
                        : "localidades tildadas"}
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
                        name={`${idBase}-loc-${localidad}`}
                        checked={seleccionadas.includes(localidad)}
                        onChange={() =>
                          onChange(alternar(seleccionadas, localidad))
                        }
                      >
                        {localidad}
                      </Pastilla>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {seleccionadas.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="mt-3 text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
        >
          Limpiar zonas ({seleccionadas.length})
        </button>
      )}
    </div>
  );
}
