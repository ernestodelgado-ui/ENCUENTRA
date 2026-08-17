"use client";

import { Pregunta, TextoLibre } from "@/components/entrevista/pregunta";
import {
  LeyendaTriple,
  PastillaTriple,
  SIGUIENTE_ESTADO,
  type EstadoTriple,
} from "@/components/entrevista/pastilla-triple";
import {
  CARACTERISTICAS,
  CARACTERISTICA_LABEL,
  type Caracteristica,
  type SearchProfile,
} from "@/lib/entrevista/types";

/**
 * Pregunta 3: qué no se negocia.
 *
 * Es la única que distingue dos niveles de importancia. Se guarda en `mustHave`
 * y `niceToHave`, que son las listas que más adelante va a completar también la
 * IA a partir del texto libre.
 *
 * Nada es obligatorio: alguien puede escribir y no clasificar nada.
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

  const estadoDe = (c: Caracteristica): EstadoTriple => {
    if (priorities.mustHave.includes(c)) return "imprescindible";
    if (priorities.niceToHave.includes(c)) return "deseable";
    return "no";
  };

  const ciclar = (c: Caracteristica) => {
    const siguiente = SIGUIENTE_ESTADO[estadoDe(c)];

    // Se saca de las dos listas y se vuelve a agregar donde corresponda, así no
    // puede quedar en las dos a la vez.
    const mustHave = priorities.mustHave.filter((p) => p !== c);
    const niceToHave = priorities.niceToHave.filter((p) => p !== c);

    onChange({
      ...perfil,
      priorities: {
        ...priorities,
        mustHave: siguiente === "imprescindible" ? [...mustHave, c] : mustHave,
        niceToHave: siguiente === "deseable" ? [...niceToHave, c] : niceToHave,
      },
    });
  };

  return (
    <Pregunta
      titulo="¿Qué no estarías dispuesto a negociar?"
      bajada="No todo tiene que ser perfecto. Queremos entender qué es realmente importante para vos."
      onContinue={onContinue}
    >
      <TextoLibre
        etiqueta="Contanos qué no negociarías"
        placeholder="Ej.: Garaje sí o sí. No quiero planta baja. El balcón me gustaría, pero podría resignarlo."
        valor={priorities.freeText}
        onChange={(freeText) =>
          onChange({ ...perfil, priorities: { ...priorities, freeText } })
        }
      />

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-foreground">
          Marcá lo que importa
        </legend>
        <p className="mt-1 text-sm text-muted-foreground">
          Opcional. Con un par alcanza.
        </p>
        <div className="mt-3">
          <LeyendaTriple />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {CARACTERISTICAS.map((c) => (
            <PastillaTriple
              key={c}
              etiqueta={CARACTERISTICA_LABEL[c]}
              estado={estadoDe(c)}
              onCiclar={() => ciclar(c)}
            />
          ))}
        </div>
      </fieldset>
    </Pregunta>
  );
}
