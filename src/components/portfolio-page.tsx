import { useEffect, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
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
import projectItmPortal from "@/assets/project-itm-portal.jpg";
import projectBondhu from "@/assets/project-bondhu.jpg";
import projectDisasterRelief from "@/assets/project-disaster-relief.jpg";
import projectHousePrice from "@/assets/project-house-price.jpg";
import projectAmazonReviews from "@/assets/project-amazon-reviews.jpg";
import projectFakeNews from "@/assets/project-fake-news.jpg";
import projectTaskManager from "@/assets/project-task-manager.jpg";
import projectEcommerce from "@/assets/project-ecommerce.jpg";
import { ChatWidget } from "@/components/chat-widget";
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

type ProjectCategory = "university" | "ai-ml" | "app-dev";

const projectFilters: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "university", label: "University Projects" },
  { id: "ai-ml", label: "AI / ML" },
  { id: "app-dev", label: "Application Development" },
];

// ─────────────────────────────────────────────────────────────
// ADD YOUR LINKS HERE: for each project, replace the "#" values
// of `github` with your GitHub repository URL and `live` with
// your deployed project URL. Example:
//   github: "https://github.com/sourov-hasan/itm-portal",
//   live: "https://itm-portal.vercel.app",
// ─────────────────────────────────────────────────────────────
const projects: {
  n: string; title: string; role: string; category: ProjectCategory;
  tech: string[]; desc: string; details: string; image: string;
  github: string; live: string;
}[] = [
  { n: "01", title: "Department of ITM Web Portal", role: "Full-Stack / Backend Developer", category: "university",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"], image: projectItmPortal,
    desc: "A centralized portal connecting department information, courses, faculty, student profiles, notices, learning resources, and administration.",
    details: "Built end-to-end for the ITM department: dynamic course and faculty pages, student profiles, a notice board, and a resource library — all backed by a MySQL database with PHP server-side logic and an admin panel for content management.",
    github: "#", live: "#" },
  { n: "02", title: "Bondhu", role: "Backend Developer & Testing Engineer", category: "university",
    tech: ["Backend", "Database", "Testing", "Teamwork"], image: projectBondhu,
    desc: "A collaborative software project focused on server-side functionality, system integration, debugging, testing, and multi-role teamwork.",
    details: "A team-built application where I owned the server side: API logic, database integration, and debugging. I also led testing — writing test cases, tracking defects, and verifying fixes — across a multi-role agile workflow.",
    github: "#", live: "#" },
  { n: "03", title: "Disaster Relief Management", role: "Database Designer / Developer", category: "university",
    tech: ["MySQL", "SQL", "ER Modeling", "Normalization"], image: projectDisasterRelief,
    desc: "A normalized relational system coordinating victims, volunteers, resources, donations, and relief activities with strong data integrity.",
    details: "Designed the full data layer for disaster response: ER modeling, normalized schema (3NF), and SQL queries coordinating victims, volunteers, resources, donations, and relief operations with referential integrity and reporting views.",
    github: "#", live: "#" },
  { n: "04", title: "House Price Predictor", role: "ML / Application Developer", category: "ai-ml",
    tech: ["Python", "Pandas", "Scikit-learn", "Web UI", "Deployment"], image: projectHousePrice,
    desc: "An end-to-end machine learning pipeline transformed from processed data and evaluated models into a usable prediction interface.",
    details: "Full ML lifecycle: data cleaning with Pandas, feature engineering, model training and evaluation with Scikit-learn, then wrapped in a deployed web UI where users enter property details and get instant price predictions.",
    github: "#", live: "#" },
  { n: "05", title: "Amazon Review Analysis App", role: "ML / Application Developer", category: "ai-ml",
    tech: ["Python", "NLP", "Machine Learning", "Web App"], image: projectAmazonReviews,
    desc: "Text preprocessing, exploratory analysis, model training, evaluation, and web application integration for product reviews.",
    details: "An end-to-end NLP application: cleaning and vectorizing review text, exploratory sentiment analysis, training and evaluating classification models, and serving predictions through a web app that scores any review as positive or negative.",
    github: "#", live: "#" },
  { n: "06", title: "Fake News Classifier App", role: "ML / Application Developer", category: "ai-ml",
    tech: ["Python", "NLP", "Scikit-learn", "Web UI"], image: projectFakeNews,
    desc: "A text classification workflow spanning dataset cleaning, feature extraction, model evaluation, prediction, and a web UI.",
    details: "An end-to-end classifier that flags fake news: dataset cleaning, TF-IDF feature extraction, model comparison and evaluation, and a web interface where pasting an article returns a real/fake verdict with confidence.",
    github: "#", live: "#" },
  { n: "07", title: "Task Manager", role: "Application Developer", category: "app-dev",
    tech: ["CRUD", "Database", "Backend", "Persistence"], image: projectTaskManager,
    desc: "A practical task workflow with creation, editing, completion status, deletion, persistence, and backend integration.",
    details: "A complete productivity app: create, edit, complete, and delete tasks with status tracking, persistent storage, and a backend API keeping every client in sync — focused on clean CRUD architecture and reliable state handling.",
    github: "#", live: "#" },
  { n: "08", title: "E-Commerce Application", role: "Full-Stack Application Developer", category: "app-dev",
    tech: ["Auth", "Cart", "Orders", "Admin", "Database"], image: projectEcommerce,
    desc: "A complete commerce workflow covering products, categories, search, cart, profiles, orders, database integration, and administration.",
    details: "A full commerce platform: product catalog with categories and search, user authentication and profiles, cart and checkout flow, order history, and an admin dashboard for managing inventory and orders — all on a relational database.",
    github: "#", live: "#" },
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

const EMAILJS_SERVICE_ID = "service_hyvncxr";
const EMAILJS_TEMPLATE_ID = "template_erxou5c";
const EMAILJS_PUBLIC_KEY = "Wt9cFAz3vDikHbWYd";

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "success">("idle");
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const result = contactSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!result.success) {
      setStatus("error");
      return;
    }
    const { name, email, subject, message } = result.data;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    setMailtoHref(`mailto:souov.hasan373@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: name, from_email: email, reply_to: email, subject, message },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label>Name<input name="name" type="text" autoComplete="name" maxLength={100} required placeholder="Your name" /></label>
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={255} required placeholder="you@example.com" /></label>
      </div>
      <label>Subject<input name="subject" type="text" maxLength={140} required placeholder="What would you like to discuss?" /></label>
      <label>Message<textarea name="message" rows={5} minLength={10} maxLength={1200} required placeholder="Tell me a little about your idea..." /></label>
      {status === "error" && (
        <p className="form-status error" role="alert">
          The message could not be sent. Please check every field, or <a href={mailtoHref ?? "mailto:souov.hasan373@gmail.com"}>send it through your email app</a> instead.
        </p>
      )}
      {status === "sending" && <p className="form-status" role="status">Sending your message…</p>}
      {status === "success" && <p className="form-status success" role="status"><CheckCircle2 /> Message sent — I'll get back to you soon.</p>}
      <Button type="submit" size="lg" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : <>Compose message <ArrowUpRight /></>}
      </Button>
    </form>
  );
}

export function PortfolioPage() {
  const [projectFilter, setProjectFilter] = useState<"all" | ProjectCategory>("all");
  const visibleProjects = projectFilter === "all" ? projects : projects.filter((p) => p.category === projectFilter);
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
          <div className="project-filters" role="tablist" aria-label="Filter projects by category">
            {projectFilters.map((filter) => (
              <button key={filter.id} type="button" role="tab" aria-selected={projectFilter === filter.id}
                className={`project-filter ${projectFilter === filter.id ? 'is-active' : ''}`}
                onClick={() => setProjectFilter(filter.id)}>
                {filter.label}
                <span className="project-filter-count">{filter.id === 'all' ? projects.length : projects.filter((p) => p.category === filter.id).length}</span>
              </button>
            ))}
          </div>
          <div className="projects-grid" key={projectFilter}>
            {visibleProjects.map((project) => <article key={project.title} className="project-card">
              <div className="project-media">
                <img src={project.image} alt={`${project.title} preview`} loading="lazy" width={1024} height={768} />
                <div className="project-overlay">
                  <p className="project-overlay-label">About this project</p>
                  <p className="project-overlay-text">{project.details}</p>
                </div>
              </div>
              <div className="project-body">
                <div className="project-top"><span>{project.n}</span><p className="project-role">{project.role}</p></div>
                <h3>{project.title}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tech">{project.tech.map((t) => <span key={t}>{t}</span>)}</div>
                <div className="project-actions">
                  <a href={project.github} target="_blank" rel="noreferrer" className="project-btn project-btn-code"><Github /> Code</a>
                  <a href={project.live} target="_blank" rel="noreferrer" className="project-btn project-btn-live"><ArrowUpRight /> Live App</a>
                </div>
              </div>
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
      <ChatWidget />
      <footer><a href="#home" className="brand-mark">MSH<span>.</span></a><p>Designed & built with curiosity, code, and continuous learning.</p><p>© 2026 Md Sourov Hasan.</p></footer>
    </div>
  );
}
