import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { Manifiesto } from "@/components/home/manifiesto";
import { Beneficios } from "@/components/home/beneficios";
import { HowItWorks } from "@/components/home/how-it-works";
import { ClosingCta } from "@/components/home/closing-cta";

/**
 * El recorrido de la home sigue el argumento: qué proponemos (Hero), por qué
 * hace falta (Manifiesto), en qué se traduce (Beneficios), cómo se hace
 * (HowItWorks) y para qué (ClosingCta).
 */
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Manifiesto />
        <Beneficios />
        <HowItWorks />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
