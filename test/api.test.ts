'use strict'

import dotenv from 'dotenv'
dotenv.config({ path: './env' })

import { expect } from 'chai'
import { before, describe, it } from 'mocha'
import request from 'supertest'

import express, { Application } from 'express'
import util from 'util'

global.TextEncoder = util.TextEncoder
global.TextDecoder = util.TextDecoder

import { startApp } from '../src/app'

describe('API tests', () => {
    let app: Application

    before((done) => {
        app = express()
        startApp(app)
        const port = process.env.PORT
        app.listen(port, () => console.log(`App started and listening on port ${port}`))
        done()
    })

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('http://localhost:8010/health')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res: request.Response) => {
                    if (err) return done(err)
                    expect(res.body, 'Healthy')
                    done()
                })
        })
    })
})
