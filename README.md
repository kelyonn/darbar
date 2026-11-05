# Darbar — Luxury Fashion Marketplace

A full-stack, production-ready MERN e-commerce platform tailored for luxury fashion.

## Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB account (or local MongoDB server)
- Razorpay account (for payments)
- Cloudinary account (for seller image uploads)

## 1. Environment Configuration

Copy the example file and (optionally) fill in third-party keys:

```bash
cp .env.example .env
```

The defaults work for local development with **no external accounts**:

| Service | Not configured (development) | Configured |
|---|---|---|
| MongoDB | needs a MongoDB reachable at `MONGODB_URI` (local `mongod` or Atlas) | - |
| SMTP email | emails are printed to the server console; new accounts are auto-verified | real verification / reset / order emails |
| Razorpay | checkout runs a simulated "test mode" payment | real Razorpay checkout (also set `VITE_RAZORPAY_KEY_ID`) |
| Cloudinary | image uploads return a placeholder | real image uploads |

In production (`NODE_ENV=production`) the fallbacks are disabled: email verification and real Razorpay keys are required.

## Seed data

```bash
npm run seed
```

Creates 18 products, a sample coupon (`ROYAL10`) and two accounts:
`admin@darbar.in / Admin@123456` and `seller@darbar.in / Seller@123456`.

## 2. Installation

Install dependencies for the root, client, and server all at once using the setup script:

```bash
npm run install:all
```

## 3. Running the Application (Development)

We have created two helper shell scripts in the root directory to make managing the servers easy.

**To Start the Servers:**
```bash
./run.sh
```
This will start both the frontend Vite server (at `http://localhost:5173`) and the backend Express server (at `http://localhost:5001`) in the background. Server logs will be streamed to a `.dev.log` file in the root directory.

**To Stop the Servers:**
```bash
./stop.sh
```

*(Alternatively, if you prefer seeing the logs directly in your terminal without the background script, you can run `npm run dev` from the root directory).*

## 4. Testing

We have configured a full testing suite:
- **Backend**: Jest + Supertest (using MongoDB Memory Server for isolated database testing)
- **Frontend**: Vitest + React Testing Library (using JS-DOM)

To run all tests (both client and server):
```bash
npm run test
```

Server tests use an in-memory MongoDB. If it can't be downloaded in your environment, point them at any running MongoDB instead: `TEST_MONGODB_URI=mongodb://127.0.0.1:27017/darbar-test npm run test:server`.

## 5. Deploying to Vercel

The repo deploys as a single Vercel project whose **Root Directory is `client`**: the Vite app is served statically and the Express API runs as one serverless function. `client/vercel.json` runs `npm run build:vercel`, which bundles `server/src` and its dependencies into `client/api/_bundle.js` (Vercel only packages files inside the root directory) and then builds the site. Vercel auto-deploys every push (branches get Preview URLs; the production branch gets the production URL).

1. Create a free MongoDB Atlas cluster, create a database user, and under Network Access allow `0.0.0.0/0` (Vercel has no fixed IPs). Copy the `mongodb+srv://...` connection string.
2. In Vercel, open the project, then **Settings > Environment Variables**, and add:

| Variable | Value |
|---|---|
| `MONGODB_URI` | your Atlas connection string (include a database name, e.g. `.../darbar`) |
| `JWT_ACCESS_SECRET` | any random string, 32+ characters |
| `JWT_REFRESH_SECRET` | a different random string, 32+ characters |
| `AUTO_VERIFY_EMAIL` | `true` until SMTP is configured (otherwise new users can never verify) |
| `ALLOW_MOCK_PAYMENTS` | `true` for simulated checkout until Razorpay keys are set. Remove it once real keys are added |
| `CRON_SECRET` | any random string (secures the daily abandoned-cart job) |

   Optional: `CLIENT_URL` (custom domain), SMTP, Razorpay and Cloudinary keys as in `.env.example`.
3. Load the products and accounts into Atlas once, from your computer:

```bash
MONGODB_URI="mongodb+srv://..." SEED_ADMIN_PASSWORD="choose-a-strong-password" npm run seed
```

4. Redeploy (or push a commit). Vercel Hobby has no WebSockets, so the live "someone just purchased" popup is inactive there.

## 6. Production Build

To build the application for production deployment:
```bash
npm run build:server
npm run build:client
```

## Available Roles & Testing the UI
You can test the system using different user roles:
1. **Customer**: Can browse, add to cart/wishlist, checkout, leave reviews, and apply to become a seller.
2. **Seller**: Can access the Seller Portal to add products, manage inventory, and view their orders.
3. **Admin**: Can access the Admin Dashboard to approve seller applications, view platform analytics, and manage users/products.

*(Tip: You can use the database to manually upgrade a test user's role to `admin` if you haven't seeded one already, and then use that admin account to approve seller applications).*
