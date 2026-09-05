# 🛒 Ecommerce Website — DevOps Project

A containerised, full-stack Ecommerce Website built with 🐳 Docker and Docker Compose, and deployed to an ☁️ AWS EC2 (Ubuntu) instance.

The system follows a **three-tier architecture**:

- 🎨 **Frontend** — React + Vite
- ⚙️ **Backend** — Node.js + Express
- 🗄️ **Database** — PostgreSQL 17

The project demonstrates multi-stage Docker builds, Nginx as a static file server, persistent PostgreSQL storage, automated database seeding, container health checks, inter-service dependencies, environment-based configuration, and end-to-end deployment on AWS EC2.

---

## 1. 🏗️ Architecture Overview

```text
                         Internet
                            |
                            v
                    +----------------+
                    |    AWS EC2     |
                    |     Ubuntu     |
                    +-------+--------+
                            |
                            | Docker Compose
                            |
          +-----------------+-----------------+
          |                 |                 |
          v                 v                 v
   +-------------+   +-------------+   +-------------+
   |  Frontend   |   |   Backend   |   | PostgreSQL  |
   | React/Vite  |   | Node/Express|   | PostgreSQL 17|
   |    Nginx    |   |             |   |             |
   |    :8080    |   |    :3002    |   |    :5432    |
   +------+------+   +------+------+   +------+------+
          |                 |                 |
          |                 +--------+--------+
          |                          |
          |                          v
          |                   +-------------+
          |                   |    Seed     |
          |                   |  init.sql   |
          |                   +-------------+
          |
          v
        Browser
```

---

## 2. 🧰 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Web Server | Nginx |
| Backend Runtime | Node.js 24 |
| API Framework | Express.js |
| Database | PostgreSQL 17 |
| Containerisation | Docker |
| Orchestration | Docker Compose |
| Cloud Platform | AWS EC2 |
| Operating System | Ubuntu |
| Version Control | Git / GitHub |

---

## 3. 📁 Project Structure

```text
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
```

---

## 4. ⚙️ Backend — Dockerfile

The backend is built using a **two-stage Docker build**:

1. **Builder stage** (`node:24-slim`) — installs dependencies and prepares the application source.
2. **Runtime stage** (`node:24-alpine`) — a lightweight production image that runs as the non-root `node` user.

```dockerfile
# ==========================================
# STAGE 1: Build & Install Dependencies
# ==========================================
FROM node:24-slim AS builder

WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install ALL dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .


# ==========================================
# STAGE 2: Final Production Runtime
# ==========================================
FROM node:24-alpine AS runner

WORKDIR /app

# Ensure the app directory is owned by the non-root 'node' user
RUN chown -R node:node /app

# Set the environment to production
ENV NODE_ENV=production

# Copy package files from builder
COPY --from=builder --chown=node:node /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application source code
COPY --from=builder --chown=node:node /app/. .

# Switch from root to non-root user
USER node

# Expose backend port
EXPOSE 3002

# Start the application
CMD ["npm", "run", "dev"]
```

📦 **Container name:** `ecommerce-backend`
🔌 **Internal port:** `3002`
🔀 **Host mapping:** `80 → 3002`

```text
Host Port 80 → Container Port 3002
```

🌐 **Backend API endpoint:**

```text
http://<EC2-PUBLIC-IP>/api/v1/
```

---

## 5. 🎨 Frontend — Dockerfile

The frontend also uses a two-stage build:

1. **Builder stage** (`node:24-slim`) — installs dependencies and produces the Vite production build, running as a non-root user throughout.
2. **Runtime stage** (`nginxinc/nginx-unprivileged:1.27-alpine`) — serves the static assets via an unprivileged Nginx image.

```dockerfile
# ==========================================
# STAGE 1: Build the static assets
# ==========================================
FROM node:24-slim AS builder

WORKDIR /app

# Change ownership of the app folder
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Copy package files
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY --chown=node:node . .

# Build production frontend
RUN npm run build


# ==========================================
# STAGE 2: Serve static files with Nginx
# ==========================================
FROM nginxinc/nginx-unprivileged:1.27-alpine

# Copy production build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose Nginx port
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

📦 **Container name:** `ecommerce-frontend`
🏗️ **Build output:** `/app/dist` → copied to `/usr/share/nginx/html`
🔌 **Served port:** `8080`
🖥️ **Base image:** `nginxinc/nginx-unprivileged:1.27-alpine` (runs Nginx without root privileges)

```text
http://<EC2-PUBLIC-IP>:8080
```

---

## 6. 🐙 Docker Compose

The stack is orchestrated with four services: `frontend`, `backend`, `db`, and `seed`.

```yaml
services:

  frontend:
    container_name: ecommerce-frontend
    build: ./frontEnd
    ports:
      - "8080:8080"
    depends_on:
      seed:
        condition: service_completed_successfully


  backend:
    container_name: ecommerce-backend
    build: ./backEnd
    env_file:
      - ./backEnd/.env
    ports:
      - "80:3002"
    depends_on:
      db:
        condition: service_healthy


  db:
    image: postgres:17-alpine
    container_name: postgres_db
    restart: always

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 25092007dy
      POSTGRES_DB: ecommercewebsite

    volumes:
      - postgres_data:/var/lib/postgresql/data

    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d ecommercewebsite"]
      interval: 10s
      timeout: 5s
      retries: 5


  seed:
    image: postgres:17-alpine
    container_name: ecommerce-seed

    depends_on:
      backend:
        condition: service_started

    environment:
      PGPASSWORD: 25092007dy

    volumes:
      - ./database/init.sql:/seed/init.sql:ro

    command: >
      sh -c "
      until pg_isready -h db -U postgres -d ecommercewebsite;
      do
        echo 'Waiting for PostgreSQL...';
        sleep 2;
      done;
      echo 'Waiting for backend tables...';
      sleep 10;
      echo 'Running database seed...';
      psql -h db -U postgres -d ecommercewebsite -f /seed/init.sql;
      echo 'Database seed completed.';
      "

    restart: "no"


volumes:
  postgres_data:
```

> ⚠️ **Note:** The password shown above (`25092007dy`) is a placeholder from the original setup. See [Section 14 — Security](#14-security) for how to externalise credentials properly.

---

## 7. 🧩 Service Breakdown

### 7.1 🎨 Frontend
- **Build context:** `./frontEnd`
- **Container:** `ecommerce-frontend`
- **Port mapping:** `8080:8080`
- **Startup condition:** waits for the `seed` service to complete successfully.

### 7.2 ⚙️ Backend
- **Build context:** `./backEnd`
- **Container:** `ecommerce-backend`
- **Environment file:** `./backEnd/.env`
- **Port mapping:** `80:3002`
- **Startup condition:** waits for PostgreSQL to report a healthy status.

### 7.3 🗄️ PostgreSQL
- **Image:** `postgres:17-alpine`
- **Container:** `postgres_db`
- **Database name:** `ecommercewebsite`
- **User:** `postgres`
- **Port:** `5432`
- **Persistent storage:** Docker volume `postgres_data`, mounted at `/var/lib/postgresql/data`

### 7.4 🌱 Database Seed
- **Image:** `postgres:17-alpine`
- **Container:** `ecommerce-seed`
- **Seed file:** `database/init.sql`, mounted read-only at `/seed/init.sql`
- **Wait strategy:** polls the database using `pg_isready -h db -U postgres -d ecommercewebsite`
- **Seed command:** `psql -h db -U postgres -d ecommercewebsite -f /seed/init.sql`
- **Expected exit status:** `0` (a successful, one-time run)

```text
ecommerce-seed    Exited (0)
```

✅ This exit status is expected and confirms the database was seeded correctly.

---

## 8. 🔄 Service Startup Flow

```text
PostgreSQL
    |
    | Health Check
    v
Backend
    |
    | Service Started
    v
Seed
    |
    | Seed Completed Successfully
    v
Frontend
```

---

## 9. 🔌 Port Configuration

| Service | Container Port | Host Port |
|---|---:|---:|
| Frontend | 8080 | 8080 |
| Backend | 3002 | 80 |
| PostgreSQL | 5432 | 5432 |

**Application URLs:**

```text
Frontend:  http://<EC2-PUBLIC-IP>:8080
Backend:   http://<EC2-PUBLIC-IP>
API:       http://<EC2-PUBLIC-IP>/api/v1/
```

---

## 10. 🔐 Environment Variables

**Backend** (`backEnd/.env`):

```env
PORT=3002
DB_HOST=db
DB_PORT=5432
DB_NAME=ecommercewebsite
DB_USER=postgres
DB_PASSWORD=<YOUR_DATABASE_PASSWORD>
```

**Frontend** (`frontEnd/.env`):

```env
VITE_API_BASE_URL=http://<EC2-PUBLIC-IP>/api/v1/
```

Example:

```env
VITE_API_BASE_URL=http://52.38.59.15/api/v1/
```

> After updating the frontend `.env`, rebuild the frontend image so Vite bakes in the new value:
>
> ```bash
> docker compose build --no-cache frontend
> docker compose up -d frontend
> ```

---

## 11. 💾 PostgreSQL Persistent Storage

PostgreSQL data is persisted using a named Docker volume:

```yaml
volumes:
  postgres_data:
```

Mounted at `/var/lib/postgresql/data`, this volume ensures data survives container restarts and recreations.

```bash
# List all Docker volumes
docker volume ls

# Inspect the volume
docker volume inspect postgres_data
```

---

## 12. 🔑 Database Access

```bash
# Connect to PostgreSQL
docker exec -it postgres_db psql -U postgres -d ecommercewebsite
```

```sql
-- List databases
\l

-- List tables
\dt

-- Exit
\q
```

---

## 13. ☁️ AWS EC2 Deployment

```bash
# 1. Connect to the EC2 instance
ssh -i <key.pem> ubuntu@<EC2-PUBLIC-IP>

# 2. Clone the repository
git clone <YOUR-GITHUB-REPOSITORY>

# 3. Navigate into the project
cd Ecommerce-Website/Ecommerce-Website

# 4. Verify the expected files are present
ls
```

Expected output:

```text
backEnd
database
frontEnd
docker-compose.yml
README.md
```

```bash
# 5. Build the images
docker compose build

# 6. Start the stack
docker compose up -d

# 7. Verify running containers
docker ps

# Or view all containers, including stopped ones
docker ps -a
```

### 13.1 📜 Viewing Logs

```bash
docker logs ecommerce-frontend
docker logs ecommerce-backend
docker logs postgres_db
docker logs ecommerce-seed

# Follow a single service
docker logs -f ecommerce-backend

# Follow all services
docker compose logs -f
```

**Expected backend logs:**

```text
SERVER IS LISTENING ON PORT: 3002
DATABASE CONNECTED!
DATABASE MODEL SYNCED!
```

**Expected seed log:**

```text
Database seed completed.
```

### 13.2 🛠️ Common Docker Commands

```bash
# Build / rebuild
docker compose build
docker compose build --no-cache

# Start / stop / restart
docker compose up -d
docker compose down
docker compose restart

# Logs
docker compose logs
docker compose logs -f

# Inspect state
docker ps
docker ps -a
docker images
docker volume ls

# Shell into a running container
docker exec -it ecommerce-frontend sh
docker exec -it ecommerce-backend sh
docker exec -it postgres_db sh
```

### 13.3 🔁 Full Rebuilds

**Standard rebuild (keeps the database):**

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

**Full reset (wipes the database):**

```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

> ⚠️ **Warning:** `docker compose down -v` removes the `postgres_data` volume along with all existing database records. Use a plain `docker compose down` if the data needs to be preserved.

### 13.4 🩹 Frontend Troubleshooting

If the browser continues to display outdated content after a rebuild, it is most likely serving a cached JavaScript bundle.

- **Hard refresh:** `Ctrl + Shift + R`
- **Clear site data:** Chrome DevTools → Application → Storage → Clear site data
- Alternatively, test in an **Incognito window**

Diagnostic checks:

```bash
# Check whether an old/stale IP is still baked into the frontend build
docker exec ecommerce-frontend sh -c 'grep -Rni "32.185.191.155" /usr/share/nginx/html 2>/dev/null | head'

# Confirm the current IP is present
docker exec ecommerce-frontend sh -c 'grep -Rni "<EC2-PUBLIC-IP>" /usr/share/nginx/html 2>/dev/null | head'

# Confirm profile content was bundled correctly
docker exec ecommerce-frontend sh -c 'grep -Rni "Abusufiyan" /usr/share/nginx/html 2>/dev/null | head'

# Confirm the profile image was copied into the image
docker exec ecommerce-frontend ls -lh /usr/share/nginx/html/profile.png
```

---

## 14. 🔒 Security

The current configuration hard-codes the PostgreSQL password:

```yaml
POSTGRES_PASSWORD: 25092007dy
```

This is **not** suitable for a public repository or production deployment. Secrets should be externalised, for example:

```yaml
environment:
  POSTGRES_USER: ${POSTGRES_USER}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  POSTGRES_DB: ${POSTGRES_DB}
```

with the actual values stored outside version control:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<YOUR_PASSWORD>
POSTGRES_DB=ecommercewebsite
```

`.env` files should always be excluded from Git:

```gitignore
.env
*.env
node_modules/
dist/
```

**Recommended hardening for production:**

- AWS Secrets Manager for credential storage
- IAM least-privilege access policies
- HTTPS/TLS termination
- An Application Load Balancer in front of the services
- Amazon RDS instead of a self-managed PostgreSQL container
- Docker image and dependency vulnerability scanning
- Git secret scanning
- CloudWatch monitoring and alerting

**AWS Security Group — typical inbound rules:**

| Type | Port | Purpose |
|---|---:|---|
| SSH | 22 | EC2 administration |
| HTTP | 80 | Backend / API |
| Custom TCP | 8080 | Frontend |

Additional production recommendations:

- Restrict SSH access to trusted IP ranges only
- Never expose PostgreSQL (port 5432) publicly
- Enforce HTTPS
- Use an Application Load Balancer
- Keep the database private, inside a VPC
- Apply least-privilege IAM roles

---

## 15. 🌿 Git Workflow

The DevOps implementation lives on the `Devops` branch.

```bash
# Switch branches
git checkout Devops

# Check status
git status

# Stage and commit
git add .
git commit -m "Add Docker Compose configuration and database seed"

# Push
git push origin Devops
```

**Redeploying on EC2 after a push:**

```bash
git pull origin Devops

docker compose down
docker compose build --no-cache
docker compose up -d

docker ps
```

---

## 16. 🗺️ Deployment Flow Diagram

```text
Developer
    |
    v
GitHub
    |
    v
Devops Branch
    |
    v
AWS EC2
    |
    v
Docker Compose
    |
    +--------------------+
    |                    |
    v                    v
Frontend              Backend
React/Vite            Node.js
Nginx                 Express
Port 8080             Port 3002
                           |
                           v
                      PostgreSQL
                       Port 5432
                           |
                           ^
                           |
                     Database Seed
                        init.sql
```

---

## 17. 🚀 Roadmap / Future Improvements

A natural next step is a full CI/CD pipeline:

```text
GitHub
   |
   v
GitHub Actions
   |
   +-- Build
   +-- Test
   +-- Security Scan
   +-- Docker Build
   |
   v
Amazon ECR
   |
   v
AWS Deployment
```

Other planned enhancements:

- Terraform for Infrastructure as Code
- Amazon ECR for image storage
- Amazon RDS for a managed PostgreSQL instance
- Application Load Balancer
- HTTPS/SSL
- AWS CloudWatch
- Prometheus + Grafana for monitoring
- Trivy for container scanning
- SonarQube for code quality
- AWS Secrets Manager
- Kubernetes / Amazon EKS

---

## 18. 🧠 Skills Demonstrated

Docker · Docker Compose · Multi-stage Docker Builds · Docker Volumes · Docker Health Checks · Docker Networking · Non-root Containers · Nginx · React · Vite · Node.js · Express.js · PostgreSQL · Database Seeding · REST APIs · CORS · Environment Variables · Linux · AWS EC2 · Git · GitHub · 3-Tier Architecture · Container Troubleshooting · Application Deployment · Log Analysis · DevOps Workflow

---

## 19. 📊 Project Status

| Component | Status |
|---|---|
| Frontend | ✅ |
| Backend | ✅ |
| PostgreSQL | ✅ |
| Database Seed | ✅ |
| Docker | ✅ |
| Docker Compose | ✅ |
| Multi-stage Builds | ✅ |
| Non-root Containers | ✅ |
| Nginx | ✅ |
| AWS EC2 | ✅ |
| 3-Tier Architecture | ✅ |
| Git DevOps Branch | ✅ |

---

## 20. ⚡ Quick Start

```bash
git clone <YOUR-GITHUB-REPOSITORY>
cd Ecommerce-Website/Ecommerce-Website

docker compose build
docker compose up -d
docker ps
```

Open the application:

```text
http://<EC2-PUBLIC-IP>:8080
```

**Redeployment:**

```bash
git pull origin Devops

docker compose down
docker compose build --no-cache
docker compose up -d

docker ps
docker compose logs -f
```

---

## 21. 👤 Author

**Abusufiyan Khan**
DevOps / Cloud / Infrastructure Project

📬 **Contact:**
- ✉️ Email: abusufiyan730@gmail.com
- 📍 Location: Sakinaka, Mumbai, Maharashtra, India — 400072

---

**Built with:** React • Vite • Node.js • Express • PostgreSQL • Docker • Docker Compose • Nginx • AWS EC2
