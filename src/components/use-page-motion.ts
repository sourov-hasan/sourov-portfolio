import { useEffect, useState } from "react";

const REVEAL_SELECTOR = [
  ".section-heading", ".about-story", ".profile-grid > div", ".timeline-item", ".skill-card",
  ".learning-strip", ".services-list article", ".project-card", ".journey-track > div",
  ".architecture-map", ".philosophy", ".contact-intro", ".contact-form",
].join(",");

/** Scroll reveal, progress, active section and header state. Degrades gracefully. */
export function usePageMotion(sectionIds: string[]) {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (!("IntersectionObserver" in window)) return;
    els.forEach((el) => {
      const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
      el.style.setProperty("--reveal-delay", `${Math.min(siblings.indexOf(el), 6) * 70}ms`);
      el.classList.add("reveal");
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));

    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["home", ...sectionIds].forEach((id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
    return () => { io.disconnect(); spy.disconnect(); };
  }, [sectionIds]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(y > 24);
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return { active, scrolled, progress };
}
