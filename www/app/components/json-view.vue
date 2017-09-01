<template>
    <div></div>
</template>
<script>
    import Common from '../script/common';
    import $ from 'jquery';
    import 'jquery-jsonview';
    import 'jquery-jsonview/dist/jquery.jsonview.css'
    export default {
        name: 'json-view',
        props: {
            data: [Array, Object, String]
        },
        mounted() {
            $(this.$el).JSONView(this.data);
        }
    }
</script>