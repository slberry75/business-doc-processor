import { Logger } from 'typeorm';
import logger from './logger';

export class CustomTypeOrmLogger implements Logger {
  
  logQuery(query: string, parameters?: any[]) {
    logger.sql('TypeORM Query', {
      query: query.replace(/\s+/g, ' ').trim(),
      parameters: parameters || [],
      timestamp: new Date().toISOString()
    });
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    logger.error('TypeORM Query Error', {
      error,
      query: query.replace(/\s+/g, ' ').trim(),
      parameters: parameters || []
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    logger.performance('TypeORM Slow Query', {
      executionTime: time,
      query: query.replace(/\s+/g, ' ').trim(),
      parameters: parameters || []
    });
  }

  logSchemaBuild(message: string) {
    logger.info('TypeORM Schema', { message });
  }

  logMigration(message: string) {
    logger.info('TypeORM Migration', { message });
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'log':
      case 'info':
        logger.info('TypeORM Info', { message });
        break;
      case 'warn':
        logger.warn('TypeORM Warning', { message });
        break;
    }
  }
}