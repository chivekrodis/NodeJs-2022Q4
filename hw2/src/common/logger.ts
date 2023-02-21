import winston from 'winston';
import path from 'path';

const errorLog = path.join(__dirname, '../logs/error.log');
const combinedLog = path.join(__dirname, '../logs/combined.log');

export const logger = winston.createLogger({
  level: 'silly',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: errorLog,
      level: 'error',
    }),
    new winston.transports.File({ filename: combinedLog }),
  ],
});
