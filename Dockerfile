# Dockerfile para o Sistema da Biblioteca Valdiva Colaço
# EMEF Desembargador Pedro de Queiroz
FROM node:20-alpine AS base

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código-fonte
COPY . .

# Compilação para produção
RUN npm run build

# Expor porta padrão de desenvolvimento / produção
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Comando padrão
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
