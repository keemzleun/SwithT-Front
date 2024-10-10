import { createRouter, createWebHistory } from 'vue-router';
import TestView from '@/components/TestView.vue'
import { secondRouter } from './SecondRouter';

const routes = [
    {
        path: '/test',
        name: 'TEST',
        component: TestView
    },
    ...secondRouter,

]
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router