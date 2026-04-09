# CATTLEYA

Immense Beauty of Heaven.

## Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Hook Form, Zod, Axios, Socket.io-client
- Backend: Express.js, TypeScript, Prisma, PostgreSQL, Redis, BullMQ, Socket.io, Cloudinary, SendGrid, PayHere, Stripe

## Setup

1. Copy `.env.example` to the backend and frontend env files.
2. Install dependencies from the repo root.
3. Run database migrations and seed data.

```bash
npm install
npm run migrate -w backend
npm run seed -w backend
npm run dev -w frontend
npm run dev -w backend
npm run worker -w backend
```

## Scripts

- `npm run dev -w frontend` starts the Next.js app.
- `npm run dev -w backend` starts the API server.
- `npm run worker -w backend` starts the BullMQ AI worker.
- `npm run build` builds both apps.
- `npm run seed -w backend` seeds admin, customer, products, variants, and coupons.

## Brand Notes

- Logo path: `frontend/public/images/logo.png`
- Fav icon: `frontend/public/favicon.ico`
- Palette: gold, deep black, teal, purple, pink, off-white
- Typography: Cinzel for headings, Inter for body
