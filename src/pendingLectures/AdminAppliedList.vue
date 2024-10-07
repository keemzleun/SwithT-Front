<template>
    <v-container>
        <v-row justify="center">
            <v-col class="main-title" cols="12" align="center" style="font-size: 28px; font-weight: 700">
                <p>신청 내역</p>
            </v-col>
        </v-row>

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
            <v-col v-if="allLectures.length">
                <v-row v-for="(lecture, index) in allLectures" :key="lecture.applyId" class="item">
                    <v-col cols="1">{{ index + 1 }}</v-col>
                    <v-col cols="6" class="lecture-title">{{ lecture.title }}</v-col>
                    <v-col cols="3">{{ formatDate(lecture.createdTime) }}</v-col>
                    <v-col cols="2">
                        <span :class="getStatusClass(lecture.status)" style="font-weight: bold;">{{ getStatusText(lecture.status) }}</span>
                    </v-col>
                </v-row>
            </v-col>
            <v-col v-else>
                <div style="margin: 20px 0"> 개설 요청된 강의가 없습니다.</div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            allLectures: [],
        };
    },
    methods: {
        async fetchLectures() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/list-of-lecture?&status=STANDBY&size=5&page=0`);
                this.allLectures = response.data.result.content; // content에서 데이터 가져오기
                console.log(this.allLectures); // 데이터를 콘솔에 출력하여 확인
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
                case 'REJECT':
                    return 'status-reject';
                default:
                    return '';
            }
        },
        getStatusText(status) {
            switch (status) {
                case 'STANDBY':
                    return '수락 대기';
                case 'REJECT':
                    return '거절';
                default:
                    return '상태 불명';
            }
        },
    },
    created() {
        this.fetchLectures();
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
