# 🏥 PharmaSaaS - Multitenant Pharmacy Management System

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn/UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

**A modern, scalable, and fully-featured Pharmacy Management Solution built with a Monorepo architecture.**

PharmaSaaS is designed to handle complex pharmacy operations with ease. From high-speed POS transactions to detailed inventory analytics and multitenant support, this system provides everything a pharmacy owner needs to streamline their business.

---

## 🚀 Key Features

### 🏢 Multitenancy & Role Management

- **Multitenant Architecture:** Secure data isolation for different pharmacy branches or distinct pharmacy clients.
- **Role-Based Access Control (RBAC):**
  - **Owner:** View all sales, manage employees, and oversee the specific pharmacy.
  - **Seller/Worker:** Track their own sales and performance.

### 💊 Inventory & Medicine Management

- **Smart Inventory:** Automatic alerts for **Low Stock** and **Low Quantity**.
- **Purchase Planning:** Built-in "To-Buy" list (Todo style) allowing users to add needed medicines and **download as CSV** for suppliers.
- **Medicine Database:** Admins can add global medicines; Sellers can add store-specific stock.

### 🛒 Point of Sale (POS) & Billing

- **Fast Billing:** Optimized for speed.
- **Payment Tracking:** Manage **Due** and **Paid** statuses with customer details.
- **Thermal Printing:** Ready-to-print receipts formatted for **80mm thermal printers**.

### 📊 Analytics & Dashboard

- **Sales Reports:** Visualize sales data Yearly, Monthly, and Weekly.
- **Employee Performance:** Track sales performance per worker.
- **Calendar Integration:** Dashboard calendar for tracking events and settings.

---

## 📸 Screenshots

<table width="100%">
  <tr>
    <td width="50%">
      <img src="./images/dashboard-seller.png" alt="Admin Dashboard" width="100%" />
      <br />
      <p align="center"><b>Analytics Dashboard</b></p>
    </td>
    <td width="50%">
      <img src="./images/seller-sell.png" alt="POS System" width="100%" />
      <br />
      <p align="center"><b>POS & Billing</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="./images/inventory.png" alt="Inventory" width="100%" />
      <br />
      <p align="center"><b>Inventory </b></p>
    </td>
    <td width="50%">
      <img src="./images/aletrs.png" alt="Inventory" width="100%" />
      <br />
      <p align="center"><b> Stock Alerts </b></p>
    </td>
  
    
  
  </tr>
  <tr>
    <td width="50%">
      <img src="./images/employe-sell.png" alt="Todo List" width="100%" />
      <br />
      <p align="center"><b>Employee sell details</b></p>
    </td>
    <td width="50%">
      <img src="./images/sell.png" alt="Todo List" width="100%" />
      <br />
      <p align="center"><b>Shop Sell</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="./images/add-medicin.png" alt="Todo List" width="100%" />
      <br />
      <p align="center"><b>Add Medicine To shop</b></p>
    </td>
  </tr>
</table>

---

## 💎 Pro Version (Premium)

> **Looking for more?** This open-source version is powerful, but our **Premium Version** takes it to the next level.

The Paid version includes:

[**visit link for premium **](https://pharmacy.bitaradigitalit.com/)

---

## 🛠️ Tech Stack

- **Monorepo Tooling:** Turborepo / Nx (depending on your setup)
- **Frontend:** Next.js 16+, React, Tailwind CSS, Shadcn/UI
- **Backend:** NestJS, TypeORM/Mongoose
- **Database:** MongoDB
- **Authentication:** JWT (Access & Refresh Tokens)

---

## ⚙️ Installation & Setup

This project is a Monorepo containing both the `backend` and `frontend`. Follow these steps to get it running locally.

### 1. Prerequisites

- Node.js (v20+)
- MongoDB installed and running locally

### 2. Clone the Repository

3. Install Dependencies
   Run this in the root directory to install dependencies for both frontend and backend.

Bash

npm install

# or

yarn install 4. Environment Configuration
You need to set up environment variables for both the Backend and the Frontend.

Backend (/backend/.env)
Navigate to the backend folder and create a .env file:

MONGODB_URL=mongodb://localhost:27017

# Template for multitenant databases

MONGO_URI_TEMPLATE=mongodb://localhost:27017/{name}

# Security

ACCESS_TOKEN="fafafafafafaf"
REFRESH_TOKEN="fafafafafafaf"

Frontend (/frontend/.env.local)
Navigate to the frontend folder and create a .env.local file:
BASE_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000

5. Running the App
   You can run both apps simultaneously from the root if you have a monorepo script setup, or run them in separate terminals.
   cd backend
   npm run start:dev

Terminal 2: Frontend
cd frontend
npm run dev
Visit http://localhost:3000 to view the application.

<p align="center"> Made with ❤️ by <a href="https://github.com/yourusername">Rifat</a> </p>
