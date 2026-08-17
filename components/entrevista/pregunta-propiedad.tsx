"use client";

import { useId } from "react";
import { Pastilla, Seccion, alternar } from "@/components/buscar/campos";
import {
  GrupoChips,
  Pregunta,
  PrefieroElegir,
  TextoLibre,
} from "@/components/entrevista/pregunta";
import {
  preguntaBanos,
  preguntaCaracteristicas,
  preguntaDormitorios,
  preguntaPiso,
  preguntaSuperficie,
} from "@/lib/entrevista/reglas";
import {
  CARACTERISTICAS,
  CARACTERISTICA_LABEL,
  PREFERENCIAS_PISO,
  PREFERENCIA_PISO_LABEL,
  TIPOS_PROPIEDAD,
  TIPO_PROPIEDAD_LABEL,
  type Caracteristica,
  type PreferenciaPiso,
  type SearchProfile,
  type TipoPropiedad,
} from "@/lib/entrevista/types";

const OPCIONES_DORMITORIOS = [0, 1, 2, 3, 4, 5];
const OPCIONES_BANOS = [1, 2, 3, 4];

function etiquetaDormitorio(n: number): string {
  if (n === 0) return "Monoambiente";
  if (n === 5) return "5+";
  return String(n);
}

/**
 * Pregunta 2: cómo tendría que ser la propiedad.
 *
 * Es donde más se nota la lógica condicional. Los campos aparecen recién cuando
 * corresponden al tipo elegido: a un terreno no se le preguntan dormitorios, y
 * lo de planta baja o piso alto sólo tiene sentido en un apartamento. Las
 * decisiones viven en `lib/entrevista/reglas.ts`, no acá.
 */
export function PreguntaPropiedad({
  perfil,
  onChange,
  onContinue,
}: {
  perfil: SearchProfile;
  onChange: (perfil: SearchProfile) => void;
  onContinue: () => void;
}) {
  const idBase = useId();
  const { property } = perfil;

  const actualizar = (cambios: Partial<SearchProfile["property"]>) =>
    onChange({ ...perfil, property: { ...property, ...cambios } });

  const yaEligio =
    property.type !== null ||
    property.features.length > 0 ||
    property.bedrooms.length > 0;

  return (
    <Pregunta
      titulo="¿Cómo tendría que ser ese lugar?"
      bajada="Pensá en el tipo de propiedad, los espacios y aquello que te haría sentir cómodo viviendo ahí."
      onContinue={onContinue}
    >
      <TextoLibre
        etiqueta="Contanos cómo tendría que ser"
        placeholder="Ej.: Apartamento de dos dormitorios, mucha luz, balcón y espacio para trabajar."
        valor={property.freeText}
        onChange={(freeText) => actualizar({ freeText })}
      />

      <PrefieroElegir abiertoInicial={yaEligio}>
        <div className="space-y-6">
          <fieldset>
            <legend className="text-sm font-semibold text-foreground">
              Tipo de propiedad
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {TIPOS_PROPIEDAD.map((tipo) => (
                <Pastilla
                  key={tipo}
                  tipo="radio"
                  name={`${idBase}-tipo`}
                  checked={property.type === tipo}
                  onChange={() =>
                    actualizar({
                      type: tipo as TipoPropiedad,
                      // Al cambiar de tipo se limpian los campos que dejan de
                      // corresponder, para que no viajen datos fantasma.
                      ...(tipo === "terreno"
                        ? { bedrooms: [], bathrooms: [], features: [] }
                        : {}),
                      ...(tipo !== "apartamento" ? { floorPreference: null } : {}),
                    })
                  }
                >
                  {TIPO_PROPIEDAD_LABEL[tipo]}
                </Pastilla>
              ))}
            </div>
          </fieldset>

          {preguntaDormitorios(perfil) && (
            <Seccion titulo="Dormitorios">
              <div className="flex flex-wrap gap-2">
                {OPCIONES_DORMITORIOS.map((n) => (
                  <Pastilla
                    key={n}
                    tipo="checkbox"
                    name={`${idBase}-dorm-${n}`}
                    checked={property.bedrooms.includes(n)}
                    onChange={() =>
                      actualizar({ bedrooms: alternar(property.bedrooms, n) })
                    }
                  >
                    {etiquetaDormitorio(n)}
                  </Pastilla>
                ))}
              </div>
            </Seccion>
          )}

          {preguntaBanos(perfil) && (
            <Seccion titulo="Baños">
              <div className="flex flex-wrap gap-2">
                {OPCIONES_BANOS.map((n) => (
                  <Pastilla
                    key={n}
                    tipo="checkbox"
                    name={`${idBase}-bano-${n}`}
                    checked={property.bathrooms.includes(n)}
                    onChange={() =>
                      actualizar({ bathrooms: alternar(property.bathrooms, n) })
                    }
                  >
                    {n === 4 ? "4+" : String(n)}
                  </Pastilla>
                ))}
              </div>
            </Seccion>
          )}

          {preguntaSuperficie(perfil) && (
            <Seccion titulo="Superficie" ayuda="Opcional.">
              <label className="flex items-center gap-2">
                <span className="sr-only">Metros cuadrados mínimos</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={10}
                  placeholder="Mínimo"
                  value={property.minArea ?? ""}
                  onChange={(e) => {
                    const v = Number.parseInt(e.target.value, 10);
                    actualizar({
                      minArea: Number.isFinite(v) && v > 0 ? v : null,
                    });
                  }}
                  className="min-h-11 w-32 rounded-xl border border-border bg-card px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-violet"
                />
                <span className="text-sm text-muted-foreground">m²</span>
              </label>
            </Seccion>
          )}

          {preguntaPiso(perfil) && (
            <Seccion titulo="Piso">
              <div className="flex flex-wrap gap-2">
                {PREFERENCIAS_PISO.map((opcion) => (
                  <Pastilla
                    key={opcion}
                    tipo="radio"
                    name={`${idBase}-piso`}
                    checked={property.floorPreference === opcion}
                    onChange={() =>
                      actualizar({ floorPreference: opcion as PreferenciaPiso })
                    }
                  >
                    {PREFERENCIA_PISO_LABEL[opcion]}
                  </Pastilla>
                ))}
              </div>
            </Seccion>
          )}

          {preguntaCaracteristicas(perfil) && (
            <GrupoChips titulo="Características">
              {CARACTERISTICAS.map((caracteristica) => (
                <Pastilla
                  key={caracteristica}
                  tipo="checkbox"
                  name={`${idBase}-car-${caracteristica}`}
                  checked={property.features.includes(caracteristica)}
                  onChange={() =>
                    actualizar({
                      features: alternar<Caracteristica>(
                        property.features,
                        caracteristica
                      ),
                    })
                  }
                >
                  {CARACTERISTICA_LABEL[caracteristica]}
                </Pastilla>
              ))}
            </GrupoChips>
          )}
        </div>
      </PrefieroElegir>
    </Pregunta>
  );
}
