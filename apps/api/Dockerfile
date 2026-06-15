FROM node:22-alpine AS build

WORKDIR /app

COPY apps/api/package*.json ./
RUN npm ci --workspaces=false

COPY apps/api/ ./
RUN npm run build
RUN npm prune --omit=dev --workspaces=false

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3333

CMD ["node", "dist/main.js"]
