# 🛒 Ecommerce Website – DevOps Deployment

A full-stack Ecommerce Website containerised using **Docker and Docker Compose**, with a React frontend, Node.js/Express backend, and PostgreSQL database.

This project demonstrates a practical **3-tier application architecture** and its deployment using Docker on an **AWS EC2 instance**.

---

## 📌 Project Overview

This Ecommerce application consists of three main layers:

1. **Frontend** – React/Vite application served through Nginx
2. **Backend** – Node.js/Express REST API
3. **Database** – PostgreSQL database

Docker Compose is used to orchestrate all application services.

The project also includes a dedicated database seeding service that automatically populates the PostgreSQL database when the application is deployed.

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       Internet       │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP
                                    ▼
                         ┌──────────────────────┐
                         │      AWS EC2         │
                         │                      │
                         │   Public IP Address  │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌──────────────────┐             ┌──────────────────┐
          │ Frontend         │             │ Backend          │
          │ React + Vite      │             │ Node.js/Express  │
          │ Nginx             │             │ REST API         │
          │ Port 8080         │             │ Port 3002        │
          └────────┬─────────┘             └────────┬─────────┘
                   │                                │
                   │ API Requests                   │
                   │                                │
                   └────────────────────────────────┘
                                                    │
                                                    ▼
                                         ┌──────────────────┐
                                         │   PostgreSQL     │
                                         │   Database       │
                                         │   Port 5432      │
                                         └──────────────────┘
                                                    ▲
                                                    │
                                         ┌──────────────────┐
                                         │ Database Seed    │
                                         │ init.sql         │
                                         └──────────────────┘


🧱 3-Tier Architecture
Tier 1 – Presentation Layer

Technology:

React
Vite
Nginx
HTML
CSS
JavaScript

The frontend is exposed through:

```bash

http://<EC2-PUBLIC-IP>:8080

```

Docker mapping:

```bash

Host Port 8080 → Container Port 8080

```

## Tier 2 – Application Layer

### Technology

- Node.js
- Express.js
- REST API

### Backend Configuration

The backend application runs internally on **port 3002**.

```text
Container Port: 3002


## Tier 3 – Database Layer

### Technology

- PostgreSQL 17
- PostgreSQL Docker Volume

### Database Configuration

**Database Name:**

```text
ecommercewebsite


📂 Project Structure

Ecommerce-Website/
│
├── backEnd/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── .env
│
├── frontEnd/
│   ├── public/
│   │   └── profile.png
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── .env
│
├── database/
│   └── init.sql
│
├── docker-compose.yml
│
└── README.md


🐳 Docker Implementation

The application uses Docker to containerise each major component.

Docker Compose manages:

Frontend
Backend
PostgreSQL
Database seed process


🐳 Docker Compose Services

The project contains the following services:


```text
frontend
backend
db
seed

```

