# src/Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
EXPOSE 3001

CMD ["node", "src/index.js"]
