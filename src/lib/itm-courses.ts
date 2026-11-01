export type ItmCourse = { code: string; title: string; credits: number; description: string };

const course = (code: string, title: string, credits: number, description: string): ItmCourse => ({ code, title, credits, description });
const objectOrientedSemester = [
  course("ENG102", "Business English", 3, "Develop clear English for professional conversations, correspondence, and presentations. Practice communicating ideas appropriately in business settings."),
  course("AOL101", "Art of Living", 3, "Explore personal development, ethical awareness, and a balanced approach to everyday life. Reflect on habits, relationships, and responsibilities that support personal and professional growth."),
  course("ITM214", "Object Oriented Concepts Lab", 1, "Put object-oriented ideas into practice by building programs with classes and objects. Use hands-on exercises to connect encapsulation, inheritance, and polymorphism with working code."),
  course("ITM201", "Managerial Accounting", 3, "Explore how accounting information supports internal business decisions. Understand costs, budgets, and performance information used to plan and manage operations."),
  course("ITM213", "Object Oriented Concepts", 3, "Learn to organize software around objects, classes, and their relationships. Explore encapsulation, inheritance, and polymorphism as foundations for maintainable applications."),
];

export const itmSemesters: { semester: number; theme: string; courses: ItmCourse[] }[] = [
  { semester: 1, theme: "Building the foundation", courses: [
    course("ENG101", "Basic Functional English", 3, "Build a foundation in reading, writing, speaking, and listening in English. Practice expressing ideas clearly in everyday and academic situations."),
    course("ITM101", "Principles of Accounting", 3, "Understand how financial transactions are recorded and summarized. Explore the accounting cycle and basic financial statements to interpret a business's financial position."),
    course("ITM102", "Principles of Management", 3, "Explore how organizations plan, organize, lead, and control their activities. Connect management concepts with teamwork, decision-making, and organizational goals."),
    course("ITM111", "Computer Fundamentals", 3, "Learn the basic components of computer systems, including hardware, software, and data. Develop an understanding of how computers support everyday work and technology-based organizations."),
    course("ITM112", "Computer Fundamentals Lab", 1, "Practice essential computer operations and common productivity tools. Build confidence through hands-on tasks involving documents, spreadsheets, and digital workflows."),
    course("ITM123", "Software Requirement Analysis and Design", 3, "Explore how user needs become clear software requirements. Learn to model processes and structure a design before implementation begins."),
    course("MATH101", "Business Mathematics", 3, "Build mathematical skills used to describe and solve business problems. Connect quantitative reasoning with financial calculations, relationships, and decision-making."),
  ] },
  { semester: 2, theme: "Logic meets business", courses: [
    course("STA101", "Introduction to Statistics", 3, "Learn to organize, summarize, and interpret data. Explore probability and statistical reasoning as a foundation for evidence-based decisions."),
    course("ITM103", "Principles of Marketing", 3, "Explore how businesses understand customers and create value. Study market segmentation, positioning, and the role of products, pricing, promotion, and distribution."),
    course("ITM121", "Structured Programming", 3, "Develop problem-solving skills through step-by-step program design. Learn how variables, control flow, functions, and structured logic turn algorithms into programs."),
    course("ITM122", "Structured Programming Lab", 1, "Write and debug programs using structured programming techniques. Practice breaking problems into smaller parts and checking that solutions behave as expected."),
    course("ITM203", "Social Media Marketing", 3, "Explore how social platforms help organizations reach and engage audiences. Connect content planning, campaign goals, and performance measurement with digital marketing strategy."),
  ] },
  { semester: 3, theme: "Objects, people & decisions", courses: objectOrientedSemester },
  { semester: 4, theme: "Continuing the learning journey", courses: objectOrientedSemester },
  { semester: 5, theme: "Building for the web", courses: [
    course("GE314", "Bangladesh Studies", 3, "Explore Bangladesh's history, society, culture, and development. Connect national context with the responsibilities and perspectives of informed citizens."),
    course("ITM204", "Human Resource Management", 3, "Study how organizations recruit, develop, and support their people. Explore employee performance, motivation, and workplace practices that contribute to organizational success."),
    course("ITM202", "Business Communication", 3, "Learn to communicate effectively across professional situations and audiences. Practice organizing messages, reports, and presentations with clarity and purpose."),
    course("ITM223", "Website Application Development", 3, "Explore how web interfaces and application logic work together. Learn the concepts behind developing useful websites that handle user input and deliver dynamic content."),
    course("ITM224", "Website Application Development Lab", 1, "Apply web development concepts through practical implementation. Build and test interfaces and application workflows while improving usability and reliability."),
  ] },
  { semester: 6, theme: "Connected business systems", courses: [
    course("ITM307", "Introduction to Finance", 3, "Explore how individuals and organizations make financial decisions. Learn foundational ideas about money, risk, investment, and the time value of money."),
    course("ITM301", "Management Information System", 3, "Understand how information systems support business operations and management. Explore the relationship between people, processes, data, and technology in organizational decisions."),
    course("ITM206", "Entrepreneurship in IT", 3, "Explore how technology ideas can become viable ventures. Connect problem discovery, customer needs, business models, and planning with entrepreneurial thinking."),
    course("ITM315", "Data Communication & Computer Networking", 3, "Learn how devices exchange data across computer networks. Explore network structures, communication protocols, and the principles behind reliable connectivity."),
    course("ITM316", "Data Communication & Computer Networking Lab", 1, "Practice network concepts through configuration and troubleshooting exercises. Connect theoretical communication principles with the behavior of working network environments."),
  ] },
  { semester: 7, theme: "Quality, insight & security", courses: [
    course("ITM323", "Software Quality Assurance and Testing", 3, "Explore how teams assess and improve software quality throughout development. Learn about test planning, defect tracking, and verification against requirements."),
    course("ITM324", "Software Quality Assurance and Testing Lab", 1, "Design and execute practical tests for software behavior. Practice documenting defects and checking fixes to build confidence in an application's reliability."),
    course("ITM302", "Business and Web Analytics", 3, "Explore how business and website data reveal patterns and opportunities. Connect performance measures and analysis with better decisions about products and digital experiences."),
    course("ITM322", "Software and Web Security", 3, "Learn about common risks affecting software and web applications. Explore secure design practices and safeguards for protecting data, users, and application behavior."),
    course("ITM321", "Software Documentation", 3, "Learn to make software understandable through clear technical and user documentation. Practice describing requirements, designs, and workflows for the people who build and use a system."),
  ] },
];

export function filterItmCourses(semester: number | "all", query: string) {
  const search = query.trim().toLowerCase();
  return itmSemesters.filter((s) => semester === "all" || s.semester === semester)
    .map((s) => ({ ...s, courses: s.courses.filter((c) => `${c.code} ${c.title} ${c.description}`.toLowerCase().includes(search)) }))
    .filter((s) => s.courses.length > 0);
}