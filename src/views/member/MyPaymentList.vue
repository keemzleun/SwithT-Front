<template>
    <v-container>
        <v-row justify="center">
            <v-col class="main-title" cols="12" align="center" style="font-size: 28px; font-weight: 700">
                <h1>신청 내역</h1>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <h2 style="font-size: 18px; font-weight: 700; margin-top: 20px;">결제 내역</h2>
                <v-row class="header" style="font-weight: bold; margin-top: 10px;">
                    <v-col cols="1"></v-col>
                    <v-col cols="2"></v-col>
                    <v-col cols="2">강의명</v-col>
                    <v-col cols="1">결제일</v-col>
                    <v-col cols="1">결제 금액</v-col>
                    <v-col cols="1">결제 영수증</v-col>
                    <v-col cols="3">상태</v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row>
            <v-col v-if="paymentList.length">
                <v-row v-for="(payment, index) in paymentList" :key="payment.id" class="item" style="margin-top: 10px;">
                    <v-col cols="1">{{ index + 1 }}</v-col>
                    <v-col cols="2" v-if="payment.lectureGroupId !== null">
                        <img v-if="thumbnailUrls[payment.id]" :src="thumbnailUrls[payment.id]" alt="썸네일" style="width: 100%; height: auto;">
                    </v-col>
                    <v-col cols="2" v-else></v-col>
                    <v-col cols="2">{{ payment.name }}</v-col>
                    <v-col cols="1">{{ formatDate(payment.paidAt) }}</v-col>
                    <v-col cols="1">{{ payment.amount }} 원</v-col>
                    <v-col cols="1">
                        <a :href="payment.receiptUrl" target="_blank">영수증 보기</a>
                    </v-col>
                    <v-col v-if="formatStatus(payment.status) === '결제 완료'" cols="1">환불</v-col>
                    <v-col v-else cols="1"></v-col>
                    <v-col cols="1">{{ formatStatus(payment.status) }}</v-col>
                </v-row>
            </v-col>
            <v-col v-else>
                <div style="margin: 20px 0">결제 요청이 없습니다.</div>
            </v-col>
        </v-row>

        <v-btn
            :disabled="currentPage === 1"
            @click="previousPage"
            style="background-color:white; color:#7A6C5B; border: 1px solid #7A6C5B; font-size: 15px; margin-right: 3px;"
            outlined
        >
            이전 페이지
        </v-btn>
        <v-btn
            :disabled="currentPage === totalPages"
            @click="nextPage"
            style="background-color:white; color:#7A6C5B; border: 1px solid #7A6C5B; font-size: 15px; margin-left: 3px;"
            outlined
        >
            다음 페이지
        </v-btn>
        <refundModal
            v-model:dialog="showRefundModal"
        />
    </v-container>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            totalPages: 0,
            paymentList: [],
            thumbnailUrls: {}, // 썸네일 URL을 저장할 객체
        };
    },
    created() {
        this.getReceipts();
    },
    methods: {
        async getReceipts() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/payment-service/my-payments`, {
                params: {
                    page: this.currentPage - 1, // 서버는 0 기반 페이지 인덱스를 사용
                    size: this.itemsPerPage
                }
            });
            this.paymentList = response.data.content;
            this.totalItems = response.data.totalItems;
            this.totalPages = response.data.totalPages;

            // 각 결제 항목에 대해 썸네일 이미지 URL을 비동기로 가져옵니다.
            await Promise.all(this.paymentList.map(async (payment) => {
                if (payment.lectureGroupId !== null) {
                    this.thumbnailUrls[payment.id] = await this.getThumbnail(payment.lectureGroupId);
                }
            }));
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.getReceipts();
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.getReceipts();
            }
        },
        formatDate(date) {
            if (!date) return 'N/A';
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(date).toLocaleDateString(undefined, options);
        },
        formatStatus(status) {
            switch (status) {
                case 'paid':
                    return '결제 완료';
                case 'CANCELED':
                    return '환불된 강의';
                default:
                    return '';
            }
        },
        async getThumbnail(groupId) {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-group/get-image-and-title/${groupId}`);
            return response.data.result.image;
        }
    }
};
</script>
