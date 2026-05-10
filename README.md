# ChowNow - University Restaurant Management System

ChowNow is a professional-grade, full-stack restaurant online ordering system designed for high-efficiency food handoffs in campus or urban environments. Built with **Next.js**, **Prisma**, and **PostgreSQL**, it offers a premium user experience with full dark mode support, real-time order tracking, and a secure administration interface.

---

## 🎓 For Students: Project Overview

This system was designed to be easily understandable for developers and university students. It demonstrates modern web development patterns:
- **Server Actions & API Routes:** Efficient data handling.
- **NextAuth Integration:** Secure user and admin sessions.
- **Prisma ORM:** Simplified database interactions with PostgreSQL.
- **Bootstrap 5.3:** Modern, responsive UI with native Dark Mode support.

---

## 🔑 Administrative Access

To access the backend management tools, use the following credentials:
- **Admin Email:** `admin@chownow.com`
- **Admin Password:** `adminpassword`

> [!IMPORTANT]
> To initialize the admin account in a fresh database, run: `node create-admin.mjs`

---

## 🎯 Features & Functionalities

### 1. User Experience
- **Dynamic Menu:** Interactive browsing with category filters (Rice, Drinks, Fast Food, etc.).
- **Live Cart System:** Add items, manage quantities, and see real-time price calculations before checkout.
- **Secure Checkout:** Simulated bank transfer and card payment flow.
- **Order History:** Users can track their past orders and current fulfillment status in their personal dashboard.
- **Review System:** Leave star ratings and comments on specific menu items.

### 2. Admin & Kitchen Display System (KDS)
Available at `/admin`, this interface allows staff to control the restaurant's operational flow:
- **Order Management:** View all incoming orders in real-time.
- **Status Manipulation:** Update orders through their lifecycle:
  - `PENDING` → `PREPARING` → `READY FOR PICKUP` → `DELIVERED`
- **Security Check:** Unique 6-character **Pickup Codes** are generated for every order to ensure the right person gets the right food.

---

## 🛠️ How to Control & Manipulate

### Adding/Editing Menu Items
- **Local JSON:** The system seeds data from `public/assets/data/menu.json`. You can add new items here and run the seed script.
- **Seeding Script:** Run `node seedMenu.mjs` to sync your local data into the database automatically.
- **Admin Panel:** Admins can also manage items (if the feature is toggled) or use the Database Studio.

### Theming (Light/Dark Mode)
- The system uses a persistent theme toggle in the Navbar.
- It leverages Bootstrap's `data-bs-theme` attribute on the root element.
- All custom styles in `public/assets/css/style.css` are designed to respect these theme variables.

---

## 🚀 Installation & Deployment

### Local Development
1. **Env Setup:** Create a `.env` file and add your `DATABASE_URL` (PostgreSQL).
2. **Install:** `npm install`
3. **Database Sync:** `npx prisma db push`
4. **Seed Menu:** `node seedMenu.mjs`
5. **Create Admin:** `node create-admin.mjs`
6. **Run:** `npm run dev`

### Production Deployment (Vercel)
This project is pre-configured for Vercel:
1. Push your code to GitHub.
2. Link the repository to Vercel.
3. Add your `DATABASE_URL` and `NEXTAUTH_SECRET` to the Vercel Environment Variables.
4. The build command is `npm run build` and the output directory is `.next`.

---

## 📦 Directory Structure
- `/src/app`: Next.js App Router pages and API routes.
- `/src/components`: Reusable UI elements (Navbar, Footer, etc.).
- `/prisma`: Database schema definition.
- `/public/assets`: Static images, data, and global CSS.

---
© 2026 ChowNow Development Team.
