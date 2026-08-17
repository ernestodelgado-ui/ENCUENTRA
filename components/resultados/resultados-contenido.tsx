"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SearchSummary } from "@/components/resultados/search-summary";
import { PropertyCard } from "@/components/resultados/property-card";
import { WhatsappCta } from "@/components/resultados/whatsapp-cta";
import { paramsACriterios } from "@/lib/search/url";
import { buscarPropiedades } from "@/lib/propiedades/matching";
import { enlaceDeBusqueda } from "@/lib/whatsapp";
import { capturarUtms, track } from "@/lib/analytics";

/**
 * Los resultados se arman en el navegador.
 *
 * El sitio se publica como estático (no hay servidor que lea los parámetros de
 * la URL), así que la búsqueda corre acá: se leen los filtros de la query
 * string y se cruzan contra el catálogo, que viaja en el bundle.
 *
 * Con un catálogo de decenas de propiedades esto es instantáneo. Cuando pase a
 * ser una base grande, este componente es el que se reemplaza por una llamada a
 * la API — el resto de la pantalla no se entera.
 */
export function ResultadosContenido() {
  const searchParams = useSearchParams();

  const criteria = useMemo(
    () => paramsACriterios(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const { exactas, cercanas } = useMemo(
    () => buscarPropiedades(criteria),
    [criteria]
  );

  const hayExactas = exactas.length > 0;
  const enlaceWhatsapp = enlaceDeBusqueda(criteria);

  const propsEvento = useMemo(
    () => ({
      operacion: criteria.operacion,
      tipos: criteria.tiposPropiedad.join(",") || "todos",
      zonas: criteria.zonas.join(",") || "todas",
      exactas: exactas.length,
      cercanas: cercanas.length,
    }),
    [criteria, exactas.length, cercanas.length]
  );

  useEffect(() => {
    capturarUtms();
    track("search_completed", propsEvento);
    if (exactas.length === 0) track("search_no_results", propsEvento);
  }, [propsEvento, exactas.length]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header>
        {hayExactas ? (
          <>
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
              Encontramos opciones que{" "}
              <span className="text-coral">pueden interesarte.</span>
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Seleccionamos propiedades disponibles según los criterios de tu
              búsqueda.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
              Todavía no tenemos una{" "}
              <span className="text-coral">coincidencia exacta.</span>
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Pero podemos ayudarte a buscarla. Contale tu búsqueda a un asesor y
              salimos a buscar opciones para vos.
            </p>
          </>
        )}
      </header>

      <div className="mt-6 max-w-md">
        <SearchSummary criteria={criteria} />
      </div>

      {/* Sin coincidencias exactas, el contacto pasa al frente: es la salida más
          útil que se le puede ofrecer en ese momento. */}
      {!hayExactas && (
        <div className="mt-8 max-w-2xl">
          <WhatsappCta
            href={enlaceWhatsapp}
            titulo="Contale tu búsqueda a un asesor"
            detalle="Le llega lo que estás buscando y te responde con opciones que todavía no están acá."
            boton="Contarle mi búsqueda →"
            props={propsEvento}
          />
        </div>
      )}

      {hayExactas && (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {exactas.map((resultado) => (
            <PropertyCard key={resultado.property.id} resultado={resultado} />
          ))}
        </ul>
      )}

      {cercanas.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
            Quizás también te interesen estas opciones
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Son del tipo y la zona que buscás, pero se corren en precio o en
            cantidad de ambientes.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cercanas.map((resultado) => (
              <PropertyCard key={resultado.property.id} resultado={resultado} />
            ))}
          </ul>
        </section>
      )}

      {hayExactas && (
        <div className="mt-14">
          <WhatsappCta
            href={enlaceWhatsapp}
            titulo="¿No encontraste lo que buscabas?"
            detalle="Podemos ayudarte a buscar otras opciones."
            boton="Hablar con un asesor →"
            props={propsEvento}
          />
        </div>
      )}
    </div>
  );
}
