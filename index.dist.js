/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/**
 * app.ts
 * Xendit Coding Test
 * This file defines the application start
 */

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const dotenv_1 = __importDefault(__webpack_require__(142));
dotenv_1.default.config();
const express_1 = __importDefault(__webpack_require__(860));
const util_1 = __importDefault(__webpack_require__(837));
global.TextEncoder = util_1.default.TextEncoder;
global.TextDecoder = util_1.default.TextDecoder;
const app = (0, express_1.default)();
const port = process.env.PORT;
const app_1 = __webpack_require__(174);
(0, app_1.startApp)(app);
app.listen(port, () => console.log(`App started and listening on port ${port}`));


/***/ }),

/***/ 174:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/**
 * app.ts
 * Xendit Coding Test
 * This file defines the express application
 */

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.startApp = void 0;
const path_1 = __importDefault(__webpack_require__(17));
const OpenApiValidator = __importStar(__webpack_require__(684));
const body_parser_1 = __importDefault(__webpack_require__(986));
const compression_1 = __importDefault(__webpack_require__(455));
const helmet_1 = __importDefault(__webpack_require__(806));
const morgan_middleware_1 = __webpack_require__(465);
const ride_router_1 = __webpack_require__(679);
const NODE_ENV = "production";
const apiSpec = path_1.default.join(process.cwd(), '/docs/api.yml');
const startApp = (app) => {
    app.use(body_parser_1.default.json({ limit: '5mb', type: 'application/json' }));
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    if (NODE_ENV === 'development') {
        app.use(morgan_middleware_1.morganMiddleware);
    }
    app.use(OpenApiValidator.middleware({
        apiSpec: apiSpec,
        validateResponses: true // <-- to validate responses
    }));
    app.get('/health', (req, res) => res.send('Healthy'));
    app.use('/rides', ride_router_1.ridesRouter);
    app.use((err, req, res, next) => {
        // format error
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors
        });
    });
};
exports.startApp = startApp;


/***/ }),

/***/ 465:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * morganMiddleware.ts
 * Xendit Coding Test
 * This file defines the morgan middleware for logging
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.morganMiddleware = void 0;
const morgan_1 = __importDefault(__webpack_require__(470));
const logger_service_1 = __webpack_require__(823);
const stream = {
    write: (message) => logger_service_1.Logger.http(message)
};
exports.morganMiddleware = (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms', { stream });


/***/ }),

/***/ 818:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * ride.router.ts
 * Xendit Coding Test
 * This file defines the routes for ride api
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRideById = exports.getRidesList = exports.addRide = void 0;
const ride_1 = __webpack_require__(288);
const sqlite3_1 = __webpack_require__(889);
const logger_service_1 = __webpack_require__(823);
const addRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startLatitude = Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName = req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;
        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }
        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }
        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }
        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }
        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }
        const rideObj = new ride_1.Ride();
        rideObj.create(req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle);
        rideObj.created = new Date();
        const rideId = yield sqlite3_1.DB.insertOne(ride_1.Ride.COLLECTION_NAME, rideObj.getObject());
        const ride = yield sqlite3_1.DB.getOne(ride_1.Ride.COLLECTION_NAME, rideId);
        res.json(ride);
    }
    catch (error) {
        logger_service_1.Logger.error('Error Post Ride', { error: error.message });
        res.status(500).send(error.message);
    }
});
exports.addRide = addRide;
const getRidesList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const limit = Number(req.query.limit);
        const pagination = {
            limit: limit,
            after_id: (_a = req.query.after_id) === null || _a === void 0 ? void 0 : _a.toString()
        };
        const data = yield sqlite3_1.DB.getByQuery(ride_1.Ride.COLLECTION_NAME, pagination);
        if (data.length > 0) {
            let has_more = true;
            let links = [];
            if (data.length < limit) {
                has_more = false;
            }
            else {
                links.push({
                    href: `http://${req.headers.host}${req.baseUrl}${req.path}?limit=2&after_id=${data[data.length - 1].rideID}`,
                    method: 'GET',
                    rel: 'next'
                });
            }
            return res.json({
                has_more,
                data,
                links
            });
        }
        res.json({
            has_more: false,
            data: [],
            links: []
        });
    }
    catch (error) {
        logger_service_1.Logger.error('Error Get Rides', { error: error.message });
        res.status(500).send(error.message);
    }
});
exports.getRidesList = getRidesList;
const getRideById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const id = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
        if (typeof id !== 'undefined') {
            const ride = yield sqlite3_1.DB.getOne(ride_1.Ride.COLLECTION_NAME, id);
            return res.json(ride);
        }
        else {
            return res.json({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        }
    }
    catch (error) {
        logger_service_1.Logger.error('Error Get Ride By Id', { error: error.message });
        res.status(500).send(error.message);
    }
});
exports.getRideById = getRideById;


/***/ }),

/***/ 288:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ride = void 0;
/**
 * ride.ts
 * Xendit Coding Test
 * This file defines the ride collection model
 */
const sequelize_1 = __webpack_require__(496);
class Ride extends sequelize_1.Model {
    create(start_lat, start_long, end_lat, end_long, rider_name, driver_name, driver_vehicle) {
        this.start_lat = start_lat;
        this.start_long = start_long;
        this.end_lat = end_lat;
        this.end_long = end_long;
        this.rider_name = rider_name;
        this.driver_name = driver_name;
        this.driver_vehicle = driver_vehicle;
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
        };
    }
}
exports.Ride = Ride;
Ride.COLLECTION_NAME = 'Rides';


/***/ }),

/***/ 679:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * ride.router.ts
 * Xendit Coding Test
 * This file defines the routes for ride api
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ridesRouter = void 0;
const express_1 = __importDefault(__webpack_require__(860));
const body_parser_1 = __importDefault(__webpack_require__(986));
const rideController = __importStar(__webpack_require__(818));
exports.ridesRouter = express_1.default.Router();
const jsonParser = body_parser_1.default.json();
exports.ridesRouter.post('/', jsonParser, rideController.addRide);
exports.ridesRouter.get('/', rideController.getRidesList);
exports.ridesRouter.get('/:id', rideController.getRideById);


/***/ }),

/***/ 889:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * sqlite3.ts
 * Xendit Coding Test
 * This file defines the functions for sqlite3
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DB = void 0;
const sequelize_1 = __webpack_require__(496);
const ride_1 = __webpack_require__(288);
const sequelize = new sequelize_1.Sequelize('sqlite::memory:');
ride_1.Ride.init({
    rideID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    start_lat: sequelize_1.DataTypes.INTEGER,
    start_long: sequelize_1.DataTypes.INTEGER,
    end_lat: sequelize_1.DataTypes.INTEGER,
    end_long: sequelize_1.DataTypes.INTEGER,
    rider_name: sequelize_1.DataTypes.STRING,
    driver_name: sequelize_1.DataTypes.STRING,
    driver_vehicle: sequelize_1.DataTypes.STRING,
    created: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    sequelize,
    tableName: ride_1.Ride.COLLECTION_NAME,
    timestamps: false,
    underscored: true
});
class Databasesqlite3 {
    constructor() {
        this.db = null;
        this.collections = {
            Rides: ride_1.Ride
        };
        //this.db = new sqlite3.Database(':memory:', this.buildSchemas)
        sequelize.sync();
    }
    connectToDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            //this.db = new sqlite3.Database(':memory:', this.buildSchemas)
            return true;
        });
    }
    buildSchemas() {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    checkConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db) {
                yield this.connectToDatabase();
            }
        });
    }
    getByQuery(collectionName, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkConnection();
            const collection = this.collections[collectionName];
            if (filter.after_id) {
                const rows = collection.findAll({
                    where: {
                        rideID: filter.after_id
                    },
                    limit: filter.limit
                });
                if (rows) {
                    return rows;
                }
            }
            return collection.findAll({
                limit: filter.limit
            });
        });
    }
    getOne(collectionName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkConnection();
            const collection = this.collections[collectionName];
            return collection.findOne({
                where: {
                    rideID: id
                }
            });
        });
    }
    insertOne(collectionName, d) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkConnection();
            const collection = this.collections[collectionName];
            const result = yield collection.create(d);
            return result.rideID;
        });
    }
}
exports.DB = new Databasesqlite3();


/***/ }),

/***/ 823:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/**
 * logger.service.ts
 * Xendit Coding Test
 * This file defines the logger service
 */

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
const winston_1 = __importDefault(__webpack_require__(773));
const winston_daily_rotate_file_1 = __importDefault(__webpack_require__(767));
const level = () => {
    const env = "production" || 0;
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};
const transportAll = new winston_daily_rotate_file_1.default({
    filename: 'logs/info-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '100m',
    maxFiles: '7d'
});
const transportError = new winston_daily_rotate_file_1.default({
    filename: 'logs/error-%DATE%.log',
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '50m',
    maxFiles: '7d'
});
const transports = [
    new winston_1.default.transports.Console(),
    transportError,
    transportAll
    /*new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
    }),
    new winston.transports.File({ filename: 'logs/all.log' })*/
];
exports.Logger = winston_1.default.createLogger({
    level: level(),
    transports
});


/***/ }),

/***/ 478:
/***/ ((module) => {

module.exports = require("babel-polyfill");

/***/ }),

/***/ 986:
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ 455:
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ 142:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 860:
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ 684:
/***/ ((module) => {

module.exports = require("express-openapi-validator");

/***/ }),

/***/ 806:
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ 470:
/***/ ((module) => {

module.exports = require("morgan");

/***/ }),

/***/ 496:
/***/ ((module) => {

module.exports = require("sequelize");

/***/ }),

/***/ 773:
/***/ ((module) => {

module.exports = require("winston");

/***/ }),

/***/ 767:
/***/ ((module) => {

module.exports = require("winston-daily-rotate-file");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 837:
/***/ ((module) => {

module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	__webpack_require__(478);
/******/ 	var __webpack_exports__ = __webpack_require__(351);
/******/ 	
/******/ })()
;