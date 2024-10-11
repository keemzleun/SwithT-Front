
import FirstPage from '@/views/FirstPage.vue';
import TuteeAppliedList from '@/pendingLectures/TuteeAppliedList.vue';
import TutorAppliedList from '@/pendingLectures/TutorAppliedList.vue';
import AdminAppliedList from '@/pendingLectures/AdminAppliedList.vue';
import ApplyLecturePage from '@/views/ApplyLecturePage.vue';

export const FirstRouter = [
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
        path: "/apply-lecture",
        name: "ApplyLecture",
        component: ApplyLecturePage,
    }

]