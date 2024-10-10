import MemberMainView from "@/views/member/MemberMainView.vue";
import MemberLoginView from "@/views/member/MemberLoginView.vue";
import TutorEmailRegisterView from "@/views/member/TutorEmailRegisterView.vue";
import MemberSocialRegisterView from "@/views/member/MemberSocialRegisterView.vue";
import MemberEmailLoginView from "@/views/member/MemberEmailLoginView.vue";
import TuteeEmailRegisterView from "@/views/member/TuteeEmailRegisterView.vue";

export const memberRouter = [
    {
        path: '/member/main',
        name: 'MemberMainView',
        component: MemberMainView
    },
    {
        path: '/member/login',
        name: 'MemberLoginView',
        component: MemberLoginView
    },
    {
        path: '/member/email/register/tutor',
        name: 'TutorEmailRegisterView',
        component: TutorEmailRegisterView
    },
    {
        path: '/member/social/register',
        name: 'MemberSocialRegisterView',
        component: MemberSocialRegisterView
    },
    {
        path: '/member/email/login',
        name: 'MemberEmailLoginView',
        component: MemberEmailLoginView
    },
    {
        path: '/member/email/register/tutee',
        name: 'TuteeEmailRegisterView',
        component: TuteeEmailRegisterView
    },
]