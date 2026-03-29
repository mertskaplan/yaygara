# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
# Install bun
RUN npm install -g bun@1.1.20

# Copy package manifests
COPY package.json bun.lock ./

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
# Create an entrypoint script to inject runtime environment variables into a static file
RUN cat <<EOF > /docker-entrypoint.sh
#!/bin/sh
echo "window.__APP_ENV__ = {" > /usr/share/nginx/html/env.js
echo "  TELEMETRY_ENABLED: \"\${TELEMETRY_ENABLED}\"," >> /usr/share/nginx/html/env.js
echo "  TELEMETRY_URL: \"\${TELEMETRY_URL}\"" >> /usr/share/nginx/html/env.js
echo "};" >> /usr/share/nginx/html/env.js
exec nginx -g "daemon off;"
EOF
RUN chmod +x /docker-entrypoint.sh

# Define default environment variables
ENV TELEMETRY_ENABLED=false
ENV TELEMETRY_URL=""

# Expose port 80 to the outside world
EXPOSE 80
# Start the entrypoint script
CMD ["/docker-entrypoint.sh"]