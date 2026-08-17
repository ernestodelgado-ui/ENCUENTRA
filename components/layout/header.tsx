"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { PUERTAS } from "@/components/home/puertas";

const NAV_LINKS = [
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/para-quien-es", label: "Para quién es" },
  { href: "/nosotros", label: "Nosotros" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  // Close the mobile menu on Escape, and prevent body scroll while it's open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    // Note: the mobile menu panel is rendered as a *sibling* of <header>, not nested
    // inside it. Nesting it inside the header would put it under an ancestor with
    // backdrop-blur (a `backdrop-filter`), which creates a new containing block in
    // Chromium/WebKit and breaks `position: fixed` — the panel would end up sized
    // and clipped relative to the 64px-tall header instead of the viewport.
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-8 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Acá había un único CTA "Empezar búsqueda". Con tres puertas
              —comprar, alquilar y vender— un botón solo tendría que elegir una
              por la persona, y compite con la decisión que el hero le pide
              tomar. El logo ya alcanza como vuelta al inicio. */}

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X size={24} aria-hidden />
            ) : (
              <Menu size={24} aria-hidden />
            )}
          </button>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-16 z-[60] flex flex-col bg-background md:hidden"
        >
          <nav
            aria-label="Navegación móvil"
            className="flex flex-1 flex-col gap-1 px-4 pt-4"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3.5 text-lg text-foreground/90 hover:bg-black/[0.03]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-2 border-t border-border p-4">
            {PUERTAS.map((puerta) => (
              <Button
                key={puerta.href}
                href={puerta.href}
                variant={puerta.href === "/vender" ? "outline" : "primary"}
                className="w-full justify-center"
                onClick={() => setOpen(false)}
              >
                {puerta.titulo}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
