# Vintage Collection — Frontend

React + Vite frontend for the Vintage Collection luxury South Indian traditional fashion e-commerce store.

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Lucide React (icons)
- Framer Motion (animations)

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file (only needed for production)
cp .env.example .env.local
# For local dev you do NOT need to set VITE_API_URL —
# Vite proxy automatically forwards /api → http://localhost:5000

# 3. Start development server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Full backend API URL (e.g. `https://your-api.onrender.com/api`) |

> **Local development**: Leave `VITE_API_URL` unset. The Vite proxy in `vite.config.js` forwards all `/api` requests to `http://localhost:5000` automatically.

## Deployment (Vercel)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import this repo
3. Framework: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
7. Deploy ✅

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/shop` | Product Catalog |
| `/product/:id` | Product Details |
| `/login` | User Login |
| `/register` | User Registration |
| `/cart` | Shopping Cart (protected) |
| `/wishlist` | Wishlist (protected) |
| `/orders` | My Orders (protected) |
| `/profile` | User Profile (protected) |
| `/admin-login` | Admin Login |
| `/admin/dashboard` | Admin Dashboard (admin only) |
