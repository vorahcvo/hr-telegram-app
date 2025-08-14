import React, { useState, useEffect } from 'react';
import { X, Copy, Trash2, Wifi, RefreshCw, Globe, Activity } from 'lucide-react';
import { logger } from '../../utils/logger';
import { debugTestConnection, debugTestFetch, debugTestSimpleFetch, debugPingServer, debugCreateUser, debugCheckUser, debugResetUser } from '../../utils/debug';

const LogWindow: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const updateLogs = () => {
      setLogs(logger.getLogs());
    };

    // Update logs every second
    const interval = setInterval(updateLogs, 1000);
    updateLogs(); // Initial update

    return () => clearInterval(interval);
  }, []);

  const handleCopyLogs = () => {
    const logsText = logger.getLogsAsText();
    navigator.clipboard.writeText(logsText).then(() => {
      logger.success('Логи скопированы в буфер обмена');
    });
  };

  const handleClearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-[#007aff] text-white p-3 rounded-full shadow-lg hover:bg-[#0056cc] transition-colors z-50"
      >
        <Activity size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 text-white p-2 z-50 max-h-1/2 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Логи отладки</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <X size={16} />
        </button>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto space-y-1 text-xs">
        {logs.map((log, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-gray-400 min-w-[60px]">{log.timestamp}</span>
            <span className={`font-medium ${
              log.level === 'error' ? 'text-red-400' :
              log.level === 'success' ? 'text-green-400' :
              log.level === 'warning' ? 'text-yellow-400' :
              'text-blue-400'
            }`}>
              {log.level.toUpperCase()}
            </span>
            <span className="flex-1">{log.message}</span>
            {log.data && (
              <span className="text-gray-500">
                {typeof log.data === 'object' ? JSON.stringify(log.data) : log.data}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex justify-around p-2 border-t border-gray-700">
        <button onClick={handleClearLogs} className="p-2 bg-red-500 rounded-md text-sm">Очистить</button>
        <button onClick={handleCopyLogs} className="p-2 bg-blue-500 rounded-md text-sm">Копировать</button>
        <button onClick={() => debugTestConnection()} className="p-2 bg-green-500 rounded-md text-sm flex items-center justify-center">
          <Wifi className="w-4 h-4" />
        </button>
        <button onClick={() => debugTestFetch()} className="p-2 bg-purple-500 rounded-md text-sm flex items-center justify-center">
          <RefreshCw className="w-4 h-4" />
        </button>
        <button onClick={() => debugTestSimpleFetch()} className="p-2 bg-yellow-500 rounded-md text-sm flex items-center justify-center">
          <Globe className="w-4 h-4" />
        </button>
        <button onClick={() => debugPingServer()} className="p-2 bg-orange-500 rounded-md text-sm flex items-center justify-center">
          <Activity className="w-4 h-4" />
        </button>
        <button onClick={() => debugCreateUser()} className="p-2 bg-indigo-500 rounded-md text-sm">Создать пользователя</button>
        <button onClick={() => debugCheckUser()} className="p-2 bg-teal-500 rounded-md text-sm">Проверить пользователя</button>
        <button onClick={() => debugResetUser()} className="p-2 bg-pink-500 rounded-md text-sm">Сбросить пользователя</button>
      </div>
    </div>
  );
};

export default LogWindow;