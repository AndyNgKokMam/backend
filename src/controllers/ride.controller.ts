/**
 * ride.router.ts
 * Xendit Coding Test
 * This file defines the routes for ride api
 */

import { Request, Response } from 'express'
import { Ride } from '../models/ride'
import { PaginationInterface } from '../services/database'
import { DB } from '../services/database/sqlite3'
import { Logger } from '../services/logger.service'

export const addRide = async (req: Request, res: Response) => {
    try {
        const startLatitude = Number(req.body.start_lat)
        const startLongitude = Number(req.body.start_long)
        const endLatitude = Number(req.body.end_lat)
        const endLongitude = Number(req.body.end_long)
        const riderName = req.body.rider_name
        const driverName = req.body.driver_name
        const driverVehicle = req.body.driver_vehicle

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            })
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            })
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            })
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            })
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            })
        }

        const rideObj = new Ride()
        rideObj.create(
            req.body.start_lat,
            req.body.start_long,
            req.body.end_lat,
            req.body.end_long,
            req.body.rider_name,
            req.body.driver_name,
            req.body.driver_vehicle
        )
        rideObj.created = new Date()

        const rideId = <string>await DB.insertOne(Ride.COLLECTION_NAME, rideObj.getObject())

        const ride = <Ride>await DB.getOne(Ride.COLLECTION_NAME, rideId)

        res.json(ride)
    } catch (error) {
        Logger.error('Error Post Ride', { error: error.message })
        res.status(500).send(error.message)
    }
}

export const getRidesList = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit)
        const pagination: PaginationInterface = {
            limit: limit,
            after_id: req.query.after_id?.toString()
        }
        const data = <Ride[]>await DB.getByQuery(Ride.COLLECTION_NAME, pagination)
        if (data.length > 0) {
            let hasMore = true
            const links = []
            if (data.length < limit) {
                hasMore = false
            } else {
                links.push({
                    href: `http://${req.headers.host}${req.baseUrl}${req.path}?limit=2&after_id=${
                        data[data.length - 1].rideID
                    }`,
                    method: 'GET',
                    rel: 'next'
                })
            }
            return res.json({
                has_more: hasMore,
                data,
                links
            })
        }
        res.json({
            has_more: false,
            data: [],
            links: []
        })
    } catch (error) {
        Logger.error('Error Get Rides', { error: error.message })
        res.status(500).send(error.message)
    }
}

export const getRideById = async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id

        if (typeof id !== 'undefined') {
            const ride = <Ride>await DB.getOne(Ride.COLLECTION_NAME, id)
            return res.json(ride)
        } else {
            return res.json({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            })
        }
    } catch (error) {
        Logger.error('Error Get Ride By Id', { error: error.message })
        res.status(500).send(error.message)
    }
}
