/**
 * Resuelve rutas de archivos estáticos.
 *
 * En GitHub Pages el sitio cuelga de /ENCUENTRA/, no de la raíz. `next/link` y
 * el router prefijan el `basePath` solos, pero el atributo `src` de una imagen
 * no: una foto guardada como "/propiedades/foo.jpg" daría 404 en producción.
 *
 * Las URLs absolutas (fotos alojadas en el portal de origen) se dejan intactas.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(ruta: string): string {
  if (/^https?:\/\//i.test(ruta)) return ruta;
  return `${BASE_PATH}${ruta.startsWith("/") ? "" : "/"}${ruta}`;
}
