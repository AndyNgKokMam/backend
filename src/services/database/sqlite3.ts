/**
 * sqlite3.ts
 * Xendit Coding Test
 * This file defines the functions for sqlite3
 */

import { Sequelize, Model, DataTypes } from 'sequelize'
import { DatabaseInterface, PaginationInterface } from '../database'
import { Ride } from '../../models/ride'
import { Logger } from '../../services/logger.service'
import { Db } from 'mongodb'

const sequelize = new Sequelize('sqlite::memory:')

Ride.init(
    {
        rideID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        start_lat: DataTypes.INTEGER,
        start_long: DataTypes.INTEGER,
        end_lat: DataTypes.INTEGER,
        end_long: DataTypes.INTEGER,
        rider_name: DataTypes.STRING,
        driver_name: DataTypes.STRING,
        driver_vehicle: DataTypes.STRING,
        created: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    },
    {
        sequelize,
        tableName: Ride.COLLECTION_NAME,
        timestamps: false,
        underscored: true
    }
)

class Databasesqlite3 implements DatabaseInterface {
    public db: Db = null

    collections: { [key: string]: typeof Ride } = {
        Rides: Ride
    }

    constructor() {
        //this.db = new sqlite3.Database(':memory:', this.buildSchemas)
        sequelize.sync()
    }

    async connectToDatabase() {
        //this.db = new sqlite3.Database(':memory:', this.buildSchemas)
        return true
    }

    async buildSchemas() {
        return true
    }

    async checkConnection() {
        if (!this.db) {
            await this.connectToDatabase()
        }
    }

    async getByQuery(collectionName: string, filter?: PaginationInterface): Promise<unknown[]> {
        await this.checkConnection()
        const collection = this.collections[collectionName]

        if (filter.after_id) {
            const rows = collection.findAll({
                where: {
                    rideID: filter.after_id
                },
                limit: filter.limit
            })
            if (rows) {
                return rows
            }
        }
        return collection.findAll({
            limit: filter.limit
        })
    }

    async getOne(collectionName: string, id: string): Promise<unknown> {
        await this.checkConnection()
        const collection = this.collections[collectionName]

        return collection.findOne({
            where: {
                rideID: id
            }
        })
    }

    async insertOne(collectionName: string, d: any): Promise<unknown> {
        await this.checkConnection()
        const collection = this.collections[collectionName]

        const result = await collection.create(d)
        return result.rideID
    }
}

export const DB = new Databasesqlite3()
