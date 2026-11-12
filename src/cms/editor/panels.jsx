import { brandIcons, lineIcons, socialIcons } from "../../data/registry";
import { periodOf } from "../../data/selectors";
import { useField } from "../context";
import {
  ColorField,
  FileField,
  Group,
  IconPicker,
  ImageField,
  Label,
  NumberField,
  Row,
  TextField,
  ToggleField,
} from "./fields";
import { ItemList, StringList, TagEditor } from "./lists";
import { inputBase } from "./styles";

/** Eyebrow / title / accent (/ lead) fields shared by section headings. */
const Heading = ({ base, lead = false }) => (
  <Group title="Section heading" description="The big title at the top of this section. The accent part is shown in italic gradient.">
    <TextField path={[...base, "eyebrow"]} label="Small label" />
    <Row>
      <TextField path={[...base, "title"]} label="Title" />
      <TextField path={[...base, "accent"]} label="Accent (italic)" />
    </Row>
    {lead && <TextField path={[...base, "lead"]} label="Intro text" multiline />}
  </Group>
);

/* ------------------------------------------------------------------ */
export const ProfilePanel = () => (
  <div className="space-y-4">
    <Group title="Availability">
      <ToggleField path={["profile", "available"]} label="Show availability badge" description="The green “Available” pill in the hero" />
      <TextField path={["profile", "availabilityText"]} label="Badge text" />
    </Group>
    <Group title="Hero headline">
      <TextField path={["hero", "greeting"]} label="Greeting" />
      <Row>
        <TextField path={["hero", "line1"]} label="Big line 1" />
        <TextField path={["hero", "line2"]} label="Big line 2 (italic)" />
      </Row>
      <TextField path={["hero", "tagline"]} label="Tagline" multiline />
      <TextField path={["hero", "craftPrefix"]} label="Rotating words prefix" />
      <StringList path={["hero", "rotatingWords"]} label="Rotating words" addLabel="Add phrase" multiline={false} />
      <TextField path={["hero", "intro"]} label="Short introduction" multiline />
    </Group>
    <Group title="About you">
      <Row>
        <TextField path={["profile", "fullName"]} label="Full name" />
        <TextField path={["profile", "firstName"]} label="First name" />
      </Row>
      <Row>
        <TextField path={["profile", "role"]} label="Job title" />
        <TextField path={["profile", "location"]} label="Location" />
      </Row>
      <TextField path={["profile", "experienceLabel"]} label="Experience label" hint="e.g. 3+ yrs experience" />
      <ImageField path={["profile", "portrait"]} label="Portrait photo" />
      <FileField path={["profile", "resume"]} label="Resume (PDF)" />
    </Group>
    <Group title="Code window" description="The animated code card in the hero.">
      <TagEditor path={["hero", "codeStack"]} label="Stack" />
      <TextField path={["hero", "codeState"]} label="State management" />
      <TextField path={["hero", "codeFocus"]} label="Obsessed with" />
    </Group>
    <Group title="Extras">
      <TextField path={["hero", "loaderText"]} label="Loading screen text" />
      <TagEditor path={["marqueeWords"]} label="Scrolling band words" />
    </Group>
  </div>
);

/* ------------------------------------------------------------------ */
export const AboutPanel = () => (
  <div className="space-y-4">
    <Heading base={["about"]} />
    <Group title="Introduction">
      <StringList path={["about", "paragraphs"]} label="Paragraphs" addLabel="Add paragraph" />
    </Group>
    <Group title="Highlight numbers" description="Animated counters next to your portrait.">
      <ItemList path={["about", "stats"]} noun="stat" title={(s) => `${s.value}${s.suffix}`} subtitle={(s) => s.label} create={() => ({ value: 0, suffix: "+", label: "" })} addLabel="Add number">
        {(p) => (
          <>
            <Row>
              <NumberField path={[...p, "value"]} label="Number" />
              <TextField path={[...p, "suffix"]} label="Suffix" hint="+, %, K+" />
            </Row>
            <TextField path={[...p, "label"]} label="Label" />
          </>
        )}
      </ItemList>
    </Group>
    <Group title="Development philosophy">
      <ItemList path={["about", "philosophy"]} noun="card" title={(c) => c.title} create={() => ({ icon: "sparkles", title: "", text: "" })} addLabel="Add card">
        {(p) => (
          <>
            <TextField path={[...p, "title"]} label="Title" />
            <TextField path={[...p, "text"]} label="Text" multiline />
            <IconPicker path={[...p, "icon"]} label="Icon" registry={lineIcons} />
          </>
        )}
      </ItemList>
    </Group>
    <Group title="What I enjoy building">
      <ItemList path={["about", "builds"]} noun="item" title={(c) => c.title} create={() => ({ icon: "code", title: "", text: "" })} addLabel="Add item">
        {(p) => (
          <>
            <TextField path={[...p, "title"]} label="Title" />
            <TextField path={[...p, "text"]} label="Text" multiline />
            <IconPicker path={[...p, "icon"]} label="Icon" registry={lineIcons} />
          </>
        )}
      </ItemList>
    </Group>
    <Group title="How I solve problems" description="Numbered automatically in order.">
      <ItemList path={["about", "approach"]} noun="step" title={(c) => c.title} create={() => ({ title: "", text: "" })} addLabel="Add step">
        {(p) => (
          <>
            <TextField path={[...p, "title"]} label="Step title" />
            <TextField path={[...p, "text"]} label="Description" multiline />
          </>
        )}
      </ItemList>
    </Group>
  </div>
);

/* ------------------------------------------------------------------ */
export const SkillsPanel = () => (
  <div className="space-y-4">
    <Heading base={["skills"]} lead />
    <Group title="Core skills" description="Large cards. “Wide” makes a card span two columns on desktop.">
      <ItemList
        path={["skills", "core"]}
        noun="skill"
        title={(s) => s.name}
        subtitle={(s) => s.detail}
        create={() => ({ icon: "", name: "", detail: "", note: "", color: "#ff5a1f", wide: false })}
        addLabel="Add core skill"
      >
        {(p) => (
          <>
            <Row>
              <TextField path={[...p, "name"]} label="Name" />
              <TextField path={[...p, "detail"]} label="Badge" hint="e.g. ES6+" />
            </Row>
            <TextField path={[...p, "note"]} label="One-line description" />
            <IconPicker path={[...p, "icon"]} label="Logo" registry={brandIcons} allowNone />
            <ColorField path={[...p, "color"]} label="Glow colour" />
            <ToggleField path={[...p, "wide"]} label="Wide card" />
          </>
        )}
      </ItemList>
    </Group>
    <Group title="Additional skills">
      <ItemList path={["skills", "additional"]} noun="skill" title={(s) => s.name} create={() => ({ icon: "code", name: "" })} addLabel="Add skill" compact>
        {(p) => (
          <>
            <TextField path={[...p, "name"]} label="Name" />
            <IconPicker path={[...p, "icon"]} label="Icon" registry={lineIcons} />
          </>
        )}
      </ItemList>
    </Group>
    <Group title="Toolkit chips">
      <TextField path={["skills", "toolkitTitle"]} label="Card title" />
      <TagEditor path={["skills", "toolkit"]} label="Tools" placeholder="e.g. Vite, Figma (comma separated)" />
    </Group>
  </div>
);

/* ------------------------------------------------------------------ */
const PREVIEW_OPTIONS = [
  { value: "", label: "Generic (project name)" },
  { value: "tomato", label: "Food ordering UI" },
  { value: "reactwind", label: "Component library UI" },
];

const SelectField = ({ path, label, options }) => {
  const [value, set] = useField(path);
  return (
    <div>
      <Label>{label}</Label>
      <select value={value ?? ""} onChange={(e) => set(e.target.value)} className={inputBase}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
};

export const ProjectsPanel = () => (
  <div className="space-y-4">
    <Heading base={["projects"]} />
    <Group>
      <TextField path={["projects", "allReposLabel"]} label="“All repositories” button text" />
    </Group>
    <ItemList
      path={["projects", "items"]}
      noun="project"
      title={(p) => p.name}
      subtitle={(p) => p.kind}
      addPosition="start"
      addLabel="Add new project"
      create={() => ({
        name: "",
        kind: "",
        description: "",
        image: "",
        imageAlt: "",
        imagePosition: "",
        preview: "",
        tech: [],
        features: [],
        liveUrl: "",
        githubUrl: "",
        githubLabel: "",
        accent: "#7c5cff",
      })}
    >
      {(p) => (
        <>
          <Row>
            <TextField path={[...p, "name"]} label="Project name" />
            <TextField path={[...p, "kind"]} label="Type" hint="e.g. SaaS dashboard" />
          </Row>
          <TextField path={[...p, "description"]} label="Short description" multiline />
          <ImageField path={[...p, "image"]} label="Preview image" hint="screenshot" emptyText="No image — a drawn preview is shown" />
          <TextField path={[...p, "imageAlt"]} label="Image description (for screen readers)" />
          <SelectField path={[...p, "preview"]} label="Drawn preview (when no image)" options={PREVIEW_OPTIONS} />
          <StringList path={[...p, "features"]} label="Key features" addLabel="Add feature" multiline={false} />
          <TagEditor path={[...p, "tech"]} label="Technologies" placeholder="e.g. React, Node.js" />
          <TextField path={[...p, "liveUrl"]} label="Live demo URL" type="url" inputMode="url" placeholder="https://…" hint="leave empty to hide" />
          <TextField path={[...p, "githubUrl"]} label="GitHub URL" type="url" inputMode="url" placeholder="https://github.com/…" />
          <TextField path={[...p, "githubLabel"]} label="GitHub button text" placeholder="View Code" />
          <ColorField path={[...p, "accent"]} label="Accent colour" />
        </>
      )}
    </ItemList>
  </div>
);

/* ------------------------------------------------------------------ */
export const JourneyPanel = () => (
  <div className="space-y-4">
    <Group title="Work experience" description="Newest first. New jobs are added at the top — use the arrows to reorder.">
      <ItemList
        path={["journey", "experience"]}
        noun="job"
        title={(j) => (j.role ? `${j.role}${j.company ? ` · ${j.company}` : ""}` : "")}
        subtitle={periodOf}
        addPosition="start"
        addLabel="Add new job"
        create={() => ({
          start: "",
          end: "",
          current: true,
          role: "",
          company: "",
          location: "",
          summary: "",
          points: [""],
          projects: [],
          tech: [],
        })}
      >
        {(p, job) => (
          <>
            <TextField path={[...p, "role"]} label="Job title" />
            <Row>
              <TextField path={[...p, "company"]} label="Company" />
              <TextField path={[...p, "location"]} label="Location" />
            </Row>
            <ToggleField path={[...p, "current"]} label="I currently work here" description="Shows “Present” and the Current badge" />
            <Row>
              <TextField path={[...p, "start"]} label="Start" placeholder="Aug 2024" />
              {!job.current && <TextField path={[...p, "end"]} label="End" placeholder="Mar 2026" />}
            </Row>
            <TextField path={[...p, "summary"]} label="One-line summary" multiline />
            <StringList path={[...p, "points"]} label="Responsibilities & achievements" addLabel="Add bullet point" />
            <TagEditor path={[...p, "projects"]} label="Major projects" />
            <TagEditor path={[...p, "tech"]} label="Technologies" />
          </>
        )}
      </ItemList>
    </Group>
    <Heading base={["journey"]} lead />
    <Group title="Education milestones">
      <ItemList path={["journey", "milestones"]} noun="milestone" title={(m) => m.title} subtitle={(m) => m.year} create={() => ({ year: "", title: "" })} addLabel="Add milestone">
        {(p) => (
          <>
            <TextField path={[...p, "year"]} label="Years" placeholder="2024 — Present" />
            <TextField path={[...p, "title"]} label="Title" />
          </>
        )}
      </ItemList>
    </Group>
    <Group title="Certifications">
      <StringList path={["journey", "certifications"]} addLabel="Add certification" />
    </Group>
  </div>
);

/* ------------------------------------------------------------------ */
export const ContactPanel = () => (
  <div className="space-y-4">
    <Group title="Contact details">
      <TextField path={["contact", "email"]} label="Email" type="email" inputMode="email" />
      <TextField path={["contact", "phone"]} label="Phone (displayed)" type="tel" inputMode="tel" />
      <TextField path={["contact", "whatsappNumber"]} label="WhatsApp number" hint="digits with country code" inputMode="tel" />
      <TextField path={["contact", "whatsappMessage"]} label="WhatsApp starter message" multiline />
    </Group>
    <Group title="Social links">
      <ItemList
        path={["contact", "socials"]}
        noun="link"
        title={(s) => s.label}
        subtitle={(s) => s.handle}
        create={() => ({ icon: "website", label: "", handle: "", url: "" })}
        addLabel="Add social link"
      >
        {(p) => (
          <>
            <Row>
              <TextField path={[...p, "label"]} label="Name" />
              <TextField path={[...p, "handle"]} label="Handle" />
            </Row>
            <TextField path={[...p, "url"]} label="URL" type="url" inputMode="url" />
            <IconPicker path={[...p, "icon"]} label="Icon" registry={socialIcons} />
          </>
        )}
      </ItemList>
    </Group>
    <Group title="Contact section text">
      <TextField path={["contact", "eyebrow"]} label="Small label" />
      <TextField path={["contact", "titleStart"]} label="Headline start" />
      <Row>
        <TextField path={["contact", "titleAccent"]} label="Accent word" />
        <TextField path={["contact", "titleEnd"]} label="Headline end" />
      </Row>
      <TextField path={["contact", "lead"]} label="Text below headline" multiline />
      <TagEditor path={["contact", "topics"]} label="Form topics" />
    </Group>
    <Group title="Footer">
      <TextField path={["footer", "taglineStart"]} label="Tagline start" />
      <Row>
        <TextField path={["footer", "taglineAccent"]} label="Accent word" />
        <TextField path={["footer", "taglineEnd"]} label="Tagline end" />
      </Row>
      <TextField path={["footer", "availability"]} label="Availability text" />
      <TextField path={["footer", "wordmark"]} label="Big outlined wordmark" />
    </Group>
  </div>
);
