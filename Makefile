# Product Explorer Frontend - Makefile
# Simple commands to get started quickly

.PHONY: help install dev build start stop clean logs shell test

# Default target
help: ## Show this help message
	@echo "Product Explorer Frontend - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Quick Start:"
	@echo "  1. make install    # Setup the project"
	@echo "  2. make dev        # Start development server"
	@echo "  3. Open http://localhost:3000 in your browser"

install: ## Install dependencies and setup the project
	@echo "🚀 Setting up Product Explorer Frontend..."
	@echo "📦 Pulling Docker images and building containers..."
	@docker-compose -f docker-compose.dev.yml build
	@echo "✅ Installation complete!"
	@echo ""
	@echo "Next steps:"
	@echo "  Run 'make dev' to start the development server"

dev: ## Start development server with hot reloading
	@echo "🔥 Starting development server..."
	@echo "📍 Frontend will be available at: http://localhost:3000"
	@echo "⏳ This may take a moment on first run..."
	@docker-compose -f docker-compose.dev.yml up --build

dev-detached: ## Start development server in background
	@echo "🔥 Starting development server in background..."
	@docker-compose -f docker-compose.dev.yml up -d --build
	@echo "✅ Development server started!"
	@echo "📍 Frontend available at: http://localhost:3000"
	@echo "📋 Use 'make logs' to view output or 'make stop' to stop"

build: ## Build production version
	@echo "🏗️  Building production version..."
	@docker-compose build
	@echo "✅ Production build complete!"

start: ## Start production server
	@echo "🚀 Starting production server..."
	@docker-compose up -d
	@echo "✅ Production server started!"
	@echo "📍 Frontend available at: http://localhost:3000"

stop: ## Stop all running containers
	@echo "🛑 Stopping all containers..."
	@docker-compose -f docker-compose.dev.yml down
	@docker-compose down
	@echo "✅ All containers stopped!"

clean: ## Clean up Docker containers, images, and cache
	@echo "🧹 Cleaning up Docker resources..."
	@docker-compose -f docker-compose.dev.yml down --remove-orphans
	@docker-compose down --remove-orphans
	@docker system prune -f
	@echo "✅ Cleanup complete!"

logs: ## View application logs
	@echo "📋 Viewing application logs (Press Ctrl+C to exit)..."
	@docker-compose -f docker-compose.dev.yml logs -f frontend-dev

logs-all: ## View all container logs
	@echo "📋 Viewing all container logs (Press Ctrl+C to exit)..."
	@docker-compose -f docker-compose.dev.yml logs -f

shell: ## Open shell inside frontend container
	@echo "🐚 Opening shell in frontend container..."
	@docker-compose -f docker-compose.dev.yml exec frontend-dev sh

test: ## Run tests (when available)
	@echo "🧪 Running tests..."
	@docker-compose -f docker-compose.dev.yml exec frontend-dev npm test

status: ## Check container status
	@echo "📊 Container Status:"
	@docker-compose -f docker-compose.dev.yml ps

restart: ## Restart development server
	@echo "🔄 Restarting development server..."
	@make stop
	@make dev

# Quick development workflow
quick-start: install dev ## Complete setup and start development (one command)

# Health check
health: ## Check if the application is running
	@echo "🏥 Checking application health..."
	@curl -s -o /dev/null -w "Frontend Status: %{http_code}\n" http://localhost:3000 || echo "❌ Frontend not running. Try 'make dev'"
	@echo "🔗 Checking backend API connection..."
	@curl -s -o /dev/null -w "Backend API Status: %{http_code}\n" http://localhost:3001/api/health || echo "❌ Backend API not accessible at http://localhost:3001/api/"

# Backend API helpers
api-docs: ## Open backend API documentation
	@echo "📚 Opening backend API documentation..."
	@echo "🌐 API Docs: http://localhost:3001/api/docs/"
	@command -v xdg-open >/dev/null 2>&1 && xdg-open http://localhost:3001/api/docs/ || echo "Please open http://localhost:3001/api/docs/ in your browser"

api-test: ## Test backend API connectivity
	@echo "🧪 Testing backend API connectivity..."
	@echo "📍 API Base URL: http://localhost:3001/api/"
	@echo ""
	@echo "Testing endpoints:"
	@echo -n "  Health: "
	@curl -s -w "%{http_code}" http://localhost:3001/api/health || echo "❌ Failed"
	@echo ""
	@echo -n "  Products: "
	@curl -s -w "%{http_code}" http://localhost:3001/api/products?limit=1 || echo "❌ Failed"
	@echo ""
	@echo -n "  Categories: "
	@curl -s -w "%{http_code}" http://localhost:3001/api/categories?limit=1 || echo "❌ Failed"
	@echo ""

# Development helpers
rebuild: ## Force rebuild containers without cache
	@echo "🔨 Force rebuilding containers..."
	@docker-compose -f docker-compose.dev.yml build --no-cache
	@echo "✅ Rebuild complete!"

# Show running processes
ps: ## Show running Docker processes
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"