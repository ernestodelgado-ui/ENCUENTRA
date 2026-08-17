"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { MAX_TEXTO } from "@/lib/entrevista/types";

/**
 * Marco común de las cinco preguntas: título, bajada, contenido y un único
 * botón para seguir.
 *
 * Todas comparten la misma estructura a propósito. La entrevista tiene que
 * sentirse como avanzar por decisiones chicas, y eso se logra cuando lo único
 * que cambia entre pantallas es la pregunta.
 */
export function Pregunta({
  titulo,
  bajada,
  children,
  onContinue,
  cta = "Continuar →",
  ctaHabilitado = true,
}: {
  titulo: React.ReactNode;
  bajada: string;
  children: React.ReactNode;
  onContinue: () => void;
  cta?: string;
  ctaHabilitado?: boolean;
}) {
  return (
    <div className="paso-entra">
      <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
        {titulo}
      </h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">{bajada}</p>

      <div className="mt-7">{children}</div>

      <div className="mt-9">
        <Button
          onClick={onContinue}
          size="lg"
          disabled={!ctaHabilitado}
          className="w-full justify-center"
        >
          {cta}
        </Button>
      </div>
    </div>
  );
}

/**
 * Campo de texto libre. Es el corazón de la entrevista: lo que se escribe acá
 * es lo que más adelante va a interpretar la IA.
 *
 * Nunca es obligatorio. Alguien puede responder sólo con pastillas, o sólo
 * escribiendo, o con las dos cosas.
 */
export function TextoLibre({
  etiqueta,
  placeholder,
  valor,
  onChange,
}: {
  etiqueta: string;
  placeholder: string;
  valor: string;
  onChange: (valor: string) => void;
}) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {etiqueta}
      </label>
      <textarea
        id={id}
        rows={5}
        maxLength={MAX_TEXTO}
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-describedby={`${id}-contador`}
        className="w-full resize-y rounded-card border border-border bg-card p-4 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-violet"
      />
      <p
        id={`${id}-contador`}
        className="mt-1.5 text-right text-xs text-muted-foreground"
      >
        {valor.length}/{MAX_TEXTO}
      </p>
    </div>
  );
}

/**
 * Grupo de pastillas que acompaña al texto libre. Complementan lo escrito, no
 * lo reemplazan: por eso van debajo y con un encabezado que lo aclara.
 */
export function GrupoChips({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mt-7">
      <legend className="text-sm font-semibold text-foreground">
        {titulo}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}
