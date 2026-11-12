// Maps the string keys stored in content.json to real assets and icon
// components, so content stays plain JSON (editable from the CMS).

import resume from "../assets/YASH KUMAR JHA.pdf";
import portrait from "../assets/yash.webp";
import curaconnect from "../assets/curaconnect.webp";
import spylt from "../assets/spylt.webp";

import {
  SiAngular, SiAmazonwebservices, SiBootstrap, SiCss3, SiCypress, SiDocker, SiExpress, SiFigma,
  SiFirebase, SiFramer, SiGit, SiGithub, SiGraphql, SiGreensock, SiHtml5, SiJavascript, SiJest,
  SiMongodb, SiMysql, SiNetlify, SiNextdotjs, SiNodedotjs, SiPhp, SiPostgresql, SiPostman, SiPrisma,
  SiPython, SiReact, SiReactquery, SiRedux, SiSass, SiStorybook, SiStripe, SiSupabase, SiSvelte,
  SiTailwindcss, SiTestinglibrary, SiThreedotjs, SiTypescript, SiVercel, SiVite, SiVuedotjs,
  SiWebpack, SiWordpress,
} from "react-icons/si";
import { FaInstagram, FaLinkedin, FaXTwitter, FaYoutube, FaDribbble, FaBehance, FaMedium, FaGlobe } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io";
import {
  Accessibility, Boxes, Brain, Cloud, Code, Cpu, Database, FlaskConical, Gauge, GitBranch, Globe,
  LayoutDashboard, Layers, Lightbulb, MonitorSmartphone, Network, Palette, Plug, Puzzle, Rocket,
  Search, ShieldCheck, Smartphone, Sparkles, Target, TestTube, Users, Workflow, Wrench, Zap,
} from "lucide-react";

/** Bundled files referenced as "asset:<key>" in content. */
export const assets = { resume, portrait, curaconnect, spylt };

/** Resolve a content media value: "asset:key", a URL, an /uploads path or a data: URL. */
export const resolveAsset = (value) => {
  if (!value) return "";
  if (value.startsWith("asset:")) return assets[value.slice(6)] ?? "";
  return value;
};

/** Brand/technology icons for core skill cards. */
export const brandIcons = {
  js: { label: "JavaScript", Icon: SiJavascript },
  ts: { label: "TypeScript", Icon: SiTypescript },
  react: { label: "React", Icon: SiReact },
  next: { label: "Next.js", Icon: SiNextdotjs },
  redux: { label: "Redux", Icon: SiRedux },
  reactquery: { label: "React Query", Icon: SiReactquery },
  html: { label: "HTML5", Icon: SiHtml5 },
  css: { label: "CSS3", Icon: SiCss3 },
  sass: { label: "Sass", Icon: SiSass },
  tailwind: { label: "Tailwind", Icon: SiTailwindcss },
  bootstrap: { label: "Bootstrap", Icon: SiBootstrap },
  vue: { label: "Vue", Icon: SiVuedotjs },
  angular: { label: "Angular", Icon: SiAngular },
  svelte: { label: "Svelte", Icon: SiSvelte },
  framer: { label: "Framer Motion", Icon: SiFramer },
  gsap: { label: "GSAP", Icon: SiGreensock },
  three: { label: "Three.js", Icon: SiThreedotjs },
  node: { label: "Node.js", Icon: SiNodedotjs },
  express: { label: "Express", Icon: SiExpress },
  graphql: { label: "GraphQL", Icon: SiGraphql },
  mongodb: { label: "MongoDB", Icon: SiMongodb },
  mysql: { label: "MySQL", Icon: SiMysql },
  postgres: { label: "PostgreSQL", Icon: SiPostgresql },
  prisma: { label: "Prisma", Icon: SiPrisma },
  firebase: { label: "Firebase", Icon: SiFirebase },
  supabase: { label: "Supabase", Icon: SiSupabase },
  php: { label: "PHP", Icon: SiPhp },
  python: { label: "Python", Icon: SiPython },
  wordpress: { label: "WordPress", Icon: SiWordpress },
  stripe: { label: "Stripe", Icon: SiStripe },
  jest: { label: "Jest", Icon: SiJest },
  rtl: { label: "Testing Library", Icon: SiTestinglibrary },
  cypress: { label: "Cypress", Icon: SiCypress },
  storybook: { label: "Storybook", Icon: SiStorybook },
  vite: { label: "Vite", Icon: SiVite },
  webpack: { label: "Webpack", Icon: SiWebpack },
  git: { label: "Git", Icon: SiGit },
  github: { label: "GitHub", Icon: SiGithub },
  docker: { label: "Docker", Icon: SiDocker },
  aws: { label: "AWS", Icon: SiAmazonwebservices },
  vercel: { label: "Vercel", Icon: SiVercel },
  netlify: { label: "Netlify", Icon: SiNetlify },
  figma: { label: "Figma", Icon: SiFigma },
  postman: { label: "Postman", Icon: SiPostman },
};

/** General-purpose line icons (additional skills, about cards). */
export const lineIcons = {
  plug: { label: "Plug", Icon: Plug },
  workflow: { label: "Workflow", Icon: Workflow },
  gauge: { label: "Speed", Icon: Gauge },
  responsive: { label: "Responsive", Icon: MonitorSmartphone },
  flask: { label: "Testing", Icon: FlaskConical },
  testtube: { label: "Test tube", Icon: TestTube },
  git: { label: "Branch", Icon: GitBranch },
  network: { label: "Architecture", Icon: Network },
  code: { label: "Code", Icon: Code },
  layers: { label: "Layers", Icon: Layers },
  boxes: { label: "Boxes", Icon: Boxes },
  dashboard: { label: "Dashboard", Icon: LayoutDashboard },
  globe: { label: "Globe", Icon: Globe },
  users: { label: "Users", Icon: Users },
  zap: { label: "Zap", Icon: Zap },
  shield: { label: "Security", Icon: ShieldCheck },
  database: { label: "Database", Icon: Database },
  cloud: { label: "Cloud", Icon: Cloud },
  palette: { label: "Design", Icon: Palette },
  a11y: { label: "Accessibility", Icon: Accessibility },
  search: { label: "SEO", Icon: Search },
  mobile: { label: "Mobile", Icon: Smartphone },
  sparkles: { label: "Sparkles", Icon: Sparkles },
  wrench: { label: "Tools", Icon: Wrench },
  cpu: { label: "CPU", Icon: Cpu },
  rocket: { label: "Rocket", Icon: Rocket },
  brain: { label: "Brain", Icon: Brain },
  idea: { label: "Idea", Icon: Lightbulb },
  target: { label: "Target", Icon: Target },
  puzzle: { label: "Puzzle", Icon: Puzzle },
};

/** Social network icons. */
export const socialIcons = {
  linkedin: { label: "LinkedIn", Icon: FaLinkedin },
  github: { label: "GitHub", Icon: IoLogoGithub },
  instagram: { label: "Instagram", Icon: FaInstagram },
  x: { label: "X / Twitter", Icon: FaXTwitter },
  youtube: { label: "YouTube", Icon: FaYoutube },
  dribbble: { label: "Dribbble", Icon: FaDribbble },
  behance: { label: "Behance", Icon: FaBehance },
  medium: { label: "Medium", Icon: FaMedium },
  website: { label: "Website", Icon: FaGlobe },
};

/** Fallback-safe icon lookup. */
export const getIcon = (registry, key, fallback = Code) => registry[key]?.Icon ?? fallback;
