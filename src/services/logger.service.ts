/**
 * logger.service.ts
 * Xendit Coding Test
 * This file defines the logger service
 */

'use strict'

import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const transportAll = new DailyRotateFile({
    filename: 'logs/info-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '100m',
    maxFiles: '7d'
})

const transportError = new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '50m',
    maxFiles: '7d'
})

const transports = [
    new winston.transports.Console(),
    transportError,
    transportAll
    /*new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
    }),
    new winston.transports.File({ filename: 'logs/all.log' })*/
]

export const Logger = winston.createLogger({
    level: level(),
    transports
})
