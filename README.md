# Yash Kumar Jha — Portfolio

Personal portfolio of Yash Kumar Jha, Frontend Engineer (Delhi/NCR).

## Stack

- **React 19 + Vite 7**
- **Tailwind CSS 3**: design tokens live in `tailwind.config.js`, with shared component classes in `src/index.css`
- **Framer Motion**: reveals, tilt, magnetic buttons, loader, timeline progress
- **Lenis**: smooth scrolling (turned off when the visitor prefers reduced motion)

## Editing content (works from your phone)

The site has a built-in editor, so you never need to touch code.

1. Open your live site with `#edit` at the end of the address, e.g. `https://your-site.com/#edit`.
   This device stays in edit mode until you choose **Leave edit mode**.
2. Tap **Edit** (bottom-left). Pick a section: work experience, projects, skills, hero, about or contact.
3. Make your changes. The page updates as you type, and everything auto-saves on that device,
   so closing the browser or refreshing loses nothing.
   - Add, edit, delete, duplicate and reorder (↑ ↓) jobs, projects, skills and bullet points
   - Tap a tag to move it or remove it
   - Upload screenshots or your resume straight from your phone
   - Undo and redo are in the editor header
4. Tap **Publish changes**. This makes one commit to GitHub (content plus any uploaded files).
   If the site is hosted from this repo (Vercel, Netlify or Cloudflare Pages), it redeploys automatically.

**One-time setup for publishing:** create a fine-grained GitHub token at
github.com/settings/personal-access-tokens/new. Limit it to the `YashProtfolio` repo and grant
**Contents: Read and write**. Paste it under *Publish → GitHub connection*. The token is stored only
on that device. Use **Test connection** to check it works.

**Backup:** *Publish → Backup → Download* saves all content as a JSON file; *Restore* loads it back.

Visitors never see the editor, and its code isn't downloaded unless the device is in edit mode.
Opening `#edit` on someone else's device only edits a local copy there: nothing can go live without your token.

## Structure

```
src/
  data/content.json      ← all content, written by the editor's Publish button
  data/registry.js       ← maps content keys to bundled files and icons
  cms/                   ← editor: content context, autosave, GitHub publishing, editor UI
  component/             ← page sections (Hero, About, Skills, Projects, Experience, Contact, Footer)
  component/ui/          ← reusable primitives (MagneticButton, TiltCard, Reveal, CustomCursor, Loader…)
  hooks/                 ← useMediaQuery, useScrollTo
  lib/                   ← small helpers (cn, spotlight, motion easing)
public/uploads/          ← images and files uploaded through the editor
```

A project's **Live Demo** button only appears when it has a live URL.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the build
npm run lint     # run ESLint
```
