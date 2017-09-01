/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from "../common";
import JobDetail from '../../components/job-detail.vue';
import {getAttribute, JobStatus, JobType} from "../dic";
export default {
    data() {
        return {
            search: {
                page: 1,
                pageSize: 10,
                sortName: 'created_at',
                sortDir: 'desc',
                query: {
                    task_id: '',
                    type: '',
                    node_group: '',
                    status: '',
                    action: ''
                }
            },
            JobStatus,
            JobType,
            loadingBtn: false,
            selectItem: null,
            pauseMsg: null,
            cancelMsg: null,
            table: {
                columns: [{
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(JobDetail, {
                            props: {
                                detail: params.row
                            }
                        })
                    }
                }, {
                    title: '任务ID',
                    key: 'task_id',
                    ellipsis: true,
                    render: Common.RENDER.POPTIP
                }, {
                    title: '类型',
                    key: 'type',
                    render: (h, params) => {
                        return h('span', getAttribute(JobType, 'id', params.row.type).name);
                    }
                }, {
                    title: '节点组',
                    key: 'node_group'
                }, {
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        return h('span', getAttribute(JobStatus, 'id', params.row.status).name);
                    }
                }, {
                    title: 'Action',
                    key: 'action'
                }, {
                    title: '分发器',
                    key: 'dispatch'
                }, {
                    title: '触发时间',
                    key: 'trigger_time',
                    render: Common.RENDER.DATE
                }, {
                    title: '创建时间',
                    key: 'created_at',
                    render: Common.RENDER.DATE
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    loading: this.loadingBtn,
                                    disabled: !['CREATE','RUNNING','PAUSE'].includes(params.row.status)
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: async () => {
                                        this.selectItem = params.row;
                                        this.cancelModal = true;
                                        this.loadingBtn = true;
                                    }
                                }
                            }, '取消'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    loading: this.loadingBtn,
                                    disabled: this.canPause(params.row)
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: async () => {
                                        this.pauseModal = params.row.status !== 'PAUSE';
                                        this.selectItem = params.row;
                                        this.loadingBtn = true;
                                        params.row.status === 'PAUSE' && this.recovery();
                                    }
                                }
                            }, params.row.status === 'PAUSE' ? '恢复' : '暂停'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    loading: this.loadingBtn
                                },
                                on: {
                                    click: async () => {
                                        this.showAdd();
                                        this.vo.type = params.row.type;
                                        this.vo.maxRetryTimes = params.row.max_retry_times;
                                        this.vo.nodeGroup = params.row.node_group;
                                        this.vo.action = params.row.action;
                                        this.vo.cron = params.row.cron;
                                        this.vo.repeatCount = params.row.repeat_count;
                                        this.vo.repeatInterval = params.row.repeat_interval;
                                        this.vo.params = params.row.params;
                                    }
                                }
                            }, '复制'),
                        ]);
                    }
                }],
                data: [],
                total: 0
            },
            model: false,
            cancelModal: false,
            pauseModal: false,
            vo: {
                taskId: null,
                type: 'REAL_TIME',
                maxRetryTimes: 10,
                nodeGroup: null,
                action: null,
                cron: null,
                repeatCount: 0,
                repeatInterval: 1000,
                params: null
            },
            jobValidate: {
                taskId: [{required: true, trigger: 'blur' }],
                type: [{required: true, trigger: 'change' }],
                nodeGroup: [{required: true, trigger: 'blur' }],
                action: [{required: true, trigger: 'blur' }]
            }
        }
    },
    async mounted() {
        await this.doQuery();
    },
    components: {
        Table
    },
    watch: {
    },
    methods: {
        async add() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let date = this.$refs['triggerTime'].currentValue;
                    let success = await this.fetch('/job/add', {method: 'post', data: Object.assign({
                        triggerTime: date ? date.getTime() : null
                    }, this.vo)});
                    if (success === false) {
                        this.resetLoadingBtn();
                        return;
                    }
                    this.model = false;
                    setTimeout(() => this.doQuery(), 500);
                } else {
                    this.resetLoadingBtn();
                    this.$Message.error('表单验证失败!');
                }
            });
        },
        async cancel() {
            if (!this.selectItem || !this.cancelMsg) return;
            let success = await this.fetch('/job/cancel', {method: 'post', data: {taskId: this.selectItem.task_id, msg: this.cancelMsg}});
            if (success === false) {
                this.resetLoadingBtn();
                return;
            }
            this.selectItem = null;
            this.cancelModal = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async pause() {
            if (!this.selectItem || !this.pauseMsg) return;
            let success = await this.fetch('/job/pause', {method: 'post', data: {taskId: this.selectItem.task_id, msg: this.pauseMsg}});
            if (success === false) {
                this.resetLoadingBtn();
                return;
            }
            this.selectItem = null;
            this.pauseModal = false;
            setTimeout(() => this.doQuery(), 500);
        },
        async recovery() {
            if (!this.selectItem) return;
            let success = await this.fetch('/job/recovery', {method: 'post', data: {taskId: this.selectItem.task_id, msg: '恢复暂停'}});
            if (success === false) {
                this.resetLoadingBtn();
                return;
            }
            this.selectItem = null;
            setTimeout(() => this.doQuery(), 500);
        },
        async doQuery() {
            let date = this.$refs['date'].currentValue;
            this.search.query.start_time = date[0] instanceof Date ? Common.dateFormat(date[0]) : '';
            this.search.query.end_time = date[1] instanceof Date ? Common.dateFormat(date[1]) : '';
            Common.voNumberToChar(this.search.query);
            let list = await this.fetch('/job/list/page', {params: this.search});
            list && (this.table.data = list.page.count === 0 ? [] : list.page.items);
            list && (this.table.total = list.page.count);
            this.loadingBtn = false;
        },
        async changePage(page) {
            this.search.page = page;
            this.doQuery();
        },
        async changePageSize(size) {
            this.search.pageSize = size;
            this.doQuery();
        },
        showAdd() {
            this.model = true;
            this.loadingBtn = true;
            this.$refs['form'].resetFields();
        },
        cancelLoading() {
            this.loadingBtn = false;
        },
        resetLoadingBtn() {
            this.loadingBtn = false;
            this.$nextTick(() => this.loadingBtn = true);
        },
        canPause(data) {
            if (['FAILED','CANCEL','SUCCESS'].includes(data.status)) return true;
            return !(data.status === 'CREATE' || data.type === 'CRON' || (['REAL_TIME','TIMER','REPEAT'].includes(data.type) && (data.retry_times < data.max_retry_times || data.repeated_count < data.repeat_count)));
        }
    }
}