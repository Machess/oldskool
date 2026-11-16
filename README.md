# Oldschool

Website for Oldschool, a studio making educational games and stories for children aged 6 to 12.

Plain HTML, CSS and JavaScript. No build step: host the files as they are.

- `index.html` – the main page
- `privacy.html` – the privacy page
- `style.css` – the look (colours and fonts are variables at the top)
- `script.js` – phone menu, contact form, the sample question
- `fonts/` – licence files for the three fonts. The fonts themselves are built into the bottom of `style.css`, so they load wherever the stylesheet does

The site sets no cookies and loads nothing from other companies.

## Before going live

- **Contact form:** create a form at a form-forwarding service, have it deliver to your inbox, and paste its URL into `CONTACT_ENDPOINT` at the top of `script.js`. Your address is never shown on the site.
- **Privacy page:** fill in the parts in square brackets in `privacy.html` (legal name, country, hosting provider, form service, what the games store) and have it checked.
- **Key art:** swap the `[Studio key art]` box in the hero of `index.html` for an image.
