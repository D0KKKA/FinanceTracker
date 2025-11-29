# Finance Tracker - Docker Deployment Guide

Это руководство поможет вам развернуть Finance Tracker приложение с использованием Docker и Docker Compose.

## Требования

- Docker Desktop (для Mac/Windows) или Docker + Docker Compose (для Linux)
- Минимум 2GB свободной памяти
- Порты 3000 и 8000 должны быть доступны

## Быстрый старт

### 1. Клонирование репозитория

```bash
cd /Users/dokkka/projects/web_iitu_final
```

### 2. Запуск приложения

```bash
docker-compose up --build
```

Это команда:
- Построит Docker образы для фронтенда и бэкенда
- Запустит оба сервиса
- Создаст необходимые volumes для хранения данных

### 3. Доступ к приложению

После того как все контейнеры запустятся:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Swagger Docs** (если добавить): http://localhost:8000/api

## Детальные команды

### Запуск в фоновом режиме

```bash
docker-compose up -d
```

### Просмотр логов

```bash
# Все логи
docker-compose logs -f

# Логи бэкенда
docker-compose logs -f backend

# Логи фронтенда
docker-compose logs -f frontend
```

### Остановка сервисов

```bash
docker-compose down
```

### Полное удаление (включая volumes)

```bash
docker-compose down -v
```

### Перестройка образов

```bash
docker-compose build --no-cache
```

### Запуск конкретного сервиса

```bash
# Только бэкенд
docker-compose up backend

# Только фронтенд
docker-compose up frontend
```

## Конфигурация

### Переменные окружения

#### Backend (.env)

```env
NODE_ENV=production
JWT_SECRET=your-secret-key-here
DATABASE_PATH=/app/data/finance.db
PORT=8000
CORS_ORIGIN=http://localhost:3000
```

**Важно!** Измени `JWT_SECRET` на сильный рандомный ключ в production!

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Изменение портов

Отредактируй `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "9000:8000"  # Старый:Новый порт

  frontend:
    ports:
      - "3001:3000"  # Старый:Новый порт
```

## Структура Docker Compose

```yaml
Services:
├── backend      # NestJS API (8000)
│   ├── Dockerfile   # Multi-stage build
│   ├── .dockerignore # Исключает ненужные файлы
│   └── volumes      # backend_data (для SQLite)
│
└── frontend     # Next.js приложение (3000)
    ├── Dockerfile   # Оптимизированный Next.js образ
    └── .dockerignore # Исключает ненужные файлы

Volumes:
└── backend_data # Хранит SQLite базу данных

Networks:
└── finance_network # Сеть для коммуникации сервисов
```

## Управление данными

### Резервная копия БД

```bash
# Копировать БД из контейнера
docker cp finance-backend:/app/data/finance.db ./backup_finance.db
```

### Восстановление БД

```bash
# Копировать БД в контейнер
docker cp ./backup_finance.db finance-backend:/app/data/finance.db

# Перезагрузить бэкенд
docker-compose restart backend
```

### Удаление всех данных

```bash
docker-compose down -v
```

## Мониторинг и диагностика

### Проверка статуса сервисов

```bash
docker-compose ps
```

### Проверка health status

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Запуск shell в контейнере

```bash
# Backend shell
docker exec -it finance-backend sh

# Frontend shell
docker exec -it finance-frontend sh
```

### Просмотр логов конкретного контейнера

```bash
docker logs -f finance-backend
docker logs -f finance-frontend
```

## Решение проблем

### Порты уже заниматы

```bash
# Найти процесс использующий порт
lsof -i :8000
lsof -i :3000

# Убить процесс (если нужно)
kill -9 <PID>
```

### Контейнер не запускается

```bash
# Проверить логи
docker-compose logs -f <service-name>

# Пересобрать образ
docker-compose build --no-cache <service-name>
```

### Issues с database connection

```bash
# Очистить всё и начать заново
docker-compose down -v
rm -rf backend/finance.db
docker-compose up --build
```

### Issues с permissions

```bash
# Если проблемы с доступом к volumes
docker-compose exec backend chmod -R 755 /app/data
```

## Деплой на Production

### Изменение конфигурации

1. Обнови `JWT_SECRET` в `.env`:
```env
JWT_SECRET=$(openssl rand -base64 32)
```

2. Обнови `CORS_ORIGIN` на твой домен:
```env
CORS_ORIGIN=https://yourdomain.com
```

3. Обнови `NEXT_PUBLIC_API_URL` на production API URL:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Scale контейнеры (если нужна высокая нагрузка)

```bash
docker-compose up -d --scale backend=3
```

### Использование nginx reverse proxy

```yaml
# docker-compose.yml
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
    networks:
      - finance_network
```

## Сохранение образов

### Экспорт образа

```bash
docker save finance-backend:latest -o backend.tar
docker save finance-frontend:latest -o frontend.tar
```

### Импорт образа

```bash
docker load -i backend.tar
docker load -i frontend.tar
```

## Очистка и оптимизация

### Удалить неиспользуемые образы

```bash
docker image prune -a
```

### Удалить неиспользуемые volumes

```bash
docker volume prune
```

### Удалить всё

```bash
docker system prune -a --volumes
```

## Полезные команды

```bash
# Просмотр использования ресурсов
docker stats

# Просмотр сетей
docker network ls

# Просмотр volumes
docker volume ls

# Просмотр истории образов
docker history finance-backend:latest

# Инспектирование контейнера
docker inspect finance-backend
```

## Tips & Best Practices

1. **Всегда** используй `--no-cache` при пересборке для актуальных зависимостей
2. **Регулярно** обновляй base images (node:20-alpine и т.д.)
3. **Бэкапь** данные перед обновлениями
4. **Используй** `.dockerignore` для исключения ненужных файлов
5. **Проверяй** логи при проблемах первым делом
6. **Устанавливай** health checks для всех критичных сервисов
7. **Используй** environment variables для конфигурации (не хардкодь)

## Дополнительные ресурсы

- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Best Practices for Node.js with Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## Поддержка

Если столкнёшься с проблемами:
1. Проверь логи: `docker-compose logs -f`
2. Убедись что все зависимости установлены
3. Попробуй пересобрать: `docker-compose build --no-cache`
4. Очисти всё и начни заново: `docker-compose down -v && docker-compose up --build`
