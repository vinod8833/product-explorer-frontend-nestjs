# Frontend - Product Data Explorer

A Next.js frontend application for exploring products from World of Books with live scraping capabilities.

## Quick Start

Run the entire frontend locally with a single command:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

The application will be available at **http://localhost:3000**

## Prerequisites

- Docker and Docker Compose installed on your system
- No Node.js installation required (runs in container)

## Development Commands

| Command | Description |
|---------|-------------|
| `docker-compose -f docker-compose.dev.yml up --build` | Start development server with hot reloading |
| `docker-compose -f docker-compose.dev.yml up -d --build` | Start in background (detached mode) |
| `docker-compose -f docker-compose.dev.yml down` | Stop development server |
| `docker-compose -f docker-compose.dev.yml logs frontend-dev` | View application logs |

## Production Build

```bash
docker-compose up --build
```

## Local Development (without Docker)

If you prefer to run without Docker:

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── styles/             # Global styles
```

## Environment Variables

The application uses these environment variables (configured in docker-compose files):

- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_DESCRIPTION` - Application description
- `NEXT_TELEMETRY_DISABLED` - Disable Next.js telemetry

## Features

- 🔍 Live product search and scraping
- 📚 Product catalog exploration
- 💝 Wishlist functionality
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast development with hot reloading
- 🐳 Docker containerization

## Tech Stack

- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Query, SWR
- **UI Components**: Headless UI, Lucide React
- **Animation**: Framer Motion
- **HTTP Client**: Axios

## Troubleshooting

### Port Already in Use
If port 3000 is occupied, modify the port in `docker-compose.dev.yml`:
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Container Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache
```

### View Container Logs
```bash
docker-compose -f docker-compose.dev.yml logs -f frontend-dev
```

## Additional Documentation

- [Docker Setup Guide](DOCKER_README.md) - Detailed Docker configuration and deployment options
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API

## Contributing

1. Make your changes
2. Test locally with `docker-compose -f docker-compose.dev.yml up --build`
3. Ensure the application runs without errors
4. Submit your changes

---

**Need help?** Check the [Docker Setup Guide](DOCKER_README.md) for advanced configuration options.