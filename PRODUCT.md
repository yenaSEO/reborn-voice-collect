# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS/JS (no build), hosted on GitHub Pages; Supabase for storage and the public angel list.

## Users

Friends and friends-of-friends of the author, mostly young adults in Korea, who open a link shared via KakaoTalk on their phone. They are doing a favor: they want to finish quickly and know exactly what to do on each screen.

## Product Purpose

Collect short real voice recordings (normal, fading, prolonged speech) to improve a speech-analysis CNN. Success: many different people finish all 4 recordings in about 2 minutes, with usable audio.

## Positioning

A personal favor, not a survey: playful, quick, with a visible "angel list" thanking everyone who finished.

## Operating Context

- Opened on a phone, often from the KakaoTalk in-app browser (Android in-app mic is unreliable, so the page offers opening in Chrome).
- The phone should rest on a desk during recording; quiet room.
- Flow: intro + prep tips → consent, gender (optional), nickname (optional, defaults to angelN) → 4 recordings, each with listen-back and retry → done screen with the angel list and optional "record more".

## Capabilities and Constraints

- Recordings go to a private bucket; visitors can only upload. Only nicknames are public.
- File names use numbers, never nicknames.
- Each upload stores device info and actual mic settings (auto gain control state); the user is never asked about it.
- Undecided: final fun copy, the script sentences, and the explainer text. Placeholders for now.

## Brand Commitments

- The project name "Re-born" is not shown on the main screens; it appears only inside the "이 녹음은 어디에 쓰여요?" explainer.
- Voice: soft, polite Korean (부드러운 존댓말).

## Evidence on Hand

None yet. Do not invent participant counts or results.

## Product Principles

1. One glance tells you what to do next.
2. Finishing fast beats collecting more per person.
3. Recordings stay private; only the thank-you is public.
4. Curious people can learn more, but nobody has to read anything.

## Accessibility & Inclusion

Large tap targets for one-handed phone use; text readable without zoom.
