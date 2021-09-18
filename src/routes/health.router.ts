/**
 * ride.router.ts
 * Xendit Coding Test
 * This file defines the routes for ride api
 */

import express, { Request, Response } from 'express'

export const healthRouter = express.Router()

healthRouter.get('/', (req: Request, res: Response) => res.send('Healthy'))
