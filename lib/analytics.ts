"use client";

/**
 * Capa de eventos.
 *
 * Todo pasa por `track`, no por llamadas sueltas a un proveedor. Hoy no hay
 * ninguno instalado: los eventos se ven en la consola del navegador durante el
 * desarrollo y no se envían a ningún lado.
 *
 * PARA ENCHUFAR UN PROVEEDOR (Plausible, Vercel Analytics, el que sea): sólo se
 * toca `enviar`, más abajo. Ninguna pantalla cambia.
 *
 * No hay cookies ni identificadores de persona. Se registra qué se buscó y qué
 * se tocó, nunca quién. Por eso tampoco hace falta banner de consentimiento
 * — algo a reconfirmar si algún día se suma un proveedor que sí ponga cookies.
 */

export type EventoNombre =
  | "page_view"
  /** Entró al paso 1 de la búsqueda. */
  | "search_started"
  | "search_step_1"
  /** Llegó a resultados. */
  | "search_completed"
  | "search_no_results"
  | "property_opened"
  | "external_link_click"
  | "whatsapp_click_search"
  | "whatsapp_click_property";

export type EventoProps = Record<
  string,
  string | number | boolean | null | undefined
>;

const CLAVES_UTM = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const ALMACEN_UTM = "encuentra:utm";

/**
 * Guarda las UTMs la primera vez que se entra y las mantiene durante la sesión.
 * Si no se guardaran, se perderían apenas la persona navega a otra pantalla y
 * no habría forma de atribuir un clic de WhatsApp a la campaña que lo trajo.
 */
export function capturarUtms(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const encontradas: Record<string, string> = {};

  for (const clave of CLAVES_UTM) {
    const valor = params.get(clave);
    if (valor) encontradas[clave] = valor;
  }

  if (Object.keys(encontradas).length === 0) return;

  try {
    window.sessionStorage.setItem(ALMACEN_UTM, JSON.stringify(encontradas));
  } catch {
    // Modo privado o almacenamiento lleno: se sigue sin atribución.
  }
}

export function leerUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};

  try {
    const guardado = window.sessionStorage.getItem(ALMACEN_UTM);
    return guardado ? (JSON.parse(guardado) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/**
 * Único punto de salida. Cambiar sólo esto para enchufar un proveedor, por
 * ejemplo `window.plausible?.(nombre, { props })`.
 */
function enviar(nombre: EventoNombre, props: EventoProps): void {
  if (process.env.NODE_ENV === "development") {
    console.info(`[analytics] ${nombre}`, props);
  }
}

export function track(nombre: EventoNombre, props: EventoProps = {}): void {
  if (typeof window === "undefined") return;
  enviar(nombre, { ...leerUtms(), ...props });
}
