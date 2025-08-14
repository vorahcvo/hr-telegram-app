import React, { useState, useEffect } from 'react';
import { X, Copy, Trash2, RefreshCw, Wifi, Globe, Activity } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'error' | 'warning' | 'success';
  message: string;
  data?: any;
}

interface LogWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogWindow: React.FC<LogWindowProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Подписываемся на логи
      const handleLog = (event: CustomEvent) => {
        const { level, message, data } = event.detail;
        const newLog: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          level,
          message,
          data
        };
        setLogs(prev => [...prev, newLog]);
      };

      window.addEventListener('app-log', handleLog as EventListener);
      return () => window.removeEventListener('app-log', handleLog as EventListener);
    }
  }, [isOpen]);

  const clearLogs = () => {
    setLogs([]);
  };

  const copyLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}${log.data ? ` | ${JSON.stringify(log.data)}` : ''}`
    ).join('\n');
    
    navigator.clipboard.writeText(logText).then(() => {
      // Показываем уведомление
      const event = new CustomEvent('app-log', {
        detail: { level: 'success', message: 'Логи скопированы в буфер обмена' }
      });
      window.dispatchEvent(event);
    });
  };

  const resetApp = () => {
    // Сбрасываем состояние приложения
    window.location.reload();
  };

  const testConnection = () => {
    // Вызываем функцию тестирования подключения
    if (window.debugTestConnection) {
      window.debugTestConnection();
    }
  };

  const testFetch = () => {
    // Вызываем функцию тестирования fetch
    if (window.debugTestFetch) {
      window.debugTestFetch();
    }
  };

  const testSimpleFetch = () => {
    // Вызываем функцию простого тестирования fetch
    if (window.debugTestSimpleFetch) {
      window.debugTestSimpleFetch();
    }
  };

  const pingServer = () => {
    // Вызываем функцию пинга сервера
    if (window.debugPingServer) {
      window.debugPingServer();
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1c1c1e] rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#2c2c2e]">
          <h2 className="text-lg font-semibold text-white">Логи приложения</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={pingServer}
              className="p-2 text-[#8e8e93] hover:text-white transition-colors"
              title="Пинг сервера"
            >
              <Activity size={16} />
            </button>
            <button
              onClick={testConnection}
              className="p-2 text-[#8e8e93] hover:text-white transition-colors"
              title="Тест подключения к Supabase"
            >
              <Wifi size={16} />
            </button>
            <button
              onClick={testFetch}
              className="p-2 text-[#8e8e93] hover:text-white transition-colors"
              title="Тест прямого fetch"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={testSimpleFetch}
              className="p-2 text-[#8e8e93] hover:text-white transition-colors"
              title="Простой тест fetch"
            >
              <Globe size={16} />
            </button>
            <button
              onClick={resetApp}
              className="p-2 text-[#8e8e93] hover:text-white transition-colors"
              title="Перезагрузить приложение"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={copyLogs}
              className="p-2 text-[#8e8e93] hover:text-white transition-colors"
              title="Копировать логи"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={clearLogs}
              className="p-2 text-[#8e8e93] hover:text-white transition-colors"
              title="Очистить логи"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#8e8e93] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Автопрокрутка</span>
            </label>
            <span className="text-sm text-[#8e8e93]">
              Логов: {logs.length}
            </span>
            <button
              onClick={() => {
                if (window.debugCreateUser) {
                  window.debugCreateUser();
                }
              }}
              className="text-sm text-[#007aff] hover:underline"
            >
              Создать пользователя
            </button>
            <button
              onClick={() => {
                if (window.debugCheckUser) {
                  window.debugCheckUser();
                }
              }}
              className="text-sm text-[#007aff] hover:underline"
            >
              Проверить пользователя
            </button>
          </div>
          
          <div className="bg-[#2c2c2e] rounded-lg p-3 h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-[#8e8e93] text-center">Логи появятся здесь...</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2">
                    <span className={`text-xs ${getLevelColor(log.level)} min-w-[60px]`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-[#8e8e93] text-xs min-w-[80px]">
                      {log.timestamp}
                    </span>
                    <span className="text-white flex-1">
                      {log.message}
                      {log.data && (
                        <span className="text-[#8e8e93] ml-2">
                          {typeof log.data === 'object' ? JSON.stringify(log.data) : log.data}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogWindow;