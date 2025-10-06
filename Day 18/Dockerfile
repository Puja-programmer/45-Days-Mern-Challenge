# Stage 1: build (keeps parity; for Node this mainly copies deps)
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Stage 2: production
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app . 
EXPOSE 5000
CMD ["node", "server.js"]