# Sustainable Lifestyle Tracker & Store

A full‑stack web app that helps users **track sustainable habits** and **shop eco‑friendly products**. Built with **TypeScript/Node.js/Express/Prisma (SQLite)** on the backend and **React + Vite** on the frontend.

---

## Features

- User authentication (signup/login)
- Real‑time sustainability tracking and personalized product recommendations
- Product catalog with categories (e.g., Reducing Plastic Use, Saving Water) 
- Cart & orders flow
- Admin pages: add/edit products, manage users & activities
- Email endpoints (configurable via RESEND)

---

## Tech Stack

**Backend:** Node.js, Express, TypeScript, Prisma (SQLite), Zod, cookie‑session, CORS  
**Frontend:** React, Vite, React Router, React Hook Form, Radix UI, Tailwind CSS  
**Tooling:** ESLint, Prettier, Nodemon, PNPM/NPM, GitHub Actions (tests/artifacts)

---

## Project Structure

```
backend/
  src/
    index.ts               # Express app entry
    routes/                # /auth, /products, /cart, /order, /review, /admin, /contact, /user
    lib/db.ts              # Prisma client
    lib/utils.ts           # absoluteServerUrl helper
  prisma/
    schema.prisma          # SQLite DB schema
    dev.db                 # Local SQLite database (for dev)
  seed/products.ts         # Seed script to populate example products

frontend/
  src/                     # React app (layouts, pages, components)
  .env                     # VITE_SERVER_URL (API base)
```

---

## Prerequisites

- Node.js 18+
- PNPM or NPM
- RESEND account (if you want email to work)

---

## Local Development

### 1) Install deps
From each folder:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2) Prepare the database
```bash
cd backend
# Generate Prisma client & sync schema to SQLite
npx prisma generate
npx prisma db push
```

### 3) Run the backend
```bash
# Dev (hot‑reload)
npm run dev

# Or production style
pnpm run build && pnpm start
```

The server should start on: `http://localhost:8000`

### 4) Run the frontend
```bash
cd ../frontend
npm run dev
```
Open the Vite dev URL (usually printed like `http://localhost:5173`).  
The app expects the API at `VITE_SERVER_URL` (default `http://localhost:8000`).

---

## 📚 Notable Routes (Backend)

- `GET /products` – list products
- `POST /products` – create product (admin)
- `PUT /products/:id` – edit product (admin)
- `POST /auth/*` – signup / login / logout
- `GET /cart` / `POST /cart` – manage cart
- `POST /order` – create order
- `POST /contact` – contact form 
- `GET /user/*` – user profile & activities
- `GET /admin/*` – admin dashboards

> Full code under `backend/src/routes/*`

---

## Demo Video

Watch a quick demo of the website here: https://youtu.be/v_Ln1SCbARA

---

## Credits

Built by Itay Aharoni.
