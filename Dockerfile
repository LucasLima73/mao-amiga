# Etapa 1: Construção
FROM node:18-alpine AS builder

WORKDIR /mao-amiga

COPY package.json package-lock.json ./
RUN npm install --force

# Copia o restante do código e o arquivo de ambiente
COPY . .
COPY .env.local .env.local

RUN npm run build
RUN npm prune --production --force

# Etapa 2: Execução
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /mao-amiga/package.json ./
COPY --from=builder /mao-amiga/package-lock.json ./
COPY --from=builder /mao-amiga/node_modules ./node_modules
COPY --from=builder /mao-amiga/.next ./.next
COPY --from=builder /mao-amiga/next.config.js ./
COPY --from=builder /mao-amiga/public ./public
COPY --from=builder /mao-amiga/.env.local .env.local

RUN npm install --only=production --force

EXPOSE 3031
CMD ["npm", "start"]
