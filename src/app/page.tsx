"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/landingPage/Hero";
import About from "@/components/landingPage/About";
import MyJourney from "@/components/landingPage/MyJourney";
import Portfolio from "@/components/landingPage/Portfolio";
import Testimonials from "@/components/landingPage/Testimonials";
import Contact from "@/components/landingPage/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animasi/efek awal
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero isVisible={isVisible} scrollToSection={scrollToSection} />
      <About />
      <MyJourney />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
