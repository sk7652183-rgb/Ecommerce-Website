# ==========================================
# STAGE 1: Build & Install Dependencies
# ==========================================
FROM node:24-slim AS builder
WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install ALL dependencies (including devDependencies if needed for build)
RUN npm ci

# Copy the rest of your application code
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

# Copy only the necessary production dependencies from Stage 1
COPY --from=builder --chown=node:node /app/package*.json ./
RUN npm ci --only=production

# Copy the application source code from Stage 1
COPY --from=builder --chown=node:node /app/. .

# Switch from 'root' to the secure non-root 'node' user
USER node

# Expose your backend port (change to match your app's port)
EXPOSE 3002


# Start the application
CMD ["npm", "run","dev"]

