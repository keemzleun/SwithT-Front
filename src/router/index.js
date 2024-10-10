import { createRouter, createWebHistory } from 'vue-router';
import TestView from '@/components/TestView.vue'

import { lectureRouter } from './lectureRouter';
import LoginPage from '@/components/LoginPage.vue';
import FirstPage from '@/views/FirstPage.vue';
import TuteeAppliedList from '@/pendingLectures/TuteeAppliedList.vue';
import TutorAppliedList from '@/pendingLectures/TutorAppliedList.vue';
import AdminAppliedList from '@/pendingLectures/AdminAppliedList.vue';
import { memberRouter } from './memberRouter';
import { thirdRouter } from './thirdRouter';
import { lectureHomeRouter } from './lectureHomeRouter';
import LoginPage from '@/components/LoginPage.vue';
import { FirstRouter } from './FirstRouter';


const routes = [
    {
        path: '/test',
        name: 'TEST',
        component: TestView
    },
    ...thirdRouter,

    {
        path: "/home",
        name: "Home",
        component: FirstPage,
    },
    {
        path: "/tutee-applied-list",
        name: "TuteeAppliedList",
        component: TuteeAppliedList,
    },
    {
        path: "/tutor-applied-list",
        name: "TutorAppliedList",
        component: TutorAppliedList,
    },
    {
        path: "/admin-applied-list",
        name: "AdminAppliedList",
        component: AdminAppliedList,
    },
    {
        path: '/login',
        name: 'LOGIN',
        component: LoginPage
    },
    {
      path: "/first",
      name: "Home",
      component: FirstPage,
    },
    ...lectureRouter,
    ...memberRouter,
    ...lectureHomeRouter,
    ...FirstRouter
  
]
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router