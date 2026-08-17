"use client";

import { MessageCircle } from "lucide-react";
import { track, type EventoNombre } from "@/lib/analytics";

/**
 * Botón de WhatsApp.
 *
 * El enlace ya viene con el mensaje escrito: abre la conversación y la persona
 * decide si lo manda. Nunca se envía solo, y nunca se le pide el número.
 *
 * Verde de WhatsApp a propósito, en vez del coral de la marca: es la señal que
 * la gente reconoce sin leer, y además distingue el contacto del resto de los
 * CTA del sitio.
 */
export function WhatsappBoton({
  href,
  children,
  evento,
  props,
}: {
  href: string;
  children: React.ReactNode;
  evento: Extract<
    EventoNombre,
    "whatsapp_click_search" | "whatsapp_click_property"
  >;
  props?: Record<string, string | number>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(evento, props)}
      className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#25d366] px-7 text-base font-semibold text-[#06331a] transition-colors hover:bg-[#1eb958]"
    >
      <MessageCircle size={20} aria-hidden />
      {children}
    </a>
  );
}

/** Bloque completo para el pie de resultados. */
export function WhatsappCta({
  href,
  titulo,
  detalle,
  boton,
  props,
}: {
  href: string;
  titulo: string;
  detalle: string;
  boton: string;
  props?: Record<string, string | number>;
}) {
  return (
    <section className="rounded-card border border-border bg-card p-6 text-center">
      <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
        {titulo}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">{detalle}</p>
      <div className="mx-auto mt-5 max-w-xs">
        <WhatsappBoton href={href} evento="whatsapp_click_search" props={props}>
          {boton}
        </WhatsappBoton>
      </div>
    </section>
  );
}
