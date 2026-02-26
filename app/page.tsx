import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/homepage/hero-section";
import { BrandMarquee } from "@/components/homepage/brand-marquee";
import { Features } from "@/components/homepage/features";
import { HowItWorks } from "@/components/homepage/how-it-works";
import { Pricing } from "@/components/homepage/pricing";
import { Testimonials } from "@/components/homepage/testimonials";
import { FAQ } from "@/components/homepage/faq";
import { CTA } from "@/components/homepage/cta";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-600">
      <Navbar />

      <HeroSection />
      <BrandMarquee />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />

      <Footer />
    </main>
  );
}
