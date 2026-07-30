# Progress Log

## 2026-07-30 — Open-source rename

### Done
- Renamed GitHub repo `supermarket` → `freshlane` (still public under `santhiprakash`)
- Added MIT `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `.github/CODEOWNERS`
- Documented owner/maintainer as `@santhiprakash`; package name set to `freshlane`

### Live URLs
- **Production**: https://supermarket-neon.vercel.app
- **GitHub**: https://github.com/santhiprakash/freshlane

### Decisions
- Keep repo on personal account for full admin control
- Do not transfer to `garudaccs` until maintainer has Maintain/Admin in that org (current token only has pull on org repos)

### Next
- Optional: rename Vercel project / custom domain to match FreshLane branding
- Wire Phase 2 API/DB when ready

## 2026-07-12 — Project kickoff

### Done
- Reorganized all specification docs into `docs/` folder with index
- Created `PLANNING.md`, `PROGRESS.md`, `PROMPTS.md`, `docs/DEVOPS.md`
- Scaffolded Next.js app (TypeScript, Tailwind, App Router)
- Built MVP customer storefront UI with mock data
- Cart context with localStorage persistence
- Git repository initialized, pushed to GitHub
- Deployed to Vercel
- Added Privacy Policy and Terms of Service pages with footer links

### Live URLs (at kickoff)
- **Production**: https://supermarket-neon.vercel.app
- **GitHub**: https://github.com/santhiprakash/supermarket (later renamed to `freshlane`)

### In progress
- None (MVP slice complete)

### Decisions
- **Brand name**: FreshLane — local neighborhood supermarket
- **MVP data**: Mock JSON; API/DB deferred to Phase 2 per roadmap
- **Deploy**: Vercel production from `main` branch

### Next
- Wire Supabase/Neon Postgres and real API routes
- Auth (login/register)
- Razorpay checkout integration
- Admin CRUD backed by database
