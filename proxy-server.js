const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Включаем CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-telegram-app-domain.com'],
  credentials: true
}));

// Прокси для Supabase API
app.use('/api/supabase', createProxyMiddleware({
  target: 'http://5.129.230.57:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/supabase': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying request:', req.method, req.url);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('Received response:', proxyRes.statusCode, req.url);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Proxying /api/supabase/* to http://5.129.230.57:8000/*`);
});