import type { Metadata } from "next";
import { EntrevistaFlow } from "@/components/entrevista/entrevista-flow";

export const metadata: Metadata = {
  title: "Empecemos por vos",
  description:
    "Cinco preguntas para entender qué estás buscando antes de mostrarte propiedades. Te lleva menos de dos minutos.",
};

export default function BuscarPage() {
  return <EntrevistaFlow />;
}
