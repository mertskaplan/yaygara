# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
# Install bun
RUN npm install -g bun
# Copy package manifests
COPY package.json bun.lockb* ./
# Install dependencies
RUN bun install --frozen-lockfile
# Copy the rest of the application source code
COPY . .
# Build the application for production
RUN bun run build
# Stage 2: Serve the application with a lightweight Nginx server
FROM nginx:1.25-alpine
# Copy the built static files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Create a custom Nginx configuration to support single-page application (SPA) routing.
# This ensures that refreshing the page on a route like /setup still loads the app.
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf
# Expose port 80 to the outside world
EXPOSE 80
# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]