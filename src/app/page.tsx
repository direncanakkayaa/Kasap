import Hero from "@/components/landing/Hero";
import AboutSection from "@/components/landing/AboutSection";
import ProductGrid from "@/components/landing/ProductGrid";
import ServicesSection from "@/components/landing/ServicesSection";
import WhyUsSection from "@/components/landing/WhyUsSection";
import CTASection from "@/components/landing/CTASection";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ProductGrid />
      <ServicesSection />
      <WhyUsSection />
      <CTASection />
    </>
  );
}
