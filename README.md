# CultureUp

A marketplace connecting artists with buyers — artwork discovery and sales, art equipment listings, a freelance jobs board, direct messaging between users, and Stripe-powered checkout.

**Live:** https://culturup.vercel.app

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)

---

## About

This repository is the **frontend** single-page application. It consumes a separate Django REST API for authentication, catalog data, messaging and payments.

## Features

**Discovery**
- Browse and filter artworks by category
- Artist directory with public profile pages and featured-artist highlights
- Art equipment marketplace alongside the main artwork catalog

**Commerce**
- Cart with state held in React context
- Stripe checkout via `@stripe/react-stripe-js`, with a dedicated purchase flow and order confirmation
- Bidding support for artworks sold at auction rather than fixed price

**Jobs board**
- Artists post and browse commission and freelance listings
- Job detail pages with an integrated payment step

**Messaging**
- Conversation list and threaded chat windows so buyers and artists can negotiate in-app

**Accounts**
- Registration and login for both artist and buyer profile types
- Two-factor authentication — setup, verification, disable, and backup-code recovery
- Profile and settings management, including artwork and equipment editing

**Admin**
- Separate admin login behind a protected route
- Dashboard with statistics visualised using Recharts
- Management screens for artists, artworks and equipment

## Tech stack

| Concern | Choice |
|---|---|
| Framework | React 19 with Vite |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 (with `@tailwindcss/forms` and `typography`) |
| Animation | Framer Motion |
| Data fetching | Axios |
| Payments | Stripe Elements |
| Charts | Recharts |
| Notifications | React Toastify |
| Icons | Lucide + React Icons |

## Running locally

**Prerequisites:** Node.js 20+

```bash
git clone https://github.com/shayan2601/culturup.git
cd culturup
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Available scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run inline` | Build with assets inlined |

## Project structure

```
src/
├─ pages/        # route-level screens (gallery, artists, equipment,
│                #   jobs, chat, cart, checkout, admin dashboard)
├─ components/   # shared UI — navbar, footer, hero, cards, modal
├─ context/      # CartContext
├─ api/          # messageService and API helpers
└─ styles/
```

## Deployment

Deployed on Vercel. `vercel.json` rewrites all paths to `/` so client-side routing works on direct navigation and refresh.
