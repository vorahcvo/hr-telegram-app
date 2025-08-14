interface LogEntry {
  timestamp: string;
  level: 'info' | 'error' | 'success' | 'warning';
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private addLog(level: LogEntry['level'], message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      data
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console for debugging
    const consoleMethod = level === 'error' ? 'error' : level === 'success' ? 'log' : 'info';
    console[consoleMethod](`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
  }

  info(message: string, data?: any) {
    this.addLog('info', message, data);
  }

  error(message: string, data?: any) {
    this.addLog('error', message, data);
  }

  success(message: string, data?: any) {
    this.addLog('success', message, data);
  }

  warning(message: string, data?: any) {
    this.addLog('warning', message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  getLogsAsText(): string {
    return this.logs
      .map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}${log.data ? ' | ' + JSON.stringify(log.data) : ''}`)
      .join('\n');
  }
}

export const logger = new Logger();