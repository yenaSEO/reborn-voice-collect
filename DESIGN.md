---
name: 너의 목소리를 들려줘
description: A festival stamp-tour card for lending your voice: four missions, four stamps, one angel list.
colors:
  paper: "#e6e9ff"
  card: "#ffffff"
  ink: "#2b3bd6"
  ink-deep: "#1c2690"
  ink-mid: "#6f79dc"
  ink-faint: "#a9b0ef"
  stamp: "#d6341f"
  stamp-deep: "#b92c1a"
  text: "#171a3a"
  text-soft: "#3d4378"
  text-hint: "#6b70a0"
typography:
  display:
    fontFamily: "'Black Han Sans', 'Pretendard Variable', sans-serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Black Han Sans', 'Pretendard Variable', sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.3
  title:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  script:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  full: "50%"
spacing:
  xs: "8px"
  sm: "10px"
  md: "16px"
  lg: "18px"
  xl: "22px"
components:
  button-stamp:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.card}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: "0 18px"
    height: "60px"
  button-stamp-hover:
    backgroundColor: "{colors.stamp-deep}"
  button-stamp-recording:
    backgroundColor: "{colors.ink-deep}"
  button-stamp-disabled:
    backgroundColor: "{colors.ink-faint}"
  button-record:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.card}"
    rounded: "{rounded.lg}"
    height: "72px"
  button-ink:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 18px"
    height: "60px"
  button-ink-hover:
    backgroundColor: "{colors.paper}"
  button-example:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "44px"
  input-text:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "56px"
  choice-chip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "48px"
  paper-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "16px"
  stamp-slot:
    textColor: "{colors.ink-mid}"
    rounded: "{rounded.full}"
  stamp-slot-stamped:
    textColor: "{colors.stamp}"
    rounded: "{rounded.full}"
  angel-tag:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink-deep}"
    rounded: "{rounded.md}"
    padding: "6px 14px"
  angel-tag-me:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.card}"
---

# Design System: 너의 목소리를 들려줘

## Overview

**Creative North Star: "The Stamp Tour Card"**

A festival stamp-tour card, not a survey form. The page is lilac card paper; ultramarine ink draws everything structural (dashed empty slots, rules, checkboxes, the time bar); vermilion rubber-stamp ink is reserved for the one live action on each screen and for the stamps themselves. Each recording is a mission, and finishing it presses a stamp into the card.

It is a single-column phone page (max 480px), one screen visible at a time, with the primary action docked in the thumb zone. Density is low: big type, big targets, white paper cards floating on lilac. Only one thing moves: the stamp press. Everything else is still.

The system rejects the grey progress-bar + blue-button wizard look. Progress is shown as stamps, not a percentage.

**Key Characteristics:**
- Lilac paper ground, white paper cards, two inks (ultramarine structure, vermilion action/stamp).
- Black Han Sans for stamps and headings; Pretendard for everything read.
- Exactly one vermilion primary button per screen, full-width, in a sticky bottom dock.
- Round stamp slots, each tilted a little differently as if pressed by hand.
- One motion: stamp press with a brief ink blur. Nothing else animates.

## Colors

Two inks on lilac paper: cool ultramarine for structure, hot vermilion for action and reward.

### Primary
- **Vermilion Stamp Ink** (`stamp`): the single primary button per screen, stamped slots, the big "미션 성공" stamp, the stretched-word bar and emphasized word in the script, the user's own name on the angel list, text selection, and the KakaoTalk warning border.
- **Pressed Vermilion** (`stamp-deep`): hover state of the stamp button on pointer devices only.

### Secondary
- **Ultramarine Ink** (`ink`): structure. Current-slot ring, secondary (outline) buttons, checkbox/radio strokes and fills, focus outline, input focus border, time bar, list markers, link-style summary, display headings.
- **Deep Ultramarine** (`ink-deep`): bold emphasis inside reading text, status messages, angel names, and the record button while recording.
- **Mid Ultramarine** (`ink-mid`): numbers in empty stamp slots.
- **Faint Ultramarine** (`ink-faint`): dashed empty-slot borders, resting input borders, disabled primary button fill.

### Neutral
- **Lilac Card Paper** (`paper`): page ground, `theme-color`, dock fade, hover fill for ink buttons, inner ring of the big stamp.
- **White Paper** (`card`): every content card, inputs, chips, and text on vermilion.
- **Night Ink Text** (`text`): body text.
- **Soft Ink Text** (`text-soft`): lead, small print, explainer body, time readout.
- **Hint Text** (`text-hint`): input placeholder only.

### Named Rules
**The One Red Button Rule.** Each screen has exactly one vermilion button, and it is the next step. Secondary actions are ultramarine outline buttons.

**The Two Inks Rule.** Structure is ultramarine, reward and action are vermilion. Never use vermilion for a border, rule, or label that is merely structural (the KakaoTalk warning is the sole exception: it is an alert).

## Typography

**Display Font:** Black Han Sans (with Pretendard Variable, sans-serif)
**Body Font:** Pretendard Variable (with Pretendard, -apple-system, Apple SD Gothic Neo, sans-serif)

**Character:** Black Han Sans is the rubber stamp: heavy, blocky, festival-poster. Pretendard is the quiet reading voice. `word-break: keep-all` keeps Korean words whole.

### Hierarchy
- **Display** (Black Han Sans, 48px, 1.1, -0.02em, ultramarine): the intro headline only.
- **Headline** (Black Han Sans, 22px): primary button labels and the angel-list heading. Stamp labels use the same face at 18px ("성공") and 44px (big stamp).
- **Title** (Pretendard 800, 24px, 1.4, balanced wrap): screen headings and mission guide.
- **Script** (Pretendard 700, 26px, 1.45): the sentence to read aloud; the target word is 900 weight in vermilion.
- **Lead** (Pretendard 400, 18px, `text-soft`): one supporting sentence under a heading.
- **Body** (Pretendard 400, 17px, 1.6): base text. Outline buttons are 17px/800.
- **Label** (Pretendard 400, 14px, `text-soft`): hints, consent detail, footnotes. Mission "why" line is 15px.

### Named Rules
**The Stamp Face Rule.** Black Han Sans is for things that feel stamped or shouted: display, primary button labels, stamps, slot numbers. Never set paragraphs or form labels in it.

## Layout

Single centered column, `max-width: 480px`, side padding 16px, top padding 20px. Each screen is a `section` at `min-height: 100dvh`, a vertical flex stack with an 18px gap. Only one screen is visible at a time; switching scrolls to top.

The **dock** is sticky at the bottom (`margin-top: auto`), padded `22px 0 calc(18px + safe-area-inset-bottom)`, with a gradient fade from transparent to paper at 40% so content scrolls under it. Inside it, buttons stack with a 12px gap; paired buttons use a `1fr 1.4fr` grid (secondary left, primary right) with a 10px gap.

Spacing rhythm is small and even: 8 / 10 / 16 / 18 / 22px. Tap targets are at least 44px (example button), 48px (chips, audio), 56px (input), 60px (buttons), 72px (record).

## Elevation & Depth

Mostly flat, depth by tone: white cards sit on lilac paper with no border. The stamp card is the only lifted surface.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 6px 18px -10px rgb(28 38 144 / 0.45)`): the stamp card only, a soft ultramarine-tinted shadow so it reads as a physical card.
- **Stamp double ring** (`box-shadow: inset 0 0 0 3px #fff, inset 0 0 0 5px var(--stamp)`): not elevation; draws the inner ring of a rubber stamp. The big stamp uses 6px paper + 9px stamp.

### Named Rules
**The One Card Rule.** Only the stamp card casts a shadow. Other white panels are flat.

## Shapes

Soft rectangles and circles. Cards and primary/secondary buttons use 16px corners; chips, inputs, the example button, angel tags, and the illustration use 12px; checkboxes use 6px (the focus outline too); the time bar uses 8px. Stamp slots, radios, and the big stamp are full circles. Empty slots are dashed 2px faint-ink circles; borders elsewhere are solid 2px (3px for current/stamped slots, 5px for the big stamp).

## Components

### Buttons
- **Shape:** gently rounded (16px), min-height 60px, centered content with a 10px icon gap.
- **Primary (stamp):** vermilion fill, white Black Han Sans 22px label, no border. Hover (pointer devices only) darkens to `stamp-deep`. Disabled turns `ink-faint` with no press.
- **Record:** the primary button at 72px with a 26px stroked mic icon; turns `ink-deep` while recording.
- **Secondary (ink):** white fill, 2px ultramarine border, ultramarine 17px/800 label. Hover fills with paper.
- **Example (tertiary):** white, borderless, 12px radius, 44px, ultramarine 700 label with an 18px play icon; aligned left, not full width.
- **Press:** all dock buttons scale to 0.97 on `:active` (120ms ease-out). Focus is a 3px ultramarine outline, 3px offset.

### Chips (choice)
- **Style:** white pill-ish label (12px radius, 48px tall, 16px side padding) with a transparent 2px border and a 20px custom radio.
- **State:** selected gets an ultramarine border, deep-ink 700 text, and a radio filled ultramarine with a white inner ring.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** white on paper.
- **Shadow Strategy:** flat, except the stamp card (see Elevation).
- **Border:** none, except the KakaoTalk alert (2px vermilion).
- **Internal Padding:** 16px; the script card is 22px 20px.

### Inputs / Fields
- **Style:** 56px tall, white, 2px `ink-faint` border, 12px radius, 16px side padding, weight 500. Label above in 700, 6px gap.
- **Focus:** border shifts to ultramarine; no glow.
- **Checkbox:** 24px, 6px radius, 2px ultramarine stroke; checked fills ultramarine with a white check SVG.

### Navigation
None. The flow is linear; the dock button is the navigation.

### Stamp Card (signature)
A white card with a 4-column grid of round slots (10px gap, 16px padding). Empty slot: dashed faint-ink circle with the number in Black Han Sans 22px `ink-mid`. Current slot: solid 3px ultramarine ring, number in ultramarine. Stamped slot: 3px vermilion ring plus inner ring, "성공" in Black Han Sans 18px vermilion, rotated by `--tilt` (-12°, -7°, -11°, -6° per slot). Ghost slot (intro preview): the stamped look at 22% opacity.

**Stamp press motion:** `stamp` keyframes over 420ms `cubic-bezier(0.2, 0.9, 0.3, 1)`: from scale 2.4, tilt −18° extra, opacity 0, blur 3px → scale 0.88 at 55% with blur 0.8px → rest at scale 1, blur 0. A full card stamps in sequence with a 160ms stagger. The big stamp (190px, "미션 성공" at 44px) uses the same keyframes at 520ms. Under `prefers-reduced-motion: reduce` the animation is removed and the stamp simply appears.

### Script Card
White card, 26px/700 sentence. The target word is `em` in vermilion 900; a stretched sound is shown by a vermilion rounded bar (2.4em × 0.18em) inline after the letter.

### Time Bar
14px tall, 2px ultramarine border, 8px radius, white track, solid ultramarine fill; full length = target seconds. The readout below is 15px `text-soft` with tabular numbers.

### Angel List
Wrapping row of tags (8px gap): white, 12px radius, 6px 14px padding, deep-ink 700 names. The current user's tag is vermilion with white text.

### Disclosure (about)
Ultramarine 700 underlined summary (4px offset) with a CSS chevron that flips when open; body is a white card in 16px `text-soft`.

## Do's and Don'ts

### Do:
- **Do** keep exactly one vermilion `stamp` button per screen, full width, in the sticky bottom dock.
- **Do** draw structure (borders, rings, checks, bars, focus) in ultramarine `ink`.
- **Do** show progress as stamp slots, tilted per slot via `--tilt`.
- **Do** reserve motion for the stamp press (420ms, ease-out overshoot, brief blur) and the 0.97 button press; honor `prefers-reduced-motion`.
- **Do** keep tap targets at 44px or more and primary actions at 60px or more.
- **Do** gate hover color changes behind `@media (hover: hover)`.

### Don't:
- **Don't** use a grey progress bar or percentage to show mission progress.
- **Don't** set body text, labels, or form text in Black Han Sans.
- **Don't** put shadows on panels other than the stamp card.
- **Don't** use vermilion for purely structural lines or secondary buttons.
- **Don't** animate screen transitions, cards, or text; only stamps move.


## Done screen (2026-10-18 update)

The big "미션 성공" stamp is a faint background watermark (opacity 0.14, 220px, -12deg) in the top-right corner, partly cropped, so a long list never covers it; it presses in once (`soft-stamp`, 600ms) and stays visible, also under reduced motion (static). Order: "○○님, 감사합니다!" → "덕분에 졸업할 수 있을 것 같아요" → "복 받을 명단" (32px display) → name tags (17px). Dock: share note, one vermilion "친구에게 공유하기", and a small underlined text button for one more attempt. Blank nicknames get a random celebrity name by gender (or 천사님); repeats get B, C….

Type note: the done-screen seal uses **Noto Serif KR 900**, loaded as a one-glyph subset (`text=福`) and used only for that 福 inside the same double ring. The nickname screen carries a faint "미션 성공" background stamp below the input (hidden when the viewport is under 740px tall).
