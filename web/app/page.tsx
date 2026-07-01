import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { Testimonials } from "@/components/Testimonials";
import { SessionSection } from "@/components/SessionSection";
import { Pricing } from "@/components/Pricing";
import { About } from "@/components/About";
import { Faq } from "@/components/Faq";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingRoot } from "@/components/booking/BookingRoot";

export default function Home() {
  return (
    <BookingRoot>
      <SiteNav />
      <main id="top">
        <Hero />
        <Testimonials />
        <SessionSection />
        <Pricing />
        <About />
        <Faq />
      </main>
      <SiteFooter />
    </BookingRoot>
  );
}
