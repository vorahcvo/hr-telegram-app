# Настройка проекта для вашего Self-Hosted Supabase

## 🎯 Ваши данные Supabase

### Сервер
- **IP адрес**: 5.129.230.57
- **Порт API**: 8000
- **Порт Studio**: 3000
- **Порт базы данных**: 5432

### Доступы
- **Admin Panel**: http://5.129.230.57:8000/project/default
- **API URL**: http://5.129.230.57:8000
- **Studio URL**: http://5.129.230.57:3000

### Ключи
- **ANON_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ1MDEwMDAwLCJleHAiOjE5MDI3NzY0MDB9.LlGieQIb8ukhfR_qGM0yUBLWy1BYE9jno76YkLJBmRU`
- **SERVICE_ROLE_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NDUwMTAwMDAsImV4cCI6MTkwMjc3NjQwMH0.afVvYJMT8rZUoNfhgp27QSBhMHo_sC62vV54i7jJIoo`
- **JWT_SECRET**: `ePSluVzseen7ZjW7EpteyU8FEBq0eEzzGEECDmDi`
- **POSTGRES_PASSWORD**: `8946LAPedQWa`

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
git clone https://github.com/vorahcvo/hr-telegram-app.git
cd hr-telegram-app
npm install
```

### 2. Проверка конфигурации

Файл `src/config/env.ts` уже настроен с вашими данными:

```typescript
export const SUPABASE_CONFIG = {
  url: 'http://5.129.230.57:8000',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ1MDEwMDAwLCJleHAiOjE5MDI3NzY0MDB9.LlGieQIb8ukhfR_qGM0yUBLWy1BYE9jno76YkLJBmRU',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NDUwMTAwMDAsImV4cCI6MTkwMjc3NjQwMH0.afVvYJMT8rZUoNfhgp27QSBhMHo_sC62vV54i7jJIoo',
  jwtSecret: 'ePSluVzseen7ZjW7EpteyU8FEBq0eEzzGEECDmDi'
};
```

### 3. Проверка базы данных

Убедитесь, что миграции выполнены в вашей базе данных:

1. Подключитесь к админке: http://5.129.230.57:8000/project/default
2. Перейдите в SQL Editor
3. Выполните SQL файлы из папки `supabase/migrations/`

### 4. Запуск приложения

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

## 🔧 Настройка Telegram Bot

### 1. Создание бота

1. Напишите @BotFather в Telegram
2. Выполните команду `/newbot`
3. Следуйте инструкциям для создания бота

### 2. Настройка Web App

1. Выполните команду `/setmenubutton`
2. Выберите вашего бота
3. Укажите URL: `http://localhost:5173` (для разработки)
4. Укажите текст кнопки: "HR App"

### 3. Обработчики колбеков

Добавьте обработчики для следующих колбеков:

- `phones_request` - запрос на получение списка телефонов заявок
- `support_request` - обращение пользователя в поддержку  
- `fired_request` - запрос на расторжение договора

## 📊 Структура базы данных

### Таблицы (уже созданы)

- **users** - профили пользователей с реквизитами
- **applications** - заявки (с soft delete)
- **sources** - источники заявок (с soft delete)
- **lessons** - уроки обучения (2 примера уже добавлены)
- **user_lessons** - прогресс пользователей по урокам

### RLS политики (уже настроены)

- Пользователи могут читать/изменять только свои данные
- Уроки доступны всем пользователям
- Автоматическое создание источников по умолчанию

## 🐛 Отладка

### Проверка подключения к Supabase

1. Откройте консоль браузера (F12)
2. Перейдите на http://localhost:5173
3. Проверьте, нет ли ошибок подключения к Supabase

### Проверка базы данных

1. Откройте админку: http://5.129.230.57:8000/project/default
2. Перейдите в Table Editor
3. Убедитесь, что таблицы созданы и содержат данные

### Логи Supabase

```bash
# На сервере с Supabase
docker compose logs -f
```

## 🚀 Production развертывание

### 1. Сборка приложения

```bash
npm run build
```

### 2. Настройка веб-сервера

Настройте nginx для раздачи статических файлов из папки `dist/`

### 3. Обновление Telegram Bot

Обновите Web App URL в @BotFather на ваш production домен

### 4. SSL сертификат

Обязательно настройте HTTPS для production

## 📞 Поддержка

При возникновении проблем:

1. Проверьте консоль браузера
2. Убедитесь, что Supabase доступен по адресу http://5.129.230.57:8000
3. Проверьте, что миграции выполнены в базе данных
4. Убедитесь в корректности настроек Telegram Bot

## 🔐 Безопасность

⚠️ **Важно**: В production обязательно измените все секретные ключи!

- JWT_SECRET
- POSTGRES_PASSWORD
- ANON_KEY
- SERVICE_ROLE_KEY

---

**Готово!** Ваш Telegram Mini App настроен и готов к использованию с вашим self-hosted Supabase.