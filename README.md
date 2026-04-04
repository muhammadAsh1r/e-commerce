# TechStore - Premium E-Commerce Platform

TechStore is a modern, high-performance e-commerce platform built with the MERN stack. It features a cinema-style dark mode aesthetic, a robust admin suite, and secure Stripe payment integration.

## 🚀 Key Features

### 🛒 Customer Experience
- **Permanent Dark Mode**: A premium, dark-only interface with multi-layered radial gradients and blurred brand glows for a sophisticated feel.
- **Seamless Discovery**: Advanced search and categorization for effortless product discovery.
- **Interactive Cart**: Real-time cart management with quantity adjustments and persistent storage.
- **Secure Checkout**: Integrated Stripe Elements with a custom "night" theme for safe and stylish transactions.
- **Order Tracking**: Comprehensive order history and status tracking for all users.

### 🛡 Admin Suite
- **Powerful Dashboard**: Real-time statistics and overview of store performance.
- **Inventory Management**: Full CRUD capabilities for products and categories.
- **Order Fulfillment**: Complete control over customer orders and payment statuses.
- **User Management**: Monitor and manage user accounts and system roles.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Redux Toolkit, Tailwind CSS, Lucide React, React Router 7.
- **Backend**: Node.js, Express 5, MongoDB (Mongoose).
- **Security**: JWT Authentication, Bcryptjs password hashing, CORS.
- **Payments**: Stripe API & Stripe Elements.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local instance
- Stripe Account (for API keys)

### 1. Clone the repository
```bash
git clone <repository-url>
cd e-commerce
```

### 2. Backend Configuration
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 3. Frontend Configuration
Navigate to the `frontend` folder and install dependencies:
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 🏃‍♂️ Running the Project

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

## 💎 Design Philosophy
TechStore is designed to be **Dark First**. By removing traditional light-mode toggles, we've focused entirely on perfecting the dark aesthetic using:
- **Layered Gradients**: Multiple radial layers to provide visual depth.
- **Glassmorphism**: High-opacity backdrops (`dark:bg-gray-900/95`) and blur effects for a premium feel.
- **Precision Typography**: Optimized contrast using `gray-200` for readability and `white` for emphasis.

---
*Built with ❤️ for the modern tech enthusiast.*
