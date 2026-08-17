import { Logo } from "@/components/layout/logo";

/**
 * El flujo usa un encabezado mínimo, sin navegación ni CTA: una vez que la
 * persona arrancó la búsqueda no queremos ofrecerle salidas. El logo sigue
 * siendo un link al inicio para quien quiera volver a propósito.
 */
export default function BuscarLayout({ children }: LayoutProps<"/buscar">) {
  return (
    <>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-lg items-center px-4 sm:px-6">
          <Logo />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
