<template>
    <v-container width="60%">
        <h1>썸네일 자리</h1>

        <h2>{{this.title}}</h2>
        <hr><br>



        <v-row v-for="apply in lessonApplyList" :key="apply.id">
            <v-col>
                <v-card class="custom-border">
                    <v-card-text class="d-flex justify-space-between align-center">
                        <div>
                            {{ apply.tuteeName }}
                            <v-btn color="#90CDFF"
                                class="ml-3 font-weight-class">채팅<v-icon>mdi-message-outline</v-icon></v-btn>
                        </div>


                        <div>
                            <v-btn color="#FFC978" class="ml-3 font-weight-class" v-if="apply.status === 'WAITING'">결제
                                대기중</v-btn>
                            <v-btn color="#FFF490" class="ml-3 font-weight-class" v-else
                                @click="clickApplyRejectBtn('apply', apply.applyId, apply.tuteeName)">수락</v-btn>
                            <v-btn color="#DBD599" class="ml-3 font-weight-class"
                                @click="clickApplyRejectBtn('reject', apply.applyId, apply.tuteeName)">거절</v-btn>
                        </div>


                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>



        <v-pagination v-model="frontendPage" :length="totalPages" @click="handlePageChange"></v-pagination>

        

        <YesOrNoModal
        v-model="yesOrNoModal" 
        @confirmed="handleYesBtn"
        @update:dialog="yesOrNoModal = $event"
        :title=this.modalTitle
        :contents=this.modalContents
        yesBtnName="확인"
        />

    </v-container>
</template>

<script>
import YesOrNoModal from '@/components/YesOrNoModal.vue';
import axios from 'axios';
export default {
    components:{
        YesOrNoModal,
    },

    data() {
        return {
            lessonApplyList: [],
            page: 0,
            size: 5,
            totalPages: 0,
            frontendPage: 1,
            title: this.$route.query.title,
            lectureGroupId: null,
            selectedApplyId: null,



            yesOrNoModal: false,
            modalTitle: 'kk',
            modalContents: 'kk',



        };

    },

    created() {
        this.showApplyList();
    },

    methods: {
        async showApplyList() {
            try {
                let params = {
                    size: this.size,
                    page: this.page
                };
                this.lectureGroupId = this.$route.query.lectureGroupId;
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/single-lecture-apply-list/${this.lectureGroupId}`, { params });
                this.lessonApplyList = response.data.result.content;
                this.totalPages = response.data.result.totalPages;
            } catch (e) {
                console.log(e.response.data.error_message);
            }
        },

        handlePageChange() {
            this.page = this.frontendPage - 1;
            this.showApplyList();
        },


        clickApplyRejectBtn(applyOrReject, applyId, tuteeName){
            if(applyOrReject == 'apply'){
                this.modalTitle = '결제 요청';
                this.modalContents = tuteeName+'님께 결제요청을 보내시겠습니까?';
            }else{
                this.modalTitle = '신청 거절';
                this.modalContents = tuteeName+'님의 신청을 거절하시겠습니까?';
                this.yesOrNoModal = true;
            }
            this.selectedApplyId = applyId;
            this.yesOrNoModal = true;


        },

        handleYesBtn(){
            if(this.modalTitle == '결제 요청'){
                this.clickApplyAdmit(this.selectedApplyId);
            }else{
                this.clickApplyReject(this.selectedApplyId);
            }
            window.location.reload();
            this.yesOrNoModal = false;

        },

        async clickApplyAdmit(applyId) {
            try {
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/single-lecture-payment-request/${applyId}`);
                console.log(response.data.result);
            } catch (e) {
                alert(e.response.data.error_message+"\n한번에 한 튜티에게 결제 요청을 보낼 수 있습니다.");
            }
        },

        async clickApplyReject(applyId) {
            this.yesOrNoModal = true;

            try {
                const response = await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/single-lecture-apply-reject/${applyId}`);
                console.log(response.data.result);
            } catch (e) {
                console.log(e.response.data.error_message);
                alert("신청 취소에 실패했습니다.");
            }

        }

    }
}
</script>

<style scoped>
.custom-border {
    border: 2px solid #cccccc;
    border-radius: 8px;
    box-shadow: none !important;
}

div,
.font-weight-class {
    font-weight: 900;
}

.submit-group {
    background-color: #0d6efd;
    color: #f5f5f5;
    width: 100px;
    height: 40px;
    line-height: 40px;
    border-radius: 10px;
    right: 0;
    font-weight: bold;
  }
.submit-group:hover {
    cursor: pointer;
}
</style>