import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/dm-sans";
import "./globals.css";

const siteUrl = "https://encuentra.com.uy";

// Una sola fuente para la descripción: se repetía en tres lugares y se
// desincronizó apenas cambiamos el producto.
const descripcion =
  "Contanos qué estás buscando y te mostramos opciones que pueden encajar con vos. Propiedades en Uruguay, con un asesor a mano cuando lo necesites.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "encuentra. — Tu próximo hogar empieza con una búsqueda mejor",
    template: "%s · encuentra.",
  },
  description: descripcion,
  openGraph: {
    title: "encuentra. — Tu próximo hogar empieza con una búsqueda mejor",
    description: descripcion,
    url: siteUrl,
    siteName: "encuentra.",
    locale: "es_UY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "encuentra. — Tu próximo hogar empieza con una búsqueda mejor",
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
