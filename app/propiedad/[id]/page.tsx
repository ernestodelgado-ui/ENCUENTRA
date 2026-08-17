import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Ruler, MapPin } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VolverAtras } from "@/components/resultados/volver-atras";
import { EnlaceExterno } from "@/components/resultados/enlace-externo";
import { WhatsappBoton } from "@/components/resultados/whatsapp-cta";
import { PropiedadTracker } from "@/components/resultados/propiedad-tracker";
import { asset } from "@/lib/assets";
import { buscarPropiedad, propiedadesActivas } from "@/lib/propiedades/data";
import { estaVerificada } from "@/lib/propiedades/types";
import { enlaceDePropiedad } from "@/lib/whatsapp";
import {
  CARACTERISTICA_LABEL,
  TIPO_PROPIEDAD_LABEL,
  formatMoneda,
} from "@/lib/search/types";

export function generateStaticParams() {
  return propiedadesActivas().map((propiedad) => ({ id: propiedad.id }));
}

export async function generateMetadata(
  props: PageProps<"/propiedad/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const propiedad = buscarPropiedad(id);

  if (!propiedad) return { title: "Propiedad no disponible" };

  return {
    title: propiedad.title,
    description: `${TIPO_PROPIEDAD_LABEL[propiedad.property_type]} en ${propiedad.neighborhood}, ${propiedad.department}. ${formatMoneda(propiedad.price, propiedad.currency)}.`,
  };
}

export default async function PropiedadPage(
  props: PageProps<"/propiedad/[id]">
) {
  const { id } = await props.params;
  const propiedad = buscarPropiedad(id);

  // `buscarPropiedad` ya filtra las inactivas, así que una propiedad dada de
  // baja devuelve 404 en vez de quedar accesible por URL directa.
  if (!propiedad) notFound();

  const verificada = estaVerificada(propiedad);

  const datos = [
    propiedad.bedrooms > 0
      ? {
          Icon: BedDouble,
          valor: `${propiedad.bedrooms} ${propiedad.bedrooms === 1 ? "dormitorio" : "dormitorios"}`,
        }
      : null,
    propiedad.bathrooms > 0
      ? {
          Icon: Bath,
          valor: `${propiedad.bathrooms} ${propiedad.bathrooms === 1 ? "baño" : "baños"}`,
        }
      : null,
    propiedad.area !== null
      ? { Icon: Ruler, valor: `${propiedad.area} m²` }
      : null,
    {
      Icon: MapPin,
      valor: `${propiedad.neighborhood}, ${propiedad.department}`,
    },
  ].filter((d) => d !== null);

  return (
    <>
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <PropiedadTracker />

          <VolverAtras />

          {propiedad.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset(propiedad.images[0])}
              alt={propiedad.title}
              className="mt-4 aspect-[4/3] w-full rounded-card object-cover sm:aspect-[16/9]"
            />
          ) : (
            <div
              role="img"
              aria-label={`Foto de ${propiedad.title}`}
              className="mt-4 flex aspect-[4/3] w-full items-center justify-center rounded-card bg-gradient-to-br from-orange/25 via-coral/10 to-violet/15 text-sm text-foreground/40 sm:aspect-[16/9]"
            >
              [ foto de propiedad — placeholder ]
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm font-medium text-muted-foreground">
              {TIPO_PROPIEDAD_LABEL[propiedad.property_type]} en{" "}
              {propiedad.operation === "venta" ? "venta" : "alquiler"}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
              {propiedad.title}
            </h1>
            <p className="mt-3 font-display text-3xl font-bold text-coral">
              {formatMoneda(propiedad.price, propiedad.currency)}
            </p>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {datos.map(({ Icon, valor }) => (
              <li
                key={valor}
                className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 text-sm text-foreground"
              >
                <Icon size={16} className="shrink-0 text-coral" aria-hidden />
                {valor}
              </li>
            ))}
          </ul>

          {propiedad.features.length > 0 && (
            <section className="mt-8">
              <h2 className="text-base font-semibold text-foreground">
                Características
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {propiedad.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-full border border-border bg-card px-3.5 py-2 text-sm text-muted-foreground"
                  >
                    {CARACTERISTICA_LABEL[feature]}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10 rounded-card border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              ¿Te interesa esta propiedad?
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Escribile a un asesor. El mensaje ya va con la referencia de esta
              propiedad, así sabe de cuál le hablás.
            </p>

            <div className="mt-4">
              <WhatsappBoton
                href={enlaceDePropiedad(propiedad)}
                evento="whatsapp_click_property"
                props={{
                  id: propiedad.id,
                  reference: propiedad.reference,
                  price: propiedad.price,
                }}
              >
                Consultar por WhatsApp →
              </WhatsappBoton>
            </div>

            {propiedad.external_url && (
              <div className="mt-3">
                <EnlaceExterno
                  href={propiedad.external_url}
                  id={propiedad.id}
                  reference={propiedad.reference}
                />
              </div>
            )}
          </section>

          <footer className="mt-8 space-y-1 text-xs text-muted-foreground">
            <p>Referencia: {propiedad.reference}</p>
            {!verificada && (
              <p>
                Los datos de esta propiedad no se confirman desde hace más de un
                mes. Consultá disponibilidad antes de tomar una decisión.
              </p>
            )}
          </footer>
        </div>
      </main>

      <Footer />
    </>
  );
}
