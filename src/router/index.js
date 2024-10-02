import { createRouter, createWebHistory } from 'vue-router';
import TestView from '@/components/TestView.vue'
const routes = [
    {
        path: '/test',
        name: 'TEST',
        component: TestView
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router