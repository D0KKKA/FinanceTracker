.PHONY: help build up down logs clean restart shell-backend shell-frontend ps db-backup db-restore prune

DOCKER_COMPOSE = docker-compose

help:
	@echo "🐳 Finance Tracker - Docker Commands"
	@echo ""
	@echo "Основные команды:"
	@echo "  make build              - Построить Docker образы"
	@echo "  make up                 - Запустить все сервисы"
	@echo "  make down               - Остановить все сервисы"
	@echo "  make restart            - Перезагрузить сервисы"
	@echo ""
	@echo "Логи и мониторинг:"
	@echo "  make logs               - Просмотреть логи всех сервисов"
	@echo "  make logs-backend       - Логи бэкенда"
	@echo "  make logs-frontend      - Логи фронтенда"
	@echo "  make ps                 - Статус сервисов"
	@echo ""
	@echo "Доступ в контейнеры:"
	@echo "  make shell-backend      - Shell в бэкенд контейнере"
	@echo "  make shell-frontend     - Shell в фронтенд контейнере"
	@echo ""
	@echo "Управление данными:"
	@echo "  make db-backup          - Сделать бэкап БД"
	@echo "  make db-restore         - Восстановить БД из бэкапа"
	@echo ""
	@echo "Очистка:"
	@echo "  make clean              - Остановить и удалить контейнеры/volumes"
	@echo "  make prune              - Очистить Docker ресурсы"

# ===== Основные команды =====

build:
	@echo "🔨 Построение образов..."
	$(DOCKER_COMPOSE) build

up:
	@echo "🚀 Запуск сервисов..."
	$(DOCKER_COMPOSE) up -d
	@echo ""
	@echo "✅ Готово!"
	@echo "   Frontend:  http://localhost:3000"
	@echo "   Backend:   http://localhost:8000"
	@echo ""
	@echo "Просмотр логов: make logs"

down:
	@echo "⛔ Остановка сервисов..."
	$(DOCKER_COMPOSE) down

restart:
	@echo "🔄 Перезагрузка сервисов..."
	$(DOCKER_COMPOSE) restart
	@echo "✅ Готово!"

# ===== Логи и мониторинг =====

logs:
	$(DOCKER_COMPOSE) logs -f

logs-backend:
	$(DOCKER_COMPOSE) logs -f backend

logs-frontend:
	$(DOCKER_COMPOSE) logs -f frontend

ps:
	@$(DOCKER_COMPOSE) ps

# ===== Доступ в контейнеры =====

shell-backend:
	@echo "Открыт shell в бэкенд контейнере (выход: exit)"
	$(DOCKER_COMPOSE) exec backend sh

shell-frontend:
	@echo "Открыт shell в фронтенд контейнере (выход: exit)"
	$(DOCKER_COMPOSE) exec frontend sh

# ===== Управление данными =====

db-backup:
	@echo "💾 Создание бэкапа БД..."
	@mkdir -p ./backups
	@docker cp finance-backend:/app/data/finance.db ./backups/finance-$$(date +%Y%m%d-%H%M%S).db
	@echo "✅ Бэкап готов в ./backups/"

db-restore:
	@echo "⚠️  Введи имя файла бэкапа (например: finance-20231128-120000.db)"
	@read -p "Имя файла: " backup_file; \
	docker cp ./backups/$$backup_file finance-backend:/app/data/finance.db && \
	$(DOCKER_COMPOSE) restart backend && \
	echo "✅ БД восстановлена!"

# ===== Очистка =====

clean:
	@echo "🧹 Удаление контейнеров и volumes..."
	$(DOCKER_COMPOSE) down -v
	@echo "✅ Очищено!"

prune:
	@echo "🧹 Очистка Docker ресурсов..."
	docker image prune -a --force
	docker volume prune --force
	docker system prune -a --force
	@echo "✅ Docker очищен!"

# ===== Dev режим =====

dev-backend:
	@echo "🚀 Запуск бэкенда в режиме разработки..."
	@cd backend && npm run start:dev

dev-frontend:
	@echo "🚀 Запуск фронтенда в режиме разработки..."
	@cd finance-app && npm run dev

# ===== Build для production =====

build-prod:
	@echo "🔨 Production build..."
	$(DOCKER_COMPOSE) build --no-cache
	@echo "✅ Production образы готовы!"

# ===== Тестирование =====

test-backend:
	$(DOCKER_COMPOSE) exec backend npm test

test-frontend:
	$(DOCKER_COMPOSE) exec frontend npm test

# ===== Информация =====

version:
	@echo "Finance Tracker Version:"
	@grep version backend/package.json | head -1
	@$(DOCKER_COMPOSE) images

resources:
	docker stats --no-stream

.DEFAULT_GOAL := help
