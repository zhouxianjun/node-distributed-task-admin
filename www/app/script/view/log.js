/**
 * Created by alone on 17-6-29.
 */
'use strict';
import Table from "../../components/i-table.vue";
import Common from "../common";
import {getAttribute, LogType, LogStatus} from "../dic";
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
                    success: '',
                    action: ''
                }
            },
            LogType,
            LogStatus,
            loadingBtn: false,
            table: {
                columns: [{
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h('pre', params.row.msg);
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
                        return h('span', getAttribute(LogType, 'id', params.row.type).name);
                    }
                }, {
                    title: '节点组',
                    key: 'node_group'
                }, {
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        return h('span', getAttribute(LogStatus, 'id', params.row.success).name);
                    }
                }, {
                    title: 'Action',
                    key: 'action'
                }, {
                    title: '执行者',
                    render: (h, params) => {
                        return h('span', `${params.row['operation_host']}:${params.row['operation_port']}:${params.row['operation_pid']}`);
                    }
                }, {
                    title: '记录时间',
                    key: 'created_at',
                    render: Common.RENDER.DATE
                }],
                data: [],
                total: 0
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
        async doQuery() {
            let date = this.$refs['date'].currentValue;
            this.search.query.start_time = date[0] instanceof Date ? Common.dateFormat(date[0]) : '';
            this.search.query.end_time = date[1] instanceof Date ? Common.dateFormat(date[1]) : '';
            Common.voNumberToChar(this.search.query);
            let list = await this.fetch('/log/list/page', {params: this.search});
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
        }
    }
}