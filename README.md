# OMKAR NAGU ELECTRICAL WORKS
> **"Reliable Electrical Solutions for Every Space"**

A modern, enterprise-grade electrical services web application and operations management system built for **OMKAR NAGU ELECTRICAL WORKS**.

---

## ⚡ Project Overview

OMKAR NAGU ELECTRICAL WORKS provides professional electrical installation, rewiring, architectural ceiling lighting, and industrial panel board services for:
* **Homes & Villas**
* **Apartment Buildings**
* **Function Halls & Event Centers**
* **Retail Shops & Showrooms**
* **Offices & Corporate Buildings**
* **Industrial & Heavy Power Distribution**

### Key Features
* **Two-Way Booking Submission**:
  * **Channel 1 (Database/Admin)**: Immediate recording into database; visible in Admin Portal in real time with initial status `NEW`.
  * **Channel 2 (WhatsApp Integration)**: Seamless one-click dispatch generating pre-formatted WhatsApp messages with complete customer, service, schedule, and `ON-EW-XXXX` booking details.
* **3D Electrical Visualizer (Three.js)**:
  * Rotating 3D Thunderbolt with electric energy glow
  * Detailed 3D Voltage Tester with neon indicator
  * Precision 3D Wire Cutter with insulated grips and chrome pivot
  * Smooth mouse drag interaction, soft studio lighting, and high-performance mobile fallbacks.
* **Dedicated Operations Admin Portal**:
  * Primary theme color: **#5B86B6**
  * Real-time statistics: Total, New Requests, Confirmed, In Progress, Completed, Cancelled.
  * Status workflow transitions: `NEW` ➔ `CONFIRMED` ➔ `IN PROGRESS` ➔ `COMPLETED` (or `CANCELLED`).
  * Direct Customer Communication: Instant **Call Customer** (`tel:`) and **WhatsApp Customer** (`wa.me`) directly from the table.
  * Customer Profile Inspection with complete booking history.
  * Service catalog management.
* **Customer Portal**:
  * Account registration with Indian phone number validation (`/^[6-9]\d{9}$/`).
  * Booking flow with auto-populated customer info, schedule selector, and optional photo upload of electrical setup/problems.
  * Live status tracking with visual timeline.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Three.js, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL / Supabase with Prisma ORM (and resilient local JSON synchronization) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing, role-based guards (`CUSTOMER`, `ADMIN`) |
| **Integrations** | WhatsApp Web & Mobile API (`wa.me`) |

---

## 🚀 Quick Start & Development Commands

### 1. Prerequisites
* **Node.js** v20+ or v24+
* **npm** v10+ or v11+
* (Optional) **PostgreSQL** or **Supabase** account

### 2. Starting the Backend Server
```powershell
cd "d:\omkar nagu website\backend"
npm install
npm run dev
```
> The API server will boot on **http://localhost:5000** with pre-seeded Admin and Customer demo accounts.

### 3. Starting the Frontend Dev Server
```powershell
cd "d:\omkar nagu website\frontend"
npm install
npm run dev
```
> The frontend application will be live at **http://localhost:5173**.

---

## 🔑 Default Credentials for Evaluation

### Admin Portal
* **URL**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
* **Username / Email**: `naguomkar@service.com`
* **Password**: `26152215`

### Customer Demo Account
* **URL**: [http://localhost:5173/login](http://localhost:5173/login)
* **Phone**: `9988776655`
* **Password**: `Customer@123`

---

## 🗄️ Database Setup (Supabase & PostgreSQL)

The application includes dual-mode database support:
1. **Out-of-the-Box Mode**: Persistent JSON synchronization in `backend/data/db.json` which works instantly without requiring an external database.
2. **Supabase / PostgreSQL Production Mode**:
   * Create a new project on [Supabase](https://supabase.com).
   * Go to **Project Settings** ➔ **Database** ➔ **Connection String** (URI).
   * Copy the connection string (e.g., `postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`).
   * Paste it into your `backend/.env` file:
     ```env
     DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
     ```
   * Push the Prisma schema to create all tables:
     ```bash
     cd backend
     npx prisma db push
     ```

---

## 📲 WhatsApp Configuration

The business phone number for receiving customer bookings is configured via:
* `frontend/.env` or root `.env`:
  ```env
  VITE_WHATSAPP_NUMBER="919876543210"
  ```
Format: Country code without spaces or symbols (e.g. `919876543210` for India).

When a customer books a service, clicking **"Send Details to WhatsApp"** automatically generates the exact message:
```text
*OMKAR NAGU ELECTRICAL WORKS*
*NEW SERVICE BOOKING*

*Customer Name:* Santhosh Kumar
*Phone:* 9876543210

*Address:*
Visakhapatnam, Andhra Pradesh

*Service Category:*
Wiring

*Service:*
House Wiring

*Preferred Date:*
15 October 2026

*Preferred Time:*
10:00 AM

*Work Description:*
Complete wiring for new house.

*Booking ID:*
ON-EW-1025

_Please contact me regarding this service booking._
```

---

## 🏗️ Production Build Commands

To generate optimized production bundles:

```powershell
# Build Frontend
cd "d:\omkar nagu website\frontend"
npm run build

# Build Backend
cd "d:\omkar nagu website\backend"
npm run build
```

---

## 📁 Project Structure

```text
omkar-nagu-electrical-works/
├── backend/
│   ├── src/
│   │   ├── config/          # Database store & Prisma initialization
│   │   ├── controllers/     # Auth, Bookings, Customers, Admin, Services
│   │   ├── data/            # Comprehensive Electrical Services Catalog
│   │   ├── middleware/      # JWT Authentication & Multer photo upload
│   │   ├── routes/          # REST API route endpoints
│   │   ├── utils/           # JWT & WhatsApp formatters
│   │   └── server.ts        # Express server entrypoint
│   ├── prisma/
│   │   └── schema.prisma    # PostgreSQL / Supabase Prisma Schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/          # Three.js 3D Electrical Scene (Thunderbolt, Tester, Cutter)
│   │   │   ├── admin/       # Admin sidebar & layout (#5B86B6 brand theme)
│   │   │   ├── booking/     # Booking modal & Booking details modal
│   │   │   └── common/      # Navbar, Footer, Logo, StatusBadge, Toast
│   │   ├── context/         # AuthContext (JWT, roles, customer profile)
│   │   ├── data/            # Standalone service catalog data
│   │   ├── pages/
│   │   │   ├── admin/       # Dashboard, Bookings, Customers, Services
│   │   │   ├── customer/    # Dashboard, My Bookings, Profile
│   │   │   └── public/      # Home, Services, About, Contact, Login, Register, AdminLogin
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # WhatsApp utility & link generator
│   ├── public/
│   │   └── images/          # Realistic logo, hero banner, and service photography
│   └── package.json
│
├── .env.example
├── docker-compose.yml
└── README.md
```

---

© 2026 **OMKAR NAGU ELECTRICAL WORKS** — Reliable Electrical Solutions for Every Space.
