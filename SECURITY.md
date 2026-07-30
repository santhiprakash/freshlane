# Security Policy

## Supported versions

This project is an early MVP (mock-data storefront). Security fixes are accepted on the `main` branch only.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security reports.

Email **santhi@santhiprakash.com** with:

- A short description of the issue
- Steps to reproduce (or a proof-of-concept)
- Impact assessment if known

You should receive an acknowledgement within a few business days (IST).

## Scope notes (MVP)

- The current MVP uses **mock JSON** and local cart state — there is no production database or payment processing in this repo yet.
- Do not commit API keys, `.env` files, or customer data.
- Future Phase 2 work (auth, Postgres, payments) will document additional security expectations here.
