import { createRouter, createWebHistory } from 'vue-router';
import TestView from '@/components/TestView.vue'
import { lectureHomeRouter } from './lectureHomeRouter';
import { lectureRouter } from './lectureRouter';
import LoginPage from '@/components/LoginPage.vue';
import FirstPage from '@/views/FirstPage.vue';
import TuteeAppliedList from '@/pendingLectures/TuteeAppliedList.vue';
import TutorAppliedList from '@/pendingLectures/TutorAppliedList.vue';
import AdminAppliedList from '@/pendingLectures/AdminAppliedList.vue';


const routes = [
    {
        path: '/test',
        name: 'TEST',
        component: TestView
    },
    ...lectureHomeRouter
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
    ...lectureRouter
]
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router