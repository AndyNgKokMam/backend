/**
 * mongodb.ts
 * Xendit Coding Test
 * This file defines the functions for mongodb
 */

import { Collection, Db, MongoClient, MongoServerError, ObjectId } from 'mongodb'
import { DatabaseInterface, PaginationInterface } from '../database'
import { Ride } from '../../models/ride'
import { Logger } from '../../services/logger.service'

class Database implements DatabaseInterface {
    db: Db | null

    collections: { [key: string]: Collection | null } = {
        Rides: null
    }

    constructor() {
        this.db = null
    }

    async connectToDatabase() {
        console.log(process.env.DB_MONGODB_CONN_STRING)
        const client: MongoClient = new MongoClient(process.env.DB_MONGODB_CONN_STRING, {
            maxPoolSize: 100,
            minPoolSize: 10
        })

        await client.connect()

        this.db = client.db(process.env.DB_NAME)

        await this.buildSchemas()

        // Connect to the collection with the specific name from .env, found in the database previously specified
        const ridesCollection: Collection = this.db.collection(Ride.COLLECTION_NAME)

        // Persist the connection to the Games collection
        this.collections.Rides = ridesCollection

        Logger.info(
            `Successfully connected to database: ${this.db.databaseName} and collection: ${ridesCollection.collectionName}`
        )
        return true
    }

    async buildSchemas() {
        const db = this.db
        const jsonSchema = {
            $jsonSchema: {
                bsonType: 'object',
                required: [
                    'start_lat',
                    'start_long',
                    'end_lat',
                    'end_long',
                    'rider_name',
                    'driver_name',
                    'driver_vehicle',
                    'created'
                ],
                additionalProperties: false,
                properties: {
                    startLatitude: {
                        bsonType: 'int',
                        minimum: -90,
                        maximum: 180,
                        description: "'Start Latitude' is required and must be an integer in -90 to 180"
                    },
                    startLongitude: {
                        bsonType: 'int',
                        minimum: -90,
                        maximum: 180,
                        description: "'Start Longitude' is required and must be an integer in -90 to 180"
                    },
                    endLatitude: {
                        bsonType: 'int',
                        minimum: -90,
                        maximum: 180,
                        description: "'End Latitude' is required and must be an integer in -90 to 180"
                    },
                    endLongitude: {
                        bsonType: 'int',
                        minimum: -90,
                        maximum: 180,
                        description: "'End Longitude' is required and must be an integer in -90 to 180"
                    },
                    riderName: {
                        bsonType: 'string',
                        description: "'Rider Name' must be a string and is required"
                    },
                    driverName: {
                        bsonType: 'string',
                        description: "'Driver Name' must be a string and is required"
                    },
                    driverVehicle: {
                        bsonType: 'string',
                        description: "'Driver Vehicle' must be a string and is required"
                    },
                    created: {
                        bsonType: 'timestamp',
                        description: 'Current Timestamp'
                    }
                }
            }
        }

        await db
            .command({
                collMod: Ride.COLLECTION_NAME,
                validator: jsonSchema
            })
            .catch(async (error: MongoServerError) => {
                if (error.codeName === 'NamespaceNotFound') {
                    await db.createCollection(Ride.COLLECTION_NAME, {
                        validator: jsonSchema
                    })
                }
            })
        return true
    }

    async checkConnection() {
        if (!this.db) {
            await this.connectToDatabase()
        }
    }

    async getByQuery(collectionName: string, filter?: PaginationInterface): Promise<unknown[]> {
        await this.checkConnection()
        const collection: Collection = this.collections[collectionName]

        if (filter.after_id) {
            return collection
                .find({ _id: { $gt: new ObjectId(filter.after_id) } })
                .limit(filter.limit)
                .toArray()
        }
        return collection.find().limit(filter.limit).toArray()
    }

    async getOne(collectionName: string, id: string): Promise<unknown> {
        await this.checkConnection()
        const collection: Collection = this.collections[collectionName]

        const result = await collection.find({ _id: new ObjectId(id) }).toArray()
        if (result.length > 0) {
            return result[0]
        }
        return null
    }

    async insertOne(collectionName: string, d: unknown): Promise<unknown> {
        await this.checkConnection()
        const collection: Collection = this.collections[collectionName]
        const result = await collection.insertOne(d)
        return result.insertedId
    }
}

export const DB = new Database()
