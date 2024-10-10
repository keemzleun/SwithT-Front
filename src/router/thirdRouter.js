import LectureHomeView from '@/views/lecture/home/LectureHomeView.vue'
import MapTest from '@/views/lecture/home/MapTest.vue'
export const thirdRouter=[
    {
        path: '/lecture/:lectureGroupId',
        name: 'LectureHomeView',
        component: LectureHomeView
    },
    {
        path: '/lecture/test',
        name: 'MapTest',
        component: MapTest
    },

]