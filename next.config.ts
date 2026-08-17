import type { NextConfig } from "next";

/**
 * El sitio se publica en GitHub Pages, que sirve archivos estáticos: no hay
 * servidor de Node del otro lado. De ahí salen las tres opciones de acá abajo.
 *
 * `basePath` viene por variable de entorno porque en GitHub Pages el sitio
 * cuelga de /ENCUENTRA/ mientras que en local vive en la raíz. Lo setea el
 * workflow de deploy; en desarrollo queda vacío.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Genera HTML plano en out/ en lugar de necesitar un servidor.
  output: "export",

  basePath,

  // Cada ruta se emite como carpeta con index.html, que es lo que GitHub Pages
  // sabe servir sin reescrituras.
  trailingSlash: true,

  // El optimizador de imágenes de Next necesita servidor. Sin él, next/image
  // rompería el build estático.
  images: { unoptimized: true },
};

export default nextConfig;
