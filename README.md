# 💈 ChairSync - Barber Shop Queue & Chair Management System

> A modern full-stack barber shop management system built using **React.js, ASP.NET Core Web API, Entity Framework Core, and PostgreSQL**.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-.NET-blueviolet?logo=dotnet)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 📖 Overview

ChairSync is a web-based Barber Shop Queue & Chair Management System developed during my **.NET Full Stack Developer Internship**.

The application helps barber shops efficiently manage customer queues, chair availability, and service flow through a modern web interface.

---

# ❗ Problem Statement

Many barber shops still rely on manual methods to manage customer queues and chair availability. This often leads to long waiting times, inefficient chair allocation, customer confusion, and poor service management.

ChairSync provides a digital solution that enables staff to monitor chair availability, manage waiting customers, assign customers to available chairs, and track service progress in real time.

---

# 🎯 Objectives

- Digitize barber shop queue management
- Monitor chair availability in real time
- Reduce customer waiting time
- Improve service efficiency
- Simplify chair assignment
- Learn enterprise-level Full Stack Development

---

# 🚀 Features

## 💺 Chair Management

- View all barber chairs
- Available / Occupied Status
- Real-time chair updates
- Assign customer to chair
- Release chair after service

## 👥 Customer Management

- Add customers
- Customer token system
- View customer list
- Customer status tracking

## ⏳ Queue Management

- Waiting queue
- Assign queue to available chair
- Complete haircut
- Queue workflow

## 🌐 REST API

- ASP.NET Core Web API
- CRUD Operations
- JSON API
- Swagger Documentation

---
# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- JavaScript
- Axios
- Bootstrap
- CSS3

## Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core

## Database

- PostgreSQL

## Tools

- Visual Studio 2022
- Visual Studio Code
- Git
- GitHub
- Swagger
- pgAdmin 4

---

# 📂 Project Structure

```text
ChairSync
│
├── Backend
│   ├── Controllers
│   ├── Models
│   ├── Data
│   ├── Migrations
│   ├── Program.cs
│   └── appsettings.json
│
├── Frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

# 🔄 Workflow

```text
Customer Arrives
        │
        ▼
Add Customer
        │
        ▼
Waiting Queue
        │
        ▼
Available Chair
        │
        ▼
Assign Customer
        │
        ▼
Chair Status → Occupied
        │
        ▼
Haircut Completed
        │
        ▼
Chair Released
        │
        ▼
Customer Status → Completed
```

---

# 📡 API Endpoints

## Chairs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/Chairs | Get All Chairs |
| GET | /api/Chairs/{id} | Get Chair |
| POST | /api/Chairs | Add Chair |
| PUT | /api/Chairs/{id} | Update Chair |
| DELETE | /api/Chairs/{id} | Delete Chair |

---

## Customers

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/Customer | Get Customers |
| GET | /api/Customer/waiting | Waiting Customers |
| POST | /api/Customer | Add Customer |
| POST | /api/Customer/{id}/assign/{chairId} | Assign Chair |
| POST | /api/Customer/{id}/complete | Complete Haircut |

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/Acharya-Sonam/ChairSync.git
```

---

## Backend Setup

```bash
cd Backend

dotnet restore

dotnet ef database update

dotnet run
```

Backend

```
http://localhost:5126
```

Swagger

```
http://localhost:5126/swagger
```

---

## Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

Frontend

```
http://localhost:5173
```

---

# 📸 Screenshots

> Add screenshots here

- Dashboard
- Queue Management
- Chair Management
- Customer Module
- Swagger API

Example:

```
screenshots/
│
├── dashboard.png
├── queue.png
├── chairs.png
└── swagger.png
```

---

# 🚀 Future Enhancements

- JWT Authentication
- Admin Login
- Barber Login
- Appointment Booking
- Payment Module
- Service Management
- Revenue Reports
- Analytics Dashboard
- Email Notifications
- SMS Notifications
- Progressive Web App (PWA)

---

# 📚 Learning Outcomes

During this project I learned:

- ASP.NET Core Web API
- React.js
- PostgreSQL
- Entity Framework Core
- REST APIs
- CRUD Operations
- Axios Integration
- MVC Architecture
- Git & GitHub
- Full Stack Development

---

# 👨‍💻 Developer

**Sonam Acharya**

**BSc (Hons) Computing**
Itahari International College
(London Metropolitan University)

### Connect with Me

- GitHub: https://github.com/Acharya-Sonam
- LinkedIn: https://www.linkedin.com/in/YOUR-LINKEDIN

---

## ⭐ Star this repository if you found it helpful!
