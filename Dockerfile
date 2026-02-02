FROM node:22-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# Pre-warm Vite's dependency optimization cache
RUN pnpm slidev build || true

EXPOSE 8080

CMD ["pnpm", "slidev", "--remote", "--port", "8080"]
