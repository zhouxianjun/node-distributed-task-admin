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
                                <Option v-for="item in JobType" :value="item.id" :key="item">{{ item.name }}</Option>
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
                    <label>状态</label>
                    <div class="form-group">
                        <Select v-model="search.query.status" class="pull-right">
                            <Option value="">全部</Option>
                            <Option v-for="item in JobStatus" :value="item.id" :key="item">{{ item.name }}</Option>
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
                        <label>创建时间</label>
                        <div class="form-group">
                            <Date-picker ref="date" style="width: 100%" type="datetimerange" placeholder="选择日期和时间"></Date-picker>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default i-panel-default">
            <div class="panel-heading">
                <span>任务列表</span>
                <button type="button" class="btn btn-default btn-sm pull-right" @click="showAdd">
                    <span class="glyphicon glyphicon glyphicon-plus" aria-hidden="true"></span> 添加
                </button>
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
        <Modal v-model="model" title="新增任务" :loading="loadingBtn" @on-ok="add" @on-cancel="cancelLoading">
            <Form ref="form" :model="vo" :label-width="100" :rules="jobValidate">
                <Form-item label="任务ID" prop="taskId">
                    <Input v-model="vo.taskId"/>
                </Form-item>
                <Form-item label="类型" prop="type">
                    <Select v-model="vo.type">
                        <Option v-for="item in JobType" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="最大重试次数" prop="maxRetryTimes" v-show="vo.type == 'REAL_TIME' || vo.type == 'TIMER'">
                    <Input-number :max="100" :min="0" v-model="vo.maxRetryTimes"></Input-number>
                </Form-item>
                <Form-item label="节点组" prop="nodeGroup">
                    <Input v-model="vo.nodeGroup"/>
                </Form-item>
                <Form-item label="Action" prop="action">
                    <Input v-model="vo.action"/>
                </Form-item>
                <Form-item label="Cron" prop="cron" v-show="vo.type == 'CRON'">
                    <Input v-model="vo.cron"/>
                </Form-item>
                <Form-item label="触发时间">
                    <Date-picker ref="triggerTime" type="datetime" placeholder="选择日期和时间"></Date-picker>
                </Form-item>
                <Form-item label="重复次数" prop="repeatCount" v-show="vo.type == 'REPEAT'">
                    <Input-number :max="100" :min="1" v-model="vo.repeatCount"></Input-number>
                </Form-item>
                <Form-item label="重复间隔" prop="repeatInterval" v-show="vo.type == 'REPEAT'">
                    <Input-number :max="9999999" :min="100" v-model="vo.repeatInterval"></Input-number>
                </Form-item>
                <Form-item label="参数" prop="params">
                    <Input v-model="vo.params" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入参数"></Input>
                </Form-item>
            </Form>
        </Modal>
        <Modal v-model="cancelModal" width="360" @on-cancel="cancelLoading">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>取消确认</span>
            </p>
            <div style="text-align:center">
                <p>确定取消该任务吗? 取消后将无法恢复。</p>
                <p>是否继续取消？</p>
            </div>
            <Input v-model="cancelMsg" placeholder="请输入取消理由"></Input>
            <div slot="footer">
                <Button type="error" size="large" @click="cancel">取消</Button>
            </div>
        </Modal>
        <Modal v-model="pauseModal" width="360" @on-cancel="cancelLoading">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>暂停确认</span>
            </p>
            <div style="text-align:center">
                <p>确定暂停该任务吗?</p>
                <p>是否继续暂停？</p>
            </div>
            <Input v-model="pauseMsg" placeholder="请输入暂停理由"></Input>
            <div slot="footer">
                <Button type="error" size="large" @click="pause">暂停</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import view from '../script/view/job';
    export default view;
</script>