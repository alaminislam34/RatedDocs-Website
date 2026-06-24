# -----------------------
# Base Image
# -----------------------
FROM node:22-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS dev
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

CMD ["corepack", "pnpm", "dev", "--hostname", "0.0.0.0"]


FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm exec next build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user (SECURITY)
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001

# Install curl for healthcheck
RUN apk add --no-cache curl libc6-compat

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Fix permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Healthcheck (PROPER)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
    CMD curl -f http://localhost:3000 || exit 1

# Start app
CMD ["node", "server.js"]