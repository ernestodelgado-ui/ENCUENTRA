"use client";

import { Pregunta, TextoLibre } from "@/components/entrevista/pregunta";
import {
  LeyendaTriple,
  PastillaTriple,
  SIGUIENTE_ESTADO,
  type EstadoTriple,
} from "@/components/entrevista/pastilla-triple";
import {
  PREFERENCIAS_HOGAR,
  PREFERENCIA_HOGAR_LABEL,
  type PreferenciaHogar,
  type SearchProfile,
} from "@/lib/entrevista/types";

/**
 * Pregunta 3: qué no se negocia.
 *
 * Es la única que distingue dos niveles de importancia. La distinción se guarda
 * en `must_have` y `nice_to_have`, que son las listas que más adelante va a
 * completar también la IA a partir del texto libre.
 */
export function PreguntaPrioridades({
  perfil,
  onChange,
  onContinue,
}: {
  perfil: SearchProfile;
  onChange: (perfil: SearchProfile) => void;
  onContinue: () => void;
}) {
  const { priorities } = perfil;

  const estadoDe = (preferencia: PreferenciaHogar): EstadoTriple => {
    if (priorities.must_have.includes(preferencia)) return "imprescindible";
    if (priorities.nice_to_have.includes(preferencia)) return "deseable";
    return "no";
  };

  const ciclar = (preferencia: PreferenciaHogar) => {
    const siguiente = SIGUIENTE_ESTADO[estadoDe(preferencia)];

    // Se saca de las dos listas y se vuelve a agregar donde corresponda: así no
    // puede quedar en las dos a la vez.
    const sinEsta = {
      must_have: priorities.must_have.filter((p) => p !== preferencia),
      nice_to_have: priorities.nice_to_have.filter((p) => p !== preferencia),
    };

    onChange({
      ...perfil,
      priorities: {
        ...priorities,
        must_have:
          siguiente === "imprescindible"
            ? [...sinEsta.must_have, preferencia]
            : sinEsta.must_have,
        nice_to_have:
          siguiente === "deseable"
            ? [...sinEsta.nice_to_have, preferencia]
            : sinEsta.nice_to_have,
      },
    });
  };

  return (
    <Pregunta
      titulo="¿Qué no estarías dispuesto a negociar?"
      bajada="Todos tenemos algo que la propiedad indicada tiene que tener sí o sí."
      onContinue={onContinue}
    >
      <TextoLibre
        etiqueta="Contanos qué no negociarías"
        placeholder="Ej.: Necesito garaje y no quiero planta baja. El balcón me gustaría, pero podría resignarlo."
        valor={priorities.free_text}
        onChange={(free_text) =>
          onChange({ ...perfil, priorities: { ...priorities, free_text } })
        }
      />

      <fieldset className="mt-7">
        <legend className="text-sm font-semibold text-foreground">
          Marcá lo que importa
        </legend>
        <div className="mt-2">
          <LeyendaTriple />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {PREFERENCIAS_HOGAR.map((preferencia) => (
            <PastillaTriple
              key={preferencia}
              etiqueta={PREFERENCIA_HOGAR_LABEL[preferencia]}
              estado={estadoDe(preferencia)}
              onCiclar={() => ciclar(preferencia)}
            />
          ))}
        </div>
      </fieldset>
    </Pregunta>
  );
}
