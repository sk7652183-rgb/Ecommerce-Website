# --- STAGE 1: Build the static assets ---
FROM node:24-slim AS builder
WORKDIR /app

# Change ownership of the app folder to the default 'node' user
RUN chown -R node:node /app

# Switch to the non-root user before handling files
USER node

# Copy files (maintaining non-root ownership) and build
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build

# --- STAGE 2: Serve the static files with Nginx ---
# Unprivileged Nginx variant runs on a non-root 'nginx' user by default
FROM nginxinc/nginx-unprivileged:1.27-alpine

# Copy the built production assets from the builder stage
# Default Nginx HTML directory path is slightly different in the unprivileged image
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 8080 (Non-root users cannot bind to ports below 1024)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

