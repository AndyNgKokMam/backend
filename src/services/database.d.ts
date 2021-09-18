/**
 * database.d.ts
 * Xendit Coding Test
 * This file defines the interface for database, for MongoDB, Postgres, MySQL, sqlite
 */

export interface PaginationInterface {
    limit: number
    after_id?: string
}

export interface DatabaseInterface {
    db: any
    connectToDatabase(): Promise<boolean>
    buildSchemas(): Promise<boolean>
    getByQuery(collectionName: string, d: unknown, filter?: PaginationInterface): Promise<unknown[]>
    getOne(collectionName: string, id: string): Promise<unknown>
    insertOne(collectionName: string, d: unknown): Promise<unknown>
}
