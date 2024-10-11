<template>
    <v-card class="pa-4" style="border: 5px #FFF490 solid;">
        <v-row>
            <v-col cols="3">
                <v-img :src="infoData.image" alt="썸네일" width="90%" height="100%"></v-img>
            </v-col>

            <v-col cols="9" class="pa-4">
                <div class="d-flex align-center">
                    <h2>{{ infoData.title }}</h2>
                    <v-btn variant="tonal" class="ma-2" @click="clickChatRoom()">채팅</v-btn>
                </div>
                <v-row>
                    <v-col cols="6" class="text-left">
                        <div style="margin-bottom: 10px;"><strong>분야:</strong> {{ infoData.category }}</div>
                        <div style="margin-bottom: 10px;"><strong>시작 일자:</strong> {{ infoData.startDate }}</div>
                        <div style="margin-bottom: 1px;"><strong>강의 일정:</strong></div>
                        <div v-html="lectureSchedules" style="margin-bottom: 10px;"></div>
                        <div style="margin-bottom: 10px;"><strong>튜터:</strong> {{ infoData.memberName }}</div>
                    </v-col>

                    <v-col cols="6" class="text-left">
                        <div><strong>장소:</strong> 서울특별시 동작구 신대방동 플레이데이터 4층 이건 string값 받으면 그때 변경</div>
                        <!-- coordinate 값이 있을 경우에만 KakaoMap 렌더링 -->
                        <KakaoMap v-if="coordinate" :lat="coordinate.lat" :lng="coordinate.lng" :draggable="true" width="90%" height="100%">
                            <KakaoMapMarker :lat="coordinate.lat" :lng="coordinate.lng"></KakaoMapMarker>
                        </KakaoMap>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

export default {
    components: {
        KakaoMap,
        KakaoMapMarker,
    },
    props: {
        infoData: Object,
        lectureSchedules: String,
        coordinate: {
            type: Object,
            default: null, // coordinate 값이 없을 경우 null로 처리
        },
    },
    methods: {
        clickChatRoom() {
            console.log("채팅방 입장" + this.infoData.chatRoomId);
        },
    },
};
</script>

<style scoped>
.text-left {
    text-align: left;
}
</style>