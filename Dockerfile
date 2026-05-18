FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build-schema
EXPOSE 3001
CMD ["node", "server.js"]
