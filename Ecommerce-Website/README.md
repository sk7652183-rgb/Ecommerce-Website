# Ecommerce Website – DevOps Project

A full-stack Ecommerce Website containerised using Docker and Docker Compose and deployed on an AWS EC2 Ubuntu server.

The application follows a **3-tier architecture** consisting of:

- React/Vite frontend
- Node.js/Express backend
- PostgreSQL 17 database

The project also includes multi-stage Docker builds, Nginx, PostgreSQL persistent storage, database seeding, Docker health checks, service dependencies, environment variables, and AWS EC2 deployment.

## Architecture

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

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Web Server | Nginx |
| Backend | Node.js 24 |
| API Framework | Express.js |
| Database | PostgreSQL 17 |
| Containerisation | Docker |
| Orchestration | Docker Compose |
| Cloud | AWS EC2 |
| Operating System | Ubuntu |
| Version Control | Git / GitHub |

## Project Structure

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

## Backend Dockerfile

The backend uses a **multi-stage Docker build**. The first stage uses `node:24-slim` to install dependencies and prepare the application. The second stage uses `node:24-alpine` as the final runtime image. The application runs using the non-root `node` user.

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

The backend container is `ecommerce-backend`.

The backend listens on port `3002`. Docker Compose maps host port `80` to container port `3002`.

```text
Host Port 80 → Container Port 3002
```

Backend API:

```text
http://<EC2-PUBLIC-IP>/api/v1/
```

## Frontend Dockerfile

The frontend uses a multi-stage Docker build. The first stage builds the React/Vite production assets. The second stage uses an unprivileged Nginx image to serve the static files.

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

The frontend container is `ecommerce-frontend`.

The production build is generated in:

```text
/app/dist
```

and copied to:

```text
/usr/share/nginx/html
```

The frontend is served on port `8080`.

```text
http://<EC2-PUBLIC-IP>:8080
```

The frontend uses:

```text
nginxinc/nginx-unprivileged:1.27-alpine
```

so Nginx runs without root privileges.

## Docker Compose

The application is managed using Docker Compose with four services:

- `frontend`
- `backend`
- `db`
- `seed`

Complete `docker-compose.yml`:

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

## Docker Services

### Frontend

The frontend is built from:

```text
./frontEnd
```

Container:

```text
ecommerce-frontend
```

Port mapping:

```text
8080:8080
```

The frontend waits for the seed service to complete successfully.

### Backend

The backend is built from:

```text
./backEnd
```

Container:

```text
ecommerce-backend
```

Environment variables are loaded from:

```text
./backEnd/.env
```

Port mapping:

```text
80:3002
```

The backend waits for PostgreSQL to become healthy.

### PostgreSQL

PostgreSQL uses:

```text
postgres:17-alpine
```

Container:

```text
postgres_db
```

Database:

```text
ecommercewebsite
```

Database user:

```text
postgres
```

Port:

```text
5432
```

PostgreSQL data is stored in the Docker volume:

```text
postgres_data
```

mounted at:

```text
/var/lib/postgresql/data
```

### Database Seed

The seed service uses:

```text
postgres:17-alpine
```

Container:

```text
ecommerce-seed
```

The SQL file:

```text
database/init.sql
```

is mounted as:

```text
/seed/init.sql
```

The file is mounted as read-only.

The seed service waits for PostgreSQL using:

```bash
pg_isready -h db -U postgres -d ecommercewebsite
```

It then executes:

```bash
psql -h db -U postgres -d ecommercewebsite -f /seed/init.sql
```

After successful execution, the seed container exits with status `0`.

```text
ecommerce-seed    Exited (0)
```

This is expected and indicates successful database seeding.

## Service Startup Flow

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

## Port Configuration

| Service | Container Port | Host Port |
|---|---:|---:|
| Frontend | 8080 | 8080 |
| Backend | 3002 | 80 |
| PostgreSQL | 5432 | 5432 |

Application URLs:

```text
Frontend:
http://<EC2-PUBLIC-IP>:8080

Backend:
http://<EC2-PUBLIC-IP>

API:
http://<EC2-PUBLIC-IP>/api/v1/
```

## Environment Variables

Backend environment file:

```text
backEnd/.env
```

Example:

```env
PORT=3002
DB_HOST=db
DB_PORT=5432
DB_NAME=ecommercewebsite
DB_USER=postgres
DB_PASSWORD=<YOUR_DATABASE_PASSWORD>
```

Frontend environment file:

```text
frontEnd/.env
```

Example:

```env
VITE_API_BASE_URL=http://<EC2-PUBLIC-IP>/api/v1/
```

Example:

```env
VITE_API_BASE_URL=http://52.38.59.15/api/v1/
```

After changing the frontend `.env`, rebuild the frontend:

```bash
docker compose build --no-cache frontend
docker compose up -d frontend
```

## PostgreSQL Persistent Storage

PostgreSQL uses a named Docker volume:

```yaml
volumes:
  postgres_data:
```

The volume is mounted at:

```text
/var/lib/postgresql/data
```

List Docker volumes:

```bash
docker volume ls
```

Inspect the volume:

```bash
docker volume inspect postgres_data
```

The volume keeps PostgreSQL data persistent when containers are restarted or recreated.

## Database Access

Connect to PostgreSQL:

```bash
docker exec -it postgres_db psql -U postgres -d ecommercewebsite
```

List databases:

```sql
\l
```

List tables:

```sql
\dt
```

Exit PostgreSQL:

```sql
\q
```

## AWS EC2 Deployment

The application is designed to run on an AWS EC2 Ubuntu instance.

Connect to EC2:

```bash
ssh -i <key.pem> ubuntu@<EC2-PUBLIC-IP>
```

Clone the repository:

```bash
git clone <YOUR-GITHUB-REPOSITORY>
```

Navigate to the project:

```bash
cd Ecommerce-Website/Ecommerce-Website
```

Verify the files:

```bash
ls
```

Expected:

```text
backEnd
database
frontEnd
docker-compose.yml
README.md
```

Build the Docker images:

```bash
docker compose build
```

Start the application:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Check all containers:

```bash
docker ps -a
```

## Docker Logs

Frontend logs:

```bash
docker logs ecommerce-frontend
```

Backend logs:

```bash
docker logs ecommerce-backend
```

PostgreSQL logs:

```bash
docker logs postgres_db
```

Seed logs:

```bash
docker logs ecommerce-seed
```

Follow backend logs:

```bash
docker logs -f ecommerce-backend
```

Follow all Compose logs:

```bash
docker compose logs -f
```

Expected backend logs:

```text
SERVER IS LISTENING ON PORT: 3002
DATABASE CONNECTED!
DATABASE MODEL SYNCED!
```

Expected seed log:

```text
Database seed completed.
```

## Docker Commands

Build:

```bash
docker compose build
```

Build without cache:

```bash
docker compose build --no-cache
```

Start:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

Restart:

```bash
docker compose restart
```

View logs:

```bash
docker compose logs
```

Follow logs:

```bash
docker compose logs -f
```

View containers:

```bash
docker ps
```

View all containers:

```bash
docker ps -a
```

List images:

```bash
docker images
```

List volumes:

```bash
docker volume ls
```

Enter frontend container:

```bash
docker exec -it ecommerce-frontend sh
```

Enter backend container:

```bash
docker exec -it ecommerce-backend sh
```

Enter PostgreSQL container:

```bash
docker exec -it postgres_db sh
```

## Complete Rebuild

For a normal clean rebuild:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

For a complete reset including PostgreSQL data:

```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

> **Warning:** `docker compose down -v` deletes the PostgreSQL Docker volume and therefore removes the existing database data.

Use `docker compose down` when you want to keep the database.

## Frontend Troubleshooting

If the browser continues to show old frontend information after rebuilding the Docker container, the browser may be using cached JavaScript files.

Perform a hard refresh:

```text
Ctrl + Shift + R
```

Alternatively:

```text
Chrome DevTools
→ Application
→ Storage
→ Clear site data
```

The application can also be tested using an Incognito window.

Check whether an old IP exists in the built frontend:

```bash
docker exec ecommerce-frontend sh -c 'grep -Rni "32.185.191.155" /usr/share/nginx/html 2>/dev/null | head'
```

Check the current IP:

```bash
docker exec ecommerce-frontend sh -c 'grep -Rni "<EC2-PUBLIC-IP>" /usr/share/nginx/html 2>/dev/null | head'
```

Check the profile information:

```bash
docker exec ecommerce-frontend sh -c 'grep -Rni "Abusufiyan" /usr/share/nginx/html 2>/dev/null | head'
```

Check the profile image:

```bash
docker exec ecommerce-frontend ls -lh /usr/share/nginx/html/profile.png
```

## Profile Information

The application profile has been configured with:

```text
Name: Abusufiyan
Username: Abusufiyankhan
Date of Birth: 18/09/1997
Email: abusufiyan730@gmail.com
Phone: 7738901810
Location: Mumbai
Address: Sakinaka Mumbai - 400072
State: Maharashtra
Country: India
ZIP Code: 400072
```

Profile image:

```text
frontEnd/public/profile.png
```

The image can be used in React:

```jsx
<img src="/profile.png" alt="Profile" />
```

## Git Workflow

The DevOps implementation is maintained on the:

```text
Devops
```

branch.

Switch to the branch:

```bash
git checkout Devops
```

Check status:

```bash
git status
```

Stage changes:

```bash
git add .
```

Commit changes:

```bash
git commit -m "Add Docker Compose configuration and database seed"
```

Push changes:

```bash
git push origin Devops
```

Pull the latest changes on EC2:

```bash
git pull origin Devops
```

Redeploy:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

Check:

```bash
docker ps
```

## AWS Security Group

Typical inbound rules:

| Type | Port | Purpose |
|---|---:|---|
| SSH | 22 | EC2 administration |
| HTTP | 80 | Backend/API |
| Custom TCP | 8080 | Frontend |

For production environments:

- Restrict SSH access to trusted IP addresses.
- Do not expose PostgreSQL publicly.
- Use HTTPS.
- Use an Application Load Balancer.
- Use a private database.
- Use appropriate IAM permissions.

## Security

The current Docker Compose configuration contains the PostgreSQL password directly:

```yaml
POSTGRES_PASSWORD: 25092007dy
```

For a public GitHub repository or production environment, credentials should not be stored directly in `docker-compose.yml`.

A better configuration is:

```yaml
environment:
  POSTGRES_USER: ${POSTGRES_USER}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  POSTGRES_DB: ${POSTGRES_DB}
```

The values can be stored in a secure environment file:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<YOUR_PASSWORD>
POSTGRES_DB=ecommercewebsite
```

The `.env` files should be excluded from Git:

```gitignore
.env
*.env
node_modules/
dist/
```

For production, consider:

- AWS Secrets Manager
- IAM least-privilege permissions
- HTTPS/TLS
- Application Load Balancer
- Amazon RDS for PostgreSQL
- Docker image scanning
- Dependency scanning
- Secret scanning
- CloudWatch monitoring

## DevOps Deployment Flow

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

## Future Improvements

The project can be extended with a complete CI/CD pipeline:

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

Additional DevOps improvements can include:

- Terraform for Infrastructure as Code
- Amazon ECR for Docker images
- Amazon RDS for PostgreSQL
- Application Load Balancer
- HTTPS/SSL
- AWS CloudWatch
- Prometheus
- Grafana
- Trivy
- SonarQube
- AWS Secrets Manager
- Kubernetes
- Amazon EKS

## DevOps Skills Demonstrated

```text
Docker
Docker Compose
Multi-stage Docker Builds
Docker Volumes
Docker Health Checks
Docker Networking
Non-root Containers
Nginx
React
Vite
Node.js
Express.js
PostgreSQL
Database Seeding
REST APIs
CORS
Environment Variables
Linux
AWS EC2
Git
GitHub
3-Tier Architecture
Container Troubleshooting
Application Deployment
Log Analysis
DevOps Workflow
```

## Project Status

```text
Frontend             ✅
Backend              ✅
PostgreSQL           ✅
Database Seed        ✅
Docker               ✅
Docker Compose       ✅
Multi-stage Builds   ✅
Non-root Containers  ✅
Nginx                ✅
AWS EC2              ✅
3-Tier Architecture  ✅
Git DevOps Branch    ✅
```

## Quick Start

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

For redeployment:

```bash
git pull origin Devops

docker compose down

docker compose build --no-cache

docker compose up -d

docker ps

docker compose logs -f
```

## Developer

**Abusufiyan Khan**

DevOps / Cloud / Infrastructure Project

---

**Built with React • Vite • Node.js • Express • PostgreSQL • Docker • Docker Compose • Nginx • AWS EC2**
