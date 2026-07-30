# DevOps — FreshLane Supermarket

## Hosting
| Service | Purpose | URL |
|---------|---------|-----|
| Vercel | Frontend (Next.js) | https://supermarket-neon.vercel.app |
| GitHub | Source control | https://github.com/santhiprakash/freshlane |

## Deploy
```bash
# Automatic: push to main triggers Vercel production deploy
git push origin main

# Manual via Vercel CLI (optional)
npx vercel --prod
```

## Environment Variables (Vercel dashboard)
| Variable | When needed | Notes |
|----------|-------------|-------|
| `DATABASE_URL` | Phase 2 | Neon/Supabase Postgres |
| `NEXT_PUBLIC_SUPABASE_URL` | Phase 2 | Auth + DB |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Phase 2 | Auth + DB |
| `RAZORPAY_KEY_ID` | Phase 2 | Payments |
| `RAZORPAY_KEY_SECRET` | Phase 2 | Server only |

## Local Development
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build
```bash
npm run build
npm start
```

## Monitoring
- Vercel Analytics (enable in dashboard when ready)
- Runtime logs: Vercel dashboard → Project → Logs
