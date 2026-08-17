"use client";

import { Check, CircleAlert } from "lucide-react";

/**
 * Piezas compartidas por los dos pasos de la búsqueda: la pastilla que se tilda
 * y el bloque de sección con su título y ayuda.
 */

export function alternar<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor)
    ? lista.filter((v) => v !== valor)
    : [...lista, valor];
}

const CLASES_PASTILLA =
  "flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm transition-colors hover:border-foreground/25 has-[:checked]:border-coral has-[:checked]:bg-coral/10 has-[:checked]:font-semibold has-[:checked]:text-coral has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet";

/**
 * Pastilla que se tilda. El input real va oculto pero presente, para no perder
 * el manejo por teclado que el navegador ya hace bien.
 */
export function Pastilla({
  tipo,
  name,
  checked,
  onChange,
  children,
}: {
  tipo: "checkbox" | "radio";
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className={CLASES_PASTILLA}>
      <input
        type={tipo}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {checked && <Check size={14} strokeWidth={3} aria-hidden />}
      {children}
    </label>
  );
}

export function Seccion({
  titulo,
  ayuda,
  error,
  children,
}: {
  titulo: string;
  ayuda?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-border pt-6">
      <legend className="text-base font-semibold text-foreground">
        {titulo}
      </legend>
      {ayuda && <p className="mt-1 text-sm text-muted-foreground">{ayuda}</p>}
      <div className="mt-4">{children}</div>
      {error && (
        <p
          role="alert"
          className="mt-3 flex items-start gap-1.5 text-sm text-coral-dark"
        >
          <CircleAlert size={15} className="mt-0.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </fieldset>
  );
}
