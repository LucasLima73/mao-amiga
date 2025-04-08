# Etapa 1: Construção
FROM node:18-alpine AS builder

WORKDIR /mao-amiga

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install --force

# Copia o restante do código
COPY . .

# Build da aplicação
RUN npm run build

# Remove as devDependencies para reduzir o tamanho da imagem
RUN npm prune --production --force

# Etapa 2: Execução
FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos necessários do estágio de construção
COPY --from=builder /mao-amiga/package.json ./ 
COPY --from=builder /mao-amiga/package-lock.json ./ 
COPY --from=builder /mao-amiga/node_modules ./node_modules 
COPY --from=builder /mao-amiga/.next ./.next  
COPY --from=builder /mao-amiga/next.config.js ./ 
COPY --from=builder /mao-amiga/public ./public  

# Instala apenas as dependências de produção (não é necessário instalar as devDependencies)
RUN npm install --only=production --force

# Expondo a porta 3031
EXPOSE 3031

# Comando para iniciar a aplicação
CMD ["npm", "start"]
