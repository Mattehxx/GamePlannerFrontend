# Stage 1: Build
FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --production
 
# Stage 2: Serve
FROM nginx:alpine
COPY --from=build-stage /app/dist/game-planner /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]