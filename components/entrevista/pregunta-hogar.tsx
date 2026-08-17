"use client";

import { useId } from "react";
import { Pastilla, alternar } from "@/components/buscar/campos";
import { GrupoChips, Pregunta, TextoLibre } from "@/components/entrevista/pregunta";
import {
  PREFERENCIAS_HOGAR,
  PREFERENCIA_HOGAR_LABEL,
  type SearchProfile,
} from "@/lib/entrevista/types";

/** Pregunta 2: cómo tendría que ser para sentirse en casa. */
export function PreguntaHogar({
  perfil,
  onChange,
  onContinue,
}: {
  perfil: SearchProfile;
  onChange: (perfil: SearchProfile) => void;
  onContinue: () => void;
}) {
  const idBase = useId();
  const { home } = perfil;

  return (
    <Pregunta
      titulo="¿Cómo tendría que ser para que te sintieras en casa?"
      bajada="Pensá en los espacios, la luz, el exterior o cualquier cosa que para vos haga la diferencia."
      onContinue={onContinue}
    >
      <TextoLibre
        etiqueta="Contanos cómo tendría que ser"
        placeholder="Ej.: Dos dormitorios, mucha luz, balcón y un espacio donde pueda trabajar desde casa."
        valor={home.free_text}
        onChange={(free_text) =>
          onChange({ ...perfil, home: { ...home, free_text } })
        }
      />

      <GrupoChips titulo="¿Algo de esto te suena?">
        {PREFERENCIAS_HOGAR.map((preferencia) => (
          <Pastilla
            key={preferencia}
            tipo="checkbox"
            name={`${idBase}-${preferencia}`}
            checked={home.preferences.includes(preferencia)}
            onChange={() =>
              onChange({
                ...perfil,
                home: {
                  ...home,
                  preferences: alternar(home.preferences, preferencia),
                },
              })
            }
          >
            {PREFERENCIA_HOGAR_LABEL[preferencia]}
          </Pastilla>
        ))}
      </GrupoChips>
    </Pregunta>
  );
}
