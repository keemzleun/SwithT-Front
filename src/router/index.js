import { createRouter, createWebHistory } from 'vue-router';
import TestView from '@/components/TestView.vue'
import { lectureHomeRouter } from './lectureHomeRouter';
import LoginPage from '@/components/LoginPage.vue';
import { FirstRouter } from './FirstRouter';


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
    ...lectureHomeRouter,
    ...FirstRouter

]
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router