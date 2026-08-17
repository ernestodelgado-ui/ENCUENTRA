import { Logo } from "@/components/layout/logo";

/**
 * Encabezado de las pantallas del recorrido: sólo el logo, sin navegación ni
 * CTA. Una vez que la persona arrancó no queremos ofrecerle salidas; el logo
 * sigue llevando al inicio para quien quiera volver a propósito.
 *
 * La pantalla de introducción no lo usa: ahí el logo va flotando sobre la foto.
 */
export function HeaderMinimo() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-lg items-center px-4 sm:px-6">
        <Logo />
      </div>
    </header>
  );
}
