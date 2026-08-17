"use client";

import { ExternalLink } from "lucide-react";
import { track } from "@/lib/analytics";

/** Enlace a la publicación original de la propiedad, medido como salida. */
export function EnlaceExterno({
  href,
  id,
  reference,
}: {
  href: string;
  id: string;
  reference: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("external_link_click", { id, reference })}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-transparent px-6 text-[15px] font-medium text-foreground transition-colors hover:bg-black/[0.03]"
    >
      <ExternalLink size={17} aria-hidden />
      Ver la publicación original
    </a>
  );
}
