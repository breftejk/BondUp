# Builder stage for TypeScript compilation
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY tsconfig.json .
COPY src ./src
RUN pnpm run build

# Development stage
FROM node:22-alpine AS dev

RUN apk add --no-cache curl gnupg \
  && curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

RUN npm install -g @nestjs/cli

COPY . .
ENTRYPOINT ["doppler", "run", "--"]
CMD ["pnpm", "run", "start:dev"]

# Production stage
FROM node:22-alpine AS prod

RUN apk add --no-cache curl gnupg \
  && curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh
  
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile
COPY --from=builder /app/dist ./dist

ENTRYPOINT ["doppler", "run", "--"]
CMD ["pnpm", "run", "start:prod"]