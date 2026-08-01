# UniEvent Hub — University Event Management Web Application

ICT 1209 – Web Technologies | Phase 2 – Frontend Layout & Design
Rajarata University of Sri Lanka | Department of ICT

## Project Theme

UniEvent Hub is a centralized platform for managing university events — workshops,
seminars, sports meets, cultural nights and club activities. Instead of announcements
scattered across social media, notice boards and messaging groups, students discover,
register for, and get a digital QR ticket to every event in one place. Organizers get
a dashboard to manage registrations, attendance and feedback.

The visual design leans on the product's own subject matter: events run on tickets,
so every event card is styled as a **ticket stub** — a torn perforated edge, a ticket
number in monospace type, and a QR-style corner mark — rather than a generic content card.

- Colour palette: deep navy `#0E1930` / `#16233F`, cool paper `#F3F4F8`, achievement
  gold `#E3A73E`, campus-green `#3B7A57`, and an urgent coral `#E2574C` used sparingly.
- Typography: Space Grotesk for headings and ticket numbers, Inter for body copy,
  JetBrains Mono for dates, codes and data — reinforcing the "ticket counterfoil" feel.

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero, upcoming events, spotlight slider, features, organizer CTA |
| Events | `events.html` | Full listing with live search + category filter chips |
| Event Details | `event-details.html` | Single event view, hydrated dynamically via `?id=` |
| Student Dashboard | `dashboard.html` | Registered events, tickets, notifications |
| Contact | `contact.html` | Validated contact form + location |

Navigation bar and footer are present on every page.

## Tech Stack

- HTML5 — semantic, multi-page structure
- CSS3 — custom design tokens in `css/style.css` (no framework overrides beyond Bootstrap grid/utilities)
- Bootstrap 5.3 — navbar, cards, modal, progress bars, breadcrumbs, responsive grid
- Vanilla JavaScript — see `js/script.js` and `js/data.js`

## JavaScript Features Implemented

1. Dynamic Content Updates — live search + category filtering on `events.html`,
   re-rendering the event grid from a shared dataset (`js/data.js`).
2. Interactive Slider — custom "Spotlight" slider on the home page with
   autoplay, progress bar, dot navigation and prev/next controls (built without a plugin).
3. Form Validation — real-time validation on the contact form (name, email regex,
   subject, message length) with inline error/success states.
4. Smooth Scrolling — in-page navigation (e.g. Home → About) scrolls smoothly with
   fixed-navbar offset correction.
5. Event Handling — hover tooltips (`data-hint`), click-to-register flow with a
   Bootstrap modal and a custom toast confirmation.
6. Custom Animations — scroll-triggered reveal animations via `IntersectionObserver`
   on cards, tiles and panels.

## Project Structure

```
unievent-hub/
├── index.html
├── events.html
├── event-details.html
├── dashboard.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── data.js        # shared event dataset
│   └── script.js       # all interactive behaviour
└── README.md
```

## Running Locally

No build step required — it's a static site.

1. Clone the repository.
2. Open `index.html` in a browser, or serve the folder locally:
   ```bash
   npx serve .
   # or
   python3 -m http.server 5500
   ```
3. Visit `http://localhost:5500`.

## Wireframe → Build

Built from the Phase 1 wireframes (Home, Events, Event Details, Student Dashboard,
Contact) with the additional Bootstrap components, responsive breakpoints and JS
interactivity required for Phase 2.

## Credits

- Bootstrap 5.3 / Bootstrap Icons 1.11 (CDN)
- Google Fonts: Space Grotesk, Inter, JetBrains Mono
- Built as a mini project for ICT1209 – Web Technologies, 2024 Batch
