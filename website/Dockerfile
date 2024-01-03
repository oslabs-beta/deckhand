# Stage 1: Building the site
FROM node:latest as build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Docusaurus codebase into the container
COPY . .

# Build the site
RUN npm run build

# Stage 2: Serve the site with Nginx
FROM nginx:alpine

# Copy static files from build stage to Nginx public folder
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
