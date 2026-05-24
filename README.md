# Darbar — Luxury Fashion Marketplace

A full-stack, production-ready MERN e-commerce platform tailored for luxury fashion.

## Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB account (or local MongoDB server)
- Razorpay account (for payments)
- Cloudinary account (for seller image uploads)

## 1. Environment Configuration

The project uses a single `.env` file at the root of the repository. You currently have placeholder keys for third-party services that you need to fill out before those specific features will fully work.

Open the `.env` file at the root of the project and update the following placeholders:

```env
# Razorpay (Required for Checkout to work)
RAZORPAY_KEY_ID=your_real_key_here
RAZORPAY_KEY_SECRET=your_real_secret_here
RAZORPAY_WEBHOOK_SECRET=your_real_webhook_secret_here

# Cloudinary (Required for Sellers to upload product images)
CLOUDINARY_CLOUD_NAME=your_real_cloud_name
CLOUDINARY_API_KEY=your_real_api_key
CLOUDINARY_API_SECRET=your_real_api_secret

# Vite Client Variables
VITE_RAZORPAY_KEY_ID=your_real_key_here
```
*(Your MongoDB, JWT, and SMTP email settings are already configured and working!)*

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

## 5. Production Build

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
