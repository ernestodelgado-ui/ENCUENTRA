"use client";

import { useId } from "react";
import { Pastilla, alternar } from "@/components/buscar/campos";
import { GrupoChips, Pregunta, TextoLibre } from "@/components/entrevista/pregunta";
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

  return (
    <Pregunta
      titulo="¿Dónde te imaginás viviendo?"
      bajada="No hace falta que tengas un barrio decidido. Contanos qué lugares te gustan o cómo te gustaría que fuera la zona."
      onContinue={onContinue}
    >
      <TextoLibre
        etiqueta="Contanos dónde te imaginás viviendo"
        placeholder="Ej.: Cerca de la rambla, en un lugar tranquilo pero con cosas para hacer cerca. Pocitos me gusta, aunque también podría ser Buceo."
        valor={location.free_text}
        onChange={(free_text) =>
          onChange({ ...perfil, location: { ...location, free_text } })
        }
      />

      <GrupoChips titulo="¿Algo de esto te suena?">
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
    </Pregunta>
  );
}
