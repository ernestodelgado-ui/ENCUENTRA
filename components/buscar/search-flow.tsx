"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlowShell, type Progreso } from "@/components/buscar/flow-shell";
import { StepEsencial } from "@/components/buscar/step-esencial";
import { StepAfinar } from "@/components/buscar/step-afinar";
import { CRITERIOS_INICIALES, type SearchCriteria } from "@/lib/search/types";
import { criteriosAUrl } from "@/lib/search/url";
import { capturarUtms, track } from "@/lib/analytics";

const PASOS = [1, 2] as const;
type Paso = (typeof PASOS)[number];

const PROGRESO: Record<Paso, Progreso> = {
  1: { label: "Paso 1 de 2", valor: 0.5 },
  2: { label: "Paso 2 de 2", valor: 1 },
};

function esPaso(valor: unknown): valor is Paso {
  return PASOS.includes(valor as Paso);
}

/**
 * Los dos pasos de la búsqueda.
 *
 * Al terminar no guarda nada: navega a `/resultados` con los criterios en la
 * URL. Esa URL es la única fuente de verdad de la búsqueda, y es lo que hace
 * que se pueda compartir, volver atrás y medir sin instrumentación extra.
 */
export function SearchFlow() {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>(1);
  const [criteria, setCriteria] = useState<SearchCriteria>(CRITERIOS_INICIALES);

  useEffect(() => {
    capturarUtms();
    track("search_started");
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

  const completarPaso1 = useCallback(() => {
    track("search_step_1", {
      operacion: criteria.operacion,
      tipos: criteria.tiposPropiedad.join(","),
      zonas: criteria.zonas.join(",") || "todas",
      moneda: criteria.presupuesto.moneda,
      desde: criteria.presupuesto.desde,
      hasta: criteria.presupuesto.hasta,
    });
    irA(2);
  }, [criteria, irA]);

  const verResultados = useCallback(() => {
    router.push(criteriosAUrl(criteria));
  }, [criteria, router]);

  return (
    <FlowShell onBack={paso === 1 ? undefined : volver} progreso={PROGRESO[paso]}>
      {paso === 1 && (
        <StepEsencial
          criteria={criteria}
          onChange={setCriteria}
          onContinue={completarPaso1}
        />
      )}

      {paso === 2 && (
        <StepAfinar
          criteria={criteria}
          onChange={setCriteria}
          onContinue={verResultados}
        />
      )}
    </FlowShell>
  );
}
