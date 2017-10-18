'use strict';
exports.JobType = [{
    id: 'CRON',
    name: 'CRON任务'
}, {
    id: 'REAL_TIME',
    name: '实时任务'
}, {
    id: 'TIMER',
    name: '定时任务'
}, {
    id: 'REPEAT',
    name: '重复任务'
}];
exports.JobStatus = [{
    id: 'CREATE',
    name: '创建成功'
}, {
    id: 'RUNNING',
    name: '运行中'
}, {
    id: 'PAUSE',
    name: '已暂停'
}, {
    id: 'SUCCESS',
    name: '已完成'
}, {
    id: 'FAILED',
    name: '失败'
}, {
    id: 'CANCEL',
    name: '已取消'
}, {
    id: 'EXECUTE',
    name: '执行中'
}];
exports.LogType = [{
    id: 'RECEIVE',
    name: '已接收'
}, {
    id: 'COMPLETE',
    name: '完成任务'
}, {
    id: 'PAUSE',
    name: '暂停任务'
}, {
    id: 'RECOVERY',
    name: '恢复任务'
}, {
    id: 'CANCEL',
    name: '取消任务'
}, {
    id: 'RESET',
    name: '重置执行'
}];
exports.LogStatus = [{
    id: 0,
    name: '失败'
}, {
    id: 1,
    name: '成功'
}];
exports.getAttribute = (dic, prop, value, isArray = false) => {
    let result = [];
    for (let item of dic) {
        if (item[prop] === value) {
            if (!isArray) return item;
            result.push(item);
        }
    }
    return isArray ? result : null;
};