# Planning — FreshLane Supermarket

## Vision
Digital storefront for a local neighborhood supermarket — browse, order online, click & collect or home delivery, with an admin dashboard for store operations.

## Stack (MVP)
| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS | App Router, server + client components |
| State | React Context + localStorage | Cart, orders, and guest profile until API is wired |
| Data (MVP) | Mock JSON in `src/data/` | Swap for Postgres/API in Phase 2 |
| Auth (MVP) | Local guest profile | No password/server login; Supabase Auth planned for Phase 2 |
| Deploy | Vercel | Preview + production |
| DB (future) | PostgreSQL via Neon/Supabase | See `docs/DATABASE.md` |

## Architecture
```
app/                  # Next.js App Router pages
src/components/       # UI components
src/data/             # Mock products, categories, offers
src/lib/              # Utilities, cart / order / account stores
docs/                 # Product & technical specifications
```

## MVP Pages (from `docs/SITEMAP.md`)
- Home, Products, Categories, Offers, About, Contact
- Account (guest profile + saved addresses), Cart, Checkout, Orders, Order detail
- Admin dashboard (live local orders, inventory, offer counts)

## Design Direction
- **Brand**: FreshLane — neighborhood fresh market
- **Palette**: Deep forest green, warm cream, terracotta accent, sage highlights
- **Type**: Outfit (UI) + Literata (headings) — readable, warm, not generic SaaS
- **Motif**: Organic produce curves, market-stall warmth, WCAG AA contrast

## Security & Deploy
- HTTPS via Vercel (automatic)
- Env vars for future API keys in Vercel dashboard — see `docs/DEVOPS.md`
- No secrets in repo

## Phase 2 (not in this slice)
- NestJS/Express API, Postgres, Razorpay, real auth, admin CRUD APIs
