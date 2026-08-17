import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/dm-sans";
import "./globals.css";

const siteUrl = "https://encuentra.com.uy";

// Una sola fuente para el título y la descripción: se repetían en tres lugares
// y se desincronizaban cada vez que cambiaba el posicionamiento.
const titulo = "encuentra. — Primero entendemos qué buscás";

const descripcion =
  "No empieces por cientos de propiedades. Contanos qué necesitás y te ayudamos a encontrar opciones que tengan sentido para tu búsqueda. Propiedades en Uruguay, con un asesor a mano.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titulo,
    template: "%s · encuentra.",
  },
  description: descripcion,
  openGraph: {
    title: titulo,
    description: descripcion,
    url: siteUrl,
    siteName: "encuentra.",
    locale: "es_UY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: titulo,
    description: descripcion,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
