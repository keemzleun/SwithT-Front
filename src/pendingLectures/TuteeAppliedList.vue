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
                            <v-col cols="3">신청날짜</v-col>
                            <v-col cols="2">상태</v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-if="paymentLectures.length">
                        <v-row v-for="(lecture, index) in paymentLectures" :key="lecture.applyId" class="item">
                            <v-col cols="1">{{ index + 1 }}</v-col>
                            <v-col cols="6" class="lecture-title">{{ lecture.title }}</v-col>
                            <v-col cols="3">{{ formatDate(lecture.createdTime) }}</v-col>
                            <v-col cols="2">
                                <span :class="getStatusClass(lecture.status)"
                                      @click="lecture.status === 'WAITING' ? (initiatePayment(),handlePaymentRequest(lecture.applyId)) : null"
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
                            <v-col cols="3">신청날짜</v-col>
                            <v-col cols="2">상태</v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-if="allLectures.length" >
                        <v-row v-for="(lecture, index) in allLectures" :key="lecture.applyId" class="item">
                            <v-col cols="1">{{ index + 1 }}</v-col>
                            <v-col cols="6" class="lecture-title">{{ lecture.title }}</v-col>
                            <v-col cols="3">{{ formatDate(lecture.createdTime) }}</v-col>
                            <v-col cols="2" style="font-weight: 700">
                                <span :class="getStatusClass(lecture.status)"
                                      @click="lecture.status === 'WAITING' ? (initiatePayment(),handlePaymentRequest(lecture.applyId)) : null"
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
    </v-container>
</template>

<script>
import axios from "axios";
import { jwtDecode } from 'jwt-decode'

export default {
    data() {
        return {
            activeTab: 'payment', // 기본 활성 탭 인덱스
            paymentLectures: [], // 결제 요청 강의 목록
            allLectures: [], // 전체 강의 목록
        };
    },
    watch:{
        tab(newTab){
            if(newTab === 'payment'){
                this.fetchPaymentLectures();
            }else if(newTab === 'all'){
                this.fetchAllLectures();
            }
        }
    },
    methods: {
        async fetchPaymentLectures() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/tutee-my-lecture-list?status=WAITING`);
                this.paymentLectures = response.data.result.content; // 데이터가 없을 경우를 대비
            } catch (error) {
                console.error("Failed to fetch payment lectures:", error);
            }
        },
        async fetchAllLectures() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/tutee-my-lecture-list?status=`);
                this.allLectures = response.data.result.content; // 데이터가 없을 경우를 대비
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
                case 'WAITING' :
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
                case 'WAITING' :
                    return '결제 요청'
                default:
                    return '상태 불명';
            }
        },
        async handlePaymentRequest(applyId) {
            try {
                const lectureApplyId = Number(applyId)
                this.applyId = lectureApplyId 

                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/group/${lectureApplyId }`)
                this.title = response.data.result.lectureName
                this.price = response.data.result.price
                console.log('결제 요청 처리 결과:', response.data)
            } catch (error) {
                console.error('결제 요청 처리 중 오류 발생:', error)
            }
        },
        initiatePayment() {
            const IMP = window.IMP  // 아임포트 전역 객체
            IMP.init("imp00575764") // 아임포트 상점 고유코드로 초기화

            const paymentData = {
                pg: "html5_inicis", // 결제 PG사
                pay_method: "card", // 결제 방법
                merchant_uid: `merchant_${new Date().getTime()}`, // 주문번호
                name: this.title, // 결제 내역
                amount: this.price, // 결제 금액
                buyer_email: jwtDecode(localStorage.getItem('token')).email,
                buyer_name: jwtDecode(localStorage.getItem('token')).name,
                buyer_tel: "",
            }
            
            IMP.request_pay(paymentData, this.processPayment) // 결제 요청
        },
        async processPayment(rsp){
            try{
                this.memberId = localStorage.getItem('id')
                if(rsp.success) {
                    const data = {
                        impUid: rsp.imp_uid, // 아임포트 거래 고유번호
                        title: this.title,
                        price: this.price,
                        memberId: this.memberId,
                        id: this.applyId
                    }
                    console.log(data)
                    const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/payment-service/complete`, data)
                    alert(response.data.responseMessage)
                }
            } catch(error){
                console.log("what's the matter?: "+error)
            }
        },
    },
    created() {
        this.fetchPaymentLectures(); // 결제 요청 강의 목록을 가져옴
        this.fetchAllLectures(); // 전체 강의 목록을 가져옴
    },
};
</script>

<style scoped>
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
