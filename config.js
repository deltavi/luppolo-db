'use strict';
var config = {
    server: {
        port: 3003,
        dbs: {
            dump_file: 'dump/dbs.json'
        },
        logger : {
            console: true,
            datepattern: "YYYY-MM-DD",
            filename: "log/luppolo-%DATE%.log",
            level: "debug",
            max_size: 2000000
        }
    }
};

module.exports = config;