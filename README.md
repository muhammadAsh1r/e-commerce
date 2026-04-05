# TechStore - Premium E-commerce Platform

A full-stack, responsive e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js), featuring a clean "Linear White" premium design, Stripe payments, and a powerful admin suite.

## 🚀 Live Demo
- **Frontend**: [Vercel](https://e-commerce-pi-jade.vercel.app)
- **Backend (API)**: [Render](https://e-commerce-4den.onrender.com)

## 🔐 Admin Credentials (Demo)
- **Email**: `admin@shop.pro`
- **Password**: `admin123`

## ✨ Features
- **Premium Light Theme**: Clean, high-altitude linear gradient aesthetic.
- **Dynamic Cart**: Real-time quantity updates and persistent shopping bag.
- **Secure Payments**: Integrated with Stripe (PCI-compliant checkout).
- **Admin Dashboard**: Full Inventory management (CRUD), Order tracking, and User analytics.
- **Mobile First**: Fully responsive layout using Tailwind CSS.

## 🛠 Deployment & Setup
### Prerequisites
- Node.js & npm
- MongoDB Atlas account
- Stripe account (Secret & Publishable keys)

### Backend Settings (Render)
- **Root Directory**: `backend`
- **Environment Variables**:
  - `MONGO_URI`: Your MongoDB connection string.
  - `JWT_SECRET`: A secure random secret for authentication.
  - `STRIPE_SECRET_KEY`: Your Stripe secret key.

### Frontend Settings (Vercel)
- **Root Directory**: `frontend`
- **Environment Variables**:
  - `VITE_API_URL`: Your backend Render URL.
  - `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key.

---

## 🎨 Design Philosophy
The application prioritizes a **"Light-First"** premium experience, utilizing a sophisticated linear gradient (`#f8fafc` to `#ffffff`) to create an airy, professional workspace for modern e-commerce.
