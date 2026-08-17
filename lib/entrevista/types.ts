/**
 * El perfil de búsqueda que arma la entrevista.
 *
 * Las claves van en inglés, igual que el modelo de propiedad: este objeto es el
 * que va a viajar a la API de IA cuando exista, y conviene que no lo toque
 * nadie después.
 *
 * Los tres `free_text` están aislados a propósito. Son exactamente los campos
 * que se le van a mandar al modelo para que los convierta en zonas, tipos y
 * características estructuradas. Hoy se guardan tal cual los escribió la
 * persona y no se interpretan: `lib/entrevista/a-criterios.ts` sólo traduce lo
 * que se eligió tocando pastillas.
 */

import type { Moneda, Operacion } from "@/lib/search/types";

export type { Moneda, Operacion };

// ------------------------------------------------------------- vocabularios

/** Cómo le gustaría que fuera la zona. Nada de esto es un barrio concreto. */
export type PreferenciaZona =
  | "cerca-rambla"
  | "barrio-tranquilo"
  | "cerca-de-todo"
  | "mucho-verde"
  | "buena-locomocion"
  | "cerca-trabajo"
  | "cerca-colegios"
  | "vida-de-barrio";

export const PREFERENCIA_ZONA_LABEL: Record<PreferenciaZona, string> = {
  "cerca-rambla": "Cerca de la rambla",
  "barrio-tranquilo": "Barrio tranquilo",
  "cerca-de-todo": "Cerca de todo",
  "mucho-verde": "Mucho verde",
  "buena-locomocion": "Buena locomoción",
  "cerca-trabajo": "Cerca del trabajo",
  "cerca-colegios": "Cerca de colegios",
  "vida-de-barrio": "Con vida de barrio",
};

export const PREFERENCIAS_ZONA = Object.keys(
  PREFERENCIA_ZONA_LABEL
) as PreferenciaZona[];

/**
 * Cómo tendría que ser la propiedad. El mismo vocabulario sirve para la
 * pregunta 2 (qué te gustaría) y la 3 (qué no negociarías): son las mismas
 * cosas, lo que cambia es cuánto pesan.
 */
export type PreferenciaHogar =
  | "luminoso"
  | "balcon"
  | "terraza"
  | "jardin"
  | "garaje"
  | "parrillero"
  | "espacio-trabajo"
  | "cocina-amplia"
  | "buena-vista"
  | "mascotas"
  | "piscina"
  | "seguridad";

export const PREFERENCIA_HOGAR_LABEL: Record<PreferenciaHogar, string> = {
  luminoso: "Luminoso",
  balcon: "Balcón",
  terraza: "Terraza",
  jardin: "Jardín",
  garaje: "Garaje",
  parrillero: "Parrillero",
  "espacio-trabajo": "Espacio para trabajar",
  "cocina-amplia": "Cocina amplia",
  "buena-vista": "Buena vista",
  mascotas: "Acepta mascotas",
  piscina: "Piscina",
  seguridad: "Seguridad",
};

export const PREFERENCIAS_HOGAR = Object.keys(
  PREFERENCIA_HOGAR_LABEL
) as PreferenciaHogar[];

/** Cómo pensás pagarlo. */
export type Financiacion =
  | "contado"
  | "credito"
  | "contado-financiacion"
  | "vender-primero"
  | "no-lo-se";

export const FINANCIACION_LABEL: Record<Financiacion, string> = {
  contado: "Contado",
  credito: "Crédito bancario",
  "contado-financiacion": "Contado + financiación",
  "vender-primero": "Necesito vender primero",
  "no-lo-se": "Todavía no lo sé",
};

export const FINANCIACIONES = Object.keys(
  FINANCIACION_LABEL
) as Financiacion[];

/** En qué momento de la búsqueda está. */
export type Momento = "visitar" | "evaluar" | "vender-primero" | "explorando";

export const MOMENTO: Record<Momento, { titulo: string; detalle: string }> = {
  visitar: {
    titulo: "Querría visitarla",
    detalle: "Estoy buscando activamente.",
  },
  evaluar: {
    titulo: "La evaluaría con calma",
    detalle: "Estoy interesado, pero no tengo apuro.",
  },
  "vender-primero": {
    titulo: "Primero necesito vender",
    detalle: "Mi próxima compra depende de otra propiedad.",
  },
  explorando: {
    titulo: "Por ahora estoy explorando",
    detalle: "Todavía estoy conociendo opciones.",
  },
};

export const MOMENTOS = Object.keys(MOMENTO) as Momento[];

// ----------------------------------------------------------------- el perfil

export type SearchProfile = {
  location: {
    free_text: string;
    preferences: PreferenciaZona[];
  };
  home: {
    free_text: string;
    preferences: PreferenciaHogar[];
  };
  priorities: {
    free_text: string;
    must_have: PreferenciaHogar[];
    nice_to_have: PreferenciaHogar[];
  };
  transaction: {
    operation: Operacion;
    currency: Moneda;
    budget_min: number;
    budget_max: number;
    financing: Financiacion | null;
  };
  intent: {
    stage: Momento | null;
  };
};

/** Tope de caracteres de cada respuesta escrita. */
export const MAX_TEXTO = 600;
