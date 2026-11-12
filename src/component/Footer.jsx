import { ArrowUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import logo from "../assets/logo.webp";
import { useContent } from "../cms/context";
import { getIcon, resolveAsset, socialIcons } from "../data/registry";
import { navLinks, whatsappUrl } from "../data/selectors";
import { useScrollTo } from "../hooks/useScrollTo";

const Footer = () => {
  const { profile, contact, footer } = useContent();
  const resume = resolveAsset(profile.resume);
  const scrollTo = useScrollTo();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] pt-20">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img src={logo} alt="" width="56" height="56" loading="lazy" className="h-14 w-14" />
            <p className="mt-6 max-w-sm text-2xl font-light leading-snug text-paper/90">
              {footer.taglineStart} <span className="font-serif italic text-ember-soft">{footer.taglineAccent}</span> {footer.taglineEnd}
            </p>
            {profile.available && footer.availability && (
              <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-2 text-sm text-paper/80">
                <span className="h-2 w-2 rounded-full bg-[#34d399]" aria-hidden="true" />
                {footer.availability}
              </div>
            )}
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow mb-5">Navigate</p>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => scrollTo(l.id, e)} className="text-paper/70 transition-colors hover:text-ember">
                    {l.label}
                  </a>
                </li>
              ))}
              {resume && (
                <li>
                  <a href={resume} target="_blank" rel="noopener noreferrer" className="text-paper/70 transition-colors hover:text-ember">
                    Resume
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-5">Connect</p>
            <ul className="space-y-3">
              {contact.socials.filter((s) => s.url).map((s, i) => {
                const Icon = getIcon(socialIcons, s.icon);
                return (
                  <li key={s.id ?? i}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-paper/70 transition-colors hover:text-paper">
                      <Icon className="h-4 w-4 transition-colors group-hover:text-ember" aria-hidden="true" /> {s.label}
                    </a>
                  </li>
                );
              })}
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="break-all text-paper/70 transition-colors hover:text-paper">
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/[0.06] py-8 text-sm text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {profile.fullName}. Designed & built with React, Tailwind CSS & Framer Motion.</p>
          <a
            href="#top"
            onClick={(e) => scrollTo("top", e)}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-paper/80 transition-colors hover:border-ember hover:text-ember"
          >
            Back to top <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Oversized outlined wordmark */}
      <p aria-hidden="true" className="text-outline pointer-events-none select-none whitespace-nowrap text-center text-[23vw] font-semibold leading-[0.75] tracking-tightest">
        {footer.wordmark}
      </p>

      {/* Floating WhatsApp shortcut (kept from previous version) */}
      {contact.whatsappNumber && (
        <a
          href={whatsappUrl(contact)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="dock-aware-right fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_10px_40px_-8px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-110 sm:bottom-8 sm:right-8"
        >
          <FaWhatsapp className="h-7 w-7" aria-hidden="true" />
        </a>
      )}
    </footer>
  );
};

export default Footer;
