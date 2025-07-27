# 🔗 **Urlvy – Smart Short Links, Live Insights**

**Urlvy** transforms long, ugly URLs into memorable slugs, enriches them with **AI-powered** summaries and tracks every click in real-time. Share, analyse, and chat with an AI analyst about your traffic – all in one slick workspace.

**Think “Bitly × Mixpanel” with a built-in data scientist. 🚀**

<p align="center">
  <img src="docs/logo.png" alt="Urlvy Logo" width="45%" style="border-radius: 10px">
</p>

> [!IMPORTANT]
> _Born from my frustration with blind, un-branded links. Urlvy gives marketers, dev-rels and indie hackers immediate feedback on every share._

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-EA4C1D?style=flat-square&logo=datagrip&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-889889?style=flat-square&logo=shadcnui&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-ffdd55?style=flat-square&logo=chartdotjs&logoColor=black)
![Google AI](https://img.shields.io/badge/Google_AI-4285F4?style=flat-square&logo=google&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Amazon Web Services](https://img.shields.io/badge/Amazon_Web_Services-232F3E?style=flat-square&logo=task&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-623CE4?style=flat-square&logo=terraform&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white)
![Nhost](https://img.shields.io/badge/Nhost-00C58E?style=flat-square&logo=nhost&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)
![Makefile](https://img.shields.io/badge/Makefile-000000?style=flat-square&logo=make&logoColor=white)
![Shell](https://img.shields.io/badge/Shell-89E051?style=flat-square&logo=gnu-bash&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=flat-square&logo=eslint&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)

## 📑 Table of Contents

1. [About Urlvy](#-about-urlvy)
2. [Live Demo](#-live-demo)
3. [Feature Highlights](#-feature-highlights)
4. [Tech Stack & Architecture](#-tech-stack--architecture)
5. [Architecture Diagram](#-architecture-diagram)
6. [Screenshots](#-screenshots)
7. [Database Schema](#-database-schema)
8. [Getting Started](#-getting-started)
9. [API Reference](#-api-reference)
10. [Deployment Guide](#-deployment-guide)
11. [Scripts & Makefile](#-scripts--makefile)
12. [Nhost Backup Backend](#-nhost-backup-backend)
13. [Testing](#-testing)
14. [CI/CD](#-cicd)
15. [Docker & Compose](#-docker--compose)
16. [AWS Deployment](#-aws-deployment)
17. [Contributing](#-contributing)
18. [License](#-license)
19. [Author](#-author)

## 🪄 About Urlvy

Urlvy is a **full-stack URL platform** that lets you:

- 🔐 **Shorten & brand** links with custom slugs
- 💬 **AI summaries** – fetches the titles & generates AI-powered two-line previews automatically
- 📈 **Live analytics** – track clicks, referrers, devices, geos in real-time and more
- 🤖 **Chat with UrlvyStatsBot** – ask “Why did clicks spike yesterday?” and get insights
- ⏲ **TTL & auto-expire** – set links to self-destruct or pause whenever
- 📊 **Dashboard** – global stats across every link, top performers & histograms
- 🛡 **Security first** – JWT, RBAC guards, rate-limited endpoints
- 🧰 **REST + Swagger** – fully typed OpenAPI 3.1 spec, ready for your automation

Built for **growth hackers, product teams and indie makers** who need answers, not raw CSVs.

## 🌍 Live Demo

Urlvy is live and ready to use! Check it out:

- **Frontend** – [https://urlvy.vercel.app](https://urlvy.vercel.app)
- **Backend API - Swagger Docs** – [https://api.urlvy.app/docs](https://urlvy-url-shortener-app.onrender.com/docs)

Feel free to register with a throw-away address and play – no credit card, no limits during beta.

> [!CAUTION]
> The demo may be down periodically due to inactivity or maintenance. If you encounter issues, please try again later or deploy your own instance using the instructions below. Please don't rely on the demo for production use, as it may not always be available!

## ✨ Feature Highlights

Urlvy packs a punch with its features, designed to make link management and analytics a breeze:

| Category      | Goodies                                                                              |
| ------------- | ------------------------------------------------------------------------------------ |
| **Link Ops**  | One-click shorten, custom slug, edit destination, expire × date or by clicks         |
| **Analytics** | 30-day line chart, hourly bar, weekday bar, device pie, interval histogram & scatter |
| **AI**        | Summaries on create, conversational stats bot with full chat history                 |
| **Auth**      | Register, login, JWT refresh, forgot-password (email verify + reset)                 |
| **UI/UX**     | Dark mode, skeleton loaders, animated counters, responsive & accessible              |
| **Docs**      | Swagger UI served 100 % from CDN, favicon, OpenAPI JSON at `/docs-json`              |
| **DevX**      | ESLint, Prettier, Husky, Type-safe DTOs, Zod on FE, ValidationPipe on BE             |
| **Ops**       | Docker-Compose dev stack, Postgres 15, Redis cache (future), GitHub Actions CI, AWS  |

## 🏗 Tech Stack & Architecture

We use a very modern stack to ensure performance, scalability and developer experience!

| Layer         | Stack                                                                            |
| ------------- | -------------------------------------------------------------------------------- |
| **Frontend**  | Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| **Backend**   | NestJS 10, TypeORM, PostgreSQL, Swagger, class-validator                         |
| **Auth**      | bcrypt, JWT RS256, Passport, CORS                                                |
| **AI**        | Google GenerativeAI Large Language Model (LLM)                                   |
| **Infra**     | Vercel / Docker-Compose local / Amazon Web Services                              |
| **Dev Tools** | Yarn Berry, ESLint, Prettier, Commitlint, Husky, GitHub Actions                  |

## 🖼 Architecture Diagram

Here's a high-level overview of Urlvy's architecture (not necessarily complete, but gives you an idea of how the components interact):

<p align="center">
  <img src="docs/arch.png" alt="Architecture Diagram" width="100%">
</p>

```mermaid
flowchart TD
    subgraph ClientApp[Client]
        A[Next.js PWA]
    end
    subgraph CDNLayer[CDN]
        CDN[Edge + Cache]
    end
    subgraph APILayer[API]
        G[AWS<br/>NestJS API]
    end
subgraph Database[DB]
P[(PostgreSQL ← TypeORM)]
end
subgraph AIService[AI]
M[Google AI LLM]
end

A -- Static assets --> CDN
A -- REST/JWT --> G
G -- SQL --> P
G -- Summaries / Chat --> M

style ClientApp fill:#d0e8ff,stroke:#333
style CDNLayer fill:#d0ffd8,stroke:#333
style APILayer fill:#ffd0d8,stroke:#333
style Database fill:#e0e0e0,stroke:#333
style AIService fill:#dcd0ff,stroke:#333
```

## 📸 Screenshots

### Landing Page

<p align="center">
  <img src="docs/landing.png" alt="Landing Page" width="100%">
</p>

### Dashboard

<p align="center">
  <img src="docs/dashboard.png" alt="Dashboard" width="100%">
</p>

### URL Details

<p align="center">
  <img src="docs/link-detail.png" alt="URL Details" width="100%">
</p>

### Visualizations

<p align="center">
  <img src="docs/charts.png" alt="Visualizations" width="100%">
</p>

### AI Chat

<p align="center">
  <img src="docs/chatbot.png" alt="AI Chat" width="100%">
</p>

### Dark Mode

<p align="center">
  <img src="docs/dark.png" alt="Dark Mode" width="100%">
</p>

### Login & Register & Reset Password

<p align="center">
  <img src="docs/login.png" alt="Login & Register" width="100%">
</p>

<p align="center">
  <img src="docs/register.png" alt="Register" width="100%">
</p>

<p align="center">
  <img src="docs/forgot.png" alt="Reset Password" width="100%">
</p>

## 🗄 Database Schema

As mentioned, Urlvy uses **PostgreSQL 15** with TypeORM for ORM. The schema is designed for performance and scalability, with UUIDs for primary keys and indexed foreign keys.

### Entity ERD (PostgreSQL 15)

| Table     | Fields (excerpt)                                          | Notes                 |
| --------- | --------------------------------------------------------- | --------------------- |
| **user**  | id UUID PK · email uniq · password_hash · created_at      | salted Bcrypt 10      |
| **url**   | id UUID · slug uniq · destination · summary · owner_id FK | summary pre-generated |
| **click** | id UUID · url_id FK · ip · user_agent · created_at        | heavy SELECT indexing |

Full DDL in `database/schema.sql`.

## 🚀 Getting Started

```bash
git clone https://github.com/hoangsonww/urlvy.git
cd urlvy

# ─── Backend ─────────────────────────────────────────────
cd api
cp .env.example .env          # fill PG_URL, JWT_SECRET, GOOGLE_API_KEY
docker compose up -d postgres
npm i && npm run dev          # https://urlvy-url-shortener-app.onrender.com/docs

# ─── Frontend ────────────────────────────────────────────
cd ../web
cp .env.local.example .env.local   # NEXT_PUBLIC_API=https://urlvy-url-shortener-app.onrender.com
npm i --legacy-peer-deps
npm run dev                    # http://localhost:3000
```

> **Postgres' default URI:** `postgres://urlvy:password@localhost:5432/urlvy_db`. Change as needed.

## 📚 API Reference

We provide a fully typed REST API with OpenAPI 3.1 spec, accessible via Swagger UI.
You have 2 options to explore the API documentation:

1. Swagger UI: `/docs`
2. JSON: `/docs-json`

| Method | Endpoint              | Description                             |
| ------ | --------------------- | --------------------------------------- |
| POST   | `/auth/register`      | create user → JWT                       |
| POST   | `/auth/login`         | email + pwd → JWT                       |
| POST   | `/auth/forgot`        | verify email exists                     |
| POST   | `/auth/reset`         | reset pwd with token                    |
| GET    | `/urls`               | list my URLs                            |
| POST   | `/urls`               | create (`{ destination, customSlug? }`) |
| GET    | `/urls/:slug/details` | metadata + clicks (JSON)                |
| GET    | `/urls/:slug`         | 302 redirect (HTML)                     |
| PATCH  | `/urls/:slug`         | update destination                      |
| DELETE | `/urls/:slug`         | delete link                             |
| GET    | `/stats/:slug/daily`  | array of `{ day,count }`                |
| POST   | `/urls/:slug/chat`    | AI chat on stats                        |
| GET    | `/stats/global`       | aggregated stats for all links          |

Headers: `Authorization: Bearer <token>`

<p align="center">
  <img src="docs/swagger.png" alt="Swagger UI" width="100%">
</p>

## ☁️ Deployment Guide

To deploy Urlvy, you have several options depending on your stack and preferences. Here are the recommended methods:

| Target                | Steps                                                 |
| --------------------- | ----------------------------------------------------- |
| **Vercel** (web)      | `vercel --prod` _(auto from `web/vercel.json`)_       |
| **Render** (api)      | Connect repo → pick `api` dir → build `npm run build` |
| **AWS** (api)         | `scripts/deploy.sh aws` _(requires AWS CLI)_          |
| **Docker all-in-one** | `docker compose -f compose.prod.yml up --build -d`    |
| **Railway**           | 1-click template in `deploy/railway.json`             |

Required env vars: `PORT, DATABASE_URL, JWT_SECRET, GOOGLE_API_KEY`. Make sure to set them in your hosting provider's dashboard.

## 🔧 Scripts & Makefile

### Makefile

Urlvy uses a `Makefile` for common tasks to simplify development. Here are some key commands:

```bash
make setup-dev         # Setup dev environment (api + web)
make start-dev         # Start dev server (api + web)
make stop-dev          # Stop dev server

# and many more deployment, testing, linting tasks. Please check the Makefile for full list,
# or:
make help              # Show all available commands
```

### Shell Scripts

In addition to the Makefile, we have some shell scripts for convenience:

- `scripts/deploy.sh` – deploy to AWS, Render, or Vercel (your choice)
- `scripts/setup.sh` – setup dev environment (Postgres, Redis, etc.)

Please ensure you have the necessary permissions and environment variables set before running these scripts.
Also, visit these scripts to change/add any deployment configurations as needed before running.

## ✨ Nhost Backup Backend

Urlvy also provides a backup backend using Nhost, which is a serverless backend-as-a-service (BaaS) platform. This allows you to quickly set up a backend without managing servers.

To use the Nhost backend, follow these steps:

1. **Create a Nhost Project**:
   - Go to [Nhost](https://nhost.io) and create a new project.
   - Set up the database and authentication as per your requirements.

2. **Configure Environment Variables**:
   - Update your `.env` file with the Nhost project details:
     ```bash
     NHOST_BACKEND_URL=https://<your-nhost-backend-url>
     NHOST_GRAPHQL_URL=https://<your-nhost-graphql-url>
     ```
3. **Install Nhost CLI**:
   - Install the Nhost CLI globally:
     ```bash
     npm install -g nhost
     ```
4. **Run Nhost Locally** (optional):
   - If you want to run Nhost locally, you can use Docker:
     ```bash
     docker run -d -p 1337:1337 -p 3000:3000 nhost/nhost
     ```
   - This will start the Nhost backend on `http://localhost:1337`.

5. **Start the Application**:
   - Run the application as usual:
     ```bash
     cd ../web
     npm run dev
     ```

> [!NOTE]
> Make sure to update the frontend code to use the Nhost backend URLs for API calls or it will default to the local API!

## 🧪 Testing

Urlvy has a comprehensive test suite to ensure reliability and quality:

1. **Backend Tests**:

```bash
cd api
npm run test
```

2. **Frontend Tests**:

```bash
cd web
npm run test
```

Running tests will execute both unit and integration tests, ensuring all components work as expected.

## 🔄 CI/CD

Urlvy uses GitHub Actions for continuous integration and deployment. The CI/CD pipeline includes:

- **Linting** – runs ESLint and Prettier to ensure code quality
- **Testing** – executes unit and integration tests for both frontend and backend
- **Build** – compiles the Next.js app and NestJS API
- **Deployment** – deploys the frontend to Vercel and backend to AWS or Docker
- **Notifications** – sends notifications on success/failure to the PR or commit
- **Cache** – caches dependencies to speed up builds
- and more...

The CI/CD configuration is defined in `.github/workflows/workflow.yml`. You can customize it to fit your workflow.

## 🐳 Docker & Compose

### Docker

Urlvy provides a Docker setup for both development and production environments. This allows you to run the application in isolated containers, making it easy to manage dependencies and configurations.

We have two main Docker Compose files:

- `compose.dev.yml` – for local development (includes web, api, and pg)
- `compose.prod.yml` – for production deployment (includes web, api, pg, and Nginx)

To run, use:

```bash
docker compose up        # dev: web + api + pg
docker compose -f compose.prod.yml up --build  # prod
```

It will start the following services:

- `urlvy-backend` – NestJS
- `urlvy-frontend` – Next.js static export (served by Nginx)
- `urlvy-pg` – Postgres 15 w/ init script

The production setup also includes an Nginx reverse proxy to serve the frontend and API securely.

### Kubernetes

For Kubernetes users, we provide a `kubernetes/` directory with example manifests to deploy Urlvy on a Kubernetes cluster. This includes:

- Deployment manifests for the frontend and backend
- Service definitions for exposing the applications
- Ingress configuration for routing traffic
- PersistentVolumeClaims for PostgreSQL data storage
- and more...

Feel free to adapt these manifests to your cluster's requirements. You can use tools like `kubectl` or `Helm` to deploy Urlvy on Kubernetes.

## 🐍 AWS Deployment

Urlvy can be deployed on AWS using CloudFormation templates. The `aws/` directory contains the necessary YAML files to set up the infrastructure:

- `ecs-backend.yml` – deploys the NestJS API on ECS
- `rds-postgresql.yml` – provisions a PostgreSQL database on RDS
- `s3-cloudfront.yml` – sets up S3 for static assets and CloudFront for CDN
- `deploy.sh` – a script to deploy all stacks in the correct order

For more details on deploying Urlvy on AWS, please refer to the [AWS Deployment Guide](docs/aws-deployment.md).

## 🤝 Contributing

We welcome contributions to Urlvy! If you have ideas, bug fixes or improvements, please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Make your changes/improvements.
4. Before committing, run `npm run lint` and `npm run format` to ensure everything is in order. Add tests if applicable.
5. Commit your changes: `git commit -m "Add my feature"`
6. Push to your fork: `git push origin feature/my-feature`
7. Open a Pull Request against the `main` branch of this repository.
8. Wait for review and address any feedback.
9. Once approved, your changes will be merged!

Bug reports & feature requests are also welcomed via Issues. Feel free to open an issue if you find a bug or have a suggestion for a new feature.

## 📄 License

[MIT License](LICENSE) © 2025 Son Nguyen.

You can use Urlvy in your projects, commercial or non-commercial, as long as you include the original license and attribution.
You must attribute the original author in your project documentation or README, regardless of whether you modify the code or not, and what you use it for.

## 👨🏻‍💻 Author

Made with ☕ and keyboard rage by **[Son Nguyen](https://sonnguyenhoang.com)** 😅. Feel free to reach out to me on the following platforms:

- [GitHub](https://github.com/hoangsonww)
- [LinkedIn](https://www.linkedin.com/in/hoangsonw)
- [Email](mailto:hoangson091104@gmail.com)

Alternatively, you can also open an issue on this repository if you have any questions or suggestions, or just drop a message in the Discussion tab.

---

> [!NOTE]
> “Build links that _talk back_.” – Urlvy tagline
