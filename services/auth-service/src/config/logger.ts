import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Extend Winston's Logger interface to include custom levels
declare module 'winston' {
  interface Logger {
    auth: winston.LeveledLogMethod;
    sql: winston.LeveledLogMethod;
    performance: winston.LeveledLogMethod;
  }
}

// Custom log levels for specialized logging
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    auth: 3,
    sql: 4,
    performance: 5,
    debug: 6
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    auth: 'blue',
    sql: 'magenta',
    performance: 'cyan',
    debug: 'white'
  }
};

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';

// Create transports array
const transports: winston.transport[] = [];

// Console transport for development
if (!isProduction) {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

// Environment-based transport selection
const fileTransports = [
  // Always in production
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    level: 'error',
    maxFiles: '90d'  // Keep errors longer
  }),
  
  new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log', 
    level: 'info',
    maxFiles: '30d'
  }),

  new DailyRotateFile({
    filename: 'logs/auth-%DATE%.log',
    level: 'auth', 
    maxFiles: '365d'  // Keep auth logs for compliance
  })
];

// Development and staging only
if (process.env.NODE_ENV !== 'production') {
  fileTransports.push(
    new DailyRotateFile({
      filename: 'logs/sql-%DATE%.log',
      level: 'sql',
      maxFiles: '7d'  // Short retention for debug logs
    }),
    
    new DailyRotateFile({
      filename: 'logs/performance-%DATE%.log',
      level: 'performance', 
      maxFiles: '7d'
    }),
    
    new DailyRotateFile({
      filename: 'logs/debug-%DATE%.log',
      level: 'debug',
      maxFiles: '3d'  // Very short retention
    })
  );
}

// Optional: Feature flag for SQL logging in production
if (process.env.ENABLE_SQL_LOGGING === 'true') {
  fileTransports.push(
    new DailyRotateFile({
      filename: 'logs/sql-%DATE%.log',
      level: 'sql',
      maxFiles: '1d'  // Very short retention in production
    })
  );
}

// Add file transports to main transports array
transports.push(...fileTransports);

// Create the logger
const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports
});

// Add colors to Winston
winston.addColors(customLevels.colors);

export default logger;