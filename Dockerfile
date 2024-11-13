# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.13.1
FROM node:${NODE_VERSION} as base

LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules and additional dependencies (including Python 3)
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    node-gyp \
    pkg-config \
    python3 \
    python3-pip \
    python3-dev \
    g++ \
    libxi-dev \
    libglu1-mesa-dev \
    libglew-dev \
    libgl1-mesa-glx \
    libx11-dev \
    libxext-dev && \
    # Create symlink for python to point to python3
    ln -s /usr/bin/python3 /usr/bin/python

# Install node modules
COPY package-lock.json package.json ./ 
RUN npm ci --include=dev

# Rebuild native modules (such as headless-gl)
RUN npm rebuild

# Copy application code
COPY . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM nginx

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Start the server by default, this can be overwritten at runtime
EXPOSE 80
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
