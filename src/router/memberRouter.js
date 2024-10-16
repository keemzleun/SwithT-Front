import MemberMainView from "@/views/member/MemberMainView.vue";
import MemberSocialExplainView from "@/views/member/MemberSocialExplainView.vue";
import TutorEmailRegisterView from "@/views/member/TutorEmailRegisterView.vue";
import MemberTutorSocialRegisterView from "@/views/member/MemberTutorSocialRegisterView.vue";
import MemberTuteeSocialRegisterView from "@/views/member/MemberTuteeSocialRegisterView.vue";
import MemberEmailLoginView from "@/views/member/MemberEmailLoginView.vue";
import TuteeEmailRegisterView from "@/views/member/TuteeEmailRegisterView.vue";
import MemberWelcome from "@/views/member/MemberWelcome.vue";
import MemberMyPage from "@/views/member/MemberMyPage.vue";
export const memberRouter = [
    {
        path: '/member/main',
        name: 'MemberMainView',
        component: MemberMainView
    },
    {
        path: '/member/explain',
        name: 'MemberSocialExplainView',
        component: MemberSocialExplainView
    },
    {
        path: '/member/email/register/tutor',
        name: 'TutorEmailRegisterView',
        component: TutorEmailRegisterView
    },
    {
        path: '/member/social/register/tutor',
        name: 'MemberTutorSocialRegisterView',
        component: MemberTutorSocialRegisterView
    },
    {
        path: '/member/social/register/tutee',
        name: 'MemberTuteeSocialRegisterView',
        component: MemberTuteeSocialRegisterView
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
    {
        path: '/member/welcome',
        name: 'MemberWelcome',
        component: MemberWelcome
    },
    {
        path: '/member/mypage',
        name: 'MemberMyPage',
        component: MemberMyPage
    },
]