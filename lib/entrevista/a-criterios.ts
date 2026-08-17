/**
 * Traduce el perfil de la entrevista a los criterios que ya entiende el
 * buscador. Es el único punto de contacto entre los dos caminos:
 *
 *   Entrevista  ┐
 *               ├─→  SearchCriteria  →  /resultados?…  →  mismo motor
 *   Filtros     ┘
 *
 * Hoy traduce solamente lo que la persona eligió tocando pastillas. Los tres
 * `free_text` quedan sin usar a propósito: interpretarlos con reglas sería
 * simular una inteligencia que todavía no tenemos, y el resultado sería peor
 * que no mostrar nada. Cuando entre la IA, va a llenar zonas, tipo de propiedad
 * y ambientes a partir de esos textos, y esta función va a leerlos de ahí sin
 * que cambie nada más.
 */

import { criteriosAUrl } from "@/lib/search/url";
import type { Caracteristica, SearchCriteria } from "@/lib/search/types";
import type { PreferenciaHogar, SearchProfile } from "./types";

/**
 * Qué preferencia de la entrevista corresponde a qué característica del modelo
 * de propiedad. Las que valen `null` no existen todavía en el catálogo: se
 * guardan igual en el perfil, para la IA y para el asesor, pero no llegan al
 * buscador porque ninguna propiedad podría cumplirlas.
 */
const A_CARACTERISTICA: Record<PreferenciaHogar, Caracteristica | null> = {
  balcon: "balcon",
  terraza: "terraza",
  jardin: "jardin",
  garaje: "garaje",
  parrillero: "parrillero",
  piscina: "piscina",
  mascotas: "mascotas",
  luminoso: null,
  "espacio-trabajo": null,
  "cocina-amplia": null,
  "buena-vista": null,
  seguridad: null,
};

export function perfilACriterios(perfil: SearchProfile): SearchCriteria {
  const preferencias = [
    ...perfil.priorities.must_have,
    ...perfil.priorities.nice_to_have,
    ...perfil.home.preferences,
  ];

  const caracteristicas = [
    ...new Set(
      preferencias
        .map((p) => A_CARACTERISTICA[p])
        .filter((c): c is Caracteristica => c !== null)
    ),
  ];

  return {
    operacion: perfil.transaction.operation,
    // Tipo de propiedad, zonas y ambientes no se preguntan en la entrevista:
    // vacío significa "sin filtrar" para el motor, que es lo correcto mientras
    // no tengamos ese dato. Ver el comentario del encabezado.
    tiposPropiedad: [],
    zonas: [],
    dormitorios: [],
    banos: [],
    presupuesto: {
      moneda: perfil.transaction.currency,
      desde: perfil.transaction.budget_min,
      hasta: perfil.transaction.budget_max,
    },
    caracteristicas,
  };
}

export function perfilAUrl(perfil: SearchProfile): string {
  return criteriosAUrl(perfilACriterios(perfil));
}
