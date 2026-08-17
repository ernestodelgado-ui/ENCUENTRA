import { ChevronLeft } from "lucide-react";

export type Progreso = {
  /** Texto que se muestra sobre la barra, ej. "Paso 1 de 2". */
  label: string;
  /** Avance entre 0 y 1. */
  valor: number;
};

/**
 * Marco común de las pantallas del flujo: botón de volver, indicador de avance
 * y una columna angosta centrada. En el mockup el flujo está dibujado dentro de
 * un celular; acá se traduce a una columna de ancho acotado que funciona igual
 * en mobile y en desktop.
 */
export function FlowShell({
  onBack,
  progreso,
  children,
}: {
  onBack?: () => void;
  progreso?: Progreso;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      {/* Alto reservado siempre, para que el contenido no salte entre pasos. */}
      <div className="flex min-h-11 items-center">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/[0.04]"
          >
            <ChevronLeft size={22} aria-hidden />
            <span className="sr-only">Volver al paso anterior</span>
          </button>
        )}
      </div>

      {progreso && (
        <div className="mb-8">
          <p className="text-center text-sm font-semibold text-coral">
            {progreso.label}
          </p>
          <div
            role="progressbar"
            aria-label="Avance de la búsqueda"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progreso.valor * 100)}
            className="mx-auto mt-3 h-1 w-full max-w-[14rem] overflow-hidden rounded-full bg-border"
          >
            <div
              className="h-full rounded-full bg-coral transition-[width] duration-300"
              style={{ width: `${progreso.valor * 100}%` }}
            />
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

/**
 * Recuadro de apoyo en violeta, el mismo que en el mockup acompaña los pasos de
 * interpretación con una explicación de lo que está pasando.
 */
export function NotaViolet({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex gap-3 rounded-2xl bg-violet/[0.07] p-4">
      <span className="mt-0.5 shrink-0 text-violet">{icon}</span>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
