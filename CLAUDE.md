# CLAUDE.md

Guidance for Claude Code and other coding agents working in this repository.

## Project Overview

This is a SvelteKit static site for a personal photo/video portfolio. It uses:

- Svelte 5 and SvelteKit 2
- TypeScript
- `@sveltejs/adapter-static`
- `@sveltejs/enhanced-img`
- Sharp-based image optimization

The deployed site is configured with a base path of `/vstudio`, so internal links and static asset paths should account for that.

## Common Commands

```bash
npm run dev
npm run build
npm run check
npm run lint
npm run format
npm run optimize-images
```

Use `npm run check` for Svelte and TypeScript validation. Use `npm run lint` before larger handoffs when practical.

## Repository Structure

- `src/routes/` contains SvelteKit pages and the shared layout.
- `src/routes/+layout.svelte` owns global navigation, page shell, global CSS reset, and footer.
- `src/routes/+layout.js` enables prerendering.
- `src/lib/components/` contains reusable gallery/image components.
- `src/lib/data/images.ts` contains gallery image metadata, though some pages currently define their own image lists inline.
- `static/images/` contains optimized public image assets.
- `scripts/optimize-images.js` generates responsive image variants from `src/lib/images/originals`.
- `svelte.config.js` configures static output, prerender entries, enhanced images, and the `/vstudio` base path.

## Routing And Paths

Always import `base` from `$app/paths` for internal route links and public assets referenced from Svelte code:

```svelte
<script>
  import { base } from '$app/paths';
</script>

<a href={`${base}/kit`}>Kit</a>
<img src={`${base}/images/example.avif`} alt="">
```

Do not hard-code root-relative links such as `/kit` or `/images/...` in routed Svelte pages unless there is a deliberate reason to bypass the configured base path.

When adding a new public page, update `kit.prerender.entries` in `svelte.config.js` so the static build includes it.

## Image Conventions

Public optimized images live in `static/images/` and are referenced as `/images/name.ext` after applying the SvelteKit base path.

The image pipeline expects originals in:

```text
src/lib/images/originals
```

Then `npm run optimize-images` writes responsive variants to:

```text
static/images
```

`src/lib/components/Image.svelte` builds `srcset` values by stripping suffixes like `-sm`, `-md`, `-lg`, `-xl`, and `-2xl` from the provided `src`. If you add image assets manually, keep those suffix conventions consistent or update the component logic.

## Style Guidelines

- Keep the site quiet, image-forward, and minimal.
- Match the existing lowercase, understated navigation and monospace accents.
- Prefer component-scoped CSS in `.svelte` files.
- Use responsive CSS with explicit breakpoints where layout changes materially.
- Avoid adding broad global styles outside `+layout.svelte` unless they are truly site-wide.
- Preserve accessibility basics: meaningful `alt` text, labelled controls, valid heading order, and keyboard-accessible interactive elements.

## Svelte Notes

This codebase currently uses classic Svelte syntax such as `export let`, `$:` reactive statements, and `on:` event handlers. Follow the existing local style unless intentionally migrating a file.

Use `$lib/...` imports for shared source modules and components.

## Deployment Notes

The app is statically prerendered. Avoid server-only behavior in routes unless the adapter and deployment model are changed. Client-only browser APIs should be guarded with `onMount`.

## Before Handoff

For ordinary code changes, run:

```bash
npm run check
```

For routing, layout, or production-build changes, also run:

```bash
npm run build
```

For style or formatting-heavy changes, run:

```bash
npm run lint
```
