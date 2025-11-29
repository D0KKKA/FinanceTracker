#!/bin/bash

set -e

echo "========================================="
echo "🚀 Finance Tracker - Docker Initialization"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
echo "📋 Проверка установленного ПО..."

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен!${NC}"
    echo "Установи Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose не установлен!${NC}"
    echo "Установи Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker установлен${NC}"
echo -e "${GREEN}✅ Docker Compose установлен${NC}"
echo ""

# Check if ports are available
echo "🔌 Проверка портов..."

check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ Порт $1 уже занят!${NC}"
        return 1
    fi
    echo -e "${GREEN}✅ Порт $1 доступен${NC}"
    return 0
}

if ! check_port 3000; then
    echo "Попробуй: lsof -i :3000 | grep LISTEN | awk '{print \$2}' | xargs kill -9"
fi

if ! check_port 8000; then
    echo "Попробуй: lsof -i :8000 | grep LISTEN | awk '{print \$2}' | xargs kill -9"
fi
echo ""

# Create .env files if they don't exist
echo "📝 Проверка конфигурационных файлов..."

if [ ! -f "backend/.env" ]; then
    echo "Создание backend/.env..."
    cat > backend/.env << 'EOF'
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)
DATABASE_PATH=/app/data/finance.db
PORT=8000
CORS_ORIGIN=http://localhost:3000
EOF
    echo -e "${GREEN}✅ backend/.env создан${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env уже существует${NC}"
fi

if [ ! -f "finance-app/.env.local" ]; then
    echo "Создание finance-app/.env.local..."
    cat > finance-app/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
    echo -e "${GREEN}✅ finance-app/.env.local создан${NC}"
else
    echo -e "${YELLOW}⚠️  finance-app/.env.local уже существует${NC}"
fi
echo ""

# Build images
echo "🔨 Построение Docker образов..."
echo "Это может занять несколько минут..."
echo ""

docker-compose build

echo ""
echo -e "${GREEN}✅ Образы построены успешно!${NC}"
echo ""

# Start services
echo "🚀 Запуск сервисов..."
docker-compose up -d

echo ""
echo "⏳ Ожидание инициализации сервисов..."
sleep 5

# Check health
echo ""
echo "🏥 Проверка статуса сервисов..."
echo ""

if docker-compose ps | grep -q "backend.*healthy"; then
    echo -e "${GREEN}✅ Backend запущен и здоров${NC}"
else
    echo -e "${YELLOW}⚠️  Backend инициализируется...${NC}"
fi

if docker-compose ps | grep -q "frontend.*healthy"; then
    echo -e "${GREEN}✅ Frontend запущен и здоров${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend инициализируется...${NC}"
fi

echo ""
echo "========================================="
echo -e "${GREEN}🎉 Инициализация завершена!${NC}"
echo "========================================="
echo ""
echo "📱 Доступные сервисы:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo ""
echo "📚 Полезные команды:"
echo "   make logs              - Просмотреть логи"
echo "   make down              - Остановить сервисы"
echo "   make shell-backend     - Shell в бэкенде"
echo "   make shell-frontend    - Shell во фронте"
echo ""
echo "📖 Подробнее: cat DOCKER.md"
echo ""

# Wait for services to be healthy
echo "⏳ Ожидание полной готовности сервисов (может занять до 30 сек)..."

# Function to check if service is healthy
wait_for_service() {
    local service=$1
    local timeout=60
    local elapsed=0

    while [ $elapsed -lt $timeout ]; do
        if docker-compose ps $service | grep -q "healthy"; then
            echo -e "${GREEN}✅ $service готов${NC}"
            return 0
        fi
        sleep 2
        elapsed=$((elapsed + 2))
        echo -n "."
    done

    echo ""
    echo -e "${YELLOW}⚠️  $service все еще инициализируется${NC}"
    return 0
}

wait_for_service "backend"
wait_for_service "frontend"

echo ""
echo -e "${GREEN}✅ Всё готово! Поехали! 🚀${NC}"
echo ""
