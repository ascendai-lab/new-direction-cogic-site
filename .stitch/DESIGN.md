New Direction C.O.G.I.C is a contemporary church with Church of God in Christ roots. The identity is called **Forward Path**: an angular N framing a road that rises toward an inset cross. Build every surface so it says the same thing the mark says — movement, welcome, steady ground.

## How to use this system

Set body copy in `body` and `ink-body` on `surface`. Set headings in the `Display` and `Headings` groups in `ink`. Use `brand-blue` for anything a person clicks and `brand-sky` only on dark grounds. Keep the page white: alternate `surface` with `surface-sunken` or `surface-tint`, and use `brand-navy` for full-width bands, never for a whole page.

## Content fundamentals

**Voice.** Warm, plain, present tense. Speak to one person as "you" and about the church as "we". Short sentences. No church jargon a first-time visitor would have to translate.

**Write like this:** "Online Bible Study, every Wednesday at 7:00 PM." "You are welcome exactly as you are." "Our goal is spiritual service and development, for each person and for the whole community."

**Not like this:** "We cordially invite you to join us in fellowship." "Come experience the anointing." Anything with an exclamation point in a heading.

**COGIC roots stay in the footer and the About page, not the headline.** The church is Church of God in Christ and does not hide it, but the front door speaks to a neighbor deciding where to spend Sunday morning, not to a denomination.

**Casing.** Sentence case for headings, buttons and navigation. The site uses no eyebrow labels above headings (removed 2026-11-12), so nothing is set in all caps.

**Times and dates.** "Wednesdays at 7:00 PM." "Sunday, September 16." Spell the day out; use a colon and AM/PM in caps.

**Scripture and creed.** Set the Affirmation of Faith statements in `creed`, in `ink`, on `surface-tint`, one statement per line with no bullet. Cite a verse as "John 3:16" on its own line in `caption` and `ink-muted`.

**No emoji anywhere.** Not in headings, buttons, social captions or email subject lines.

## Visual foundations

**Color.** Three brand colors, in this order of weight: `brand-navy` carries the identity, `brand-blue` carries action, `brand-sky` is the accent. On white, `brand-sky` reads only 2.7:1, so it is a shape color, not a text or border color — put it on `brand-navy` or `navy-deep`, where it reads 4.7:1 and 5.6:1. Text pairs that must hold: `ink` and `ink-body` on `surface`, `surface-sunken` and `surface-tint`; `ink-inverse` on `brand-navy`, `navy-deep` and `action`; `ink-inverse-muted` on `brand-navy` and `navy-deep` only. Give every focus state `focus-ring` on light grounds and `focus-ring-inverse` on dark ones, solid, 2px, offset 2px.

**Type.** One family, Google Sans Flex, loaded from Google Fonts across weights 300–800. Set hero headlines in `display-xl`, page titles in `display-lg`, section headings in `display-md`. Never run more than three type styles in one block. Keep body measure at 68 characters or fewer.

**Spacing.** A 4px base. Sections get `space-8` of padding top and bottom on desktop, `space-6` on phones. Cards get `space-5` of padding and `space-5` between them. A heading block sits `space-6` above its content.

**Radius.** Cards and media use `radius-lg`, buttons `radius-md`, inputs and tags `radius-sm`, badges and date chips `radius-pill`. Nothing is fully square except full-bleed bands.

**Borders and shadows.** The brand leans on borders and color bands. Use `border` for decorative hairlines and `border-strong` for any edge a person needs to see, such as an input or an outline button. Shadows stay navy-tinted and rare: `shadow-sm` at rest, `shadow-md` on hover, `shadow-lg` for dialogs only.

**The sky rule.** The thin `rule-sky` lines either side of the COGIC line in the logo are the one repeating graphic device. Use them to flank a small centered label, at 1px, 40–80px long. Do not stretch one across a section as a divider.

**Imagery.** Real photographs of the congregation, in natural light, faces visible. Crop wide. When text sits over a photo, lay `navy-deep` at 62% over it and set the text in `ink-inverse`. No stock photos of hands in silhouette, no lens flares, no darkened stage shots that hide who is there.

**Motion.** 150ms on hover and focus, 250ms on anything entering the page, ease-out. Nothing that moves on its own, no carousels that auto-advance.

**States.** Every interactive element needs rest, hover, focus and disabled. Disabled is `ink-muted` on `surface-sunken` with `border`. Success is `success` and error is `danger`, each always carrying a word, never color alone.

## Iconography

The brand ships no icon set. Use [Lucide](https://lucide.dev) at 24px, 1.75px stroke, in `ink-body` on light grounds and `ink-inverse-muted` on dark. This is a substitution, not a brand asset: replace it if the church adopts an icon library of its own.

## The logo

Three files live in the **Logos** asset group: the stacked lockup, the horizontal lockup and the mark on its own. They are PNGs on transparent grounds, drawn for light backgrounds. Read `assets/Logos/README.md` before placing one. There is no vector master and no reversed (white) version yet; both are worth commissioning.

## Approved site additions

The approved live site added two warm colors that every new page keeps: `warm-gold` #D4A64A for giving buttons and italic accents on dark bands, and `warm-cream` #FFF7E8 for the hero and the Affirmation of Faith. It also uses Instrument Serif italic for emphasized words in headings. `src/styles/global.css` is the working source for all of these values.
