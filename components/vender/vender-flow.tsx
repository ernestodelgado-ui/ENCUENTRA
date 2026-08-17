"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { Handshake, LineChart, MessageCircle } from "lucide-react";
import { Pastilla, Seccion } from "@/components/buscar/campos";
import { SelectorZonas } from "@/components/buscar/selector-zonas";
import { FlowShell } from "@/components/buscar/flow-shell";
import { HeaderMinimo } from "@/components/buscar/header-minimo";
import { Pregunta } from "@/components/entrevista/pregunta";
import { Button } from "@/components/ui/button";
import {
  guardarVenta,
  leerVenta,
  perfilVentaInicial,
} from "@/lib/entrevista/almacenamiento";
import {
  MOMENTOS_VENTA,
  MOMENTO_VENTA_LABEL,
  MOTIVOS_VENTA,
  MOTIVO_VENTA_LABEL,
  TIPOS_VENTA,
  TIPO_VENTA_LABEL,
  type MomentoVenta,
  type MotivoVenta,
  type SellProfile,
  type TipoPropiedadVenta,
} from "@/lib/entrevista/types";
import { capturarUtms, track } from "@/lib/analytics";

const PASOS = [1, 2, 3, 4] as const;
type Paso = (typeof PASOS)[number];
const TOTAL_PREGUNTAS = 3;

function esPaso(valor: unknown): valor is Paso {
  return PASOS.includes(valor as Paso);
}

/** Los tipos que tienen dormitorios. Un terreno o un local, no. */
const CON_DORMITORIOS: TipoPropiedadVenta[] = ["apartamento", "casa"];

/**
 * El recorrido de quien quiere vender.
 *
 * Es corto a propósito: tres preguntas y un cierre. Quien vende no necesita que
 * le pidan características ni presupuesto —eso lo define el mercado y un
 * asesor—, necesita que lo escuchen y lo orienten. Por eso no reutiliza las
 * preguntas del comprador: sólo comparten el marco y los controles.
 *
 * No se piden datos personales. El cierre invita a hablar con un asesor.
 */
export function VenderFlow() {
  const idBase = useId();
  const [paso, setPaso] = useState<Paso>(1);
  const [perfil, setPerfil] = useState<SellProfile>(perfilVentaInicial);

  /* eslint-disable react-hooks/set-state-in-effect --
     Lectura de estado del navegador tras montar; ver EntrevistaFlow. */
  useEffect(() => {
    capturarUtms();
    track("search_started", { operacion: "vender" });

    const guardado = leerVenta();
    if (guardado) setPerfil(guardado);

    const pasoGuardado = (window.history.state as { encuentraPaso?: unknown } | null)
      ?.encuentraPaso;
    if (esPaso(pasoGuardado)) setPaso(pasoGuardado);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const actualizar = useCallback((siguiente: SellProfile) => {
    setPerfil(siguiente);
    guardarVenta(siguiente);
  }, []);

  const irA = useCallback((siguiente: Paso) => {
    setPaso(siguiente);
    window.history.pushState({ encuentraPaso: siguiente }, "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const volver = useCallback(() => window.history.back(), []);

  useEffect(() => {
    const alVolver = (event: PopStateEvent) => {
      const guardado = (event.state as { encuentraPaso?: unknown } | null)
        ?.encuentraPaso;
      setPaso(esPaso(guardado) ? guardado : 1);
    };
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, []);

  const mostrarDormitorios =
    perfil.property.type !== null &&
    CON_DORMITORIOS.includes(perfil.property.type);

  return (
    <>
      <HeaderMinimo />
      <FlowShell
        onBack={volver}
        progreso={
          paso <= TOTAL_PREGUNTAS
            ? {
                label: `${paso} de ${TOTAL_PREGUNTAS}`,
                valor: paso / TOTAL_PREGUNTAS,
              }
            : undefined
        }
      >
        {paso === 1 && (
          <Pregunta
            titulo="Contanos sobre la propiedad que querés vender."
            bajada="Con lo básico alcanza. Un asesor puede ayudarte con el resto."
            onContinue={() => irA(2)}
          >
            <div className="space-y-6">
              <Seccion titulo="Tipo de propiedad">
                <div className="flex flex-wrap gap-2">
                  {TIPOS_VENTA.map((tipo) => (
                    <Pastilla
                      key={tipo}
                      tipo="radio"
                      name={`${idBase}-tipo`}
                      checked={perfil.property.type === tipo}
                      onChange={() =>
                        actualizar({
                          ...perfil,
                          property: {
                            ...perfil.property,
                            type: tipo as TipoPropiedadVenta,
                            // Si deja de tener dormitorios, se limpia.
                            bedrooms: CON_DORMITORIOS.includes(tipo)
                              ? perfil.property.bedrooms
                              : null,
                          },
                        })
                      }
                    >
                      {TIPO_VENTA_LABEL[tipo]}
                    </Pastilla>
                  ))}
                </div>
              </Seccion>

              <Seccion titulo="¿Dónde está?">
                <SelectorZonas
                  seleccionadas={perfil.property.location}
                  onChange={(location) =>
                    actualizar({
                      ...perfil,
                      property: { ...perfil.property, location },
                    })
                  }
                />
              </Seccion>

              {mostrarDormitorios && (
                <Seccion titulo="Dormitorios">
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <Pastilla
                        key={n}
                        tipo="radio"
                        name={`${idBase}-dorm`}
                        checked={perfil.property.bedrooms === n}
                        onChange={() =>
                          actualizar({
                            ...perfil,
                            property: { ...perfil.property, bedrooms: n },
                          })
                        }
                      >
                        {n === 0 ? "Monoambiente" : n === 5 ? "5+" : String(n)}
                      </Pastilla>
                    ))}
                  </div>
                </Seccion>
              )}
            </div>
          </Pregunta>
        )}

        {paso === 2 && (
          <Pregunta
            titulo="¿Qué te lleva a pensar en vender?"
            bajada="Nos ayuda a entender qué es lo más importante para vos en esta operación."
            onContinue={() => irA(3)}
          >
            <div className="space-y-2.5">
              {MOTIVOS_VENTA.map((motivo) => (
                <label
                  key={motivo}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/25 has-[:checked]:border-coral has-[:checked]:bg-coral/[0.06] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet"
                >
                  <input
                    type="radio"
                    name={`${idBase}-motivo`}
                    checked={perfil.motivation === motivo}
                    onChange={() =>
                      actualizar({
                        ...perfil,
                        motivation: motivo as MotivoVenta,
                      })
                    }
                    className="sr-only"
                  />
                  <span
                    className={`font-medium ${
                      motivo === "prefiero-no-responder"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {MOTIVO_VENTA_LABEL[motivo]}
                  </span>
                </label>
              ))}
            </div>
          </Pregunta>
        )}

        {paso === 3 && (
          <Pregunta
            titulo="¿En qué momento estás?"
            bajada="No hay una respuesta correcta. Sirve para saber cómo acompañarte."
            onContinue={() => {
              track("search_completed", {
                origen: "vender",
                tipo: perfil.property.type ?? "sin-definir",
                motivo: perfil.motivation ?? "sin-responder",
                momento: perfil.timeline ?? "sin-responder",
              });
              irA(4);
            }}
            cta="Ver qué sigue →"
            ctaHabilitado={perfil.timeline !== null}
          >
            <div className="space-y-2.5">
              {MOMENTOS_VENTA.map((momento) => (
                <label
                  key={momento}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/25 has-[:checked]:border-coral has-[:checked]:bg-coral/[0.06] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet"
                >
                  <input
                    type="radio"
                    name={`${idBase}-momento`}
                    checked={perfil.timeline === momento}
                    onChange={() =>
                      actualizar({
                        ...perfil,
                        timeline: momento as MomentoVenta,
                      })
                    }
                    className="sr-only"
                  />
                  <span className="font-medium text-foreground">
                    {MOMENTO_VENTA_LABEL[momento]}
                  </span>
                </label>
              ))}
            </div>

            {perfil.timeline === null && (
              <p className="mt-4 text-sm text-muted-foreground">
                Elegí una opción para continuar.
              </p>
            )}
          </Pregunta>
        )}

        {paso === 4 && <CierreVenta perfil={perfil} />}
      </FlowShell>
    </>
  );
}

const QUE_HACE_UN_ASESOR = [
  { icon: LineChart, texto: "Evaluar cuánto podría valer tu propiedad hoy" },
  { icon: Handshake, texto: "Entender cómo está el mercado en tu zona" },
  { icon: MessageCircle, texto: "Pensar juntos la mejor estrategia de venta" },
];

function CierreVenta({ perfil }: { perfil: SellProfile }) {
  const resumen = [
    perfil.property.type ? TIPO_VENTA_LABEL[perfil.property.type] : null,
    perfil.property.location.length > 0
      ? `en ${perfil.property.location.join(" · ")}`
      : null,
    perfil.timeline ? MOMENTO_VENTA_LABEL[perfil.timeline] : null,
  ].filter(Boolean);

  return (
    <div className="paso-entra">
      <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
        Ya tenemos una idea de tu situación.
      </h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Un asesor puede ayudarte a evaluar la propiedad, entender el mercado y
        pensar la mejor estrategia de venta.
      </p>

      {resumen.length > 0 && (
        <div className="mt-6 rounded-card border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Lo que nos contaste
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {resumen.join(" · ")}
          </p>
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {QUE_HACE_UN_ASESOR.map(({ icon: Icon, texto }) => (
          <li key={texto} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">
              <Icon size={16} aria-hidden />
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">
              {texto}
            </span>
          </li>
        ))}
      </ul>

      {/* El contacto por WhatsApp se conecta en la próxima iteración. Se deja
          visible y deshabilitado en vez de esconderlo, para que la pantalla
          cierre la idea y se vea dónde va a estar. */}
      <div className="mt-8">
        <Button
          size="lg"
          disabled
          className="w-full justify-center"
        >
          Hablar con un asesor →
        </Button>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Muy pronto vas a poder escribirle directo por WhatsApp.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Button href="/" variant="ghost" size="sm">
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
