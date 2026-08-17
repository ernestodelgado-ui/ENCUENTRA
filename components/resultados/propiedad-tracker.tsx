"use client";

import { useEffect } from "react";
import { capturarUtms } from "@/lib/analytics";

/**
 * La ficha puede ser la primera pantalla de la sesión (alguien llega por un
 * enlace compartido), así que también captura las UTMs.
 *
 * El evento `property_opened` no se dispara acá sino en el clic de la tarjeta,
 * para no contar dos veces la misma apertura.
 */
export function PropiedadTracker() {
  useEffect(() => {
    capturarUtms();
  }, []);

  return null;
}
