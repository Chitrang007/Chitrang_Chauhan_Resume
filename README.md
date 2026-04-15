# Chitrang Chauhan | Full-Stack Portfolio CMS

A premium, high-performance professional resume and CMS platform. Originally engineered as a static site, it has evolved into a **Full-Stack Enterprise Architecture** featuring a **React (Vite)** frontend, a **Go (Golang)** backend engine, and a **MongoDB Atlas** database.

---

## 🚀 Latest Evolution: Static to Dynamic
The project has been upgraded from a vanilla HTML/CSS file to a **Headless CMS architecture**. 
* **Dynamic Content**: Resume data is now fetched from a Go API instead of being hardcoded.
* **Admin Dashboard**: A secure `/admin` route allows for real-time updates to work history and projects without touching code.
* **Secure Authentication**: Implemented a protected login flow with JWT-style token persistence and a custom "Show Password" toggle for the UI.

---

## 🛠 Tech Stack & Cloud Infrastructure

### **The "Engine" (Backend)**
* **Language**: Go (Golang)
* **API Architecture**: RESTful API with net/http and Hybrid Routing.
* **Database**: MongoDB Atlas (NoSQL) for flexible resume schema management.
* **Security**: Middleware-based Authorization (Bearer Tokens) and CORS orchestration for cross-domain safety.
* **Hosting**: **Render** (Web Service).

### **The "Interface" (Frontend)**
* **Library**: React 18 (Vite)
* **Routing**: React Router 6 with Protected & Public-Only route guards.
* **Styling**: Tailwind CSS & Custom CSS3 Media Queries.
* **Hosting**: **Vercel** (Edge Network).

---

## 💼 Professional Impact (Accenture)

* **Quality Transformation**: Orchestrated a comprehensive unit testing strategy using GitHub Copilot, successfully increasing Angular code coverage from **5% to 90%** using **Jasmine and Karma**.
* **Enterprise Scale**: Developed **5+ mission-critical frontend pages** (Payment, Shopping Bag, Wishlist) and maintained dozens of core components for high-traffic SAP Hybris storefronts.
* **Operational Excellence**: Monitored live systems using **Kibana and Dynatrace**, resolving production bottlenecks and ensuring **99.9% storefront uptime**.

---

## 🏗 Key Features

### **1. Secure Admin CMS**
The `/admin` dashboard provides a high-fidelity interface to modify the **Accenture experience bullets** and **Project Portfolio**. Changes are saved instantly to MongoDB and reflected on the main site without a redeploy.

### **2. Print-to-PDF Engine**
* **Emerald-Slate Dark Theme**: Optimized for developer-centric web viewing.
* **@media print logic**: Specialized CSS that automatically strips dark backgrounds and UI buttons to generate a clean, professional A4 PDF for physical job applications.

### **3. Reverse Proxy Logic (CMDB Pro)**
Integrated specialized Go-based proxying to bypass ISP restrictions for high-fidelity movie metadata extraction (OMDb API integration).

---

## 🚀 Installation & Local Development

### **Backend Setup**
1. Navigate to `/backend`.
2. Create a `.env` file with `MONGO_URI`, `ADMIN_USER`, and `ADMIN_PASS`.
3. Run `go run main.go`.

### **Frontend Setup**
1. Navigate to `/frontend`.
2. Run `npm install`.
3. Create a `.env` with `VITE_API_URL=http://localhost:8080`.
4. Run `npm run dev`.

---

## 🏗 Project Structure

```bash
├── backend/
│   ├── main.go         # Go API & MongoDB logic
│   ├── go.mod          # Dependencies
│   └── .env            # Secrets (Private)
├── frontend/
│   ├── src/
│   │   ├── Admin.jsx   # CMS Dashboard
│   │   ├── Resume.jsx  # Public Resume View
│   │   ├── Login.jsx   # Auth View (with Show Password)
│   │   └── main.jsx    # Router & Entry Point
│   ├── index.css       # Print logic & Tailwind
│   └── vercel.json     # SPA Routing config
└── readme.md