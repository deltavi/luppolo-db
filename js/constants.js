'use strict';
const pjson = require('../package.json');

module.exports.pluginExtension = '.plup.js';
module.exports.luppoloVersion = 'v. ' + pjson.version;
module.exports.luppoloName = 'LuppoloDB ' + module.exports.luppoloVersion;
module.exports.luppoloRoot = '/luppolo';
module.exports.luppoloUIRoot = module.exports.luppoloRoot + '/ui';
module.exports.luppoloDbRoot = module.exports.luppoloRoot + '/db';
module.exports.luppoloDbsRoot = module.exports.luppoloRoot + '/dbs';