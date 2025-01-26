# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./ 
RUN npm install --frozen-lockfile --legacy-peer-deps

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run the app
FROM node:18-alpine AS runner
WORKDIR /app

# Security: Add a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary files for production
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Security: Run as non-root user
USER nextjs

# Expose port for clarity
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
