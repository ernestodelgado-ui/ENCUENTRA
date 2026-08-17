/**
 * Modelo de propiedad.
 *
 * Las claves van en inglés a propósito, a diferencia del resto del código: este
 * es el contrato que se le pasa al equipo para cargar propiedades y el que va a
 * hablar una API más adelante. Mantenerlo estable vale más que la consistencia
 * de idioma con el dominio de búsqueda.
 *
 * La costura entre este modelo y los criterios de búsqueda (en español) la
 * resuelve `lib/propiedades/matching.ts`.
 */

export type PropertyOperation = "venta" | "alquiler";

export type PropertyType =
  | "apartamento"
  | "casa"
  | "terreno"
  | "local"
  | "oficina";

export type PropertyCurrency = "USD" | "UYU";

/**
 * Características de la propiedad. Coinciden con las que se pueden tildar en la
 * búsqueda (`Caracteristica` en `lib/search/types.ts`), y esa correspondencia
 * está verificada en tiempo de compilación por `matching.ts`.
 */
export type PropertyFeature =
  | "garaje"
  | "balcon"
  | "terraza"
  | "parrillero"
  | "jardin"
  | "piscina"
  | "amoblado"
  | "mascotas";

export type Property = {
  /** Identificador interno y estable. Es lo que va en la URL de la ficha. */
  id: string;
  /** Referencia del portal de origen, la que reconoce el asesor. */
  reference: string;
  operation: PropertyOperation;
  property_type: PropertyType;
  title: string;
  department: string;
  neighborhood: string;
  price: number;
  currency: PropertyCurrency;
  bedrooms: number;
  bathrooms: number;
  /** Superficie en m². `null` cuando el aviso original no la informa. */
  area: number | null;
  /**
   * Gastos comunes mensuales en pesos. `null` cuando no corresponden (una casa,
   * un terreno) o cuando el aviso no los informa.
   *
   * Pesan de verdad en la decisión: un alquiler barato con gastos altos puede
   * costar más que uno caro sin ellos, así que el motor los tiene en cuenta.
   */
  common_expenses: number | null;
  features: PropertyFeature[];
  /** Rutas o URLs de imágenes. Vacío hasta que haya fotos reales. */
  images: string[];
  /** Publicación original (REMAX u otra). Vacío si todavía no la tenemos. */
  external_url: string;
  /** Una propiedad inactiva nunca aparece en resultados ni en su ficha. */
  active: boolean;
  created_at: string;
  updated_at: string;
  /**
   * Última vez que alguien confirmó que sigue disponible. Es el dato que evita
   * mostrar propiedades ya vendidas: ver `estaVerificada`.
   */
  last_verified_at: string;
};

/** Días tras los cuales una propiedad se considera sin verificar. */
export const DIAS_PARA_REVERIFICAR = 30;

/**
 * Si hace mucho que nadie confirma que sigue disponible, no la ocultamos —
 * eso vaciaría los resultados — pero sí lo avisamos en la ficha.
 */
export function estaVerificada(
  property: Property,
  ahora: Date = new Date()
): boolean {
  const verificada = new Date(property.last_verified_at).getTime();
  if (Number.isNaN(verificada)) return false;

  const dias = (ahora.getTime() - verificada) / 86_400_000;
  return dias <= DIAS_PARA_REVERIFICAR;
}
