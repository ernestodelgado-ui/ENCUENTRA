"use client";

/**
 * Guarda lo respondido mientras dura la visita.
 *
 * Se usa `sessionStorage` y no la URL porque acá hay párrafos escritos a mano
 * que no entran en una query string. Y no `localStorage` porque esto es la
 * intención de una visita, no algo que deba quedar meses en un celular que
 * quizás se comparte.
 *
 * Cada operación guarda por separado: alguien puede estar mirando para comprar
 * y además querer vender, y una cosa no debería pisar la otra.
 */

import { presupuestoCompleto } from "@/lib/search/types";
import type { Operacion, SearchProfile, SellProfile } from "./types";

const CLAVE_BUSQUEDA = "encuentra:busqueda";
const CLAVE_VENTA = "encuentra:venta";

export function perfilInicial(operation: Operacion): SearchProfile {
  // El rango arranca completo, que es la forma de decir "sin filtro".
  const rango = presupuestoCompleto(
    operation === "buy" ? "comprar" : "alquilar",
    operation === "buy" ? "USD" : "UYU"
  );

  return {
    operation,
    location: { freeText: "", selectedLocations: [], preferences: [] },
    property: {
      freeText: "",
      type: null,
      bedrooms: [],
      bathrooms: [],
      minArea: null,
      floorPreference: null,
      features: [],
    },
    priorities: { freeText: "", mustHave: [], niceToHave: [] },
    budget: {
      currency: rango.moneda,
      min: rango.desde,
      max: rango.hasta,
      maxCommonExpenses: null,
      maxRent: null,
      maxTotalMonthly: null,
    },
    transaction: { financing: null, intent: null, moveTimeline: null },
  };
}

export function perfilVentaInicial(): SellProfile {
  return {
    operation: "sell",
    property: { type: null, location: [], bedrooms: null },
    motivation: null,
    timeline: null,
  };
}

function leerCrudo<T>(clave: string): Partial<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const guardado = window.sessionStorage.getItem(clave);
    return guardado ? (JSON.parse(guardado) as Partial<T>) : null;
  } catch {
    return null;
  }
}

function guardarCrudo(clave: string, valor: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Modo privado o almacenamiento lleno: el recorrido sigue funcionando,
    // sólo se pierde lo escrito si se recarga.
  }
}

export function guardarPerfil(perfil: SearchProfile): void {
  guardarCrudo(`${CLAVE_BUSQUEDA}:${perfil.operation}`, perfil);
}

/**
 * Devuelve lo guardado completando con el perfil inicial lo que falte, así un
 * dato de una versión anterior no rompe la pantalla.
 */
export function leerPerfil(operation: Operacion): SearchProfile | null {
  const guardado = leerCrudo<SearchProfile>(`${CLAVE_BUSQUEDA}:${operation}`);
  if (!guardado) return null;

  const base = perfilInicial(operation);
  return {
    operation,
    location: { ...base.location, ...guardado.location },
    property: { ...base.property, ...guardado.property },
    priorities: { ...base.priorities, ...guardado.priorities },
    budget: { ...base.budget, ...guardado.budget },
    transaction: { ...base.transaction, ...guardado.transaction },
  };
}

export function guardarVenta(perfil: SellProfile): void {
  guardarCrudo(CLAVE_VENTA, perfil);
}

export function leerVenta(): SellProfile | null {
  const guardado = leerCrudo<SellProfile>(CLAVE_VENTA);
  if (!guardado) return null;

  const base = perfilVentaInicial();
  return {
    operation: "sell",
    property: { ...base.property, ...guardado.property },
    motivation: guardado.motivation ?? null,
    timeline: guardado.timeline ?? null,
  };
}
