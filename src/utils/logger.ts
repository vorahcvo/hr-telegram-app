type LogLevel = 'info' | 'error' | 'warning' | 'success';

interface LogData {
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogData[] = [];
  private maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private addLog(level: LogLevel, message: string, data?: any) {
    const logData: LogData = { level, message, data };
    
    // Добавляем в массив
    this.logs.push(logData);
    
    // Ограничиваем количество логов
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Отправляем событие для UI
    const event = new CustomEvent('app-log', { detail: logData });
    window.dispatchEvent(event);

    // Также выводим в консоль для разработки
    const timestamp = new Date().toLocaleTimeString();
    const emoji = this.getEmoji(level);
    console.log(`${emoji} [${timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
  }

  private getEmoji(level: LogLevel): string {
    switch (level) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  }

  info(message: string, data?: any) {
    this.addLog('info', message, data);
  }

  error(message: string, data?: any) {
    this.addLog('error', message, data);
  }

  warning(message: string, data?: any) {
    this.addLog('warning', message, data);
  }

  success(message: string, data?: any) {
    this.addLog('success', message, data);
  }

  getLogs(): LogData[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();