# Estágio 1: Build
FROM node:22.12.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Produção com Nginx
FROM nginx:stable-alpine
# Copia o build do React para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Expõe a porta 80 (padrão web)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]