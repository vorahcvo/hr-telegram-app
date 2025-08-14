# Telegram Mini App - HR Management System

Telegram Mini App для управления заявками, источниками трафика и обучения персонала.

## 🚀 Возможности

- **Управление заявками**: Добавление, редактирование и отслеживание статуса заявок
- **Источники трафика**: Управление различными каналами привлечения кандидатов
- **Система обучения**: Интерактивные уроки с отслеживанием прогресса
- **Профиль пользователя**: Управление реквизитами и настройками
- **Интеграция с Telegram**: Полная интеграция с Telegram WebApp API

## 🛠 Технологии

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **UI**: Tailwind CSS + Lucide React Icons
- **Telegram**: Telegram WebApp API

## 📋 Требования

- Node.js 18+
- Self-hosted Supabase instance
- Telegram Bot (созданный через @BotFather)

## 🔧 Установка и настройка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd telegram-mini-app-hr
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка Supabase

#### Self-hosted Supabase

1. **Разверните Supabase** на вашем сервере:
   ```bash
   # Клонируйте репозиторий Supabase
   git clone https://github.com/supabase/supabase.git
   cd supabase/docker
   
   # Скопируйте .env.example в .env и настройте переменные
   cp .env.example .env
   ```

2. **Настройте переменные окружения** в `.env`:
   ```env
   POSTGRES_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ANON_KEY=your_anon_key
   SERVICE_ROLE_KEY=your_service_role_key
   SITE_URL=http://localhost:5173
   API_EXTERNAL_URL=http://your-server-ip:8000
   ```

3. **Запустите Supabase**:
   ```bash
   docker compose up -d
   ```

4. **Выполните миграции**:
   ```bash
   # Подключитесь к базе данных и выполните SQL файлы из supabase/migrations/
   ```

#### Настройка клиента

Обновите файл `src/config/env.ts` с вашими данными:

```typescript
export const SUPABASE_CONFIG = {
  url: 'http://your-server-ip:8000',
  anonKey: 'your-anon-key',
  serviceRoleKey: 'your-service-role-key',
  jwtSecret: 'your-jwt-secret'
};
```

### 4. Настройка Telegram Bot

1. **Создайте бота** через @BotFather
2. **Настройте Web App URL**:
   ```
   /setmenubutton
   /newapp
   ```
3. **Добавьте обработчики колбеков**:
   - `phones_request` - запрос на получение телефонов
   - `support_request` - обращение в поддержку
   - `fired_request` - расторжение договора

### 5. Запуск приложения

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

## 📊 Структура базы данных

### Таблицы

- **users** - профили пользователей с реквизитами
- **applications** - заявки (с soft delete)
- **sources** - источники заявок (с soft delete)
- **lessons** - уроки обучения
- **user_lessons** - прогресс пользователей по урокам

### RLS (Row Level Security)

Все таблицы защищены RLS политиками:
- Пользователи могут читать/изменять только свои данные
- Уроки доступны всем пользователям
- Автоматическое создание источников по умолчанию

## 🏗 Архитектура проекта

### Компоненты

```
src/
├── components/
│   ├── Layout/          # Общие элементы (Header, TabBar)
│   ├── UI/             # Переиспользуемые UI элементы
│   ├── Applications/   # Компоненты для работы с заявками
│   ├── Sources/        # Компоненты для источников
│   ├── Training/       # Компоненты обучения
│   └── Profile/        # Компоненты профиля
├── hooks/              # React хуки
├── lib/                # Утилиты и конфигурация
├── pages/              # Страницы приложения
└── types/              # TypeScript типы
```

### Хуки

- `useTelegram()` - интеграция с Telegram WebApp API
- `useUser()` - управление пользователем
- `useApplications()` - работа с заявками
- `useSources()` - работа с источниками
- `useLessons()` - работа с уроками

## 🔐 Безопасность

- **RLS политики** в Supabase
- **Валидация данных** на стороне клиента
- **JWT токены** для аутентификации
- **Telegram WebApp** для безопасной авторизации

## 🚀 Развертывание

### Production

1. **Соберите приложение**:
   ```bash
   npm run build
   ```

2. **Настройте веб-сервер** (nginx/apache) для раздачи статических файлов

3. **Обновите Web App URL** в Telegram Bot на production адрес

4. **Настройте SSL** для HTTPS

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📝 API Endpoints

### Supabase Tables

- `GET /rest/v1/users` - получение профиля пользователя
- `POST /rest/v1/users` - создание/обновление профиля
- `GET /rest/v1/applications` - список заявок
- `POST /rest/v1/applications` - создание заявки
- `GET /rest/v1/sources` - список источников
- `POST /rest/v1/sources` - создание источника
- `GET /rest/v1/lessons` - список уроков
- `POST /rest/v1/user_lessons` - отметка о прохождении урока

## 🤝 Telegram Bot API

### Callbacks

- `phones_request` - запрос на получение списка телефонов заявок
- `support_request` - обращение пользователя в поддержку
- `fired_request` - запрос на расторжение договора

### WebApp API

- `initData` - данные инициализации
- `user` - информация о пользователе
- `themeParams` - параметры темы
- `viewportHeight` - высота viewport

## 🐛 Отладка

### Логи

```bash
# Просмотр логов Supabase
docker compose logs -f

# Логи приложения
npm run dev
```

### Консоль браузера

Откройте DevTools для просмотра:
- Ошибок подключения к Supabase
- Telegram WebApp событий
- React ошибок

## 📞 Поддержка

При возникновении проблем:

1. Проверьте консоль браузера
2. Убедитесь в правильности настроек Supabase
3. Проверьте подключение к базе данных
4. Убедитесь в корректности Telegram Bot настроек

## 📄 Лицензия

MIT License

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Внесите изменения
4. Создайте Pull Request

---

**Примечание**: Убедитесь, что ваш self-hosted Supabase правильно настроен и доступен перед запуском приложения.