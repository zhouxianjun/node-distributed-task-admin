/**
 * Created by alone on 17-5-15.
 */
'use strict';
const Result = require('../dto/Result');
const ip = require('ip');
const SequelizeDao = require('sequelize-dao');
const trc = require('trc');
const jobService = trc.ServerProvider.instance(require('../thrift/JobService'));
const PublicStruct = require('../thrift/PublicStruct_types');
const JobDao = require('../dao/JobDao');
module.exports = class JobController {
    static get routers() {
        return [{
            method: 'get',
            path: '/job/list/page',
            value: JobController.listPage
        }, {
            method: 'post',
            path: '/job/pause',
            value: JobController.pause
        }, {
            method: 'post',
            path: '/job/recovery',
            value: JobController.recovery
        }, {
            method: 'post',
            path: '/job/cancel',
            value: JobController.cancel
        }, {
            method: 'post',
            path: '/job/add',
            value: JobController.add
        }];
    }
    static async listPage(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let paging = new SequelizeDao.Paging(1, 10);
        await JobDao.templateByPage('selectByPage', paging, params);
        ctx.body = new Result(true, {
            key: 'page',
            value: paging
        }).json;
    }

    static async pause(ctx) {
        let params = ctx.request.body;
        await jobService.pause(params.taskId, params.msg, new PublicStruct.HostInfo({
            host: ip.address() || '127.0.0.1',
            port: 0,
            pid: process.pid
        }));
        ctx.body = new Result(true).json;
    }

    static async recovery(ctx) {
        let params = ctx.request.body;
        await jobService.recovery(params.taskId, params.msg, new PublicStruct.HostInfo({
            host: ip.address() || '127.0.0.1',
            port: 0,
            pid: process.pid
        }));
        ctx.body = new Result(true).json;
    }

    static async cancel(ctx) {
        let params = ctx.request.body;
        await jobService.cancel(params.taskId, params.msg, new PublicStruct.HostInfo({
            host: ip.address() || '127.0.0.1',
            port: 0,
            pid: process.pid
        }));
        ctx.body = new Result(true).json;
    }

    static async add(ctx) {
        let params = ctx.request.body;
        await jobService.add(new PublicStruct.JobStruct(Object.assign({
            submitHost: ip.address() || '127.0.0.1',
            submitPid: process.pid
        }, params)));
        ctx.body = new Result(true).json;
    }
};