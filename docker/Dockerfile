FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json turbo.json ./

COPY packages ./packages
COPY apps ./apps

RUN npm ci

FROM deps AS builder
WORKDIR /app/apps/velocity

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules

COPY --from=builder /app/apps/nextjs-app/.next ./apps/nextjs-app/.next
COPY --from=builder /app/apps/nextjs-app/package.json ./apps/nextjs-app/package.json
COPY --from=builder /app/apps/nextjs-app/next.config.js ./apps/nextjs-app/next.config.js
COPY --from=builder /app/apps/nextjs-app/public ./apps/nextjs-app/public

COPY --from=builder /app/apps/velocity/prisma ./apps/velocity/prisma
RUN npx prisma generate --schema=apps/velocity/prisma/schema.prisma

EXPOSE 3000

WORKDIR /app/apps/velocity
CMD ["npm", "start"]
