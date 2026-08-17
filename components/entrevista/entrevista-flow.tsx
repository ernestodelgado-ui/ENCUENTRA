"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlowShell } from "@/components/buscar/flow-shell";
import { HeaderMinimo } from "@/components/buscar/header-minimo";
import { Intro } from "@/components/entrevista/intro";
import { PreguntaLugar } from "@/components/entrevista/pregunta-lugar";
import { PreguntaHogar } from "@/components/entrevista/pregunta-hogar";
import { PreguntaPrioridades } from "@/components/entrevista/pregunta-prioridades";
import { PreguntaPresupuesto } from "@/components/entrevista/pregunta-presupuesto";
import { PreguntaMomento } from "@/components/entrevista/pregunta-momento";
import { Sintesis } from "@/components/entrevista/sintesis";
import {
  guardarPerfil,
  leerPerfil,
  perfilInicial,
} from "@/lib/entrevista/almacenamiento";
import { perfilAUrl } from "@/lib/entrevista/a-criterios";
import type { SearchProfile } from "@/lib/entrevista/types";
import { capturarUtms, track } from "@/lib/analytics";

/** 0 es la introducción, 1 a 5 las preguntas y 6 la síntesis. */
const PASOS = [0, 1, 2, 3, 4, 5, 6] as const;
type Paso = (typeof PASOS)[number];

const TOTAL_PREGUNTAS = 5;

function esPaso(valor: unknown): valor is Paso {
  return PASOS.includes(valor as Paso);
}

/**
 * La entrevista completa.
 *
 * Las respuestas viven acá, no en cada pregunta: al cambiar de pantalla se
 * desmonta sólo la pregunta y el perfil queda arriba intacto. Además se espeja
 * en sessionStorage, porque alguien puede escribir dos minutos y recargar sin
 * querer.
 *
 * Cada avance empuja una entrada al historial, así el botón atrás del navegador
 * recorre la entrevista en lugar de salir del sitio. El paso también viaja en
 * `history.state`, que el navegador conserva al recargar: si alguien recarga en
 * la pregunta 3, vuelve a la pregunta 3 con lo que había escrito.
 */
export function EntrevistaFlow() {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>(0);
  const [perfil, setPerfil] = useState<SearchProfile>(perfilInicial);

  // Restaurar después de montar y no durante el render.
  //
  // `sessionStorage` y `history.state` sólo existen en el navegador, y esta
  // ruta se prerenderiza: leerlos mientras se renderiza haría que el primer
  // render del cliente no coincida con el HTML servido y rompa la hidratación.
  // Por eso el estado arranca en la introducción y se corrige acá.
  /* eslint-disable react-hooks/set-state-in-effect --
     Ver el párrafo de arriba: es lectura de estado del navegador tras montar,
     que es justamente el caso que esta regla no puede cubrir. */
  useEffect(() => {
    capturarUtms();
    track("search_started");

    const guardado = leerPerfil();
    if (guardado) setPerfil(guardado);

    const pasoGuardado = (window.history.state as { encuentraPaso?: unknown } | null)
      ?.encuentraPaso;
    if (esPaso(pasoGuardado)) setPaso(pasoGuardado);
  }, []);
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
      setPaso(esPaso(guardado) ? guardado : 0);
    };

    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, []);

  const verResultados = useCallback(() => {
    track("search_completed", {
      origen: "entrevista",
      operacion: perfil.transaction.operation,
      financiacion: perfil.transaction.financing ?? "sin-responder",
      momento: perfil.intent.stage ?? "sin-responder",
      imprescindibles: perfil.priorities.must_have.length,
      escribio: [
        perfil.location.free_text,
        perfil.home.free_text,
        perfil.priorities.free_text,
      ].filter((t) => t.trim() !== "").length,
    });
    router.push(perfilAUrl(perfil));
  }, [perfil, router]);

  // La introducción va a sangre completa y con su propio logo: no lleva el
  // encabezado ni el marco de las preguntas.
  if (paso === 0) {
    return <Intro onStart={() => irA(1)} />;
  }

  const props = { perfil, onChange: actualizar };

  return (
    <>
      <HeaderMinimo />
      <FlowShell
        onBack={volver}
        progreso={
          paso <= TOTAL_PREGUNTAS
            ? {
                label: `Pregunta ${paso} de ${TOTAL_PREGUNTAS}`,
                valor: paso / TOTAL_PREGUNTAS,
              }
            : undefined
        }
      >
        {paso === 1 && <PreguntaLugar {...props} onContinue={() => irA(2)} />}
        {paso === 2 && <PreguntaHogar {...props} onContinue={() => irA(3)} />}
        {paso === 3 && (
          <PreguntaPrioridades {...props} onContinue={() => irA(4)} />
        )}
        {paso === 4 && (
          <PreguntaPresupuesto {...props} onContinue={() => irA(5)} />
        )}
        {paso === 5 && <PreguntaMomento {...props} onContinue={() => irA(6)} />}
        {paso === 6 && (
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
