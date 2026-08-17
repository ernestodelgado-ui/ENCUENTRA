/**
 * Los perfiles que arman los recorridos guiados.
 *
 * Hay dos, separados a propósito: quien busca y quien vende no comparten casi
 * nada, y mezclarlos obligaría a llenar de campos opcionales un objeto que
 * después nadie entiende.
 *
 * Las claves van en inglés y en camelCase, igual que el modelo de propiedad:
 * son los objetos que van a viajar a la API de IA cuando exista.
 *
 * Los `freeText` están aislados a propósito. Son exactamente los campos que se
 * le van a mandar al modelo para que los convierta en zonas, tipos y
 * características estructuradas. Hoy se guardan tal cual y no se interpretan.
 */

import type { Moneda } from "@/lib/search/types";

export type { Moneda };

/** Comprar y alquilar comparten recorrido; vender tiene el suyo. */
export type Operacion = "buy" | "rent";

export const OPERACION_LABEL: Record<Operacion, string> = {
  buy: "Comprar",
  rent: "Alquilar",
};

export const OPERACION_RUTA: Record<Operacion, string> = {
  buy: "comprar",
  rent: "alquilar",
};

export function operacionDesdeRuta(valor: string): Operacion | null {
  if (valor === "comprar") return "buy";
  if (valor === "alquilar") return "rent";
  return null;
}

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
  "vida-de-barrio": "Vida de barrio",
};

export const PREFERENCIAS_ZONA = Object.keys(
  PREFERENCIA_ZONA_LABEL
) as PreferenciaZona[];

/** Tipos de propiedad que se pueden buscar o vender. */
export type TipoPropiedad =
  | "apartamento"
  | "casa"
  | "terreno"
  | "local"
  | "oficina";

export const TIPO_PROPIEDAD_LABEL: Record<TipoPropiedad, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  terreno: "Terreno",
  local: "Local",
  oficina: "Oficina",
};

export const TIPOS_PROPIEDAD = Object.keys(
  TIPO_PROPIEDAD_LABEL
) as TipoPropiedad[];

/** Características de la propiedad. Sirven para la pregunta 2 y para la 3. */
export type Caracteristica =
  | "garaje"
  | "balcon"
  | "terraza"
  | "jardin"
  | "parrillero"
  | "piscina"
  | "luminoso"
  | "espacio-trabajo"
  | "cocina-amplia"
  | "buena-vista"
  | "mascotas"
  | "seguridad";

export const CARACTERISTICA_LABEL: Record<Caracteristica, string> = {
  garaje: "Garaje",
  balcon: "Balcón",
  terraza: "Terraza",
  jardin: "Jardín",
  parrillero: "Parrillero",
  piscina: "Piscina",
  luminoso: "Luminoso",
  "espacio-trabajo": "Espacio para trabajar",
  "cocina-amplia": "Cocina amplia",
  "buena-vista": "Buena vista",
  mascotas: "Acepta mascotas",
  seguridad: "Seguridad",
};

export const CARACTERISTICAS = Object.keys(
  CARACTERISTICA_LABEL
) as Caracteristica[];

/** Preferencia de piso. Sólo tiene sentido en apartamentos. */
export type PreferenciaPiso =
  | "indiferente"
  | "no-planta-baja"
  | "planta-baja-ok"
  | "piso-alto";

export const PREFERENCIA_PISO_LABEL: Record<PreferenciaPiso, string> = {
  indiferente: "No me importa",
  "no-planta-baja": "No quiero planta baja",
  "planta-baja-ok": "Planta baja está bien",
  "piso-alto": "Piso alto",
};

export const PREFERENCIAS_PISO = Object.keys(
  PREFERENCIA_PISO_LABEL
) as PreferenciaPiso[];

/** Cómo piensa pagarlo. Sólo aplica a compra. */
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

export const FINANCIACIONES = Object.keys(FINANCIACION_LABEL) as Financiacion[];

/** En qué momento de la compra está. */
export type Momento = "visitar" | "evaluar" | "vender-primero" | "explorando";

export const MOMENTO: Record<Momento, { titulo: string; detalle: string }> = {
  visitar: { titulo: "Querría visitarla", detalle: "Estoy buscando activamente." },
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

/** Cuándo necesita mudarse. Reemplaza al momento cuando se alquila. */
export type Mudanza = "ya" | "1-mes" | "1-3-meses" | "mas-adelante" | "mirando";

export const MUDANZA_LABEL: Record<Mudanza, string> = {
  ya: "Lo antes posible",
  "1-mes": "Dentro de 1 mes",
  "1-3-meses": "1 a 3 meses",
  "mas-adelante": "Más adelante",
  mirando: "Solo estoy mirando",
};

export const MUDANZAS = Object.keys(MUDANZA_LABEL) as Mudanza[];

/** Topes de gastos comunes que se ofrecen como atajo, en pesos. */
export const TOPES_GASTOS_COMUNES = [5000, 8000, 12000];

// ------------------------------------------------------- perfil de búsqueda

export type SearchProfile = {
  operation: Operacion;

  location: {
    freeText: string;
    /** Localidades concretas, ej. "Pocitos". */
    selectedLocations: string[];
    preferences: PreferenciaZona[];
  };

  property: {
    freeText: string;
    type: TipoPropiedad | null;
    /** Cantidades tildadas. 0 = monoambiente, 5 = "5 o más". */
    bedrooms: number[];
    /** Cantidades tildadas. 4 = "4 o más". */
    bathrooms: number[];
    minArea: number | null;
    floorPreference: PreferenciaPiso | null;
    features: Caracteristica[];
  };

  priorities: {
    freeText: string;
    mustHave: Caracteristica[];
    niceToHave: Caracteristica[];
  };

  budget: {
    currency: Moneda;
    /** Precio de compra. */
    min: number | null;
    max: number | null;
    /** Tope de gastos comunes mensuales, en pesos. */
    maxCommonExpenses: number | null;
    /** Alquiler mensual máximo. */
    maxRent: number | null;
    /** Alquiler + gastos comunes, para quien razona por el total. */
    maxTotalMonthly: number | null;
  };

  transaction: {
    financing: Financiacion | null;
    intent: Momento | null;
    moveTimeline: Mudanza | null;
  };
};

// --------------------------------------------------------- perfil de venta

export type MotivoVenta =
  | "mudarme"
  | "comprar-otra"
  | "inversion"
  | "herencia"
  | "liquidez"
  | "otro"
  | "prefiero-no-responder";

export const MOTIVO_VENTA_LABEL: Record<MotivoVenta, string> = {
  mudarme: "Quiero mudarme",
  "comprar-otra": "Necesito comprar otra propiedad",
  inversion: "Inversión",
  herencia: "Herencia",
  liquidez: "Necesito liquidez",
  otro: "Otro",
  "prefiero-no-responder": "Prefiero no responder",
};

export const MOTIVOS_VENTA = Object.keys(MOTIVO_VENTA_LABEL) as MotivoVenta[];

export type MomentoVenta =
  | "ahora"
  | "3-meses"
  | "6-meses"
  | "solo-tasar"
  | "pensandolo";

export const MOMENTO_VENTA_LABEL: Record<MomentoVenta, string> = {
  ahora: "Quiero vender ahora",
  "3-meses": "En los próximos 3 meses",
  "6-meses": "En los próximos 6 meses",
  "solo-tasar": "Solo quiero saber cuánto podría valer",
  pensandolo: "Todavía lo estoy pensando",
};

export const MOMENTOS_VENTA = Object.keys(
  MOMENTO_VENTA_LABEL
) as MomentoVenta[];

/** Los que vende puede elegir un tipo que no se ofrece para buscar. */
export type TipoPropiedadVenta = TipoPropiedad | "otro";

export const TIPO_VENTA_LABEL: Record<TipoPropiedadVenta, string> = {
  ...TIPO_PROPIEDAD_LABEL,
  otro: "Otro",
};

export const TIPOS_VENTA = Object.keys(TIPO_VENTA_LABEL) as TipoPropiedadVenta[];

export type SellProfile = {
  operation: "sell";
  property: {
    type: TipoPropiedadVenta | null;
    /** Localidades elegidas. */
    location: string[];
    bedrooms: number | null;
  };
  motivation: MotivoVenta | null;
  timeline: MomentoVenta | null;
};

/** Tope de caracteres de cada respuesta escrita. */
export const MAX_TEXTO = 600;
