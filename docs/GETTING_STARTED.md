# Getting Started

Local neighborhood supermarket storefront. The MVP uses mock catalog data and saves the cart, orders, and guest profile in the browser (`localStorage`). No API keys required.

## Run locally

```bash
git clone https://github.com/santhiprakash/freshlane.git
cd freshlane
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Walk the shopper loop

1. **Browse** — Home, [Products](http://localhost:3000/products), [Categories](http://localhost:3000/categories), or [Offers](http://localhost:3000/offers).
2. **Add to cart** — open a product and add it, or use the card controls. The cart persists under `freshlane-cart`.
3. **Checkout** — [Cart](http://localhost:3000/cart) → Proceed to Checkout.
   - Home Delivery needs name, phone, pincode, and address.
   - Click & Collect needs name and phone only.
   - Optional coupon: `FRESH15` (15% off subtotal) or `WELCOME100` (₹100 off when subtotal is ₹500+).
4. **Place order** — the order is saved under `freshlane-orders` with an id like `FL-2026-0001`. Stay on the success screen to copy the id; **Track Order** opens `/orders/[id]`.
5. **See the order** — [My Orders](http://localhost:3000/orders) lists real local orders. Open one for line items, totals, and customer details.
6. **Admin status** — [Admin](http://localhost:3000/admin) shows today’s order count, catalog stats, and a recent-orders table. Change status along **Pending → Confirmed → Ready → Delivered**. That change is what the customer sees on `/orders`.

## Guest profile (optional)

[Account](http://localhost:3000/account) saves a **local guest profile** (`freshlane-account`): name, email, phone, and addresses. Checkout prefills the most recent address. **Sign out** clears the profile only — orders stay put.

This is not a server login. There is no password.

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Next.js dev server |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Typecheck without a full production build |

## What stays local

| Key | Contents |
|-----|----------|
| `freshlane-cart` | Cart line items |
| `freshlane-orders` | Placed orders |
| `freshlane-account` | Guest profile + saved addresses |

Clear site data in the browser to reset the demo.
