<template>
    <div>
        <div class="row">
            <div class="col-md-6">
                <label>重试次数:</label>
                <span v-html="`${detail.retry_times}/${detail.max_retry_times}`"></span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <label>提交者:</label>
                <span v-html="`${detail.submit_host}:${detail.submit_pid}`"></span>
            </div>
        </div>
        <div class="row" v-show="detail.type == 'CRON'">
            <div class="col-md-6">
                <label>CRON:</label>
                <span v-html="detail.cron"></span>
            </div>
        </div>
        <div class="row" v-show="detail.type == 'REPEAT'">
            <div class="col-md-6">
                <label>重复次数:</label>
                <span v-html="`${detail.repeated_count}/${detail.repeat_count}`"></span>
            </div>
        </div>
        <div class="row" v-show="detail.type == 'REPEAT'">
            <div class="col-md-6">
                <label>重复间隔:</label>
                <span v-html="detail.repeat_interval"></span>
            </div>
        </div>
        <div class="row" v-show="detail.type != 'CRON'">
            <div class="col-md-6">
                <label>下次执行时间:</label>
                <span v-html="detail.next_time ? dateFormat(detail.next_time) : ''"></span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <label>参数:</label>
                <json-view :data="detail.params"></json-view>
            </div>
        </div>
    </div>
</template>
<script>
    import Common from '../script/common';
    import JsonView from './json-view.vue';
    export default {
        props: {
            detail: Object
        },
        methods: {
            dateFormat: Common.dateFormat
        },
        components: {
            JsonView
        }
    }
</script>