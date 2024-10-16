<template>
    <v-card class="custom-card">
        <v-row>
            <v-col cols="3" class="thumbnail-container rounded-circle">
                <v-img :src="infoData.image" alt="썸네일" class="thumbnail-image rounded-circle"></v-img>
            </v-col>

            <v-col cols="9" class="pa-4">
                    <div class="text-left">
                        <div class="ml-2" justify="start">{{infoData.memberName}} 선생님 <v-icon @click="clickChatRoom()">mdi-chat</v-icon> </div> 
                        <h2>{{ infoData.title }}</h2>
                    </div>
                <v-row>
                    <v-col cols="6" class="text-left">
                        <v-chip label>{{ infoData.category }}</v-chip> 
                        <div style="margin-top: 10px;margin-bottom: 10px;"><strong>시작 일자:</strong> {{ infoData.startDate }}</div>
                        <div style="margin-bottom: 1px;"><strong>강의 일정:</strong></div>
                        <div v-html="lectureSchedules" style="margin-bottom: 5px;"></div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
export default {
    props: {
        infoData: Object,
        lectureSchedules: String,
    },
    
    methods: {
        clickChatRoom() {
            console.log("채팅방 입장" + this.infoData.chatRoomId);
        },
    },
};
</script>

<style scoped>
.custom-card {
    border: 1px solid #E0E0E0;
    padding: 20px;
    background-color: #FAFAFA;
}

.thumbnail-container {

    width: 100px;
    height: 100px;
    border-radius: 100%;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}

.thumbnail-image {
    width: 100%;
    /* 너비를 고정 */
    height: 100%;
    /* 높이를 고정 */
    border-radius: 100%;
    /* 동그랗게 만듦 */
    object-fit: cover;
    /* 이미지가 잘리지 않게 설정 */
}

.pa-4 {
    padding: 16px;
}

.text-left {
    text-align: left;
}

.d-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
