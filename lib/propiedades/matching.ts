/**
 * Motor de búsqueda. Filtros tradicionales, sin IA.
 *
 * Trabaja en tres niveles, y de ahí sale directo la pantalla de resultados:
 *
 *   DUROS      operación, tipo y zona. No se relajan nunca: si no cumplen, la
 *              propiedad no es lo que la persona pidió.
 *   AJUSTABLES precio, dormitorios y baños. Cumplirlos define la "coincidencia
 *              exacta"; fallarlos manda la propiedad a "quizás también te
 *              interesen" en vez de descartarla.
 *   BLANDOS    características. Sólo suman relevancia y ordenan.
 *
 * Así el estado "todavía no tenemos una coincidencia exacta" sale del mismo
 * motor, sin una segunda búsqueda.
 */

import type { Caracteristica, SearchCriteria } from "@/lib/search/types";
import { propiedadesActivas } from "./data";
import type {
  Property,
  PropertyFeature,
  PropertyOperation,
} from "./types";

/**
 * Verifica en tiempo de compilación que las características que se pueden
 * tildar y las que puede tener una propiedad sigan siendo el mismo conjunto.
 * Si alguien agrega una de un lado y se olvida del otro, no compila.
 */
type MismoConjunto<A, B> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : never
  : never;
export type CaracteristicasAlineadas = MismoConjunto<
  Caracteristica,
  PropertyFeature
>;

/** La búsqueda habla de lo que hace la persona; la propiedad, de cómo se ofrece. */
const OPERACION_A_PROPERTY: Record<
  SearchCriteria["operacion"],
  PropertyOperation
> = {
  comprar: "venta",
  alquilar: "alquiler",
};

export type PropiedadPuntuada = {
  property: Property;
  puntaje: number;
  /** Cuáles de las características pedidas tiene, para destacarlas en la tarjeta. */
  coincidencias: Caracteristica[];
  /**
   * Si los gastos comunes entran en el tope indicado. `null` cuando no se puso
   * tope o la propiedad no tiene gastos. Lo consume la tarjeta para mostrar el
   * ✓ o el ○ sin recalcular nada.
   */
  gastosComunesEnPresupuesto: boolean | null;
};

export type ResultadoBusqueda = {
  /** Cumple todo lo que se pidió. */
  exactas: PropiedadPuntuada[];
  /** Es del tipo y la zona buscados, pero se corre en precio o ambientes. */
  cercanas: PropiedadPuntuada[];
};

// ------------------------------------------------------------------ criterios

function cumpleDuros(property: Property, criteria: SearchCriteria): boolean {
  if (property.operation !== OPERACION_A_PROPERTY[criteria.operacion]) {
    return false;
  }

  if (
    criteria.tiposPropiedad.length > 0 &&
    !criteria.tiposPropiedad.includes(property.property_type)
  ) {
    return false;
  }

  // Sin zonas tildadas se busca en todas.
  if (
    criteria.zonas.length > 0 &&
    !criteria.zonas.includes(property.neighborhood)
  ) {
    return false;
  }

  return true;
}

/**
 * El precio sólo se puede comparar dentro de la misma moneda. Antes que cablear
 * una cotización que envejece mal, una propiedad en otra moneda no se descarta:
 * queda fuera de las exactas y aparece entre las cercanas, con su precio en su
 * moneda a la vista.
 */
function cumplePrecio(property: Property, criteria: SearchCriteria): boolean {
  if (property.currency !== criteria.presupuesto.moneda) return false;

  return (
    property.price >= criteria.presupuesto.desde &&
    property.price <= criteria.presupuesto.hasta
  );
}

/**
 * Con la opción tope tildada ("5 o más", "4 o más") también cuentan los valores
 * por encima.
 */
function cumpleCantidad(
  valor: number,
  seleccionadas: number[],
  tope: number
): boolean {
  if (seleccionadas.length === 0) return true;
  if (seleccionadas.includes(valor)) return true;
  return seleccionadas.includes(tope) && valor >= tope;
}

/**
 * Los gastos comunes son parte del costo real de vivir ahí, así que se tratan
 * como el precio: dentro del tope es coincidencia exacta, por encima manda la
 * propiedad a "cercanas" en vez de descartarla.
 *
 * Una propiedad sin gastos comunes (una casa, un terreno) nunca falla este
 * criterio: no tener es mejor que estar dentro del tope.
 */
export function cumpleGastosComunes(
  property: Property,
  criteria: SearchCriteria
): boolean {
  if (criteria.maxGastosComunes === null) return true;
  if (property.common_expenses === null) return true;
  return property.common_expenses <= criteria.maxGastosComunes;
}

function cumpleSuperficie(
  property: Property,
  criteria: SearchCriteria
): boolean {
  if (criteria.minSuperficie === null) return true;
  // Sin el dato no se puede descartar: el aviso puede no informarlo.
  if (property.area === null) return true;
  return property.area >= criteria.minSuperficie;
}

function cumpleAjustables(
  property: Property,
  criteria: SearchCriteria
): boolean {
  if (!cumplePrecio(property, criteria)) return false;
  if (!cumpleGastosComunes(property, criteria)) return false;
  if (!cumpleSuperficie(property, criteria)) return false;

  // Un terreno no tiene ambientes: pedirle dormitorios lo dejaría siempre
  // afuera, cuando en realidad el criterio no le aplica.
  if (property.property_type !== "terreno") {
    if (!cumpleCantidad(property.bedrooms, criteria.dormitorios, 5)) {
      return false;
    }
    if (!cumpleCantidad(property.bathrooms, criteria.banos, 4)) return false;
  }

  return true;
}

// -------------------------------------------------------------------- puntaje

function coincidenciasDe(
  property: Property,
  criteria: SearchCriteria
): Caracteristica[] {
  return criteria.caracteristicas.filter((c) => property.features.includes(c));
}

/**
 * Ordena dentro de cada grupo. Las características pedidas pesan más que las
 * que la propiedad trae de yapa, y a igualdad de todo gana la verificada más
 * recientemente: es la que tiene más chance de seguir disponible.
 */
function puntuar(
  property: Property,
  criteria: SearchCriteria,
  coincidencias: Caracteristica[]
): number {
  let puntaje = coincidencias.length * 10;

  if (criteria.dormitorios.includes(property.bedrooms)) puntaje += 5;
  if (criteria.banos.includes(property.bathrooms)) puntaje += 3;
  if (property.images.length > 0) puntaje += 2;
  if (property.external_url) puntaje += 1;

  const verificada = new Date(property.last_verified_at).getTime();
  if (Number.isFinite(verificada)) {
    // Fracción chica: sólo desempata, no reordena.
    puntaje += verificada / 1e13;
  }

  return puntaje;
}

// -------------------------------------------------------------------- búsqueda

export function buscarPropiedades(
  criteria: SearchCriteria,
  catalogo: Property[] = propiedadesActivas()
): ResultadoBusqueda {
  const exactas: PropiedadPuntuada[] = [];
  const cercanas: PropiedadPuntuada[] = [];

  for (const property of catalogo) {
    if (!cumpleDuros(property, criteria)) continue;

    const coincidencias = coincidenciasDe(property, criteria);
    const puntuada: PropiedadPuntuada = {
      property,
      puntaje: puntuar(property, criteria, coincidencias),
      coincidencias,
      gastosComunesEnPresupuesto:
        criteria.maxGastosComunes === null || property.common_expenses === null
          ? null
          : property.common_expenses <= criteria.maxGastosComunes,
    };

    if (cumpleAjustables(property, criteria)) {
      exactas.push(puntuada);
    } else {
      cercanas.push(puntuada);
    }
  }

  const porPuntaje = (a: PropiedadPuntuada, b: PropiedadPuntuada) =>
    b.puntaje - a.puntaje;

  return {
    exactas: exactas.sort(porPuntaje),
    cercanas: cercanas.sort(porPuntaje),
  };
}
