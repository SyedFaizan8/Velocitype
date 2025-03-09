FROM node:18-alpine AS builder

RUN apk update && apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json turbo.json ./

RUN npm ci

COPY . .

RUN npm run build --filter=velocity

FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/velocity/.next/standalone ./
COPY --from=builder /app/apps/velocity/.next/static ./apps/velocity/.next/static
COPY --from=builder /app/apps/next-app/public ./apps/velocity/public
COPY --from=builder /app/apps/velocity/package.json ./apps/velocity/package.json

WORKDIR /app/apps/velocity

RUN npm ci --production

EXPOSE 3000

USER nextjs

CMD ["npm", "start"]
