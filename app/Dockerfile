FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

ARG NEXT_PUBLIC_SERVER
ENV NEXT_PUBLIC_SERVER=$NEXT_PUBLIC_SERVER

RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
