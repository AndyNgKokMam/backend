/**
 * morganMiddleware.ts
 * Xendit Coding Test
 * This file defines the morgan middleware for logging
 */

import morgan, { StreamOptions } from 'morgan'

import { Logger } from '../services/logger.service'

const stream: StreamOptions = {
    write: (message) => Logger.http(message)
}

export const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', { stream })
