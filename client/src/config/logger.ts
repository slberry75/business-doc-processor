interface LogLevel {
  ERROR: number;
  WARN: number;
  INFO: number;
  DEBUG: number;
}

const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class BrowserLogger {
  private logLevel: number;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.REACT_APP_ENVIRONMENT === 'development';
    const envLogLevel = process.env.REACT_APP_LOG_LEVEL || 'info';
    this.logLevel = LOG_LEVELS[envLogLevel.toUpperCase() as keyof LogLevel] || LOG_LEVELS.INFO;
  }

  private shouldLog(level: number): boolean {
    return level <= this.logLevel;
  }

  private formatMessage(level: string, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      environment: process.env.REACT_APP_ENVIRONMENT,
      ...(meta && { meta })
    };

    if (this.isDevelopment) {
      // Pretty console output for development
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta || '');
    } else {
      // Structured JSON for production
      console.log(JSON.stringify(logData));
    }
  }

  error(message: string, meta?: any): void {
    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      this.formatMessage('error', message, meta);
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      this.formatMessage('warn', message, meta);
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      this.formatMessage('info', message, meta);
    }
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      this.formatMessage('debug', message, meta);
    }
  }
}

const logger = new BrowserLogger();
export default logger;