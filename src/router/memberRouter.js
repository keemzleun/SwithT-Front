import MemberCreateView from "@/views/member/MemberCreateView.vue";
import MemberLoginView from "@/views/member/MemberLoginView.vue";
import MemberEmailRegisterView from "@/views/member/MemberEmailRegisterView.vue";
import MemberSocialRegisterView from "@/views/member/MemberSocialRegisterView.vue";
import MemberEmailLoginView from "@/views/member/MemberEmailLoginView.vue";


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
        path: '/member/MemberEmailRegisterView',
        name: 'MemberEmailRegisterView',
        component: MemberEmailRegisterView
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
]