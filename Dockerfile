# Etapa base com Node Alpine
FROM node:20-alpine AS base

# Etapa de dependências
FROM base AS deps
WORKDIR /app

# Instala compatibilidade de bibliotecas
RUN apk add --no-cache libc6-compat

# Copia package.json e instala dependências
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Etapa de build
FROM base AS builder
WORKDIR /app

# Copia as dependências
COPY --from=deps /app/node_modules ./node_modules

# Copia o restante dos arquivos
COPY . .

# Copia variáveis de ambiente para o build
COPY .env.local .env.local

# Gera o build
RUN npm run build

# Etapa de execução final
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copia somente os arquivos necessários para produção
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copia env para execução
COPY .env.local .env.local

EXPOSE 3000

CMD ["npm", "start"]
