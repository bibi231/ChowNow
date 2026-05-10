# ChowNow

ChowNow is a modern, responsive web application for restaurant online ordering, built with Next.js and Prisma. It provides a seamless food ordering experience and an integrated secure Admin dashboard for dynamic order fulfillment tracking.

## Tech Stack
- Frontend & Backend: Next.js (App Router)
- Database: Neon PostgreSQL via Prisma ORM
- Authentication: NextAuth.js
- Styling: Bootstrap & Custom CSS

## Features
- **User Authentication:** Secure signup and login flow.
- **Dynamic Menu & Cart:** Easily browse menu items and manage quantities securely before checkout. 
- **User Dashboard:** Accessible account space recording historical orders and assigning unique pickup tracking codes (`/account`).
- **Admin Dashboard:** A highly protected management interface for updating the real-time fulfillment status of incoming orders (`/admin`).
- **Pickup Verification Code:** Secure 6-digit verification system to guarantee successful food handoffs.

## Local Setup

1. Copy `.env.example` to `.env` and fill in the `DATABASE_URL` with your exact Neon or standard Postgres database URI.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database schema:
   ```bash
   npx prisma db push
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Operations
Admins can mark an order status as: PENDING, PREPARING, READY FOR PICKUP, DELIVERED, or CANCELLED.
