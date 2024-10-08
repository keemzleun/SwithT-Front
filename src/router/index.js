import { createRouter, createWebHistory } from 'vue-router';
import TestView from '@/components/TestView.vue'
import { lectureHomeRouter } from './lectureHomeRouter';
const routes = [
    {
        path: '/test',
        name: 'TEST',
        component: TestView
    },
    ...lectureHomeRouter
]
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router