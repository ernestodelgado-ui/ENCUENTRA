"use client";

import { useId } from "react";
import { Pastilla, alternar } from "@/components/buscar/campos";
import { SelectorZonas } from "@/components/buscar/selector-zonas";
import {
  GrupoChips,
  Pregunta,
  PrefieroElegir,
  TextoLibre,
} from "@/components/entrevista/pregunta";
import {
  PREFERENCIAS_ZONA,
  PREFERENCIA_ZONA_LABEL,
  type SearchProfile,
} from "@/lib/entrevista/types";

/** Pregunta 1: dónde se imagina viviendo. */
export function PreguntaLugar({
  perfil,
  onChange,
  onContinue,
}: {
  perfil: SearchProfile;
  onChange: (perfil: SearchProfile) => void;
  onContinue: () => void;
}) {
  const idBase = useId();
  const { location } = perfil;

  const yaEligio =
    location.selectedLocations.length > 0 || location.preferences.length > 0;

  return (
    <Pregunta
      titulo="¿Dónde te imaginás viviendo?"
      bajada="Podés contarnos una zona concreta o simplemente describir el tipo de lugar que te gustaría."
      onContinue={onContinue}
    >
      <TextoLibre
        etiqueta="Contanos dónde te imaginás viviendo"
        placeholder="Ej.: Cerca de la rambla, en un lugar tranquilo pero con cosas para hacer cerca. Pocitos me gusta, aunque también podría ser Buceo."
        valor={location.freeText}
        onChange={(freeText) =>
          onChange({ ...perfil, location: { ...location, freeText } })
        }
      />

      <PrefieroElegir abiertoInicial={yaEligio}>
        <fieldset>
          <legend className="text-sm font-semibold text-foreground">
            Departamento y barrio
          </legend>
          <p className="mt-1 text-sm text-muted-foreground">
            Podés elegir varios.
          </p>
          <div className="mt-3">
            <SelectorZonas
              seleccionadas={location.selectedLocations}
              onChange={(selectedLocations) =>
                onChange({
                  ...perfil,
                  location: { ...location, selectedLocations },
                })
              }
            />
          </div>
        </fieldset>

        <GrupoChips titulo="Preferencias de zona">
          {PREFERENCIAS_ZONA.map((preferencia) => (
            <Pastilla
              key={preferencia}
              tipo="checkbox"
              name={`${idBase}-${preferencia}`}
              checked={location.preferences.includes(preferencia)}
              onChange={() =>
                onChange({
                  ...perfil,
                  location: {
                    ...location,
                    preferences: alternar(location.preferences, preferencia),
                  },
                })
              }
            >
              {PREFERENCIA_ZONA_LABEL[preferencia]}
            </Pastilla>
          ))}
        </GrupoChips>
      </PrefieroElegir>
    </Pregunta>
  );
}
