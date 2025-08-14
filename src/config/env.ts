// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: 'http://5.129.230.57', // Убираем порт 8000 для API клиента
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ1MDEwMDAsImV4cCI6MTkwMjc3NjQwMH0.LlGieQIb8ukhfR_qGM0yUBLWy1BYE9jno76YkLJBmRU',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ1MDEwMDAsImV4cCI6MTkwMjc3NjQwMH0.afVvYJMT8rZUoNfhgp27QSBhMHo_sC62vV54i7jJIoo',
  jwtSecret: 'ePSluVzseen7ZjW7EpteyU8FEBq0eEzzGEECDmDi'
};

// Database Configuration
export const DATABASE_CONFIG = {
  host: '5.129.230.57',
  port: 5432,
  database: 'postgres',
  password: '8946LAPedQWa'
};

// Site Configuration
export const SITE_CONFIG = {
  url: 'http://localhost:5173'
};