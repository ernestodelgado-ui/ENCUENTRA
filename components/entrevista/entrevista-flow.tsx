"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlowShell } from "@/components/buscar/flow-shell";
import { HeaderMinimo } from "@/components/buscar/header-minimo";
import { PreguntaLugar } from "@/components/entrevista/pregunta-lugar";
import { PreguntaPropiedad } from "@/components/entrevista/pregunta-propiedad";
import { PreguntaPrioridades } from "@/components/entrevista/pregunta-prioridades";
import { PreguntaPresupuesto } from "@/components/entrevista/pregunta-presupuesto";
import { Sintesis } from "@/components/entrevista/sintesis";
import {
  guardarPerfil,
  leerPerfil,
  perfilInicial,
} from "@/lib/entrevista/almacenamiento";
import { perfilAUrl } from "@/lib/entrevista/a-criterios";
import type { Operacion, SearchProfile } from "@/lib/entrevista/types";
import { capturarUtms, track } from "@/lib/analytics";

/** 1 a 4 son las preguntas y 5 la síntesis. */
const PASOS = [1, 2, 3, 4, 5] as const;
type Paso = (typeof PASOS)[number];

const TOTAL_PREGUNTAS = 4;

function esPaso(valor: unknown): valor is Paso {
  return PASOS.includes(valor as Paso);
}

/**
 * El recorrido guiado de comprar y de alquilar.
 *
 * Los dos comparten las cuatro preguntas y se diferencian por dentro: cada
 * pantalla consulta `lib/entrevista/reglas.ts` para saber qué corresponde
 * mostrar. Duplicar el recorrido habría significado mantener dos veces lo
 * mismo para que cambien tres campos.
 *
 * La operación llega desde la Home, así que no se vuelve a preguntar. Desde la
 * pregunta 1, "volver" sale del recorrido y devuelve a la Home.
 *
 * Las respuestas viven acá y se espejan en sessionStorage, porque alguien puede
 * escribir dos minutos y recargar sin querer. El paso viaja en `history.state`,
 * que el navegador conserva al recargar.
 */
export function EntrevistaFlow({ operacion }: { operacion: Operacion }) {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>(1);
  const [perfil, setPerfil] = useState<SearchProfile>(() =>
    perfilInicial(operacion)
  );

  // Restaurar después de montar y no durante el render: `sessionStorage` y
  // `history.state` sólo existen en el navegador, y esta ruta se prerenderiza.
  /* eslint-disable react-hooks/set-state-in-effect --
     Es lectura de estado del navegador tras montar, que es justamente el caso
     que esta regla no puede cubrir. */
  useEffect(() => {
    capturarUtms();
    track("search_started", { operacion });

    const guardado = leerPerfil(operacion);
    if (guardado) setPerfil(guardado);

    const pasoGuardado = (window.history.state as { encuentraPaso?: unknown } | null)
      ?.encuentraPaso;
    if (esPaso(pasoGuardado)) setPaso(pasoGuardado);
  }, [operacion]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const actualizar = useCallback((siguiente: SearchProfile) => {
    setPerfil(siguiente);
    guardarPerfil(siguiente);
  }, []);

  const irA = useCallback((siguiente: Paso) => {
    setPaso(siguiente);
    window.history.pushState({ encuentraPaso: siguiente }, "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const volver = useCallback(() => window.history.back(), []);

  useEffect(() => {
    const alVolver = (event: PopStateEvent) => {
      const guardado = (event.state as { encuentraPaso?: unknown } | null)
        ?.encuentraPaso;
      setPaso(esPaso(guardado) ? guardado : 1);
    };

    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, []);

  const verResultados = useCallback(() => {
    track("search_completed", {
      origen: "recorrido",
      operacion,
      tipo: perfil.property.type ?? "sin-definir",
      zonas: perfil.location.selectedLocations.length,
      imprescindibles: perfil.priorities.mustHave.length,
      topeGastosComunes: perfil.budget.maxCommonExpenses ?? "sin-tope",
      escribio: [
        perfil.location.freeText,
        perfil.property.freeText,
        perfil.priorities.freeText,
      ].filter((t) => t.trim() !== "").length,
    });
    router.push(perfilAUrl(perfil));
  }, [operacion, perfil, router]);

  const props = { perfil, onChange: actualizar };

  return (
    <>
      <HeaderMinimo />
      <FlowShell
        onBack={volver}
        progreso={
          paso <= TOTAL_PREGUNTAS
            ? {
                label: `${paso} de ${TOTAL_PREGUNTAS}`,
                valor: paso / TOTAL_PREGUNTAS,
              }
            : undefined
        }
      >
        {paso === 1 && <PreguntaLugar {...props} onContinue={() => irA(2)} />}
        {paso === 2 && <PreguntaPropiedad {...props} onContinue={() => irA(3)} />}
        {paso === 3 && (
          <PreguntaPrioridades {...props} onContinue={() => irA(4)} />
        )}
        {paso === 4 && (
          <PreguntaPresupuesto {...props} onContinue={() => irA(5)} />
        )}
        {paso === 5 && (
          <Sintesis
            perfil={perfil}
            onConfirm={verResultados}
            onEditar={volver}
          />
        )}
      </FlowShell>
    </>
  );
}
