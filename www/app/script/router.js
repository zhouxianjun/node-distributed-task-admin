/**
 * Created by alone on 17-5-11.
 */
import Index from '../view/index.vue';
import Home from '../view/home.vue';
import Job from '../view/job.vue';
import Log from '../view/log.vue';
export default [{
    path: '/',
    component: Index,
    children: [{
        path: 'home',
        component: Home
    }, {
        path: 'job',
        component: Job
    }, {
        path: 'log',
        component: Log
    }]
}]