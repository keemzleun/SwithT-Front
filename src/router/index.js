import { createRouter, createWebHistory } from 'vue-router';
import TestView from '@/components/TestView.vue'
import { lectureRouter } from './lectureRouter';
import LoginPage from '@/components/LoginPage.vue';
const routes = [
    {
        path: '/test',
        name: 'TEST',
        component: TestView
    },
    {
        path: '/login',
        name: 'LOGIN',
        component: LoginPage
    },
    ...lectureRouter
]
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router