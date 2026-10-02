import { useEffect, useState, type FormEvent } from "react";
import { usePageMotion } from "./use-page-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Database,
  Github,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Network,
  Palette,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";
import { z } from "zod";

import portrait from "@/assets/sourov-profile.jpg";
import { Button } from "@/components/ui/button";

const navItems = [
  ["About", "about"],
  ["Education", "education"],
  ["Skills", "skills"],
  ["Services", "services"],
  ["Projects", "projects"],
  ["Journey", "journey"],
  ["Contact", "contact"],
] as const;

const projects = [
  { n: "01", title: "Department of ITM Web Portal", role: "Full-Stack / Backend Developer", tech: "HTML · CSS · JavaScript · PHP · MySQL", tone: "project-acid", desc: "A centralized portal connecting department information, courses, faculty, student profiles, notices, learning resources, and administration." },
  { n: "02", title: "Bondhu", role: "Backend Developer & Testing Engineer", tech: "Backend · Database · Testing", tone: "project-coral", desc: "A collaborative software project focused on server-side functionality, system integration, debugging, testing, and multi-role teamwork." },
  { n: "03", title: "Disaster Relief Management", role: "Database Designer / Developer", tech: "MySQL · SQL · ER Modeling", tone: "project-cyan", desc: "A normalized relational system coordinating victims, volunteers, resources, donations, and relief activities with strong data integrity." },
  { n: "04", title: "House Price Predictor", role: "ML / Application Developer", tech: "Python · Pandas · Scikit-learn", tone: "project-sun", desc: "An end-to-end machine learning pipeline transformed from processed data and evaluated models into a usable prediction interface." },
  { n: "05", title: "Amazon Review Analysis", role: "ML / Application Developer", tech: "Python · NLP · Machine Learning", tone: "project-paper", desc: "Text preprocessing, exploratory analysis, model training, evaluation, and web application integration for product reviews." },
  { n: "06", title: "Fake News Classifier", role: "ML / Application Developer", tech: "Python · NLP · Scikit-learn", tone: "project-paper", desc: "A text classification workflow spanning dataset cleaning, feature extraction, model evaluation, prediction, and a web UI." },
  { n: "07", title: "Task Manager", role: "Application Developer", tech: "CRUD · Database · Backend", tone: "project-paper", desc: "A practical task workflow with creation, editing, completion status, deletion, persistence, and backend integration." },
  { n: "08", title: "E-Commerce Application", role: "Full-Stack Application Developer", tech: "Auth · Cart · Orders · Admin", tone: "project-paper", desc: "A complete commerce workflow covering products, categories, search, cart, profiles, orders, database integration, and administration." },
];

const skillGroups = [
  { title: "Programming", items: "C, C++, Python, JavaScript, SQL", icon: Code2 },
  { title: "Web Development", items: "HTML, CSS, JavaScript, PHP, Full-Stack", icon: Layers3 },
  { title: "AI / Machine Learning", items: "Pandas, NLP, model development, evaluation", icon: Network },
  { title: "System Design", items: "Architecture, OOP, SDLC, testing, problem solving", icon: ShieldCheck },
  { title: "Database", items: "MySQL, ER modeling, normalization, architecture", icon: Database },
  { title: "UI/UX & HCI", items: "Research, user flows, wireframes, Figma, usability", icon: Palette },
];

const services = [
  ["Web & full-stack development", "Responsive applications spanning interface, backend, data, authentication, and workflows."],
  ["Backend & database design", "Server-side logic, APIs, relational modeling, normalization, and reliable data structures."],
  ["UI/UX & HCI", "Research-led user flows, wireframes, prototypes, interfaces, and usability-focused thinking."],
  ["AI/ML applications", "Developing capability in preprocessing, model building, evaluation, NLP, and product integration."],
  ["Mobile development", "Practical mobile application skills currently expanding through structured learning."],
  ["System design", "Developing capability in application structure, scalability, reliability, security, and architecture."],
];

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(2).max(140),
  message: z.string().trim().min(10).max(1200),
});

type Theme = "light" | "dark";

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("sourov-theme");
    const initial: Theme = saved === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("sourov-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title="Change color theme">
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

const sectionIds = navItems.map(([, id]) => id);

function Header() {
  const [open, setOpen] = useState(false);
  const { active, scrolled, progress } = usePageMotion(sectionIds);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a href="#about" className="skip-link">Skip to content</a>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <span className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
        <a href="#home" className="brand-mark" aria-label="Md Sourov Hasan — home">MSH<span>.</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, id]) => (
            <a key={id} href={`#${id}`} className={active === id ? "is-active" : undefined} aria-current={active === id ? "true" : undefined}>{label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Button className="menu-button" variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map(([label, id], i) => (
              <a key={id} href={`#${id}`} style={{ animationDelay: `${i * 40}ms` }} className={active === id ? "is-active" : undefined} onClick={() => setOpen(false)}>{label}</a>
            ))}
          </nav>
        )}
      </header>
      <a href="#home" className={`back-to-top${progress > 0.15 ? " is-shown" : ""}`} aria-label="Back to top">↑</a>
    </>
  );
}

function SectionHeading({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {aside && <p className="section-aside">{aside}</p>}
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = contactSchema.safeParse(Object.fromEntries(form));
    if (!result.success) {
      setStatus("error");
      return;
    }
    const { name, email, subject, message } = result.data;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:souov.hasan373@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("success");
  };

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label>Name<input name="name" type="text" autoComplete="name" maxLength={100} required placeholder="Your name" /></label>
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={255} required placeholder="you@example.com" /></label>
      </div>
      <label>Subject<input name="subject" type="text" maxLength={140} required placeholder="What would you like to discuss?" /></label>
      <label>Message<textarea name="message" rows={5} minLength={10} maxLength={1200} required placeholder="Tell me a little about your idea..." /></label>
      {status === "error" && <p className="form-status error" role="alert">Please complete every field with a valid email and at least 10 message characters.</p>}
      {status === "success" && <p className="form-status success" role="status"><CheckCircle2 /> Your email app is ready with the message.</p>}
      <Button type="submit" size="lg">Compose message <ArrowUpRight /></Button>
    </form>
  );
}

export function PortfolioPage() {
  return (
    <div className="portfolio-shell">
      <Header />
      <main>
        <section id="home" className="hero-section">
          <div className="hero-copy animate-fade-in">
            <p className="eyebrow"><span className="status-dot" /> Available for learning & collaboration</p>
            <h1>Md Sourov<br /><span>Hasan</span></h1>
            <p className="hero-role">Aspiring System Designer <i>&</i> Software Architect</p>
            <p className="hero-description">Information Technology & Management student building toward scalable, secure, reliable, and intelligent software systems.</p>
            <div className="hero-actions">
              <Button asChild size="lg"><a href="#projects">Explore my work <ArrowDownRight /></a></Button>
              <Button asChild variant="outline" size="lg"><a href="#contact">Let’s connect</a></Button>
            </div>
            <div className="social-row">
              <a href="https://github.com/sourov-hasan" target="_blank" rel="noreferrer"><Github /> GitHub</a>
              <a href="https://www.linkedin.com/in/sourov-hasan-emon" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
              <a href="mailto:souov.hasan373@gmail.com"><Mail /> Email</a>
            </div>
          </div>
          <div className="hero-visual animate-fade-in">
            <div className="portrait-frame">
              <img src={portrait} width={731} height={727} alt="Portrait of Md Sourov Hasan" />
              <span className="portrait-label">Based in Bangladesh · 2026</span>
            </div>
            <div className="orbit-note note-one">01 / CODE</div>
            <div className="orbit-note note-two">04 / SYSTEM</div>
          </div>
          <div className="hero-track" aria-label="Professional progression">
            {['Code', 'Application', 'Architecture', 'Intelligent system'].map((item, i) => <span key={item}><b>0{i + 1}</b>{item}</span>)}
          </div>
        </section>

        <section id="about" className="content-section about-section">
          <SectionHeading eyebrow="01 / About" title="Curious about what happens beneath the interface." aside="Student today. Systems thinker in progress." />
          <div className="about-grid">
            <div className="about-story">
              <p className="lead">I’m an ITM student and technology enthusiast who enjoys understanding how modern technologies solve real-world problems.</p>
              <p>My long-term goal is to specialize in system design and software architecture, while exploring how AI and machine learning can make modern software more useful and intelligent.</p>
              <blockquote>“I believe in learning through practical projects, continuous experimentation, and understanding how technologies work beyond the surface.”</blockquote>
            </div>
            <div className="profile-grid">
              {['ITM Student', 'Aspiring System Designer', 'AI/ML Enthusiast', 'Software Developer', 'Continuous Learner', 'Technology Explorer'].map((item, i) => <div key={item}><span>0{i + 1}</span><p>{item}</p></div>)}
            </div>
          </div>
        </section>

        <section id="education" className="content-section education-section">
          <SectionHeading eyebrow="02 / Education" title="A foundation built through study and practice." />
          <div className="timeline">
            {[
              ['2024—2028', 'BSc in Information Technology & Management', 'Daffodil International University', 'Current · Expected mid-2028'],
              ['2022', 'Higher Secondary Certificate', 'Dhaka College', 'GPA 4.92 / 5.00'],
              ['2020', 'Secondary School Certificate', 'Kalai M.U. Government High School', 'GPA 5.00 / 5.00'],
              ['Ongoing', 'Professional Learning', 'AIQuest · Ostad', 'Full-stack, ML & mobile development'],
            ].map(([year, title, place, note], i) => (
              <article key={title} className="timeline-item"><span className="timeline-index">0{i + 1}</span><p className="timeline-year">{year}</p><div><h3>{title}</h3><p>{place}</p></div><p className="timeline-note">{note}</p></article>
            ))}
          </div>
        </section>

        <section id="skills" className="content-section skills-section">
          <SectionHeading eyebrow="03 / Skills" title="Tools for building the whole system." aside="From logic and data to the experience people touch." />
          <div className="skills-grid">
            {skillGroups.map(({ title, items, icon: Icon }, i) => <article key={title} className="skill-card"><div><span>0{i + 1}</span><Icon /></div><h3>{title}</h3><p>{items}</p></article>)}
          </div>
          <div className="learning-strip"><span>Currently developing</span><div>System Design · Software Architecture · Full-Stack · AI/ML · Mobile · Cloud · DevOps · Cybersecurity</div></div>
        </section>

        <section id="services" className="content-section services-section">
          <SectionHeading eyebrow="04 / Capabilities" title="What I can help build." aside="Project-grown skills, honestly represented." />
          <div className="services-list">
            {services.map(([title, desc], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{desc}</p><ArrowUpRight /></article>)}
          </div>
        </section>

        <section id="projects" className="content-section projects-section">
          <SectionHeading eyebrow="05 / Selected work" title="Projects as proof of progress." aside="Academic and independent work across web, data, and intelligent applications." />
          <div className="projects-grid">
            {projects.map((project, i) => <article key={project.title} className={`project-card ${project.tone} ${i < 4 ? 'project-featured' : ''}`}>
              <div className="project-top"><span>{project.n}</span><ArrowUpRight /></div>
              <div className="project-visual" aria-hidden="true"><span>{project.tech.split(' · ')[0]}</span><div className="system-lines"><i /><i /><i /></div></div>
              <p className="project-role">{project.role}</p><h3>{project.title}</h3><p>{project.desc}</p><div className="project-tech">{project.tech}</div>
            </article>)}
          </div>
        </section>

        <section id="journey" className="content-section journey-section">
          <SectionHeading eyebrow="06 / Journey" title="Experience through projects." aside="No inflated titles. Just a clear record of moving forward." />
          <div className="journey-track">
            {['Programming fundamentals', 'Web development', 'Databases', 'Full-stack development', 'AI / Machine Learning', 'System design', 'Software architecture'].map((item, i) => <div key={item}><span>{String(i + 1).padStart(2, '0')}</span><p>{item}</p></div>)}
          </div>
        </section>

        <section className="content-section focus-section">
          <SectionHeading eyebrow="07 / Current focus" title="Designing beyond the individual feature." />
          <div className="architecture-map">
            <div className="architecture-core"><Network /><span>Primary direction</span><h3>System Design &<br />Software Architecture</h3></div>
            <div className="architecture-nodes">{['Scalability', 'Reliability', 'Security', 'Backend', 'Database', 'AI integration', 'Cloud', 'DevOps'].map((item, i) => <span key={item} style={{ '--i': i } as React.CSSProperties}>{item}</span>)}</div>
          </div>
          <div className="philosophy"><span>Learn</span><ArrowDownRight /><span>Build</span><ArrowDownRight /><span>Experiment</span><ArrowDownRight /><span>Understand</span><ArrowDownRight /><span>Improve</span></div>
        </section>

        <section id="contact" className="content-section contact-section">
          <div className="contact-intro"><p className="eyebrow">08 / Contact</p><h2>Let’s build something <span>meaningful.</span></h2><p>Interested in collaboration, technology projects, learning opportunities, or simply connecting? Feel free to reach out.</p>
            <div className="contact-links"><a href="mailto:souov.hasan373@gmail.com"><Mail /> souov.hasan373@gmail.com</a><a href="https://wa.me/8801975435003" target="_blank" rel="noreferrer"><ArrowUpRight /> WhatsApp</a><span>Bangladesh · UTC+6</span></div>
          </div>
          <ContactForm />
        </section>
      </main>
      <footer><a href="#home" className="brand-mark">MSH<span>.</span></a><p>Designed & built with curiosity, code, and continuous learning.</p><p>© 2026 Md Sourov Hasan.</p></footer>
    </div>
  );
}
