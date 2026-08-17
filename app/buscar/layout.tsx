/**
 * El encabezado no vive acá sino en cada pantalla: la introducción de la
 * entrevista va a sangre completa sobre la fotografía y lleva su propio logo
 * flotando, mientras que las preguntas y los filtros usan la barra de
 * `HeaderMinimo`.
 */
export default function BuscarLayout({ children }: LayoutProps<"/buscar">) {
  return <main className="flex-1">{children}</main>;
}
