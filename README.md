# Darbar

A luxury Mughal-inspired fashion marketplace with multi-vendor support, role-based access control, and real payment processing.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Framer Motion |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB with Mongoose |
| Auth | JWT (access + refresh), email verification |
| Payment | Razorpay |
| Real-time | Socket.IO |
| File uploads | Cloudinary |
| Email | Nodemailer |

## Roles

- **Customer** — Browse, purchase, review, wishlist, order tracking
- **Seller** — Manage own product listings, view own sales and fulfillments
- **Admin** — Full platform control, approve sellers, manage all orders/products/users

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or local)
- Razorpay account (test mode)
- Cloudinary account (free tier)
- SMTP credentials (Gmail app password or SendGrid)

### Setup

```bash
# Clone and install all dependencies
git clone https://github.com/your-username/darbar-1.git
cd darbar-1
npm run install:all

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run database seed
cd server && npm run seed

# Start development servers (client + server concurrently)
cd ..
npm run dev
```

Client runs at `http://localhost:5173`
Server runs at `http://localhost:5000`

## Project Structure

```
darbar-1/
├── client/     # React frontend
├── server/     # Express backend
├── .env.example
└── package.json
```
