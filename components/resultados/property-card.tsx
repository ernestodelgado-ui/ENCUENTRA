"use client";

import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { formatMoneda, TIPO_PROPIEDAD_LABEL } from "@/lib/search/types";
import { CARACTERISTICA_LABEL } from "@/lib/search/types";
import { track } from "@/lib/analytics";
import { asset } from "@/lib/assets";
import type { PropiedadPuntuada } from "@/lib/propiedades/matching";

/**
 * Marca de agua mientras no haya fotos reales. Cada propiedad recibe siempre el
 * mismo degradé, derivado de su id, así la grilla no parece un tablero de
 * colores al azar entre recargas.
 */
const DEGRADES = [
  "from-orange/30 via-coral/15 to-violet/20",
  "from-violet/25 via-coral/10 to-orange/25",
  "from-coral/25 via-orange/20 to-violet/15",
];

function degradeDe(id: string): string {
  const suma = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return DEGRADES[suma % DEGRADES.length];
}

export function PropertyCard({ resultado }: { resultado: PropiedadPuntuada }) {
  const { property, coincidencias } = resultado;

  // Se muestran primero las características que la persona pidió.
  const destacadas = [
    ...coincidencias,
    ...property.features.filter((f) => !coincidencias.includes(f)),
  ].slice(0, 3);

  return (
    <li className="overflow-hidden rounded-card border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-black/5">
      <Link
        href={`/propiedad/${property.id}`}
        onClick={() =>
          track("property_opened", {
            id: property.id,
            reference: property.reference,
            neighborhood: property.neighborhood,
            price: property.price,
            currency: property.currency,
          })
        }
        className="block"
      >
        {property.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset(property.images[0])}
            alt={property.title}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={`Foto de ${property.title}`}
            className={`flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br text-xs text-foreground/40 ${degradeDe(property.id)}`}
          >
            [ foto — placeholder ]
          </div>
        )}

        <div className="p-4">
          <h3 className="font-semibold text-foreground">
            {TIPO_PROPIEDAD_LABEL[property.property_type]} en{" "}
            {property.neighborhood}
          </h3>

          <p className="mt-1 font-display text-xl font-bold text-coral">
            {formatMoneda(property.price, property.currency)}
          </p>

          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble size={14} aria-hidden />
                {property.bedrooms}{" "}
                {property.bedrooms === 1 ? "dormitorio" : "dormitorios"}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath size={14} aria-hidden />
                {property.bathrooms}{" "}
                {property.bathrooms === 1 ? "baño" : "baños"}
              </span>
            )}
            {property.area !== null && (
              <span className="flex items-center gap-1">
                <Ruler size={14} aria-hidden />
                {property.area} m²
              </span>
            )}
          </p>

          {destacadas.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {destacadas.map((feature) => (
                <li
                  key={feature}
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    coincidencias.includes(feature)
                      ? "bg-coral/10 font-medium text-coral"
                      : "bg-foreground/[0.05] text-muted-foreground"
                  }`}
                >
                  {CARACTERISTICA_LABEL[feature]}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-foreground">
            <MapPin size={14} className="text-coral" aria-hidden />
            {property.department}
          </p>

          <p className="mt-3 text-sm font-semibold text-coral">
            Ver propiedad →
          </p>
        </div>
      </Link>
    </li>
  );
}
