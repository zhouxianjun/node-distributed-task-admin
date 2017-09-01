<template>
    <div>
        <div class="box box-default">
            <div class="box-header with-border">
                <h3 class="box-title">查询</h3>

                <div class="box-tools pull-right">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                    <button type="button" class="btn btn-box-tool" @click="doQuery"><i class="glyphicon glyphicon-search"></i></button>
                </div>
            </div>
            <div class="box-body">
                <div class="row">
                    <div class="col-sm-4">
                        <label>任务ID</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.task_id" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>类型</label>
                        <div class="form-group">
                            <Select v-model="search.query.type" class="pull-right">
                                <Option value="">全部</Option>
                                <Option v-for="item in LogType" :value="item.id" :key="item">{{ item.name }}</Option>
                            </Select>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>节点组</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.node_group" class="form-control pull-right">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4">
                    <label>结果</label>
                    <div class="form-group">
                        <Select v-model="search.query.success" class="pull-right">
                            <Option value="">全部</Option>
                            <Option v-for="item in LogStatus" :value="item.id" :key="item">{{ item.name }}</Option>
                        </Select>
                    </div>
                </div>
                    <div class="col-sm-4">
                        <label>Action</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.action" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>记录时间</label>
                        <div class="form-group">
                            <Date-picker ref="date" style="width: 100%" type="datetimerange" placeholder="选择日期和时间"></Date-picker>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default i-panel-default">
            <div class="panel-heading">
                <span>日志列表</span>
            </div>
            <div class="panel-body">
                <Table :columns="table.columns" :data="table.data" :headerColor="`#fff`"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="table.total" :show-sizer="true" placement="top" @on-page-size-change="changePageSize" @on-change="changePage"></Page>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import view from '../script/view/log';
    export default view;
</script>