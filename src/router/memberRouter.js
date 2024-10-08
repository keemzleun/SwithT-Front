import MemberCreateView from "@/views/member/MemberCreateView.vue";
import MemberLoginView from "@/views/member/MemberLoginView.vue";
import TutorEmailRegisterView from "@/views/member/TutorEmailRegisterView.vue";
import MemberSocialRegisterView from "@/views/member/MemberSocialRegisterView.vue";
import MemberEmailLoginView from "@/views/member/MemberEmailLoginView.vue";
import TuteeEmailRegisterView from "@/views/member/TuteeEmailRegisterView.vue";

export const memberRouter = [
    {
        path: '/member/create',
        name: 'MemberCreateView',
        component: MemberCreateView
    },
    {
        path: '/member/login',
        name: 'MemberLoginView',
        component: MemberLoginView
    },
    {
        path: '/member/TutorEmailRegisterView',
        name: 'TutorEmailRegisterView',
        component: TutorEmailRegisterView
    },
    {
        path: '/member/MemberSocialRegisterView',
        name: 'MemberSocialRegisterView',
        component: MemberSocialRegisterView
    },
    {
        path: '/member/MemberEmailLoginView',
        name: 'MemberEmailLoginView',
        component: MemberEmailLoginView
    },
    {
        path: '/member/TuteeEmailRegisterView',
        name: 'TuteeEmailRegisterView',
        component: TuteeEmailRegisterView
    },
]