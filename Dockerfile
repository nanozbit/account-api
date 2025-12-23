# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 8080

# Set environment variables (defaults)
ENV PORT=8080
ENV APP_ENV=dev
ENV DB_HOST=localhost
ENV DB_PORT=3306
ENV DB_NAME=app_dev
ENV DB_USER=root
ENV DB_PASSWORD=password

# Start the application
CMD ["node", "dist/main"]