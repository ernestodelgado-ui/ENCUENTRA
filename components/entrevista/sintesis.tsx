"use client";

import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FINANCIACION_LABEL,
  MOMENTO,
  PREFERENCIA_HOGAR_LABEL,
  PREFERENCIA_ZONA_LABEL,
  type SearchProfile,
} from "@/lib/entrevista/types";
import { OPERACION_LABEL, formatMoneda } from "@/lib/search/types";

/**
 * "Creo que te entendimos": la devolución antes de mostrar nada.
 *
 * REGLA DE ESTA PANTALLA: sólo se muestra lo que la persona eligió o escribió.
 * Nada se deduce del texto libre — eso lo va a hacer la IA más adelante. Si un
 * bloque no tiene contenido, no aparece: preferimos un resumen corto y cierto
 * antes que uno completo e inventado.
 *
 * Por eso el texto libre se cita tal cual bajo "Lo que nos contaste", entre
 * comillas: es de la persona, no nuestro.
 */

function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border pt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {titulo}
      </h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Cita({ texto }: { texto: string }) {
  return (
    <blockquote className="border-l-2 border-coral/40 pl-3 text-sm italic leading-relaxed text-muted-foreground">
      “{texto}”
    </blockquote>
  );
}

export function Sintesis({
  perfil,
  onConfirm,
  onEditar,
}: {
  perfil: SearchProfile;
  onConfirm: () => void;
  onEditar: () => void;
}) {
  const { location, home, priorities, transaction, intent } = perfil;

  const hayTextos =
    location.free_text.trim() !== "" ||
    home.free_text.trim() !== "" ||
    priorities.free_text.trim() !== "";

  return (
    <div className="paso-entra">
      <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
        Creo que te entendimos.
      </h1>
      <p className="mt-3 text-muted-foreground">
        Esto es lo que vamos a buscar para vos.
      </p>

      <div className="mt-7 rounded-card border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-coral">
          Tu búsqueda
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Buscás
            </h3>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {OPERACION_LABEL[transaction.operation]}
            </p>
          </div>

          <Bloque titulo="Presupuesto">
            <p className="text-lg font-semibold text-foreground">
              {formatMoneda(transaction.budget_min, transaction.currency)} —{" "}
              {formatMoneda(transaction.budget_max, transaction.currency)}
            </p>
            {transaction.financing && (
              <p className="mt-1 text-sm text-muted-foreground">
                {FINANCIACION_LABEL[transaction.financing]}
              </p>
            )}
          </Bloque>

          {location.preferences.length > 0 && (
            <Bloque titulo="Dónde">
              <p className="text-sm text-foreground">
                {location.preferences
                  .map((p) => PREFERENCIA_ZONA_LABEL[p])
                  .join(" · ")}
              </p>
            </Bloque>
          )}

          {home.preferences.length > 0 && (
            <Bloque titulo="Te haría sentir en casa">
              <p className="text-sm text-foreground">
                {home.preferences
                  .map((p) => PREFERENCIA_HOGAR_LABEL[p])
                  .join(" · ")}
              </p>
            </Bloque>
          )}

          {priorities.must_have.length > 0 && (
            <Bloque titulo="No negociarías">
              <ul className="space-y-1.5">
                {priorities.must_have.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <Check size={14} strokeWidth={3} className="text-coral" aria-hidden />
                    {PREFERENCIA_HOGAR_LABEL[p]}
                  </li>
                ))}
              </ul>
            </Bloque>
          )}

          {priorities.nice_to_have.length > 0 && (
            <Bloque titulo="Te gustaría">
              <ul className="space-y-1.5">
                {priorities.nice_to_have.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Circle size={11} className="text-violet" aria-hidden />
                    {PREFERENCIA_HOGAR_LABEL[p]}
                  </li>
                ))}
              </ul>
            </Bloque>
          )}

          {intent.stage && (
            <Bloque titulo="Tu momento">
              <p className="text-sm font-medium text-foreground">
                {MOMENTO[intent.stage].titulo}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {MOMENTO[intent.stage].detalle}
              </p>
            </Bloque>
          )}
        </div>
      </div>

      {hayTextos && (
        <div className="mt-5 rounded-card border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Lo que nos contaste
          </p>
          <div className="mt-3 space-y-3">
            {location.free_text.trim() && <Cita texto={location.free_text.trim()} />}
            {home.free_text.trim() && <Cita texto={home.free_text.trim()} />}
            {priorities.free_text.trim() && (
              <Cita texto={priorities.free_text.trim()} />
            )}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Un asesor va a leer esto tal cual lo escribiste.
          </p>
        </div>
      )}

      <div className="mt-8">
        <Button onClick={onConfirm} size="lg" className="w-full justify-center">
          Sí, es lo que busco →
        </Button>
        <button
          type="button"
          onClick={onEditar}
          className="mt-3 w-full py-2 text-center text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
        >
          Quiero cambiar algo
        </button>
      </div>
    </div>
  );
}
