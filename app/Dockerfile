# Usamos una imagen ligera de Node.js
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias primero para aprovechar el cache de capas
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código (incluyendo la carpeta public)
COPY . .

# Exponer el puerto que usa la app
EXPOSE 3000

# Comando para arrancar
CMD ["node", "server.js"]