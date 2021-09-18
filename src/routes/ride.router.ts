/**
 * ride.router.ts
 * Xendit Coding Test
 * This file defines the routes for ride api
 */

import express from 'express'
import bodyParser from 'body-parser'
import * as rideController from '../controllers/ride.controller'

export const ridesRouter = express.Router()

const jsonParser = bodyParser.json()

ridesRouter.post('/', jsonParser, rideController.addRide)

ridesRouter.get('/', rideController.getRidesList)

ridesRouter.get('/:id', rideController.getRideById)
