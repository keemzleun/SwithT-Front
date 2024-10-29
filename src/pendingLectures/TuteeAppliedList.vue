<template>
    <v-container>
        <v-row justify="center">
            <v-col class="main-title" cols="12" align="center" style="font-size: 28px; font-weight: 700">
                <p>신청 내역</p>
            </v-col>
        </v-row>

        <v-tabs v-model="activeTab" style="margin-bottom: 30px;">
            <v-tab value="payment" style="font-size: 18px; font-weight: 700;">결제 요청</v-tab>
            <v-tab value="all" style="font-size: 18px; font-weight: 700;">전체</v-tab>
        </v-tabs>

        <v-tabs-window v-model="activeTab">
            <v-tabs-window-item value="payment">
                <v-row>
                    <v-col>
                        <v-row class="header">
                            <v-col cols="1">순서</v-col>
                            <v-col cols="6">강의명</v-col>
                            <v-col cols="1">신청날짜</v-col>
                            <v-col cols="2"> </v-col>
                            <v-col cols="2">상태</v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-if="paymentLectures.length">
                        <v-row v-for="(lecture, index) in paymentLectures" :key="lecture.applyId" class="item">
                            <v-col cols="1">{{ index + 1 }}</v-col>
                            <v-col cols="6" class="lecture-title" @click="lecture.status === 'WAITING' ? confirmPayment(lecture) : null">{{ lecture.title }}</v-col>
                            <v-col cols="1">{{ formatDate(lecture.createdTime) }}</v-col>
                            <v-col cols="2">
                                <v-btn small color="red" @click="confirmCancel(lecture)">신청 취소</v-btn>
                            </v-col>
                            <v-col cols="2">
                                <span :class="getStatusClass(lecture.status)"
                                      :style="{ cursor: lecture.status === 'WAITING' ? 'pointer' : 'default' }">
                                    {{ getStatusText(lecture.status) }}
                                </span>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col v-else>
                        <div style="margin: 20px 0">결제 요청이 없습니다.</div>
                    </v-col>
                </v-row>
            </v-tabs-window-item>

            <v-tabs-window-item value="all">
                <v-row>
                    <v-col>
                        <v-row class="header">
                            <v-col cols="1">순서</v-col>
                            <v-col cols="6">강의명</v-col>
                            <v-col cols="1">신청날짜</v-col>
                            <v-col cols="2"></v-col>
                            <v-col cols="2">상태</v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-if="allLectures.length">
                        <v-row v-for="(lecture, index) in allLectures" :key="lecture.applyId" class="item">
                            <v-col cols="1">{{ index + 1 }}</v-col>
                            <v-col cols="6" class="lecture-title" @click="lecture.status === 'WAITING' ? confirmPayment(lecture) : null">{{ lecture.title }}</v-col>
                            <v-col cols="1">{{ formatDate(lecture.createdTime) }}</v-col>
                            <v-col cols="2" v-if="lecture.status === 'STANDBY'">
                                <v-btn small color="red" @click="confirmCancel(lecture)">신청 취소</v-btn>
                            </v-col>
                            <v-col cols="2" v-else> </v-col>
                            <v-col cols="2" style="font-weight: 700">
                                <span :class="getStatusClass(lecture.status)"
                                      :style="{ cursor: lecture.status === 'WAITING' ? 'pointer' : 'default' }">
                                    {{ getStatusText(lecture.status) }}
                                </span>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col v-else>
                        <div style="margin: 20px 0">신청한 강의가 없습니다.</div>   
                    </v-col>
                </v-row>
            </v-tabs-window-item>
        </v-tabs-window>

        <!-- YesOrNoModal -->
        <YesOrNoModal
            v-model:dialog="showPaymentModal"
            :title="modalTitle"
            :contents="modalContents"
            :yesBtnName="yesBtnName"
            @confirmed="() => { isPaymentAction ? proceedPayment() : proceedCancellation(); }"
        />
    </v-container>
</template>

<script>
import axios from "axios";
import YesOrNoModal from "@/components/YesOrNoModal.vue";
import { jwtDecode } from 'jwt-decode';

export default {
    components: {
        YesOrNoModal
    },
    data() {
        return {
            activeTab: 'payment',
            paymentLectures: [],
            allLectures: [],
            showPaymentModal: false,
            selectedLecture: null,
            modalTitle: '',
            modalContents: '',
            yesBtnName: '',
            isPaymentAction: false
        };
    },
    watch: {
        activeTab(newTab) {
            if (newTab === 'payment') {
                this.fetchPaymentLectures();
            } else if (newTab === 'all') {
                this.fetchAllLectures();
            }
        }
    },
    methods: {
        async fetchPaymentLectures() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/tutee-my-lecture-list?status=WAITING`);
                this.paymentLectures = response.data.result.content;
            } catch (error) {
                console.error("Failed to fetch payment lectures:", error);
            }
        },
        async fetchAllLectures() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/tutee-my-lecture-list?status=`);
                this.allLectures = response.data.result.content;
            } catch (error) {
                console.error("Failed to fetch all lectures:", error);
            }
        },
        formatDate(date) {
            if (!date) return 'N/A';
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(date).toLocaleDateString(undefined, options);
        },
        getStatusClass(status) {
            switch (status) {
                case 'STANDBY':
                    return 'status-standby';
                case 'ADMIT':
                    return 'status-admit';
                case 'REJECT':
                    return 'status-reject';
                case 'TERMINATE':
                    return 'status-terminate';
                case 'WAITING':
                    return 'status-waiting';
                default:
                    return '';
            }
        },
        getStatusText(status) {
            switch (status) {
                case 'STANDBY':
                    return '수락 대기';
                case 'ADMIT':
                    return '수락';
                case 'REJECT':
                    return '거절';
                case 'TERMINATE':
                    return '삭제';
                case 'WAITING':
                    return '결제 요청';
                case 'CANCEL':
                    return '취소된 강의';
                default:
                    return '상태 불명';
            }
        },
        confirmPayment(lecture) {
            this.selectedLecture = lecture;
            this.modalTitle = `${lecture.title} 결제하시겠습니까?`;
            this.modalContents = "결제를 진행하려면 결제 버튼을 클릭하세요.";
            this.yesBtnName = "결제";
            this.isPaymentAction = true; 
            this.showPaymentModal = true;
        },
        confirmCancel(lecture) {
            console.log(lecture)
            this.selectedLecture = lecture;
            this.modalTitle = `${lecture.title} 신청을 취소하시겠습니까?`;
            this.modalContents = "신청을 취소하려면 수강 취소 버튼을 클릭하세요.";
            this.yesBtnName = "수강 취소";
            this.isPaymentAction = false; 
            this.showPaymentModal = true;
        },
        async proceedPayment() {
            this.showPaymentModal = false; 
            try {
                await this.handlePaymentRequest(this.selectedLecture.applyId); 
                this.initiatePayment(); 
            } catch (error) {
                console.error('결제 요청 중 오류 발생:', error);
            }
        },
        async handlePaymentRequest(applyId) {
            try {
                const lectureApplyId = Number(applyId);
                this.applyId = lectureApplyId;

                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/group/${lectureApplyId}`);
                this.title = response.data.result.lectureName;
                this.price = response.data.result.price;
                this.groupId = response.data.result.groupId;

                console.log('결제 요청 데이터 불러오기 성공:', response.data);
            } catch (error) {
                console.error('결제 요청 데이터 불러오기 중 오류 발생:', error);
                throw error; 
            }
        },
        initiatePayment() {
            const IMP = window.IMP; 
            IMP.init("imp00575764"); 

            const paymentData = {
                pg: "html5_inicis",
                pay_method: "card",
                merchant_uid: `merchant_${new Date().getTime()}`,
                name: this.title,
                amount: this.price,
                buyer_email: jwtDecode(localStorage.getItem('token')).email,
                buyer_name: jwtDecode(localStorage.getItem('token')).name,
                buyer_tel: "",
            };

            IMP.request_pay(paymentData, this.processPayment); 
        },
        async processPayment(rsp) {
            console.log("이상한거 호출")
            try {
                this.memberId = localStorage.getItem('id');
                if (rsp.success) {
                    const data = {
                        impUid: rsp.imp_uid,
                        title: this.title,
                        price: this.price,
                        memberId: this.memberId,
                        lectureGroupId: this.groupId,
                        id: this.applyId
                    };
                    console.log(data);

                    await axios.post(`${process.env.VUE_APP_API_BASE_URL}/payment-service/complete`, data);
                    alert("결제가 완료되었습니다!");

                    this.removePaymentAlert(this.applyId); 
                }
            } catch (error) {
                console.log("결제 처리 중 오류 발생:", error);
            }
        },
        removePaymentAlert(applyId) {
            this.paymentLectures = this.paymentLectures.filter(lecture => lecture.applyId !== applyId);
            let paymentEvents = JSON.parse(localStorage.getItem('paymentEvents')) || [];
            
            paymentEvents = paymentEvents.filter(event => event.contents !== applyId.toString());
            
            localStorage.setItem('paymentEvents', JSON.stringify(paymentEvents));
        },
        async proceedCancellation() {
            console.log("호출됨")
            this.showPaymentModal = false;
            try {
                await axios.put(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-apply/cancel/${this.selectedLecture.applyId}`);
                this.paymentLectures = this.paymentLectures.filter(lecture => lecture.applyId !== this.selectedLecture.applyId);
                this.allLectures = this.allLectures.filter(lecture => lecture.applyId !== this.selectedLecture.applyId);
                alert("신청이 취소되었습니다.");
            } catch (error) {
                console.error("신청 취소 중 오류 발생:", error);
            }
        },
    },
    created() {
        this.fetchPaymentLectures();
        this.fetchAllLectures();
    },
};
</script>

<style scoped>
.v-container {
    width: 70vw;
    margin-top: 60px;
}
.header {
    font-weight: bold;
    border-bottom: 2px solid #ccc;
}
.item {
    padding: 10px 0;
}
.lecture-title:hover{
    background-color: #ececec;
    border-radius: 15px;
    cursor: pointer;
}
.status-standby {
    color: orange;
}
.status-admit {
    color: green;
}
.status-rejected {
    color: red;
}
.status-waiting {
    color: blue;
}
.status-terminate {
    color: gray;
}
</style>
