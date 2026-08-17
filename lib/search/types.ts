/**
 * Modelo de los criterios de búsqueda.
 *
 * La persona los elige tildando opciones y moviendo la barra de presupuesto;
 * no hay interpretación de texto libre. Es el contrato entre el formulario
 * (`components/buscar/step-form.tsx`) y el envío del lead
 * (`app/buscar/actions.ts`).
 */

export type Operacion = "comprar" | "alquilar";

export type TipoPropiedad =
  | "apartamento"
  | "casa"
  | "terreno"
  | "local"
  | "oficina";

export type Caracteristica =
  | "garaje"
  | "balcon"
  | "terraza"
  | "parrillero"
  | "jardin"
  | "piscina"
  | "amoblado"
  | "mascotas";

export type Moneda = "USD" | "UYU";

export type Presupuesto = {
  moneda: Moneda;
  desde: number;
  hasta: number;
};

export type SearchCriteria = {
  operacion: Operacion;
  tiposPropiedad: TipoPropiedad[];
  /** Localidades elegidas, sin el departamento: "Pocitos", "La Barra". */
  zonas: string[];
  /** Cantidades tildadas. 0 = monoambiente, 5 = "5 o más". */
  dormitorios: number[];
  /** Cantidades tildadas. 4 = "4 o más". */
  banos: number[];
  presupuesto: Presupuesto;
  caracteristicas: Caracteristica[];
};

// ---------------------------------------------------------------- etiquetas

export const OPERACION_LABEL: Record<Operacion, string> = {
  comprar: "Comprar",
  alquilar: "Alquilar",
};

export const TIPO_PROPIEDAD_LABEL: Record<TipoPropiedad, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  terreno: "Terreno",
  local: "Local comercial",
  oficina: "Oficina",
};

export const CARACTERISTICA_LABEL: Record<Caracteristica, string> = {
  garaje: "Garaje",
  balcon: "Balcón",
  terraza: "Terraza",
  parrillero: "Parrillero",
  jardin: "Jardín",
  piscina: "Piscina",
  amoblado: "Amoblado",
  mascotas: "Acepta mascotas",
};

export const MONEDA_LABEL: Record<Moneda, string> = {
  USD: "Dólares",
  UYU: "Pesos",
};

export const OPERACIONES = Object.keys(OPERACION_LABEL) as Operacion[];
export const TIPOS_PROPIEDAD = Object.keys(
  TIPO_PROPIEDAD_LABEL
) as TipoPropiedad[];
export const CARACTERISTICAS = Object.keys(
  CARACTERISTICA_LABEL
) as Caracteristica[];
export const MONEDAS = Object.keys(MONEDA_LABEL) as Moneda[];

/** Opciones de dormitorios que se ofrecen para tildar. */
export const OPCIONES_DORMITORIOS = [0, 1, 2, 3, 4, 5];

/** Opciones de baños que se ofrecen para tildar. */
export const OPCIONES_BANOS = [1, 2, 3, 4];

/**
 * Zonas en dos niveles: departamento y localidad. El formulario despliega un
 * departamento por vez, así la lista completa (más de 50 localidades) no se
 * muestra toda junta.
 */
export type Departamento = {
  nombre: string;
  localidades: string[];
};

export const DEPARTAMENTOS: Departamento[] = [
  {
    nombre: "Montevideo",
    localidades: [
      "Pocitos",
      "Punta Carretas",
      "Buceo",
      "Malvín",
      "Parque Rodó",
      "Cordón",
      "Centro",
      "Ciudad Vieja",
      "Tres Cruces",
      "Prado",
      "Carrasco",
      "Punta Gorda",
      "Parque Batlle",
      "La Blanqueada",
      "Villa Biarritz",
      "Aguada",
      "Capurro",
      "Sayago",
      "Colón",
      "Belvedere",
    ],
  },
  {
    nombre: "Canelones",
    localidades: [
      "Ciudad de la Costa",
      "Solymar",
      "Lagomar",
      "El Pinar",
      "Shangrilá",
      "Atlántida",
      "Parque del Plata",
      "Las Toscas",
      "Salinas",
      "Las Piedras",
      "Pando",
      "Canelones",
    ],
  },
  {
    nombre: "Maldonado",
    localidades: [
      "Punta del Este",
      "Maldonado",
      "Piriápolis",
      "La Barra",
      "José Ignacio",
      "San Carlos",
      "Solanas",
      "Punta Ballena",
    ],
  },
  {
    nombre: "Rocha",
    localidades: [
      "La Paloma",
      "La Pedrera",
      "Punta del Diablo",
      "Cabo Polonio",
      "Chuy",
    ],
  },
  {
    nombre: "Colonia",
    localidades: [
      "Colonia del Sacramento",
      "Carmelo",
      "Nueva Helvecia",
      "Juan Lacaze",
    ],
  },
];

export const ZONAS = DEPARTAMENTOS.flatMap((d) => d.localidades);

// -------------------------------------------------------------- presupuesto

export type RangoPresupuesto = { min: number; max: number; paso: number };

/**
 * Topes de la barra según qué se busca y en qué moneda. Comprar y alquilar
 * viven en órdenes de magnitud distintos, así que una sola escala dejaría el
 * alquiler aplastado contra el extremo izquierdo.
 */
export const RANGOS_PRESUPUESTO: Record<
  Operacion,
  Record<Moneda, RangoPresupuesto>
> = {
  comprar: {
    USD: { min: 20_000, max: 600_000, paso: 5_000 },
    UYU: { min: 800_000, max: 24_000_000, paso: 200_000 },
  },
  alquilar: {
    USD: { min: 200, max: 6_000, paso: 50 },
    UYU: { min: 8_000, max: 240_000, paso: 2_000 },
  },
};

export function rangoDe(
  operacion: Operacion,
  moneda: Moneda
): RangoPresupuesto {
  return RANGOS_PRESUPUESTO[operacion][moneda];
}

/** Presupuesto que abarca todo el rango disponible, es decir "sin filtro". */
export function presupuestoCompleto(
  operacion: Operacion,
  moneda: Moneda
): Presupuesto {
  const rango = rangoDe(operacion, moneda);
  return { moneda, desde: rango.min, hasta: rango.max };
}

export function esRangoCompleto(
  operacion: Operacion,
  presupuesto: Presupuesto
): boolean {
  const rango = rangoDe(operacion, presupuesto.moneda);
  return presupuesto.desde <= rango.min && presupuesto.hasta >= rango.max;
}

export const CRITERIOS_INICIALES: SearchCriteria = {
  operacion: "comprar",
  tiposPropiedad: [],
  zonas: [],
  dormitorios: [],
  banos: [],
  presupuesto: presupuestoCompleto("comprar", "USD"),
  caracteristicas: [],
};

// --------------------------------------------------------------- formateo

const numberFormatter = new Intl.NumberFormat("es-UY", {
  maximumFractionDigits: 0,
});

export function formatMonto(monto: number): string {
  return numberFormatter.format(monto);
}

export function simboloDe(moneda: Moneda): string {
  return moneda === "USD" ? "USD" : "$";
}

/** Un monto suelto, ej. "USD 180.000" o "$ 28.000". */
export function formatMoneda(monto: number, moneda: Moneda): string {
  return `${simboloDe(moneda)} ${formatMonto(monto)}`;
}

/**
 * El rango completo, ej. "USD 50.000 – 200.000". Si toca el tope superior se
 * muestra abierto ("USD 500.000 o más") para no dar a entender que ahí se corta.
 */
export function formatPresupuesto(
  operacion: Operacion,
  presupuesto: Presupuesto
): string {
  const rango = rangoDe(operacion, presupuesto.moneda);
  const { moneda, desde, hasta } = presupuesto;

  if (esRangoCompleto(operacion, presupuesto)) return "Cualquier precio";
  if (hasta >= rango.max) return `${formatMoneda(desde, moneda)} o más`;
  if (desde <= rango.min) return `Hasta ${formatMoneda(hasta, moneda)}`;

  return `${formatMoneda(desde, moneda)} – ${formatMonto(hasta)}`;
}

export const SIN_PREFERENCIA = "Sin preferencia";

export function formatTiposPropiedad(tipos: TipoPropiedad[]): string {
  if (tipos.length === 0) return SIN_PREFERENCIA;
  return tipos.map((t) => TIPO_PROPIEDAD_LABEL[t]).join(", ");
}

export function formatZonas(zonas: string[]): string {
  return zonas.length > 0 ? zonas.join(", ") : "Cualquier zona";
}

export function formatDormitorio(n: number): string {
  if (n === 0) return "Monoambiente";
  if (n === 5) return "5 o más";
  return n === 1 ? "1 dormitorio" : `${n} dormitorios`;
}

export function formatDormitorios(dormitorios: number[]): string {
  if (dormitorios.length === 0) return SIN_PREFERENCIA;

  const ordenados = [...dormitorios].sort((a, b) => a - b);
  if (ordenados.length === 1) return formatDormitorio(ordenados[0]);

  // "Monoambiente, 1, 2 o 3 dormitorios" queda largo: se listan los números y
  // se aclara la unidad una sola vez al final.
  return ordenados
    .map((n) => (n === 0 ? "Monoambiente" : n === 5 ? "5+" : String(n)))
    .join(", ")
    .concat(" dormitorios");
}

export function formatBano(n: number): string {
  if (n === 4) return "4 o más";
  return n === 1 ? "1 baño" : `${n} baños`;
}

export function formatBanos(banos: number[]): string {
  if (banos.length === 0) return SIN_PREFERENCIA;

  const ordenados = [...banos].sort((a, b) => a - b);
  if (ordenados.length === 1) return formatBano(ordenados[0]);

  return ordenados
    .map((n) => (n === 4 ? "4+" : String(n)))
    .join(", ")
    .concat(" baños");
}

export function formatCaracteristicas(caracteristicas: Caracteristica[]): string {
  if (caracteristicas.length === 0) return SIN_PREFERENCIA;
  return caracteristicas.map((c) => CARACTERISTICA_LABEL[c]).join(", ");
}

/** Resumen en una línea, para el aviso al asesor y las búsquedas guardadas. */
export function resumirCriterios(criteria: SearchCriteria): string {
  const partes = [
    OPERACION_LABEL[criteria.operacion],
    formatTiposPropiedad(criteria.tiposPropiedad),
    criteria.zonas.length > 0 ? `en ${formatZonas(criteria.zonas)}` : null,
    criteria.dormitorios.length > 0
      ? formatDormitorios(criteria.dormitorios)
      : null,
    criteria.banos.length > 0 ? formatBanos(criteria.banos) : null,
    formatPresupuesto(criteria.operacion, criteria.presupuesto),
  ].filter(Boolean);

  return partes.join(" · ");
}
