"use client";

import { useId } from "react";
import { Pastilla, Seccion } from "@/components/buscar/campos";
import { PresupuestoRange } from "@/components/buscar/presupuesto-range";
import { Pregunta } from "@/components/entrevista/pregunta";
import {
  FINANCIACIONES,
  FINANCIACION_LABEL,
  type Financiacion,
  type SearchProfile,
} from "@/lib/entrevista/types";
import {
  OPERACIONES,
  OPERACION_LABEL,
  presupuestoCompleto,
  type Operacion,
} from "@/lib/search/types";

/**
 * Pregunta 4: la única estructurada. Reutiliza tal cual la barra de presupuesto
 * y las pastillas del buscador tradicional, así los dos caminos producen
 * exactamente el mismo dato.
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
  const { transaction } = perfil;

  // Comprar y alquilar no comparten escala de precios: al cambiar de operación
  // el presupuesto vuelve al rango completo de la nueva.
  const cambiarOperacion = (operation: Operacion) => {
    const rango = presupuestoCompleto(operation, transaction.currency);
    onChange({
      ...perfil,
      transaction: {
        ...transaction,
        operation,
        budget_min: rango.desde,
        budget_max: rango.hasta,
      },
    });
  };

  return (
    <Pregunta
      titulo="Hablemos de presupuesto."
      bajada="Definí un rango en el que te sentirías cómodo."
      onContinue={onContinue}
    >
      <div className="space-y-6">
        <Seccion titulo="¿Qué querés hacer?">
          <div className="flex flex-wrap gap-2">
            {OPERACIONES.map((operacion) => (
              <Pastilla
                key={operacion}
                tipo="radio"
                name={`${idBase}-operacion`}
                checked={transaction.operation === operacion}
                onChange={() => cambiarOperacion(operacion)}
              >
                {OPERACION_LABEL[operacion]}
              </Pastilla>
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Presupuesto">
          <PresupuestoRange
            operacion={transaction.operation}
            presupuesto={{
              moneda: transaction.currency,
              desde: transaction.budget_min,
              hasta: transaction.budget_max,
            }}
            onChange={(presupuesto) =>
              onChange({
                ...perfil,
                transaction: {
                  ...transaction,
                  currency: presupuesto.moneda,
                  budget_min: presupuesto.desde,
                  budget_max: presupuesto.hasta,
                },
              })
            }
          />
        </Seccion>

        <Seccion titulo="¿Cómo pensás hacer la operación?">
          <div className="flex flex-wrap gap-2">
            {FINANCIACIONES.map((financiacion) => (
              <Pastilla
                key={financiacion}
                tipo="radio"
                name={`${idBase}-financiacion`}
                checked={transaction.financing === financiacion}
                onChange={() =>
                  onChange({
                    ...perfil,
                    transaction: {
                      ...transaction,
                      financing: financiacion as Financiacion,
                    },
                  })
                }
              >
                {FINANCIACION_LABEL[financiacion]}
              </Pastilla>
            ))}
          </div>
        </Seccion>
      </div>
    </Pregunta>
  );
}
