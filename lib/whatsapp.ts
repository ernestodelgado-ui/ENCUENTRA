/**
 * Enlaces a WhatsApp con el mensaje ya escrito.
 *
 * encuentra. nunca pide el número de la persona: el enlace abre WhatsApp con el
 * texto preparado y ella decide si lo envía. Nada se manda solo.
 */

import {
  OPERACION_LABEL,
  formatMoneda,
  esRangoCompleto,
  rangoDe,
  TIPO_PROPIEDAD_LABEL,
  type Caracteristica,
  type SearchCriteria,
  type TipoPropiedad,
} from "@/lib/search/types";
import type { Property } from "@/lib/propiedades/types";

/**
 * Número del asesor, en formato internacional sin "+" ni espacios.
 *
 * Se configura con NEXT_PUBLIC_WHATSAPP_NUMERO en el archivo .env.local. El
 * valor de abajo es sólo para poder probar: hay que reemplazarlo por el real
 * antes de publicar.
 */
export const NUMERO_ASESOR =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "59899123456";

function enlace(mensaje: string): string {
  return `https://wa.me/${NUMERO_ASESOR}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * "Pocitos, Punta Carretas o Buceo". El conector cambia según el sentido: las
 * zonas y los tipos son alternativas ("o"), las características se acumulan
 * ("y" — se quiere garaje *y* balcón, no cualquiera de los dos).
 */
function enumerar(valores: string[], conector: "o" | "y" = "o"): string {
  if (valores.length === 0) return "";
  if (valores.length === 1) return valores[0];
  return `${valores.slice(0, -1).join(", ")} ${conector} ${valores[valores.length - 1]}`;
}

/** El mensaje se lee en voz de la persona, así que los tipos llevan artículo. */
const ARTICULO: Record<TipoPropiedad, string> = {
  apartamento: "un",
  casa: "una",
  terreno: "un",
  local: "un",
  oficina: "una",
};

/**
 * Cómo se nombra cada característica dentro de la oración.
 *
 * La mayoría son cosas que la propiedad tiene y se enumeran detrás de "con".
 * Otras son condiciones y no encajan ahí — "con que acepte mascotas" no se dice
 * — así que van como cláusula suelta.
 */
const CARACTERISTICA_CON: Partial<Record<Caracteristica, string>> = {
  garaje: "garaje",
  balcon: "balcón",
  terraza: "terraza",
  parrillero: "parrillero",
  jardin: "jardín",
  piscina: "piscina",
};

const CARACTERISTICA_SUELTA: Partial<Record<Caracteristica, string>> = {
  amoblado: "amoblado",
  mascotas: "que acepte mascotas",
};

function describirCaracteristicas(caracteristicas: Caracteristica[]): string[] {
  const conPrefijo = caracteristicas
    .map((c) => CARACTERISTICA_CON[c])
    .filter((v): v is string => v !== undefined);

  const sueltas = caracteristicas
    .map((c) => CARACTERISTICA_SUELTA[c])
    .filter((v): v is string => v !== undefined);

  return [
    conPrefijo.length > 0 ? `con ${enumerar(conPrefijo, "y")}` : null,
    ...sueltas,
  ].filter((parte): parte is string => parte !== null);
}

function describirTipos(tipos: TipoPropiedad[]): string {
  if (tipos.length === 0) return "una propiedad";
  return enumerar(
    tipos.map((t) => `${ARTICULO[t]} ${TIPO_PROPIEDAD_LABEL[t].toLowerCase()}`)
  );
}

function describirDormitorios(dormitorios: number[]): string | null {
  if (dormitorios.length === 0) return null;

  const ordenados = [...dormitorios].sort((a, b) => a - b);

  // Con números sueltos alcanza con nombrar la unidad una sola vez al final:
  // "de 2 o 3 dormitorios" en lugar de "de 2 dormitorios o 3 dormitorios".
  if (ordenados.every((n) => n > 0 && n < 5)) {
    const unidad = ordenados.length === 1 && ordenados[0] === 1 ? "dormitorio" : "dormitorios";
    return `de ${enumerar(ordenados.map(String))} ${unidad}`;
  }

  return `de ${enumerar(
    ordenados.map((n) =>
      n === 0 ? "monoambiente" : n === 5 ? "5 o más dormitorios" : `${n} dormitorios`
    )
  )}`;
}

function describirBanos(banos: number[]): string | null {
  if (banos.length === 0) return null;

  const ordenados = [...banos].sort((a, b) => a - b);
  const unidad = ordenados.length === 1 && ordenados[0] === 1 ? "baño" : "baños";

  return `con ${enumerar(ordenados.map((n) => (n === 4 ? "4 o más" : String(n))))} ${unidad}`;
}

/**
 * El presupuesto se redacta según qué extremo movió la persona, en vez de
 * volcar el rango crudo: "hasta USD 380.000" se entiende mejor que
 * "USD 20.000 – 380.000".
 */
function describirPresupuesto(criteria: SearchCriteria): string | null {
  const { operacion, presupuesto } = criteria;
  if (esRangoCompleto(operacion, presupuesto)) return null;

  const rango = rangoDe(operacion, presupuesto.moneda);
  const { moneda, desde, hasta } = presupuesto;

  if (hasta >= rango.max) return `desde ${formatMoneda(desde, moneda)}`;
  if (desde <= rango.min) return `hasta ${formatMoneda(hasta, moneda)}`;

  return `entre ${formatMoneda(desde, moneda)} y ${formatMoneda(hasta, moneda)}`;
}

/**
 * Mensaje para consultar por más opciones a partir de una búsqueda.
 *
 * Ejemplo: "Hola, hice una búsqueda en encuentra. Estoy buscando comprar un
 * apartamento en Pocitos, Punta Carretas o Buceo, de 2 dormitorios, hasta USD
 * 380.000. Me gustaría recibir más opciones."
 */
export function mensajeDeBusqueda(criteria: SearchCriteria): string {
  const operacion = OPERACION_LABEL[criteria.operacion].toLowerCase();

  // El tipo y la zona van pegados, sin coma: "un apartamento en Pocitos".
  let apertura = `Estoy buscando ${operacion} ${describirTipos(criteria.tiposPropiedad)}`;
  if (criteria.zonas.length > 0) {
    apertura += ` en ${enumerar(criteria.zonas)}`;
  }

  const partes = [
    apertura,
    describirDormitorios(criteria.dormitorios),
    describirBanos(criteria.banos),
    describirPresupuesto(criteria),
    ...describirCaracteristicas(criteria.caracteristicas),
  ].filter((parte): parte is string => parte !== null);

  return `Hola, hice una búsqueda en encuentra. ${partes.join(", ")}. Me gustaría recibir más opciones.`;
}

export function enlaceDeBusqueda(criteria: SearchCriteria): string {
  return enlace(mensajeDeBusqueda(criteria));
}

/**
 * Mensaje para consultar por una propiedad puntual. Lleva la referencia para
 * que el asesor sepa de entrada de cuál se trata.
 */
export function mensajeDePropiedad(property: Property): string {
  const tipo = TIPO_PROPIEDAD_LABEL[property.property_type].toLowerCase();
  const precio = formatMoneda(property.price, property.currency);

  return (
    `Hola, vi en encuentra. el ${tipo} en ${property.neighborhood} de ${precio} ` +
    `y quisiera recibir más información sobre esta propiedad. ` +
    `(Ref: ${property.reference})`
  );
}

export function enlaceDePropiedad(property: Property): string {
  return enlace(mensajeDePropiedad(property));
}
