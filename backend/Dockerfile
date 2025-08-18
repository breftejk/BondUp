# ───────────────────── Builder stage ─────────────────────
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY tsconfig.json .
COPY src ./src
RUN pnpm run build

# ───────────────────── Development stage ─────────────────────
FROM node:22-alpine AS dev

# Doppler + Nest CLI + Prisma CLI
RUN apk add --no-cache curl gnupg \
  && curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh \
  && npm install -g @nestjs/cli prisma

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm prisma generate

# Run migrations before starting dev server
ENTRYPOINT ["doppler", "run", "--"]
CMD ["sh", "-c", "pnpm prisma migrate deploy --schema ./prisma/schema.prisma && pnpm run start:dev"]

# ───────────────────── Production stage ─────────────────────
FROM node:22-alpine AS prod

RUN apk add --no-cache curl gnupg \
  && curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh \
  && npm install -g prisma

WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

RUN pnpm prisma generate

ENTRYPOINT ["doppler", "run", "--"]
CMD ["sh", "-c", "pnpm prisma migrate deploy --skip-seed && pnpm run start:prod"]