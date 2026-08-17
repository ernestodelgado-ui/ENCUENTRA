/**
 * Traduce los criterios de búsqueda a query string y de vuelta.
 *
 * Es la pieza que hace que una búsqueda se pueda compartir, que el botón atrás
 * del navegador funcione solo, y que la analítica pueda leer qué se buscó sin
 * instrumentación especial.
 *
 * También es el enganche previsto para la IA: cuando exista, va a interpretar el
 * texto libre y producir exactamente estos parámetros, sin tocar el motor de
 * búsqueda ni las pantallas.
 *
 * Al leer, todo valor desconocido se descarta en silencio en vez de romper: la
 * URL es entrada de afuera y puede venir editada a mano o recortada.
 */

import {
  CARACTERISTICAS,
  CRITERIOS_INICIALES,
  MONEDAS,
  OPCIONES_BANOS,
  OPCIONES_DORMITORIOS,
  OPERACIONES,
  TIPOS_PROPIEDAD,
  ZONAS,
  rangoDe,
  type Caracteristica,
  type Moneda,
  type Operacion,
  type SearchCriteria,
  type TipoPropiedad,
} from "./types";

const PARAM = {
  operacion: "op",
  tipos: "tipo",
  zonas: "zona",
  dormitorios: "dorm",
  banos: "banos",
  moneda: "moneda",
  desde: "desde",
  hasta: "hasta",
  caracteristicas: "carac",
} as const;

function listaDesde<T extends string>(
  valor: string | null,
  permitidos: readonly T[]
): T[] {
  if (!valor) return [];
  const validos = valor
    .split(",")
    .map((parte) => parte.trim())
    .filter((parte): parte is T => (permitidos as readonly string[]).includes(parte));

  return [...new Set(validos)];
}

function numerosDesde(valor: string | null, permitidos: number[]): number[] {
  if (!valor) return [];
  const validos = valor
    .split(",")
    .map((parte) => Number.parseInt(parte.trim(), 10))
    .filter((n) => permitidos.includes(n));

  return [...new Set(validos)];
}

export function criteriosAParams(criteria: SearchCriteria): URLSearchParams {
  const params = new URLSearchParams();

  params.set(PARAM.operacion, criteria.operacion);
  params.set(PARAM.moneda, criteria.presupuesto.moneda);
  params.set(PARAM.desde, String(criteria.presupuesto.desde));
  params.set(PARAM.hasta, String(criteria.presupuesto.hasta));

  const listas: [string, string[]][] = [
    [PARAM.tipos, criteria.tiposPropiedad],
    [PARAM.zonas, criteria.zonas],
    [PARAM.dormitorios, criteria.dormitorios.map(String)],
    [PARAM.banos, criteria.banos.map(String)],
    [PARAM.caracteristicas, criteria.caracteristicas],
  ];

  for (const [clave, valores] of listas) {
    if (valores.length > 0) params.set(clave, valores.join(","));
  }

  return params;
}

export function criteriosAUrl(criteria: SearchCriteria): string {
  return `/resultados?${criteriosAParams(criteria).toString()}`;
}

/**
 * Reconstruye los criterios desde la URL. Lo que no se entienda cae al valor
 * inicial, así una URL rota igual muestra una búsqueda válida.
 */
export function paramsACriterios(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): SearchCriteria {
  const leer = (clave: string): string | null => {
    if (params instanceof URLSearchParams) return params.get(clave);
    const valor = params[clave];
    if (Array.isArray(valor)) return valor[0] ?? null;
    return valor ?? null;
  };

  const operacion =
    (listaDesde<Operacion>(leer(PARAM.operacion), OPERACIONES)[0] ??
      CRITERIOS_INICIALES.operacion);

  const moneda =
    (listaDesde<Moneda>(leer(PARAM.moneda), MONEDAS)[0] ??
      CRITERIOS_INICIALES.presupuesto.moneda);

  // El presupuesto se recorta al rango válido de esa operación y moneda, y se
  // ordena por si vinieran cruzados.
  const rango = rangoDe(operacion, moneda);
  const acotar = (valor: number) =>
    Math.min(Math.max(valor, rango.min), rango.max);

  const desdeCrudo = Number.parseInt(leer(PARAM.desde) ?? "", 10);
  const hastaCrudo = Number.parseInt(leer(PARAM.hasta) ?? "", 10);

  const desde = Number.isFinite(desdeCrudo) ? acotar(desdeCrudo) : rango.min;
  const hasta = Number.isFinite(hastaCrudo) ? acotar(hastaCrudo) : rango.max;

  return {
    operacion,
    tiposPropiedad: listaDesde<TipoPropiedad>(leer(PARAM.tipos), TIPOS_PROPIEDAD),
    zonas: listaDesde(leer(PARAM.zonas), ZONAS),
    dormitorios: numerosDesde(leer(PARAM.dormitorios), OPCIONES_DORMITORIOS),
    banos: numerosDesde(leer(PARAM.banos), OPCIONES_BANOS),
    presupuesto: {
      moneda,
      desde: Math.min(desde, hasta),
      hasta: Math.max(desde, hasta),
    },
    caracteristicas: listaDesde<Caracteristica>(
      leer(PARAM.caracteristicas),
      CARACTERISTICAS
    ),
  };
}
