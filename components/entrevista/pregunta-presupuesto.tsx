"use client";

import { useId } from "react";
import { Pastilla, Seccion } from "@/components/buscar/campos";
import { PresupuestoRange } from "@/components/buscar/presupuesto-range";
import { Pregunta } from "@/components/entrevista/pregunta";
import {
  preguntaFinanciacion,
  preguntaGastosComunes,
  preguntaMomento,
  preguntaMudanza,
  tituloPresupuesto,
} from "@/lib/entrevista/reglas";
import {
  FINANCIACIONES,
  FINANCIACION_LABEL,
  MOMENTO,
  MOMENTOS,
  MUDANZAS,
  MUDANZA_LABEL,
  OPERACION_LABEL,
  TOPES_GASTOS_COMUNES,
  type Financiacion,
  type Momento,
  type Mudanza,
  type SearchProfile,
} from "@/lib/entrevista/types";
import { formatMonto } from "@/lib/search/types";

const CLASES_MONTO =
  "min-h-11 w-full rounded-xl border border-border bg-card px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:border-violet";

/** Campo de monto en pesos, con el símbolo adelante. */
function CampoMonto({
  etiqueta,
  valor,
  onChange,
  placeholder,
}: {
  etiqueta: string;
  valor: number | null;
  onChange: (valor: number | null) => void;
  placeholder?: string;
}) {
  const id = useId();

  return (
    <label htmlFor={id} className="block">
      <span className="text-sm text-muted-foreground">{etiqueta}</span>
      <div className="mt-1.5 flex items-center gap-2">
        <span
          aria-hidden
          className="flex min-h-11 shrink-0 items-center rounded-xl border border-border bg-background px-3 text-[15px] text-muted-foreground"
        >
          $
        </span>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          step={500}
          placeholder={placeholder}
          value={valor ?? ""}
          onChange={(e) => {
            const v = Number.parseInt(e.target.value, 10);
            onChange(Number.isFinite(v) && v > 0 ? v : null);
          }}
          className={CLASES_MONTO}
        />
      </div>
    </label>
  );
}

/**
 * Pregunta 4: presupuesto y momento.
 *
 * Concentra casi toda la lógica condicional del recorrido. Comprar pregunta
 * financiación y estado de ánimo; alquilar pregunta cuándo necesita mudarse y
 * separa alquiler de gastos comunes. Los gastos comunes sólo aparecen donde
 * existen — un apartamento o una oficina, no una casa ni un terreno.
 *
 * La operación no se vuelve a preguntar: viene decidida desde la Home.
 */
export function PreguntaPresupuesto({
  perfil,
  onChange,
  onContinue,
}: {
  perfil: SearchProfile;
  onChange: (perfil: SearchProfile) => void;
  onContinue: () => void;
}) {
  const idBase = useId();
  const { budget, transaction } = perfil;
  const esAlquiler = perfil.operation === "rent";

  const actualizarBudget = (cambios: Partial<SearchProfile["budget"]>) =>
    onChange({ ...perfil, budget: { ...budget, ...cambios } });

  const actualizarTransaccion = (
    cambios: Partial<SearchProfile["transaction"]>
  ) => onChange({ ...perfil, transaction: { ...transaction, ...cambios } });

  return (
    <Pregunta
      titulo={tituloPresupuesto(perfil)}
      bajada={
        esAlquiler
          ? "Completá lo que te resulte más cómodo. No hace falta llenar todo."
          : "Definí un rango en el que te sentirías cómodo."
      }
      onContinue={onContinue}
      cta="Ver lo que entendimos →"
    >
      <div className="space-y-6">
        {/* La operación ya está decidida: se muestra, no se pregunta. */}
        <div className="flex items-center gap-2 rounded-2xl bg-coral/[0.07] px-4 py-3">
          <span className="text-sm text-muted-foreground">Estás buscando</span>
          <span className="text-sm font-semibold text-coral">
            {OPERACION_LABEL[perfil.operation]}
          </span>
        </div>

        {esAlquiler ? (
          <Seccion
            titulo="Presupuesto mensual"
            ayuda="Podés indicar el alquiler y los gastos por separado, o directamente cuánto querés gastar en total."
          >
            <div className="space-y-4">
              <CampoMonto
                etiqueta="Alquiler máximo"
                valor={budget.maxRent}
                onChange={(maxRent) => actualizarBudget({ maxRent })}
                placeholder="30.000"
              />
              <CampoMonto
                etiqueta="Gastos comunes máximos"
                valor={budget.maxCommonExpenses}
                onChange={(maxCommonExpenses) =>
                  actualizarBudget({ maxCommonExpenses })
                }
                placeholder="8.000"
              />

              <div className="border-t border-border pt-4">
                <CampoMonto
                  etiqueta="O, si preferís, cuánto querés gastar por mes en total"
                  valor={budget.maxTotalMonthly}
                  onChange={(maxTotalMonthly) =>
                    actualizarBudget({ maxTotalMonthly })
                  }
                  placeholder="45.000"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Alquiler y gastos comunes juntos.
                </p>
              </div>
            </div>
          </Seccion>
        ) : (
          <Seccion
            titulo="Presupuesto de compra"
            ayuda="Movés los dos extremos para marcar desde y hasta cuánto querés invertir."
          >
            <PresupuestoRange
              operacion="comprar"
              presupuesto={{
                moneda: budget.currency,
                desde: budget.min ?? 0,
                hasta: budget.max ?? 0,
              }}
              onChange={(p) =>
                actualizarBudget({
                  currency: p.moneda,
                  min: p.desde,
                  max: p.hasta,
                })
              }
            />
          </Seccion>
        )}

        {/* Los gastos comunes de compra van aparte: al alquilar ya se
            preguntaron arriba, junto al alquiler. */}
        {!esAlquiler && preguntaGastosComunes(perfil) && (
          <Seccion
            titulo="Gastos comunes"
            ayuda="Se pagan todos los meses además del precio, así que conviene tenerlos en cuenta."
          >
            <div className="flex flex-wrap gap-2">
              <Pastilla
                tipo="radio"
                name={`${idBase}-gc`}
                checked={budget.maxCommonExpenses === null}
                onChange={() => actualizarBudget({ maxCommonExpenses: null })}
              >
                No tengo un límite
              </Pastilla>
              {TOPES_GASTOS_COMUNES.map((tope) => (
                <Pastilla
                  key={tope}
                  tipo="radio"
                  name={`${idBase}-gc`}
                  checked={budget.maxCommonExpenses === tope}
                  onChange={() =>
                    actualizarBudget({ maxCommonExpenses: tope })
                  }
                >
                  Hasta ${formatMonto(tope)}
                </Pastilla>
              ))}
            </div>

            <div className="mt-4">
              <CampoMonto
                etiqueta="U otro monto"
                valor={
                  budget.maxCommonExpenses !== null &&
                  !TOPES_GASTOS_COMUNES.includes(budget.maxCommonExpenses)
                    ? budget.maxCommonExpenses
                    : null
                }
                onChange={(maxCommonExpenses) =>
                  actualizarBudget({ maxCommonExpenses })
                }
                placeholder="10.000"
              />
            </div>
          </Seccion>
        )}

        {preguntaFinanciacion(perfil) && (
          <Seccion titulo="¿Cómo pensás realizar la operación?">
            <div className="flex flex-wrap gap-2">
              {FINANCIACIONES.map((f) => (
                <Pastilla
                  key={f}
                  tipo="radio"
                  name={`${idBase}-fin`}
                  checked={transaction.financing === f}
                  onChange={() =>
                    actualizarTransaccion({ financing: f as Financiacion })
                  }
                >
                  {FINANCIACION_LABEL[f]}
                </Pastilla>
              ))}
            </div>
          </Seccion>
        )}

        {preguntaMudanza(perfil) && (
          <Seccion titulo="¿Cuándo necesitás mudarte?">
            <div className="flex flex-wrap gap-2">
              {MUDANZAS.map((m) => (
                <Pastilla
                  key={m}
                  tipo="radio"
                  name={`${idBase}-mud`}
                  checked={transaction.moveTimeline === m}
                  onChange={() =>
                    actualizarTransaccion({ moveTimeline: m as Mudanza })
                  }
                >
                  {MUDANZA_LABEL[m]}
                </Pastilla>
              ))}
            </div>
          </Seccion>
        )}

        {preguntaMomento(perfil) && (
          <Seccion titulo="Si mañana apareciera la indicada, ¿qué harías?">
            <div className="space-y-2.5">
              {MOMENTOS.map((m) => (
                <label
                  key={m}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card p-3.5 transition-colors hover:border-foreground/25 has-[:checked]:border-coral has-[:checked]:bg-coral/[0.06] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet"
                >
                  <input
                    type="radio"
                    name={`${idBase}-mom`}
                    checked={transaction.intent === m}
                    onChange={() =>
                      actualizarTransaccion({ intent: m as Momento })
                    }
                    className="sr-only"
                  />
                  <span>
                    <span className="block font-medium text-foreground">
                      {MOMENTO[m].titulo}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {MOMENTO[m].detalle}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </Seccion>
        )}
      </div>
    </Pregunta>
  );
}
