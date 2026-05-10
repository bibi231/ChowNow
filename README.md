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

### Operational Flow (The Lifecycle of an Order)
1. **Ordering:** A user adds items to the cart, proceeds to checkout, and completes the payment.
2. **Dashboard Tracking:** The user is redirected to `/account` where they see their order as `PENDING`.
3. **Admin Kitchen Management:**
   - Staff logs in at `/admin`.
   - The new order appears in the "Active Orders" list.
   - Staff clicks **Start Preparing** (status changes to `PREPARING`).
   - Once the meal is ready, staff clicks **Mark as Ready** (status changes to `READY FOR PICKUP`).
4. **Fulfillment:**
   - The user sees `READY` on their dashboard.
   - They arrive at the restaurant and provide their **6-digit Pickup Code**.
   - Staff verifies the code and clicks **Complete Order** (status becomes `DELIVERED`).

### Managing the Menu Data
- **Bulk Updates:** Modify `public/assets/data/menu.json` and run `node seedMenu.mjs`.
- **Direct Database Control:**
  - Run `npx prisma studio` to open a visual database editor.
  - Here you can manually delete orders, edit user roles, or update food descriptions without coding.

### Theming
- The system uses a persistent theme toggle in the Navbar.
- It leverages Bootstrap's `data-bs-theme` attribute on the root element.
- All custom styles in `public/assets/css/style.css` use transparent backgrounds or theme-aware variables to look perfect in both modes.

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
