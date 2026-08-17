/**
 * Traduce el perfil del recorrido guiado a los criterios que ya entiende el
 * buscador. Es el único punto de contacto entre los dos caminos:
 *
 *   Recorrido guiado  ┐
 *                     ├─→  SearchCriteria  →  /resultados?…  →  mismo motor
 *   Filtros           ┘
 *
 * Sólo traduce lo que la persona eligió tocando controles. Los `freeText`
 * quedan sin usar a propósito: interpretarlos con reglas sería simular una
 * inteligencia que todavía no tenemos, y el resultado sería peor que no mostrar
 * nada. Cuando entre la IA, va a llenar zonas y tipo a partir de esos textos y
 * esta función va a leerlos de ahí sin que cambie nada más.
 */

import { criteriosAUrl } from "@/lib/search/url";
import type {
  Caracteristica as CaracteristicaPropiedad,
  SearchCriteria,
  TipoPropiedad as TipoPropiedadBuscador,
} from "@/lib/search/types";
import type {
  Caracteristica,
  SearchProfile,
  TipoPropiedad,
} from "./types";

/**
 * Qué característica del recorrido corresponde a cuál del catálogo.
 *
 * Las que valen `null` no existen todavía en el modelo de propiedad: se guardan
 * igual en el perfil, para la IA y para el asesor, pero no llegan al buscador
 * porque ninguna propiedad podría cumplirlas.
 */
const A_CARACTERISTICA: Record<Caracteristica, CaracteristicaPropiedad | null> = {
  garaje: "garaje",
  balcon: "balcon",
  terraza: "terraza",
  jardin: "jardin",
  parrillero: "parrillero",
  piscina: "piscina",
  mascotas: "mascotas",
  luminoso: null,
  "espacio-trabajo": null,
  "cocina-amplia": null,
  "buena-vista": null,
  seguridad: null,
};

/** Los tipos coinciden uno a uno, pero se explicita para que el tipo lo cuide. */
const A_TIPO: Record<TipoPropiedad, TipoPropiedadBuscador> = {
  apartamento: "apartamento",
  casa: "casa",
  terreno: "terreno",
  local: "local",
  oficina: "oficina",
};

export function perfilACriterios(perfil: SearchProfile): SearchCriteria {
  const pedidas = [
    ...perfil.priorities.mustHave,
    ...perfil.priorities.niceToHave,
    ...perfil.property.features,
  ];

  const caracteristicas = [
    ...new Set(
      pedidas
        .map((c) => A_CARACTERISTICA[c])
        .filter((c): c is CaracteristicaPropiedad => c !== null)
    ),
  ];

  // Al alquilar, el precio de la propiedad es el alquiler mensual. Si la
  // persona razonó por el total (alquiler + gastos), ese total es el techo.
  const { budget } = perfil;
  const esAlquiler = perfil.operation === "rent";

  const techo = esAlquiler
    ? (budget.maxRent ?? budget.maxTotalMonthly ?? budget.max)
    : budget.max;

  return {
    operacion: esAlquiler ? "alquilar" : "comprar",
    tiposPropiedad: perfil.property.type ? [A_TIPO[perfil.property.type]] : [],
    zonas: perfil.location.selectedLocations,
    dormitorios: perfil.property.bedrooms,
    banos: perfil.property.bathrooms,
    presupuesto: {
      moneda: budget.currency,
      desde: budget.min ?? 0,
      hasta: techo ?? Number.MAX_SAFE_INTEGER,
    },
    caracteristicas,
    maxGastosComunes: budget.maxCommonExpenses,
    minSuperficie: perfil.property.minArea,
  };
}

export function perfilAUrl(perfil: SearchProfile): string {
  return criteriosAUrl(perfilACriterios(perfil));
}
