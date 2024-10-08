import { createRouter, createWebHistory } from 'vue-router';
import TestView from '@/components/TestView.vue'
import { lectureHomeRouter } from './lectureHomeRouter';
import FirstPage from '@/views/FirstPage.vue';

const routes = [
    {
        path: '/test',
        name: 'TEST',
        component: TestView
    },
    ...lectureHomeRouter
    {
        path: "/first",
        name: "Home",
        component: FirstPage,
      },
]
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router