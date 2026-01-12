# Docker Setup Guide

This project includes Docker configurations for both development and production environments.

## Files Overview

- `Dockerfile` - Production-optimized multi-stage build
- `Dockerfile.dev` - Development build with hot reloading
- `docker-compose.yml` - Production docker-compose setup
- `docker-compose.dev.yml` - Development docker-compose setup
- `.dockerignore` - Files to exclude from Docker builds

## Quick Start

### Development Environment

```bash
# Start development environment with hot reloading
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up -d --build
```

The frontend will be available at `http://localhost:3000`

### Production Environment

```bash
# Build and start production environment
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

## Individual Container Commands

### Frontend Only (Development)

```bash
# Build development image
docker build -f Dockerfile.dev -t frontend-dev .

# Run development container
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules frontend-dev
```

### Frontend Only (Production)

```bash
# Build production image
docker build -t frontend-prod .

# Run production container
docker run -p 3000:3000 frontend-prod
```

## Environment Variables

The docker-compose files include default environment variables. You can override them by:

1. Creating a `.env` file in the project root
2. Using the `environment` section in docker-compose files
3. Passing them via command line: `docker-compose up -e NEXT_PUBLIC_API_URL=http://custom-api:3001/api`

## Adding Backend Services

The docker-compose files include commented sections for common services:

### Backend API
Uncomment and configure the backend service in `docker-compose.yml`:

```yaml
backend:
  build:
    context: ../backend  # Adjust path to your backend
    dockerfile: Dockerfile
  ports:
    - "3001:3001"
  environment:
    - NODE_ENV=production
  networks:
    - app-network
```

### Database (PostgreSQL)
Uncomment the database service:

```yaml
db:
  image: postgres:15-alpine
  environment:
    - POSTGRES_DB=myapp
    - POSTGRES_USER=user
    - POSTGRES_PASSWORD=password
  volumes:
    - postgres_data:/var/lib/postgresql/data
  ports:
    - "5432:5432"
```

### Redis Cache
Uncomment the Redis service:

```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
```

## Useful Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs frontend

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose up --build frontend

# Execute commands in running container
docker-compose exec frontend sh
```

## Troubleshooting

### Port Conflicts
If ports 3000 or 3001 are already in use, modify the port mappings in the docker-compose files:

```yaml
ports:
  - "3002:3000"  # Use port 3002 instead of 3000
```

### Build Issues
- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache`
- Check .dockerignore to ensure necessary files aren't excluded

### Development Hot Reloading
Make sure the volume mounts are correct in `docker-compose.dev.yml`:

```yaml
volumes:
  - .:/app
  - /app/node_modules
  - /app/.next
```

## Production Considerations

- The production Dockerfile uses multi-stage builds for smaller image size
- Static files are optimized and served efficiently
- The container runs as a non-root user for security
- Environment variables should be set via secrets management in production