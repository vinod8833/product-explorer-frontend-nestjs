# Product Explorer Frontend

A modern Next.js frontend for exploring products with real-time search, advanced filtering, and comprehensive product management capabilities.

## 🚀 Quick Start

### Prerequisites
- **Docker** & **Docker Compose** ([Install Guide](https://docs.docker.com/get-docker/))
- **Git** ([Install Guide](https://git-scm.com/downloads))
- **Make** (usually pre-installed on Linux/macOS, [Windows Guide](https://gnuwin32.sourceforge.net/packages/make.htm))

### One-Command Setup
```bash
git clone <your-repo-url>
cd product-explorer-frontend
make quick-start
```

🎉 **Application available at:** http://localhost:3000

## 📋 Available Commands

### Essential Commands
| Command | Description |
|---------|-------------|
| `make install` | Install dependencies and setup project |
| `make dev` | Start development server with hot reloading |
| `make build` | Build production version |
| `make start` | Start production server |
| `make stop` | Stop all running containers |
| `make clean` | Clean up Docker resources |

### Development Workflow
```bash
make install     # First-time setup
make dev         # Start development (http://localhost:3000)
make logs        # View application logs
make stop        # Stop when finished
```

### Utility Commands
```bash
make status      # Check container status
make health      # Check application health
make shell       # Open shell in container
make restart     # Restart development server
make rebuild     # Force rebuild containers
```

## 🏗️ Technology Stack

- **Framework:** Next.js 16.1.1 with App Router
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 4.0
- **State Management:** React Query, SWR
- **UI Components:** Headless UI, Lucide React
- **HTTP Client:** Axios
- **Containerization:** Docker & Docker Compose

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── products/          # Product pages
│   ├── categories/        # Category management
│   ├── live-books/        # Live search features
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── lib/                   # Utilities & configurations
├── hooks/                 # Custom React hooks
├── contexts/              # React contexts
└── styles/                # Global styles
```

## ⚙️ Configuration

### Environment Variables

The application uses environment variables for configuration. Copy `.env.example` to `.env.local` for local development:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:3001/api` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Product Data Explorer` |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` |

### Configuration Files
- `.env.local` - Local development environment
- `.env.production` - Production environment
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## 🐳 Docker Setup

The project uses Docker for consistent development and production environments:

- **Development:** `docker-compose.dev.yml` with hot reloading
- **Production:** `docker-compose.yml` with optimized builds

### Manual Docker Commands
```bash
# Development
docker-compose -f docker-compose.dev.yml up --build

# Production
docker-compose up --build
```

## 🔧 Development

### Local Development (without Docker)
If you prefer to run without Docker:

```bash
npm install
npm run dev
```

### Code Quality
```bash
npm run lint     # ESLint checks
npm run build    # Type checking and build
```

## 🚨 Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
make stop        # Stop any running containers
make clean       # Clean up resources
make dev         # Restart development
```

**Container build issues:**
```bash
make rebuild     # Force rebuild without cache
```

**API connection issues:**
```bash
make health      # Check application health
make api-test    # Test backend connectivity
```

### Debug Commands
```bash
make logs        # View application logs
make logs-all    # View all container logs
make shell       # Access container shell
make status      # Check container status
```

## 📚 API Integration

The frontend connects to a backend API for data. Default endpoints:

- **Products:** `GET /api/products`
- **Categories:** `GET /api/categories`
- **Search:** `GET /api/products/search`

Backend API documentation: http://localhost:3001/api/docs/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Setup development: `make install`
4. Make changes and test: `make dev`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Quick Help:** Run `make help` for available commands
- **Issues:** Create GitHub issues for bugs and feature requests
- **Documentation:** Check inline code comments for detailed information

---

**Ready to explore products? Run `make quick-start` and visit http://localhost:3000**