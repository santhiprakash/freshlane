# FreshLane

Open-source digital storefront starter for a local neighborhood supermarket — browse products, place online orders, click & collect or home delivery.

**License:** MIT · **Maintainer:** [Santhi Prakash](https://github.com/santhiprakash) (`@santhiprakash`)

## Quick Start

```bash
git clone https://github.com/santhiprakash/freshlane.git
cd freshlane
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API keys required for the MVP (mock product data). Walk the add-to-cart → checkout → orders → admin loop in [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md).

## MVP Pages

- **Customer:** Home, Products, Categories, Offers, About, Contact, Cart, Checkout, Account, Orders, Order detail
- **Admin:** Dashboard at `/admin` — today’s orders, catalog stats, recent orders, and status updates (localStorage)

## Stack

Next.js 16 · TypeScript · Tailwind CSS · Mock data (Phase 2: Postgres + API)

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) | Clone, run, and walk the shopper loop |
| [PLANNING.md](PLANNING.md) | Architecture, stack, design direction |
| [PROGRESS.md](PROGRESS.md) | Maintainer's working log and decisions |
| [CHANGELOG.md](CHANGELOG.md) | Versioned release notes |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community expectations |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting |
| [docs/DEVOPS.md](docs/DEVOPS.md) | Deploy, env vars, hosting |
| [docs/](docs/README.md) | Product & technical specs |

## Ownership

| Role | Who |
|------|-----|
| Repository owner | [`santhiprakash/freshlane`](https://github.com/santhiprakash/freshlane) (personal account) |
| Maintainer | `@santhiprakash` — see [CODEOWNERS](.github/CODEOWNERS) |

This project is published under the personal GitHub account so the maintainer retains full admin access. A future transfer to an organization (e.g. GarudaCCS) is possible only after the maintainer has **Maintain** or **Admin** rights in that org.

## Deploy

Demo: [supermarket-neon.vercel.app](https://supermarket-neon.vercel.app) — see [docs/DEVOPS.md](docs/DEVOPS.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
