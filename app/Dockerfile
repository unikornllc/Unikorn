# app/Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV NEXT_PUBLIC_SERVER=http://localhost:3001
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
