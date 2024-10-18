<template>
    <section class="top-info">
        <v-row class="align-center">
            <v-col cols="7">
                <div>
                    <span class="lectureType">
                        {{ this.lectureType  }}
                    </span>
                    <span class="category" style="font-size: 18px;">
                        {{ this.category  }}
                    </span>
                </div>
                <div class="title">{{ infoData.title }}</div>
                <div class="memberName"> {{infoData.memberName}} 튜터 <v-icon @click="clickChatRoom()">mdi-chat</v-icon></div>
                <div class="detailInfo">시작 일자 : {{ infoData.startDate }}</div>
                <div class="detailInfo">강의 일정 : </div>
                <div v-html="lectureSchedules" class="detailInfo"></div> 
                <div class="detailInfo">위치 : {{ infoData.address }} <v-icon @click="showMap()">mdi-google-maps</v-icon> </div>

            </v-col>
            <v-col cols="5" class="d-flex align-center justify-center">
                <div class="thumbnail">
                    <img :src="infoData.image" alt="Lecture Thumbnail" />
                </div>
            </v-col>
        </v-row>
    </section>
    <v-dialog v-model="mapModal" max-width="500px">
        <v-card>
            <v-card-title class="text-h4 pa-4 d-flex justify-center">
                주소 확인
            </v-card-title>
            <v-divider class="mb-4" style="height: 2px; background-color: black;"></v-divider>

            <v-card-text class="pa-4 pt-0">
                <div>
                    <div id="map" style="width:100%;height:350px;"></div>
                </div>
            </v-card-text>
            <v-card-actions class="pa-4">
                <v-row justify="center">
                    <v-btn variant="outlined" @click="mapModal = false" class="mr-3">확인</v-btn>
                </v-row>
            </v-card-actions>
            <v-divider class="mt-2 mb-10"></v-divider>

        </v-card>
    </v-dialog>
    <!-- <v-card class="custom-card">
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
    </v-card> -->
</template>

<script>
/* global kakao */

export default {
    props: {
        infoData: Object,
        lectureSchedules: String,
    },
    data(){
        return{
            mapModal: false,

            lectureType:this.formattedLectureType(),
            category:this.formattedCategory(),
        };
    },
    created(){
        this.lectureType="";
        this.category="";
        this.loadKakaoMapScript();

    },
    methods: {
        clickChatRoom() {
            console.log("채팅방 입장" + this.infoData.chatRoomId);
            this.$router.push(`/chat-room?chatRoomId=${this.infoData.chatRoomId}`);
        },
        formattedCategory() {
            switch (this.infoData?.category) {
                case 'CAREER':
                    return '취업&직무';
                case 'HOBBY':
                    return '취미';
                case 'ADDMISSION':
                    return '입시';
                case 'DEVELOPMENT':
                    return '자기계발';
                default:
                    return this.infoData?.category;
            }
        },
        formattedLectureType(){
            console.log("확인 들어왔는가  "+this.infoData.lectureGroupTimes[0].lectureType)
            switch(this.infoData.lectureGroupTimes[0].lectureType) {
                case 'LECTURE':
                    return '강의';
                case 'LESSON':
                    return '과외';
                default:
                    return this.infoData.lectureGroupTimes[0].lectureType;
            }
        },
        showMap(){
            this.execDaumPostcode();
            this.mapModal=true;
        },
        loadKakaoMapScript() {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=03a055c21377bee26ab1559dedf4af6f&libraries=services&autoload=false`;
            script.onload = () => {
                window.kakao.maps.load(() => {
                    this.isKakaoScriptLoaded = true;
                });
            };
            document.head.appendChild(script);
        },
        // 주소 검색 api
        execDaumPostcode() {
            // 주소 검색한 거 기반으로 위도 경도
            // 좌표 검색을 위해 Kakao 지도 Geocoder 사용
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(this.infoData.address, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    console.log('위도 : ' + result[0].y);
                    console.log('경도 : ' + result[0].x);

                    // 지도에 마커를 추가하는 로직
                    this.initMap(result[0].y, result[0].x);
                }
            });
        },
        initMap(latitude, longitude) {
            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new kakao.maps.LatLng(latitude, longitude),
                level: 3
            };
            const map = new kakao.maps.Map(mapContainer, mapOption);

            const markerPosition = new kakao.maps.LatLng(latitude, longitude);
            const marker = new kakao.maps.Marker({
                position: markerPosition
            });
            marker.setMap(map);
        },
    },
};
</script>

<style scoped>
.v-container {
    padding: 0 !important;
}
.top-info {
    background-color: #6C97FD;
    color: white;
    padding: 100px 20vw 40px;
    text-align: left; 
}
.lectureType {
    display: inline-block;
    margin-right: 5px;
    background-color:  #121212;
    width: 50px;
    border-radius: 5px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}
.title {
    font-size: 40px;
    font-weight: bold;
}
.memberName {
    font-size: 20px;
}
.detailInfo {
    font-size: 15px;
    margin-bottom: 5px;
}
.avgScore {
    font-size: 1.5rem;
}
.thumbnail img {
    width: 80%;
    border-radius: 8px;
}
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
