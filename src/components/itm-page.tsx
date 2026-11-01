import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, BookOpen, BriefcaseBusiness, GraduationCap, Landmark, Moon, Search, Sun, X } from "lucide-react";
import departmentPhoto from "@/assets/sourov-itm-department.jpeg.asset.json";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { filterItmCourses, itmSemesters } from "@/lib/itm-courses";

const majors = [
  { name: "FinTech", icon: Landmark, label: "Finance × technology", description: "Where financial services meet digital innovation. Explore digital banking, payment systems, financial data, and emerging technologies reshaping the financial industry.", topics: ["Digital banking", "Payment systems", "Financial data", "Emerging technology"], careers: "Banks, FinTech companies, financial institutions, and technology-driven businesses." },
  { name: "Project Management", icon: BriefcaseBusiness, label: "Ideas × execution", description: "Turn an idea into a well-delivered project. Develop skills in planning, resource management, risk management, teamwork, and leadership across technology and business projects.", topics: ["Project planning", "Resource management", "Risk management", "Team leadership"], careers: "Technology projects, business operations, and cross-functional project delivery." },
];

export function ItmPage() {
  const [dark, setDark] = useState(true);
  const [major, setMajor] = useState(0);
  const [semester, setSemester] = useState<number | "all">(1);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const isDark = localStorage.getItem("sourov-theme") !== "light";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark", !dark);
    localStorage.setItem("sourov-theme", dark ? "light" : "dark");
    setDark(!dark);
  };
  const selectedMajor = majors[major] ?? majors[0];
  if (!selectedMajor) return null;
  const MajorIcon = selectedMajor.icon;
  const groups = filterItmCourses(semester, query);
  const count = groups.reduce((n, s) => n + s.courses.length, 0);
  return (
    <div className="itm-page">
      <a href="#itm-overview" className="skip-link">Skip to content</a>
      <header className="itm-header">
        <Button asChild variant="ghost"><Link to="/" hash="about"><ArrowLeft /> Back to portfolio</Link></Button>
        <span className="itm-wordmark">MSH<span>.</span> <span className="itm-header-label">/ Academic journey</span></span>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title="Change color theme">{dark ? <Sun /> : <Moon />}</Button>
      </header>
      <main>
        <section className="itm-hero">
          <img src={departmentPhoto.url} width={1024} height={768} alt="Md Sourov Hasan at the Department of Information Technology & Management, Daffodil International University" />
          <div className="itm-hero-copy">
            <p className="eyebrow">Daffodil International University</p>
            <h1>Information Technology<br /><em>& Management.</em></h1>
            <p>My academic home. Where technology, business, and the people behind both come together.</p>
            <Button asChild size="lg"><a href="#itm-curriculum">Explore the courses <ArrowUpRight /></a></Button>
          </div>
          <span className="itm-photo-caption">Sourov at the ITM department</span>
        </section>
        <section id="itm-overview" className="itm-band itm-overview">
          <div><p className="eyebrow">01 / The department</p><h2>Technology with a<br /><em>business perspective.</em></h2></div>
          <div><p className="itm-lead">ITM brings information technology, business, and management into one learning journey.</p><p>The department combines theoretical knowledge with practical skills through academic courses, projects, industry exposure, and technology-based learning — preparing students for a rapidly changing digital world.</p><div className="itm-facts"><span><GraduationCap /> 2 major areas</span><span><BookOpen /> 7 semesters supplied</span></div></div>
        </section>
        <section className="itm-band itm-majors">
          <p className="eyebrow">02 / Major pathways</p><h2>Two directions.<br /><em>A connected foundation.</em></h2>
          <div className="itm-major-tabs" role="tablist" aria-label="ITM majors">{majors.map((m, i) => <Button key={m.name} id={`major-tab-${i}`} role="tab" aria-selected={major === i} aria-controls="major-panel" variant={major === i ? "default" : "outline"} onClick={() => setMajor(i)}><m.icon /> {m.name}</Button>)}</div>
          <div key={major} id="major-panel" role="tabpanel" aria-labelledby={`major-tab-${major}`} className="itm-major-panel animate-fade-in"><MajorIcon className="itm-major-icon" /><div><p className="eyebrow">{selectedMajor.label}</p><h3>{selectedMajor.name}</h3><p>{selectedMajor.description}</p><div className="itm-tags">{selectedMajor.topics.map((t) => <span key={t}>{t}</span>)}</div></div><div className="itm-major-career"><span>Where it can lead</span><p>{selectedMajor.careers}</p></div></div>
        </section>
        <section id="itm-curriculum" className="itm-band itm-curriculum">
          <p className="eyebrow">03 / Course explorer</p><div className="itm-section-top"><h2>Learning, semester<br /><em>by semester.</em></h2><p>From first principles to connected systems, analytics, and secure software.</p></div>
          <div className="itm-course-toolbar"><div className="itm-semesters" aria-label="Choose semester">{["all", ...itmSemesters.map((s) => s.semester)].map((s) => <Button key={s} variant={semester === s ? "default" : "ghost"} aria-pressed={semester === s} onClick={() => setSemester(s === "all" ? "all" : Number(s))}>{s === "all" ? "All" : `Sem ${s}`}</Button>)}</div><label className="itm-search"><Search aria-hidden="true" /><input aria-label="Search courses" placeholder="Search title or code…" value={query} onChange={(e) => { setQuery(e.target.value); if (e.target.value) setSemester("all"); }} />{query && <Button variant="ghost" size="icon" aria-label="Clear course search" onClick={() => setQuery("")}><X /></Button>}</label></div>
          <p className="itm-results" role="status">{count} {count === 1 ? "course" : "courses"}{query ? ` matching “${query}”` : " in the selected semesters"}</p>
          {(semester === 4 || semester === "all") && <p className="itm-source-note">The supplied semester 4 list repeats semester 3. Both are shown as provided; the department can confirm the final semester 4 list.</p>}
          <div key={`${semester}-${query}`} className="animate-fade-in">{groups.map((s) => <div key={s.semester} className="itm-course-group"><div className="itm-semester-heading"><span>0{s.semester}</span><div><h3>Semester {s.semester}</h3><p>{s.theme}</p></div><span>{s.courses.reduce((n, c) => n + c.credits, 0)} credits{query ? " matched" : ""}</span></div><Accordion type="multiple">{s.courses.map((c) => <AccordionItem key={c.code} value={c.code}><AccordionTrigger className="itm-course-trigger"><span className="itm-course-code">{c.code}</span><span className="itm-course-title">{c.title}</span><span className="itm-course-credit">{c.credits} {c.credits === 1 ? "credit" : "credits"}</span></AccordionTrigger><AccordionContent className="itm-course-description">{c.description}</AccordionContent></AccordionItem>)}</Accordion></div>)}</div>
          {count === 0 && <div className="itm-no-results"><Search /><h3>No matching courses</h3><p>Try another title or course code.</p><Button variant="outline" onClick={() => { setQuery(""); setSemester("all"); }}>Show all courses</Button></div>}
          <p className="itm-curriculum-note">Course names, credits, and semester placement follow the information supplied by Sourov. Descriptions are introductory summaries, not official syllabi. No semester 8 list was supplied.</p>
        </section>
        <section className="itm-band itm-careers"><p className="eyebrow">04 / Career perspective</p><h2>More than one<br /><em>way forward.</em></h2><p>Combining technical and managerial knowledge opens opportunities across technology, finance, and business — with a foundation for entrepreneurship and leadership in the digital economy.</p><div className="itm-career-grid">{["Business Analyst", "Project Manager", "IT Manager", "FinTech Professional", "Software / Web Developer", "Data Analyst", "System Analyst", "Technology Consultant"].map((c, i) => <div key={c}><span>0{i + 1}</span><h3>{c}</h3><ArrowUpRight /></div>)}</div><Button asChild size="lg"><Link to="/" hash="projects">See what I’m building <ArrowUpRight /></Link></Button></section>
      </main>
      <footer><Link to="/" className="brand-mark">MSH<span>.</span></Link><p>Md Sourov Hasan · Information Technology & Management</p><Button asChild variant="link"><Link to="/" hash="about"><ArrowLeft /> Back to About</Link></Button></footer>
    </div>
  );
}