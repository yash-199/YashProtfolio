import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useContent } from "../cms/context";
import { getIcon, socialIcons } from "../data/registry";
import { whatsappUrl } from "../data/selectors";
import { Reveal, RevealText } from "./ui/Reveal";
import MagneticButton from "./ui/MagneticButton";
import { trackSpotlight } from "@/lib/spotlight";
import { cn } from "@/lib/utils";

const buildChannels = (contact) => [
  ...contact.socials
    .filter((s) => s.url)
    .map((s) => ({ id: s.id, label: s.label, value: s.handle || s.url, href: s.url, Icon: getIcon(socialIcons, s.icon) })),
  ...(contact.whatsappNumber
    ? [{ id: "whatsapp", label: "WhatsApp", value: contact.phone || contact.whatsappNumber, href: whatsappUrl(contact), Icon: FaWhatsapp }]
    : []),
];

/* ------------------------------------------------------------------ */
/* Email card with copy-to-clipboard                                   */
/* ------------------------------------------------------------------ */
const EmailCard = ({ contact }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <div onPointerMove={trackSpotlight} className="spotlight glass group rounded-3xl p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="eyebrow"><Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[0.7rem] text-muted transition-colors hover:border-ember/50 hover:text-paper"
          aria-label={copied ? "Email copied" : "Copy email address"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "ok" : "copy"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#34d399]" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <a
        href={`mailto:${contact.email}`}
        className="mt-5 flex items-center justify-between gap-3 break-all text-xl font-medium tracking-tight transition-colors hover:text-ember sm:text-2xl"
      >
        {contact.email}
        <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:rotate-45" aria-hidden="true" />
      </a>
      <span className="sr-only" role="status" aria-live="polite">{copied ? "Email address copied to clipboard" : ""}</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Contact form — composes an email (no backend required)              */
/* ------------------------------------------------------------------ */
const Field = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-2 block font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
      {label}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-ember-soft">{error}</p>
    )}
  </div>
);

const inputClass = (hasError) =>
  cn(
    "w-full rounded-xl border bg-ink/60 px-4 py-3.5 text-paper placeholder:text-muted/50 outline-none transition-[border-color,box-shadow] duration-300 focus:border-ember/70 focus:shadow-[0_0_0_4px_rgba(255,90,31,0.12)]",
    hasError ? "border-ember-soft/70" : "border-white/10"
  );

const validate = ({ name, email, message }) => {
  const errors = {};
  if (!name.trim()) errors.name = "Please tell me your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
  if (message.trim().length < 10) errors.message = "A few more words would help (10+ characters).";
  return errors;
};

const ContactForm = ({ contact }) => {
  const topics = contact.topics;
  const [values, setValues] = useState({ name: "", email: "", topic: topics[0] ?? "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const compose = () => {
    const subject = `${values.topic ? `${values.topic} — ` : ""}from ${values.name}`;
    const body = `${values.message}\n\n— ${values.name}\n${values.email}`;
    return { subject, body };
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    const { subject, body } = compose();
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const sendWhatsApp = () => {
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    const { subject, body } = compose();
    window.open(whatsappUrl(contact, `${subject}\n\n${body}`), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <form noValidate onSubmit={onSubmit} className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-9" aria-labelledby="form-title">
      <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-ember/20 blur-3xl" />
      <h3 id="form-title" className="relative text-2xl font-medium tracking-tight">Send a message</h3>
      <p className="relative mt-1 text-sm text-muted">It opens your email app with everything pre-filled.</p>

      <div className="relative mt-8 grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label="Name" error={errors.name}>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            placeholder="Jane Doe"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClass(errors.name)}
          />
        </Field>
        <Field id="contact-email" label="Email" error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            placeholder="jane@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClass(errors.email)}
          />
        </Field>
      </div>

      {topics.length > 0 && <fieldset className="relative mt-5">
        <legend className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">I&apos;m reaching out about</legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((t, i) => (
            <label key={`${t}-${i}`} className="cursor-pointer">
              <input type="radio" name="topic" value={t} checked={values.topic === t} onChange={set("topic")} className="peer sr-only" />
              <span className="inline-block rounded-full border border-white/10 px-4 py-2 text-sm text-paper/70 transition-all duration-300 hover:border-white/25 peer-checked:border-ember peer-checked:bg-ember peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ember-soft">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>}

      <div className="relative mt-5">
        <Field id="contact-message" label="Message" error={errors.message}>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={set("message")}
            placeholder="Tell me about the role, the project or the idea…"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={cn(inputClass(errors.message), "resize-none")}
            data-lenis-prevent
          />
        </Field>
      </div>

      <div className="relative mt-7 flex flex-wrap items-center gap-3">
        <MagneticButton type="submit" variant="ember" strength={0.25}>
          Send Message <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </MagneticButton>
        {contact.whatsappNumber && (
          <MagneticButton type="button" variant="ghost" strength={0.25} onClick={sendWhatsApp}>
            <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> Send via WhatsApp
          </MagneticButton>
        )}
      </div>

      <p role="status" aria-live="polite" className={cn("relative mt-4 text-sm transition-opacity", sent ? "text-[#34d399] opacity-100" : "opacity-0")}>
        {sent ? "Thanks! Your message is drafted and ready — just hit send." : ""}
      </p>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
const Contact = () => {
  const { contact } = useContent();
  const channels = buildChannels(contact);
  return (
  <section id="contact" aria-labelledby="contact-title" className="section-pad relative isolate overflow-hidden">
    {/* Animated background */}
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000,transparent)]" />
      <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 animate-aurora rounded-full bg-ember/[0.16] blur-[140px]" />
      <div className="absolute -right-40 bottom-0 h-[30rem] w-[30rem] animate-aurora-slow rounded-full bg-iris/[0.16] blur-[140px]" />
    </div>

    <div className="container-x">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal className="eyebrow mb-8 justify-center">
          <span className="text-ember">05</span>
          <span className="h-px w-8 bg-white/20" aria-hidden="true" />
          {contact.eyebrow}
        </Reveal>
        <h2 id="contact-title" className="break-words text-[clamp(2.75rem,8vw,7.5rem)] font-medium leading-[0.95] tracking-tightest">
          {contact.titleStart && <RevealText text={contact.titleStart} />}{" "}
          {contact.titleAccent && <RevealText text={contact.titleAccent} delay={0.12} className="font-serif font-normal italic tracking-normal text-gradient" />}{" "}
          {contact.titleEnd && <RevealText text={contact.titleEnd} delay={0.2} />}
        </h2>
        {contact.lead && (
          <Reveal delay={0.3}>
            <p className="mx-auto mt-8 max-w-xl text-lg text-muted sm:text-xl">{contact.lead}</p>
          </Reveal>
        )}
      </div>

      <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div className="flex flex-col gap-4">
          {contact.email && <Reveal><EmailCard contact={contact} /></Reveal>}
          {channels.map(({ id, label, value, href, Icon }, i) => (
            <Reveal key={id} delay={0.06 * (i + 1)}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="label"
                data-cursor-label="Open"
                className="group flex items-center gap-5 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05] sm:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] text-paper transition-all duration-500 group-hover:scale-110 group-hover:bg-paper group-hover:text-ink">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">{label}</span>
                  <span className="mt-0.5 block truncate text-lg text-paper">{value}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-ember" aria-hidden="true" />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <ContactForm contact={contact} />
        </Reveal>
      </div>
    </div>
  </section>
  );
};

export default Contact;
