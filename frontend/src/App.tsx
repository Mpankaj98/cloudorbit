import { useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Courses from "./components/Courses";
import Founder from "./components/Founder";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import ParticleField from "./components/ParticleField";

export default function App() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");

    if (!("IntersectionObserver" in window) || elements.length === 0) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ParticleField />
      <Header />
      <main>
        <Hero />
        <Courses />
        <Founder />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
