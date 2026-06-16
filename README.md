# 🚀 nova-starter

Welcome to **nova-starter**! This is a modern, open-source, multi-tenant SaaS boilerplate designed to accelerate your product development. Built with scalability and developer experience in mind, it seamlessly integrates a robust NestJS backend, a lightning-fast Next.js frontend, and a PostgreSQL database within a unified Turborepo monorepo architecture.

## ✨ Features

- **Monorepo Architecture (Turborepo):** Efficiently manage full-stack apps and packages with high-speed remote caching and parallel execution.
- **Secure JWT Authentication:** Full authentication flow using `bcrypt`, HTTP-only cookies, and Passport.js integration.
- **Native Multi-Tenancy:** Built-in organization (Tenant) isolation with role-based memberships linking Users to Workspaces.
- **Prisma Singleton Pattern:** Optimized and strongly-typed database access sharing a single Prisma Client instance across the whole architecture.
- **Pure Tailwind CSS UI:** A meticulously crafted, dependency-free premium design system prioritizing a sleek SaaS "Dark Mode" aesthetic.
- **GitHub Actions CI/CD:** Ready-to-go continuous integration pipeline for linting, type-checking, building, and automated Jest testing.
- **📚 Built-in Documentation:** A dedicated Next.js documentation app ready to host your project guides.

## 📁 Project Structure

```text
nova-starter/
├── apps/
│   ├── api/     # NestJS backend API
│   ├── docs/    # Next.js documentation site
│   └── web/     # Next.js frontend application
├── packages/
│   ├── database/ # Prisma schema and client
│   └── ui/       # Shared UI components
```

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Monorepo** | Turborepo | High-performance build system |
| **Frontend** | Next.js (App Router) | React framework for the Web |
| **Backend** | NestJS | Progressive Node.js framework |
| **Database** | PostgreSQL | Robust relational database |
| **ORM** | Prisma | Next-generation Node.js/TypeScript ORM |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |
| **Testing** | Jest | Delightful JavaScript Testing Framework |

## 🚀 Getting Started

Follow these steps to get your local development environment running:

### 1. Install Dependencies
Run this command from the root of the project to install all dependencies across the monorepo:
```bash
npm install
```

### 2. Start the Database
Spin up the local PostgreSQL database using Docker Compose:
```bash
docker compose up -d
```

### 3. Initialize the Schema
Navigate to the database package and apply the Prisma migrations to your local database:
```bash
cd packages/database
npx prisma migrate dev
```

### 4. Run the Development Servers
Return to the root directory and start all applications simultaneously:
```bash
cd ../..
npm run dev
```

* **Frontend:** Available at `http://localhost:3000`
* **Documentation:** Available at `http://localhost:3001`
* **API:** Available at `http://localhost:3002`

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it as you see fit.
