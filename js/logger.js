'use strict';
const config = require('../config');
const winston = require('winston');
const daily = require('winston-daily-rotate-file');
const myFormat = winston.format.printf(info => {
    return info.timestamp + ' [' + info.level + '] '+ info.message;
});

winston.remove(winston.transports.Console);
if (config.server.logger.console) {
    winston.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.colorize(),
            myFormat
        ),
        level: config.server.logger.level
    }));
}
winston.add(new daily({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
    ),
    filename: config.server.logger.filename,
    datePattern: config.server.logger.datepattern,
    level: config.server.logger.level,
    maxSize: config.server.logger.max_size
}));

module.exports = winston;