import type { Metadata } from "next";
import { EntrevistaFlow } from "@/components/entrevista/entrevista-flow";

export const metadata: Metadata = {
  title: "Alquilar",
  description:
    "Cuatro preguntas para entender dónde querés vivir antes de mostrarte opciones. Te lleva menos de dos minutos.",
};

export default function AlquilarPage() {
  return <EntrevistaFlow operacion="rent" />;
}
