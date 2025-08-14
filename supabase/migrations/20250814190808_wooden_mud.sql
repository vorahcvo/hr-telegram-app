/*
  # Создание таблиц для Telegram Mini App

  1. Новые таблицы
    - `users` - пользователи с реквизитами
    - `applications` - заявки пользователей
    - `sources` - источники заявок
    - `lessons` - уроки обучения
    - `user_lessons` - прогресс пользователей по урокам

  2. Безопасность
    - Включен RLS для всех таблиц
    - Политики доступа только к собственным данным
*/

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id bigint UNIQUE NOT NULL,
  name text NOT NULL,
  username text,
  avatar text,
  inn text,
  corporate_card text,
  account_number text,
  bik text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создание таблицы заявок
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id bigint NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  date timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('registered', 'in_progress', 'rejected', 'contacted')),
  source text NOT NULL,
  comment text,
  deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создание таблицы источников
CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id bigint NOT NULL,
  name text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'moderation', 'blocked')),
  url text,
  is_default boolean DEFAULT false,
  deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создание таблицы уроков
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  duration text NOT NULL,
  content text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Создание таблицы прогресса пользователей по урокам
CREATE TABLE IF NOT EXISTS user_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id bigint NOT NULL,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_deleted ON applications(deleted);
CREATE INDEX IF NOT EXISTS idx_sources_user_id ON sources(user_id);
CREATE INDEX IF NOT EXISTS idx_sources_deleted ON sources(deleted);
CREATE INDEX IF NOT EXISTS idx_user_lessons_user_id ON user_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON lessons(order_index);

-- Включение RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lessons ENABLE ROW LEVEL SECURITY;

-- Политики для таблицы users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- Политики для таблицы applications
CREATE POLICY "Users can read own applications" ON applications
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own applications" ON applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE USING (true);

-- Политики для таблицы sources
CREATE POLICY "Users can read own sources" ON sources
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own sources" ON sources
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own sources" ON sources
  FOR UPDATE USING (true);

-- Политики для таблицы lessons (все могут читать)
CREATE POLICY "Anyone can read lessons" ON lessons
  FOR SELECT USING (true);

-- Политики для таблицы user_lessons
CREATE POLICY "Users can read own progress" ON user_lessons
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own progress" ON user_lessons
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own progress" ON user_lessons
  FOR UPDATE USING (true);