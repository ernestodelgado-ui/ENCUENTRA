"use client";

import { useId } from "react";
import { Check } from "lucide-react";
import { Pregunta } from "@/components/entrevista/pregunta";
import { MOMENTO, MOMENTOS, type Momento, type SearchProfile } from "@/lib/entrevista/types";

/**
 * Pregunta 5: en qué momento de la búsqueda está.
 *
 * Cierra la entrevista, así que tiene más peso visual que las anteriores: las
 * opciones son tarjetas grandes con título y explicación en lugar de pastillas.
 * También es la más delicada de responder, y por eso la bajada aclara que no
 * hay una respuesta correcta.
 */
export function PreguntaMomento({
  perfil,
  onChange,
  onContinue,
}: {
  perfil: SearchProfile;
  onChange: (perfil: SearchProfile) => void;
  onContinue: () => void;
}) {
  const idBase = useId();
  const elegido = perfil.intent.stage;

  return (
    <Pregunta
      titulo="Si mañana apareciera la indicada, ¿qué harías?"
      bajada="No hay una respuesta correcta. Queremos entender en qué momento de tu búsqueda estás."
      onContinue={onContinue}
      cta="Ver lo que entendimos →"
      ctaHabilitado={elegido !== null}
    >
      <fieldset>
        <legend className="sr-only">Elegí en qué momento estás</legend>
        <div className="space-y-3">
          {MOMENTOS.map((momento) => (
            <label
              key={momento}
              className="flex cursor-pointer items-start gap-3 rounded-card border border-border bg-card p-4 transition-colors hover:border-foreground/25 has-[:checked]:border-coral has-[:checked]:bg-coral/[0.06] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet"
            >
              <input
                type="radio"
                name={`${idBase}-momento`}
                checked={elegido === momento}
                onChange={() =>
                  onChange({
                    ...perfil,
                    intent: { stage: momento as Momento },
                  })
                }
                className="sr-only"
              />

              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  elegido === momento
                    ? "border-coral bg-coral text-white"
                    : "border-border"
                }`}
              >
                {elegido === momento && <Check size={12} strokeWidth={3} />}
              </span>

              <span>
                <span className="block font-semibold text-foreground">
                  {MOMENTO[momento].titulo}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {MOMENTO[momento].detalle}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {elegido === null && (
        <p className="mt-4 text-sm text-muted-foreground">
          Elegí una opción para continuar.
        </p>
      )}
    </Pregunta>
  );
}
