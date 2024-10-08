import { createRouter, createWebHistory } from 'vue-router';
import TestView from '@/components/TestView.vue'
import { lectureRouter } from './lectureRouter';
import LoginPage from '@/components/LoginPage.vue';
import ScheduleView from '@/components/ScheduleView.vue'; // ScheduleView 컴포넌트 가져오기

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
    {
        path: '/schedule',
        name: 'Calendar',
        component: ScheduleView // Calendar 대신 ScheduleView 컴포넌트 사용
    },
    ...lectureRouter
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
