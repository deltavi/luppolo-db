'use strict';
const crypto = require("crypto");

function generateID(){
    return crypto.randomBytes(16).toString("hex");
}
// exports
module.exports.generateID = generateID;