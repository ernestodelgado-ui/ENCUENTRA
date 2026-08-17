"use client";

/**
 * Guarda las respuestas de la entrevista mientras dura la visita.
 *
 * Se usa `sessionStorage` y no la URL porque acá hay párrafos escritos a mano
 * que no entran en una query string. Y no `localStorage` porque esto es la
 * intención de una visita, no algo que deba quedar meses en un celular que
 * quizás se comparte.
 *
 * El motivo de guardarlo: alguien puede escribir dos minutos y recargar sin
 * querer. Con los filtros eso no importaba —se vuelve a tildar en segundos—,
 * acá sí.
 */

import { presupuestoCompleto } from "@/lib/search/types";
import type { SearchProfile } from "./types";

const CLAVE = "encuentra:entrevista";

export function perfilInicial(): SearchProfile {
  const presupuesto = presupuestoCompleto("comprar", "USD");

  return {
    location: { free_text: "", preferences: [] },
    home: { free_text: "", preferences: [] },
    priorities: { free_text: "", must_have: [], nice_to_have: [] },
    transaction: {
      operation: "comprar",
      currency: presupuesto.moneda,
      budget_min: presupuesto.desde,
      budget_max: presupuesto.hasta,
      financing: null,
    },
    intent: { stage: null },
  };
}

export function guardarPerfil(perfil: SearchProfile): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(CLAVE, JSON.stringify(perfil));
  } catch {
    // Modo privado o almacenamiento lleno: la entrevista sigue funcionando,
    // sólo se pierde lo escrito si se recarga.
  }
}

/**
 * Devuelve lo guardado, completando con el perfil inicial lo que falte. Así un
 * dato viejo de una versión anterior no rompe la pantalla.
 */
export function leerPerfil(): SearchProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const guardado = window.sessionStorage.getItem(CLAVE);
    if (!guardado) return null;

    const parseado = JSON.parse(guardado) as Partial<SearchProfile>;
    const base = perfilInicial();

    return {
      location: { ...base.location, ...parseado.location },
      home: { ...base.home, ...parseado.home },
      priorities: { ...base.priorities, ...parseado.priorities },
      transaction: { ...base.transaction, ...parseado.transaction },
      intent: { ...base.intent, ...parseado.intent },
    };
  } catch {
    return null;
  }
}

export function limpiarPerfil(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(CLAVE);
  } catch {
    // Sin nada que hacer.
  }
}
