# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

See [PROGRESS.md](PROGRESS.md) for the maintainer's day-to-day working log and decisions.

## [Unreleased]

### Added
- Open source release under MIT license
- `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `.github/CODEOWNERS`
- Issue and pull request templates
- Checkout persists orders to `localStorage`; `/orders` and `/orders/[id]` show real orders
- Admin dashboard reads local orders and can update status
- Guest account profile and saved addresses (browser-only)
- `docs/GETTING_STARTED.md`

### Fixed
- Checkout coupon Apply now validates offers (`FRESH15`, `WELCOME100`, expired/invalid codes)
- Checkout no longer auto-redirects away before the order id is visible

## [0.1.0] - 2026-07-12
### Added
- MVP customer storefront: Home, Products, Categories, Offers, About, Contact, Cart, Checkout, Account, Orders
- Admin dashboard shell at `/admin`
- Cart context with localStorage persistence
- Privacy Policy and Terms of Service pages
- Mock product data (Phase 2 will wire Postgres + API)

### Changed
- Repo renamed `supermarket` → `freshlane` to match the FreshLane brand

## Guidelines for maintaining the changelog

- Keep an "Unreleased" section at the top for changes that will be released in the future
- Add release date for each released version in YYYY-MM-DD format
- Group changes by type: Added, Changed, Deprecated, Removed, Fixed, Security
- List changes in a way that explains their impact to end-users
