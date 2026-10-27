# Odyssey Travel

A cinematic, editorial Next.js website for a travel-planning brand. The visual palette pairs electric blue (`#2563EB`) and midnight navy with warm ivory and restrained sand accents. The project is intentionally enquiry-led: there is no live inventory, checkout, confirmed pricing, fabricated social proof, CMS, or admin dashboard.

## Run locally

- Node.js 20.9+ (tested with Node 22)
- `npm install`
- `cp .env.example .env.local` and set `NEXT_PUBLIC_SITE_URL` to your local origin (for example, `http://localhost:3000`)
- `npm run dev`
- `npm run lint` (TypeScript check)
- `npm run build`
- `npm run start`

The local development server binds to `0.0.0.0` for preview environments.

## What’s included

- Responsive homepage, destination and journey galleries, destination/package detail pages, travel styles, about, journal/article pages, contact, planning form, FAQ, and policy pages.
- A pinned GSAP/ScrollTrigger hero that scrubs the existing Google Flow clip forward and backward with scroll. The original 8-second, 1280×720 H.264 video (2.9 MB, 24 fps) is served from `public/videos/Miniature_car_driving_on_map_20261026174302.mp4`; a JPEG extracted from its first frame is the poster. No autoplay is used, and reduced-motion users keep the still poster and accessible hero content without pinning.
- Shared navigation/footer, mobile menu, keyboard focus styles, reduced-motion support, scroll reveals, loading/error/404 states, and an optional configured WhatsApp link.

- SEO metadata, per-page titles/descriptions, a sitemap and robots route. The sitemap is empty and robots omits its sitemap reference until `NEXT_PUBLIC_SITE_URL` is set; use the real canonical production origin before deployment.
- Server-side enquiry validation, a honeypot, a small in-memory per-process rate limit, and optional delivery to a verified business inbox through Resend. The API returns an error (not a success message) until delivery is configured.

### Hero video QA note

The supplied MP4 is a small 24 fps H.264 clip; stream inspection found an initial keyframe followed by P-frames only. The local server returns byte-range responses, but a long GOP can make repeated random seeks slower on some mobile decoders. The original source is kept intact rather than silently re-encoded. Validate scrubbing on target iOS/Android devices; if visible seeking lag occurs, produce an approved web-optimized encode from this same source with frequent keyframes (roughly every 12–24 frames at 24 fps) and fast-start metadata, then use that optimized asset.

## Enquiry delivery

Set these server-side environment variables after verifying the sending domain and inbox in Resend:

- `RESEND_API_KEY`
- `ENQUIRY_TO_EMAIL`
- `ENQUIRY_FROM_EMAIL` (a sender authorised by your Resend account)

The endpoint emails a validated enquiry and returns a reference only after Resend accepts the message. It does not retain a second copy in a database. The in-memory rate limit is best-effort for a single process; configure edge/platform rate limiting for a multi-instance production deployment. Keep secrets server-side; only the optional WhatsApp number and site URL use `NEXT_PUBLIC_` variables.

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the verified international number using digits only. The floating WhatsApp action is hidden when this value is absent. Do not put a personal or unverified number in production configuration.

## Content and launch checklist

No official logo, imagery, business contacts, package facts, customer testimonials, credentials, or legal details were present in the starter repository. The current compass-and-type treatment is a provisional wordmark, not an official supplied logo. The bundled travel images are AI-generated visual concepts, not documentary photographs of specific properties or confirmed experiences. Replace or explicitly approve these assets for the brand before launch, and ensure destination imagery accurately represents the real destination. All journey cards and editorial notes are illustrative inspiration, not verified itinerary, pricing, availability, or destination advice.

Before launch:

1. Supply and use the official Odyssey Travel logo/brand assets if available; approve the final image set.
2. Set the real site origin, configure and test Resend delivery, and add a verified WhatsApp number only if one is available.
3. Add the operator’s real business identity and verified contact details throughout the site; this repo intentionally invents none.
4. Have the Privacy, Website Terms, and Changes & Cancellations pages reviewed and completed for the operator and applicable jurisdiction. The current notices explicitly flag missing operator-specific details.
5. Verify sample destination descriptions, confirm all customer-facing package details, and review all editorial content before publishing.
6. Test enquiry delivery, accessibility, mobile layouts, and the deployed domain. There is no database, independent CMS, authentication system, or admin UI in this project; the content is maintained in `src/lib/content.ts` and page files.

## Project structure

- `src/app/` — App Router pages, SEO routes, and the enquiry API.
- `src/components/` — reusable navigation, cards, page layouts, and forms.
- `src/lib/content.ts` — illustrative destination, journey, and journal content.
- `.env.example` — names of optional configuration variables only; no secrets.
