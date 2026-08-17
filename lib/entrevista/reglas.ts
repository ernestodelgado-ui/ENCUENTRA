/**
 * Qué preguntar y qué callar.
 *
 * Todas las decisiones de "esto no corresponde mostrarlo" viven acá, en vez de
 * repartidas como condicionales dentro de cada pantalla. Así se puede leer de
 * un vistazo por qué a alguien que busca un terreno no se le pregunta cuántos
 * dormitorios quiere, y se cambia en un solo lugar.
 *
 * Es lo que hace que la experiencia se sienta atenta antes de tener IA: no es
 * inteligencia, es no preguntar lo que no viene al caso.
 */

import type { SearchProfile, TipoPropiedad } from "./types";

/** Los que tienen ambientes habitables. Un terreno no. */
const CON_AMBIENTES: TipoPropiedad[] = ["apartamento", "casa"];

/** Los que suelen tener gastos comunes: sólo los que están en un edificio. */
const CON_GASTOS_COMUNES: TipoPropiedad[] = ["apartamento", "oficina"];

export function preguntaDormitorios(perfil: SearchProfile): boolean {
  const tipo = perfil.property.type;
  return tipo !== null && CON_AMBIENTES.includes(tipo);
}

export function preguntaBanos(perfil: SearchProfile): boolean {
  const tipo = perfil.property.type;
  // Un local o una oficina sí tienen baño, pero no es un criterio de búsqueda
  // relevante: se pregunta sólo donde se va a vivir.
  return tipo !== null && CON_AMBIENTES.includes(tipo);
}

export function preguntaPiso(perfil: SearchProfile): boolean {
  // Planta baja o piso alto sólo tiene sentido en un edificio.
  return perfil.property.type === "apartamento";
}

export function preguntaGastosComunes(perfil: SearchProfile): boolean {
  const tipo = perfil.property.type;
  return tipo !== null && CON_GASTOS_COMUNES.includes(tipo);
}

export function preguntaSuperficie(perfil: SearchProfile): boolean {
  // Aplica a todos: en un terreno los metros son, de hecho, lo principal.
  return perfil.property.type !== null;
}

export function preguntaCaracteristicas(perfil: SearchProfile): boolean {
  // Un terreno no tiene balcón ni cocina amplia.
  return perfil.property.type !== null && perfil.property.type !== "terreno";
}

export function preguntaFinanciacion(perfil: SearchProfile): boolean {
  // Nadie pide un crédito hipotecario para alquilar.
  return perfil.operation === "buy";
}

export function preguntaMudanza(perfil: SearchProfile): boolean {
  // Quien alquila tiene una fecha; quien compra, un estado de ánimo.
  return perfil.operation === "rent";
}

export function preguntaMomento(perfil: SearchProfile): boolean {
  return perfil.operation === "buy";
}

/** El título de la pregunta 4 cambia según lo que se esté haciendo. */
export function tituloPresupuesto(perfil: SearchProfile): string {
  return perfil.operation === "buy"
    ? "Hablemos de tu presupuesto y de tu momento."
    : "Hablemos de tu presupuesto mensual.";
}
