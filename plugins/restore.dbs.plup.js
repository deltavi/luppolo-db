'use strict';
const config = require('../config');
const logger = require('../js/logger');
const fs = require('fs-extra');
module.exports = {
    name : 'Auto Restore DBs Plugin',
    description : 'Restore the persistent version of all DBs on startup',
    init : function(app, db){
        if(fs.pathExistsSync(config.server.dbs.dump_file)){
            db.restoreDBs();
            const msg = 'DBs restored from: ' + config.server.dbs.dump_file;
            logger.info(msg);
            module.exports.statusMessage = msg;
        } else {
            const msg = 'No DBs to restore ("' + config.server.dbs.dump_file + '" missing)';
            logger.info(msg);
            module.exports.statusMessage = msg;
        }
    }
};