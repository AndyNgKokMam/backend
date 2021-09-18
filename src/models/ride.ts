/**
 * ride.ts
 * Xendit Coding Test
 * This file defines the ride collection model
 */
import { Model } from 'sequelize'

interface RideAttributes {
    rideID: string
    start_lat: number
    start_long: number
    end_lat: number
    end_long: number
    rider_name: string
    driver_name: string
    driver_vehicle: string
    created: Date
}

export class Ride extends Model<RideAttributes> implements RideAttributes {
    static COLLECTION_NAME = 'Rides'

    public _id: string

    public rideID: string

    public start_lat: number

    public start_long: number

    public end_lat: number

    public end_long: number

    public rider_name: string

    public driver_name: string

    public driver_vehicle: string

    public created: Date

    create(
        start_lat: number,
        start_long: number,
        end_lat: number,
        end_long: number,
        rider_name: string,
        driver_name: string,
        driver_vehicle: string
    ) {
        this.start_lat = start_lat
        this.start_long = start_long
        this.end_lat = end_lat
        this.end_long = end_long
        this.rider_name = rider_name
        this.driver_name = driver_name
        this.driver_vehicle = driver_vehicle
    }

    getObject() {
        return {
            start_lat: this.start_lat,
            start_long: this.start_long,
            end_lat: this.end_lat,
            end_long: this.end_long,
            rider_name: this.rider_name,
            driver_name: this.driver_name,
            driver_vehicle: this.driver_vehicle
        }
    }
}
