import type { Metadata } from "next";
import { EntrevistaFlow } from "@/components/entrevista/entrevista-flow";

export const metadata: Metadata = {
  title: "Comprar",
  description:
    "Cuatro preguntas para entender qué propiedad estás buscando antes de mostrarte opciones. Te lleva menos de dos minutos.",
};

export default function ComprarPage() {
  return <EntrevistaFlow operacion="buy" />;
}
