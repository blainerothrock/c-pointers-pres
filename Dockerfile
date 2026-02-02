FROM node:22-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "sleep infinity | pnpm slidev --remote --port 8080"]
