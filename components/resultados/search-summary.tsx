import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  OPERACION_LABEL,
  esRangoCompleto,
  formatBanos,
  formatDormitorios,
  formatPresupuesto,
  formatTiposPropiedad,
  type SearchCriteria,
} from "@/lib/search/types";

/**
 * Cabecera de resultados: qué se buscó, con el atajo para cambiarlo.
 *
 * Sólo se muestran las líneas que la persona efectivamente eligió; los criterios
 * que dejó en blanco no aparecen, para que el bloque no se llene de
 * "sin preferencia".
 */
export function SearchSummary({ criteria }: { criteria: SearchCriteria }) {
  const lineas: string[] = [
    `${OPERACION_LABEL[criteria.operacion]} · ${formatTiposPropiedad(criteria.tiposPropiedad)}`,
  ];

  if (criteria.zonas.length > 0) {
    lineas.push(criteria.zonas.join(" · "));
  }

  const ambientes = [
    criteria.dormitorios.length > 0
      ? formatDormitorios(criteria.dormitorios)
      : null,
    criteria.banos.length > 0 ? formatBanos(criteria.banos) : null,
  ].filter(Boolean);
  if (ambientes.length > 0) lineas.push(ambientes.join(" · "));

  if (!esRangoCompleto(criteria.operacion, criteria.presupuesto)) {
    lineas.push(formatPresupuesto(criteria.operacion, criteria.presupuesto));
  }

  return (
    <div className="rounded-card border border-border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Tu búsqueda
      </p>

      <div className="mt-2 space-y-0.5">
        {lineas.map((linea) => (
          <p key={linea} className="text-sm text-foreground">
            {linea}
          </p>
        ))}
      </div>

      <Link
        href="/buscar"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-coral underline decoration-coral/30 underline-offset-4 transition-colors hover:decoration-coral"
      >
        <Pencil size={14} aria-hidden />
        Modificar búsqueda
      </Link>
    </div>
  );
}
