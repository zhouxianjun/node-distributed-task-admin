/**
 * Created by alone on 17-5-10.
 */
'use strict';
const config = require('./config.json');
const path = require('path');
const SequelizeDao = require('sequelize-dao');
(async () => {
    const DB = require('./server/DB');
    await SequelizeDao.loadEntity(DB.sequelize, './server/entity');
    // 初始化RPC
    const RPC = require('./server/RPC');
    await RPC.client.loadType(path.resolve(__dirname, './server/thrift'));

    const App = require('./server/WebServer');
    App.listen(config.port, '0.0.0.0');
})();