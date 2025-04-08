# Etapa 1: Construção
FROM node:18-alpine AS builder

WORKDIR /mao-amiga

# Aceita variáveis como argumento no build
ARG OPENAI_API_KEY
ARG OPENAI_ASSISTANT_ID

# Exporta para o ambiente da aplicação (necessário para Next.js build)
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV OPENAI_ASSISTANT_ID=$OPENAI_ASSISTANT_ID

COPY package.json package-lock.json ./
RUN npm install --force

COPY . .

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
