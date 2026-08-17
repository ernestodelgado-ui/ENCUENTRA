"use client";

import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CARACTERISTICA_LABEL,
  FINANCIACION_LABEL,
  MOMENTO,
  MUDANZA_LABEL,
  OPERACION_LABEL,
  PREFERENCIA_PISO_LABEL,
  PREFERENCIA_ZONA_LABEL,
  TIPO_PROPIEDAD_LABEL,
  type SearchProfile,
} from "@/lib/entrevista/types";
import { formatMoneda, formatMonto } from "@/lib/search/types";

/**
 * "Creo que te entendimos": la devolución antes de mostrar nada.
 *
 * REGLA DE ESTA PANTALLA: sólo se muestra lo que la persona eligió o escribió.
 * Nada se deduce del texto libre — eso lo va a hacer la IA más adelante. Si un
 * bloque no tiene contenido, no aparece: preferimos un resumen corto y cierto
 * antes que uno completo e inventado.
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

function ListaMarcada({
  items,
  tipo,
}: {
  items: string[];
  tipo: "must" | "nice";
}) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-center gap-2 text-sm ${
            tipo === "must"
              ? "font-medium text-foreground"
              : "text-muted-foreground"
          }`}
        >
          {tipo === "must" ? (
            <Check size={14} strokeWidth={3} className="text-coral" aria-hidden />
          ) : (
            <Circle size={11} className="text-violet" aria-hidden />
          )}
          {item}
        </li>
      ))}
    </ul>
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
  const { location, property, priorities, budget, transaction } = perfil;
  const esAlquiler = perfil.operation === "rent";

  const textos = [location.freeText, property.freeText, priorities.freeText]
    .map((t) => t.trim())
    .filter((t) => t !== "");

  const ambientes = [
    property.bedrooms.length > 0
      ? property.bedrooms
          .slice()
          .sort((a, b) => a - b)
          .map((n) => (n === 0 ? "Monoambiente" : n === 5 ? "5+" : String(n)))
          .join(", ") + " dormitorios"
      : null,
    property.bathrooms.length > 0
      ? property.bathrooms
          .slice()
          .sort((a, b) => a - b)
          .map((n) => (n === 4 ? "4+" : String(n)))
          .join(", ") + " baños"
      : null,
    property.minArea !== null ? `Desde ${property.minArea} m²` : null,
    property.floorPreference
      ? PREFERENCIA_PISO_LABEL[property.floorPreference]
      : null,
  ].filter((v): v is string => v !== null);

  const cabecera = [
    OPERACION_LABEL[perfil.operation],
    property.type ? TIPO_PROPIEDAD_LABEL[property.type] : null,
  ].filter(Boolean);

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
        <p className="mt-2 text-lg font-semibold text-foreground">
          {cabecera.join(" · ")}
        </p>

        <div className="mt-4 space-y-4">
          {(location.selectedLocations.length > 0 ||
            location.preferences.length > 0) && (
            <Bloque titulo="Zona">
              {location.selectedLocations.length > 0 && (
                <p className="text-sm font-medium text-foreground">
                  {location.selectedLocations.join(" · ")}
                </p>
              )}
              {location.preferences.length > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {location.preferences
                    .map((p) => PREFERENCIA_ZONA_LABEL[p])
                    .join(" · ")}
                </p>
              )}
            </Bloque>
          )}

          <Bloque titulo="Presupuesto">
            {esAlquiler ? (
              <div className="space-y-1">
                {budget.maxRent !== null && (
                  <p className="text-sm font-medium text-foreground">
                    Alquiler hasta ${formatMonto(budget.maxRent)}
                  </p>
                )}
                {budget.maxTotalMonthly !== null && (
                  <p className="text-sm font-medium text-foreground">
                    Hasta ${formatMonto(budget.maxTotalMonthly)} por mes en total
                  </p>
                )}
                {budget.maxRent === null && budget.maxTotalMonthly === null && (
                  <p className="text-sm italic text-muted-foreground/70">
                    Sin definir
                  </p>
                )}
              </div>
            ) : (
              <p className="text-lg font-semibold text-foreground">
                {formatMoneda(budget.min ?? 0, budget.currency)} —{" "}
                {formatMoneda(budget.max ?? 0, budget.currency)}
              </p>
            )}
          </Bloque>

          {budget.maxCommonExpenses !== null && (
            <Bloque titulo="Gastos comunes">
              <p className="text-sm font-medium text-foreground">
                Hasta ${formatMonto(budget.maxCommonExpenses)}
              </p>
            </Bloque>
          )}

          {ambientes.length > 0 && (
            <Bloque titulo="Necesitás">
              <ul className="space-y-1">
                {ambientes.map((a) => (
                  <li key={a} className="text-sm font-medium text-foreground">
                    {a}
                  </li>
                ))}
              </ul>
            </Bloque>
          )}

          {property.features.length > 0 && (
            <Bloque titulo="Te haría sentir en casa">
              <p className="text-sm text-foreground">
                {property.features
                  .map((f) => CARACTERISTICA_LABEL[f])
                  .join(" · ")}
              </p>
            </Bloque>
          )}

          {priorities.mustHave.length > 0 && (
            <Bloque titulo="No negociarías">
              <ListaMarcada
                items={priorities.mustHave.map((c) => CARACTERISTICA_LABEL[c])}
                tipo="must"
              />
            </Bloque>
          )}

          {priorities.niceToHave.length > 0 && (
            <Bloque titulo="Te gustaría">
              <ListaMarcada
                items={priorities.niceToHave.map((c) => CARACTERISTICA_LABEL[c])}
                tipo="nice"
              />
            </Bloque>
          )}

          {(transaction.financing ||
            transaction.intent ||
            transaction.moveTimeline) && (
            <Bloque titulo="Tu momento">
              {transaction.financing && (
                <p className="text-sm font-medium text-foreground">
                  {FINANCIACION_LABEL[transaction.financing]}
                </p>
              )}
              {transaction.moveTimeline && (
                <p className="text-sm font-medium text-foreground">
                  Mudanza: {MUDANZA_LABEL[transaction.moveTimeline]}
                </p>
              )}
              {transaction.intent && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {MOMENTO[transaction.intent].titulo}.{" "}
                  {MOMENTO[transaction.intent].detalle}
                </p>
              )}
            </Bloque>
          )}
        </div>
      </div>

      {textos.length > 0 && (
        <div className="mt-5 rounded-card border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Lo que nos contaste
          </p>
          <div className="mt-3 space-y-3">
            {textos.map((t) => (
              <Cita key={t} texto={t} />
            ))}
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
