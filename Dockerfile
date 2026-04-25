# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ========================================
# Stage 2: Development (docker compose default)
# ========================================
FROM node:20-alpine AS dev
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "run", "dev"]

# ========================================
# Stage 3: Production Build
# ========================================
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ========================================
# Stage 4: Production Runner
# ========================================
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl curl
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g prisma
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
USER nextjs

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
