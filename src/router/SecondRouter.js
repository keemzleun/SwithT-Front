import TutorLectureClassList from "@/views/lecture/TutorLectureClassList.vue";
import TutorMyLectureList from "@/views/lecture/TutorMyLectureList.vue";
import LessonApplyList from "@/views/lectureApply/LessonApplyList.vue";

export const secondRouter = [
    {
        path: '/tutor-lecture-list',
        name: 'TutorMyLectureList',
        component: TutorMyLectureList
    },

    {
        path: '/tutor-lecture-class-list',
        name: 'TutorLectureClassList',
        component: TutorLectureClassList
    },

    {
        path: '/lesson-apply-list',
        name: 'LessonApplyList',
        component: LessonApplyList
    },

]