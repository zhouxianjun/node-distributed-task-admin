'use strict';
const DB = require('../DB');
const SequelizeDao = require('sequelize-dao');
const path = require("path");
class JobLogDao extends SequelizeDao {
}
module.exports = new JobLogDao(DB.sequelize, 'JobLog', path.resolve(__dirname, '../mapper/log.xml'));