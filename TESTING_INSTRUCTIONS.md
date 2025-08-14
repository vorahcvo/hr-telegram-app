# Инструкции по тестированию

## ✅ Статус подключения

**Подключение к Supabase работает!** Ключи аутентификации подтверждены и работают корректно.

### 🔍 Что протестировано:

1. **Прямое подключение к Supabase**: ✅ Работает
2. **Прокси-сервер**: ✅ Работает  
3. **Ключи аутентификации**: ✅ Работают
4. **Доступ к таблицам**: ✅ Работает
   - `users`: `[]` (пустая таблица)
   - `lessons`: `[2 записи]` (есть данные)
   - `sources`: `[]` (пустая таблица)
   - `applications`: `[]` (пустая таблица)

## 🚀 Как протестировать приложение

### 1. Откройте приложение
Перейдите в браузер: `http://localhost:5173/`

### 2. Проверьте логи
- Откройте консоль браузера (F12)
- Нажмите кнопки отладки в логах приложения

### 3. Тестовые функции отладки

#### Создание пользователя
```javascript
debugCreateUser()
```

#### Проверка пользователя
```javascript
debugCheckUser()
```

#### Тест подключения
```javascript
debugTestConnection()
```

#### Тест fetch запросов
```javascript
debugTestFetch()
```

#### Простой fetch тест
```javascript
debugTestSimpleFetch()
```

#### Пинг сервера
```javascript
debugPingServer()
```

## 📊 Ожидаемые результаты

### Успешные тесты должны показать:
- ✅ Подключение к Supabase
- ✅ Аутентификация с ANON_KEY и SERVICE_ROLE_KEY
- ✅ Доступ к таблицам
- ✅ Создание пользователя

### Возможные проблемы:
- ❌ `TypeError: Load failed` - проблема с смешанным контентом (HTTP/HTTPS)
- ❌ `Invalid authentication credentials` - неправильные ключи
- ❌ `Network error` - проблемы с сетью

## 🔧 Конфигурация

### Supabase URL
```
http://5.129.230.57:8000
```

### Ключи (подтверждены рабочие)
```
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ1MDEwMDAwLCJleHAiOjE5MDI3NzY0MDB9.LlGieQIb8ukhfR_qGM0yUBLWy1BYE9jno76YkLJBmRU

SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ1MDEwMDAwLCJleHAiOjE5MDI3NzY0MDB9.afVvYJMT8rZUoNfhgp27QSBhMHo_sC62vV54i7jJIoo
```

## 🎯 Следующие шаги

1. **Протестируйте приложение** в браузере
2. **Проверьте создание пользователя** через debug функции
3. **Убедитесь, что данные загружаются** в интерфейсе
4. **Если есть проблемы с смешанным контентом**, используйте прокси-сервер

## 🔗 Полезные ссылки

- **Supabase Dashboard**: `http://5.129.230.57:8000/project/default`
- **Локальное приложение**: `http://localhost:5173/`
- **Прокси-сервер**: `http://localhost:3001/` (если нужен)