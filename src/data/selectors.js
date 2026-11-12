// Small derived values used by several sections.

export const periodOf = (job) => `${job.start || "—"} — ${job.current ? "Present" : job.end || "—"}`;

export const whatsappUrl = (contact, text = contact.whatsappMessage) =>
  `https://wa.me/${String(contact.whatsappNumber).replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const findSocial = (contact, id) => contact.socials.find((s) => s.id === id || s.icon === id);

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];
