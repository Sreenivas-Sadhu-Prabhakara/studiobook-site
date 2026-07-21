# StudioBook — explainer site

A standalone marketing/explainer page for **StudioBook**, the booking and
delivery tracker for Indian wedding & event photographers and videographers.

> **Every shoot, paid and delivered.** — pricing on discovery, subscription basis

This is *not* the product UI. It is a polished, self-contained landing page that
makes the idea instantly clear to a non-technical studio owner and to an investor
skimming for 30 seconds.

## What the product does

A shoot isn't one payment on one day — it's a timeline of advance, shoot-day and
album balance, each with its own deadline, tracked today in a chat thread and
your head. StudioBook turns that timeline into the app:

- **Shoot bookings** — client, event type, shoot date, venue and package amount.
- **Payment milestones** — booking advance, shoot-day, album balance, each with a
  due date and paid amount.
- **Record payments** — mark a milestone paid by UPI or cash; the balance updates.
- **Deliverable deadlines** — edited photos, album and reels, each with a deadline.
- **Overdue album flag** — an album past its deadline turns red on the dashboard.
- **WhatsApp reminders** — pending balances and album deadlines drafted to your outbox.
- **Dashboard** — upcoming shoots, total pending balance, deliverables due, overdue albums.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup — all sections, inline SVG only. |
| `styles.css` | All styling. Palette built around the rose accent `#e11d48`. |
| `app.js` | Sticky-nav highlight, smooth scroll, and the animated hero "booking card" whose album-delivery milestone closes itself. No dependencies. |
| `favicon.svg` | Camera / studio-book mark. |
| `og.svg` / `og.png` | 1200×630 social preview card. |

## Design notes

- Palette: rose accent `#e11d48`, deep plum-black ink, warm off-white studio
  paper, a soft rose tint, and an amber-brown warning colour for overdue/balance.
- **Signature:** money and dates are set in tabular monospace, so a booking reads
  like a studio ledger card. The hero widget is a live booking whose album balance
  visibly moves balance-due → reminder → paid & delivered.
- Fully self-contained: no CDNs, no external fonts, images or scripts. System
  font stack only. Renders correctly opened as a local `file://` and deploys to
  any static host unchanged.
- Responsive down to mobile with no horizontal page scroll; the wide dashboard
  table scrolls inside its own container.
- Respects `prefers-reduced-motion` (the hero animation freezes on its end-state).

## Run it

Just open `index.html` in a browser. No build step. To serve locally:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Pushed to GitHub Pages via the workflow in `.github/workflows/deploy-pages.yml`.
Otherwise upload the folder to any static host (Netlify, Cloudflare Pages, S3).
No configuration required.

---

A **KARYA** studio build · sreeni.nintendo@gmail.com
