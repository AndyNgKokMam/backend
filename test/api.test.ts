'use strict'

import { expect } from 'chai'
import { after, before, describe, it } from 'mocha'
import request from 'supertest'

import express, { Application } from 'express'
import http from 'http'
import util from 'util'

global.TextEncoder = util.TextEncoder
global.TextDecoder = util.TextDecoder

import { startApp } from '../src/app'

describe('API tests', () => {
    let app: Application
    let server: http.Server

    before(() => {
        app = express()
        startApp(app)
        const port = 9010 // process.env.PORT
        server = app.listen(port, () => console.log(`App started and listening on port ${port}`))
    })

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200)
                .end((err, res: request.Response) => {
                    console.log(res.body)
                    expect(res.body, 'Healthy')
                    done()
                })
        })
    })

    after(() => {
        server.close()
    })
})
