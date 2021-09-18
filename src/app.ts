/**
 * app.ts
 * Xendit Coding Test
 * This file defines the express application
 */

'use strict'

import path from 'path'
import { Application, NextFunction, Request, Response } from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import { morganMiddleware } from './config/morgan.middleware'
import { ridesRouter } from './routes/ride.router'

const NODE_ENV = process.env.NODE_ENV
const apiSpec = path.join(process.cwd(), '/docs/api.yml')

export const startApp = (app: Application) => {
    app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }))
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use(helmet())
    app.use(compression())
    if (NODE_ENV === 'development') {
        app.use(morganMiddleware)
    }

    app.use(
        OpenApiValidator.middleware({
            apiSpec: apiSpec,
            validateResponses: true // <-- to validate responses
        })
    )

    app.get('/health', (req: Request, res: Response) => res.send('Healthy'))

    app.use('/rides', ridesRouter)

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        // format error
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors
        })
    })
}
