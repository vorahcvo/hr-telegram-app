# Отладка приложения

## 🔍 Добавленные логи

### Telegram Hook (`useTelegram`)
- 🔧 Инициализация Telegram WebApp
- 🔧 Данные пользователя от Telegram
- 🔧 Mock данные для разработки
- 🔧 Вызовы callback функций

### User Hook (`useUser`)
- 👤 Проверка существования пользователя
- 👤 Создание нового пользователя
- 👤 Создание источника по умолчанию
- 👤 Обновление пользователя
- 👤 Состояние загрузки

### Страницы
- 📱 ProfilePage: состояние пользователя и ошибки
- 📋 ApplicationsPage: загрузка заявок
- 🔗 SourcesPage: загрузка источников
- 📚 TrainingPage: загрузка уроков и прогресс

## 🚀 Как проверить логи

### 1. Откройте DevTools
- Нажмите F12 или правой кнопкой → "Inspect"
- Перейдите на вкладку "Console"

### 2. Обновите страницу
- Все логи будут видны в консоли
- Ищите эмодзи для быстрой навигации:
  - 🔧 - Telegram WebApp
  - 👤 - Пользователь
  - 📱 - Профиль
  - 📋 - Заявки
  - 🔗 - Источники
  - 📚 - Обучение

### 3. Проверьте последовательность
```
🔧 useTelegram: Initializing...
🔧 useTelegram: WebApp ready called
🔧 useTelegram: User data from WebApp: {...}
👤 useUser: Effect triggered
👤 useUser: Telegram user found, initializing...
👤 useUser: Starting user initialization for user_id: 123456789
👤 useUser: Checking if user exists in database...
👤 useUser: Database query result: {...}
👤 useUser: No existing user found, creating new user...
👤 useUser: User created successfully: {...}
👤 useUser: Creating default source...
👤 useUser: Default source created successfully
```

## 🐛 Возможные проблемы

### 1. Telegram WebApp не загружается
**Логи**: `🔧 useTelegram: Telegram WebApp not available`
**Решение**: Проверьте, что приложение запущено в Telegram

### 2. Пользователь не создается
**Логи**: `👤 useUser: Error creating user: {...}`
**Решение**: Проверьте подключение к Supabase и права доступа

### 3. Данные не загружаются
**Логи**: `📋 ApplicationsPage: Error fetching applications: {...}`
**Решение**: Проверьте RLS политики в Supabase

### 4. Mock данные
**Логи**: `🔧 useTelegram: Telegram WebApp not available, using mock data`
**Это нормально** для разработки вне Telegram

## 📊 Что показывают логи

### Успешная инициализация:
```
✅ Telegram WebApp загружен
✅ Данные пользователя получены
✅ Пользователь создан/найден в БД
✅ Источник по умолчанию создан
✅ Данные загружены
```

### Проблемы:
```
❌ Telegram WebApp недоступен
❌ Ошибка подключения к Supabase
❌ Пользователь не создается
❌ Данные не загружаются
```

## 🔧 Отладка в Telegram

### 1. Проверьте WebApp URL
- URL должен быть правильным в @BotFather
- Домен должен быть HTTPS

### 2. Проверьте initData
- Данные должны передаваться от Telegram
- Пользователь должен быть авторизован

### 3. Проверьте Supabase
- Подключение к базе данных
- RLS политики настроены
- Таблицы созданы

## 📝 Полезные команды

### В консоли браузера:
```javascript
// Проверить Telegram WebApp
console.log(window.Telegram?.WebApp);

// Проверить пользователя
console.log(window.Telegram?.WebApp?.initDataUnsafe?.user);

// Проверить Supabase подключение
console.log(supabase);
```

### В Supabase:
```sql
-- Проверить пользователей
SELECT * FROM users;

-- Проверить источники
SELECT * FROM sources;

-- Проверить заявки
SELECT * FROM applications;
```

---

**Теперь вы можете видеть все процессы в консоли браузера!**