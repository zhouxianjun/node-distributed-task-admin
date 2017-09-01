/**
 * Created by alone on 17-5-15.
 */
'use strict';
const Result = require('../dto/Result');
const SequelizeDao = require('sequelize-dao');
const JobLogDao = require('../dao/JobLogDao');
module.exports = class LogController {
    static get routers() {
        return [{
            method: 'get',
            path: '/log/list/page',
            value: LogController.listPage
        }];
    }
    static async listPage(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let paging = new SequelizeDao.Paging(params.page, params.pageSize);
        await JobLogDao.templateByPage('selectByPage', paging, params);
        ctx.body = new Result(true, {
            key: 'page',
            value: paging
        }).json;
    }
};