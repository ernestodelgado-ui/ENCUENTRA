import type { Metadata } from "next";
import { VenderFlow } from "@/components/vender/vender-flow";

export const metadata: Metadata = {
  title: "Vender",
  description:
    "Contanos sobre la propiedad que querés vender y en qué momento estás. Un asesor puede ayudarte a evaluarla y pensar la estrategia.",
};

export default function VenderPage() {
  return <VenderFlow />;
}
