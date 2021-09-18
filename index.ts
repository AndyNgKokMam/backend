/**
 * app.ts
 * Xendit Coding Test
 * This file defines the application start
 */

'use strict'

import dotenv from 'dotenv'
dotenv.config()
import express, { Application } from 'express'
import util from 'util'

global.TextEncoder = util.TextEncoder
global.TextDecoder = util.TextDecoder

const app: Application = express()
const port = process.env.PORT

import { startApp } from './src/app'
startApp(app)

app.listen(port, () => console.log(`App started and listening on port ${port}`))
