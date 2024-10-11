import { createRouter, createWebHistory } from 'vue-router';
import TestView from '@/components/TestView.vue'
import { secondRouter } from './SecondRouter';
import LoginPage from '@/components/LoginPage.vue';
import ScheduleView from '@/views/scheduler/MonthlyScheduleView.vue';
import { memberRouter } from './memberRouter';
import { thirdRouter } from './thirdRouter';
import { FirstRouter } from './FirstRouter';

const routes = [
    {
        path: '/test',
        name: 'TEST',
        component: TestView
    },
    ...secondRouter,
    ...thirdRouter,
    {
        path: '/login',
        name: 'LOGIN',
        component: LoginPage
    },
    {
        path: '/schedule',
        name: 'Calendar',
        component: ScheduleView
    },
    ...lectureRouter,
    ...memberRouter,
    ...FirstRouter
  
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router
