"use strict";
import winston from "winston";
import config from "../../config";

export default winston.createLogger({
    transports: [
        new winston.transports.File({
            level: config.app.IS_PROD ? "info" : "debug",
            filename: config.log.FILE,
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            maxsize: config.log.SIZE,
            maxFiles: config.log.NUM_FILES,
        }),
        new winston.transports.Console({
            level: "debug",
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize()
            ),
        }),
    ],
    exitOnError: false,
});
