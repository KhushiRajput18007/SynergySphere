# Build Stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production Stage
FROM node:20-slim

WORKDIR /app

# Copy built files and package specs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/db ./server/db

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start command
CMD ["npm", "run", "start"]
