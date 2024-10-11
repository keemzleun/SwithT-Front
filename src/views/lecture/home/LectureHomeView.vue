<template>
    <v-container>
        <v-breadcrumbs :items="breadItems">
            <template v-slot:divider>
                <v-icon>mdi-menu-right</v-icon>
            </template>
        </v-breadcrumbs>
        <!-- 노란색 v-card -->
        <v-card class="pa-4" style="border: 5px #FFF490 solid;">
            <v-row>
                <v-col cols="3">
                    <v-img :src="this.infoData.image" alt="썸네일" width="90%" height="100%"></v-img>
                </v-col>

                <v-col cols="9" class="pa-4">
                    <div class="d-flex align-center">
                        <h2>{{ this.infoData.title }}</h2>
                        <v-btn variant="tonal" class="ma-2" @click="clickChatRoom()">채팅</v-btn>
                    </div>
                    <v-row>
                        <v-col cols="6" class="text-left">
                            <div style="margin-bottom: 10px;"><strong>분야:</strong> {{ this.infoData.category }}</div>
                            <div style="margin-bottom: 10px;"><strong>시작 일자:</strong> {{ this.infoData.startDate }}
                            </div>
                            <div style="margin-bottom: 1px;"><strong>강의 일정:</strong></div>
                            <div v-html="lectureSchedules" style="margin-bottom: 10px;"></div>
                            <div style="margin-bottom: 10px;"><strong>튜터:</strong> {{ this.infoData.memberName }}</div>
                        </v-col>

                        <v-col cols="6" class="text-left">
                            <!-- todo : 주소 뽑는 거 api 고치기 -->

                            <div><strong>장소:</strong> 서울특별시 동작구 신대방동 플레이데이터 4층 API 고쳐야함 주소 스트링으로 받을까?</div>
                            <!-- <KakaoMap :lat="this.infoData.latitude" :lng="this.infoData.longtitude" :draggable="true"
                                width="90%" height="100%">
                                <KakaoMapMarker :lat="this.infoData.latitude" :lng="this.infoData.longtitude">
                                </KakaoMapMarker>
                            </KakaoMap> -->
                            <KakaoMap :lat="coordinate.lat" :lng="coordinate.lng" :draggable="true" width="90%"
                                height="100%">
                                <KakaoMapMarker :lat="coordinate.lat" :lng="coordinate.lng"></KakaoMapMarker>
                            </KakaoMap>
                            <!-- Kakao Map API -->
                            <!-- <div id="map" style="width: 100%; height: 150px;"></div> -->
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card>

        <!-- Tabs -->
        <v-tabs v-model="tab" align-tabs="center" class="mt-5">
            <v-tab value="assignment">과제</v-tab>
            <v-tab value="notice">게시판</v-tab>
            <v-tab value="tuteeList">튜티 리스트</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
            <!-- 과제 탭 -->
            <v-tabs-window-item value="assignment">
                <v-card flat>
                    <v-card-text>
                        <v-row justify="end" class="mr-4">
                            <v-btn color="#90CDFF" @click="assignmentCreateModal = true"><strong>생성</strong></v-btn>
                        </v-row>

                        <!-- 과제 목록 -->
                        <v-row>
                            <v-col cols="12" md="12" v-for="assignment in assignments" :key="assignment.id"
                                class="text-left">
                                <v-card class="pa-4 mb-3" outlined>
                                    <v-row>
                                        <v-col>
                                            <h3>{{ assignment.title }}</h3>
                                            <p>제출 시작 날짜: {{ assignment.startDate }}</p>
                                            <p>제출 마감 날짜: {{ assignment.endDate }}</p>
                                        </v-col>

                                        <v-col cols="auto">
                                            <v-btn color="#90CDFF"
                                                @click="updateAssignmentOpen(assignment.id)"><strong>수정</strong></v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-tabs-window-item>
            <!-- 게시글 리스트 -->
            <v-tabs-window-item value="notice">
                <v-card flat>
                    <v-card-text>
                        <v-row justify="end" class="mr-4">
                            <v-btn color="#90CDFF" @click="noticeCreateModal = true"><strong>생성</strong></v-btn>
                        </v-row>
                        <v-data-table :headers="headers" :items="notices" class="elevation-1"
                            @click:row="noticeViewModal = true">
                            <template v-slot:[getitemcontrols()]="{ item }">

                                <v-icon class="me-2" size="small" @click.stop="editItem(item)">
                                    mdi-pencil
                                </v-icon>
                                <v-icon size="small" @click.stop="deleteItem(item)">
                                    mdi-delete
                                </v-icon>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>

            </v-tabs-window-item>
            <!-- 튜티 리스트 탭 -->
            <v-tabs-window-item value="tuteeList">
                <v-card flat>
                    <v-card-text>
                        <!-- 튜티 리스트 -->
                        <v-list width="40%" class="mx-auto">
                            <v-list-item v-for="tutee in this.tutees" :key="tutee.id"
                                class="tutee-list-item pa-1 mx-auto d-flex " rounded="lg"
                                style="align-items: center; justify-content: flex-start; padding: 12px; border-radius: 20px; margin-bottom: 10px; background-color: #f5f5f5; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); display: flex;">
                                <v-row>
                                    <v-col>
                                        <v-list-item-avatar>
                                            <v-avatar size="50">
                                                <v-img :src="tutee.tuteeProfile" :alt="tutee.name" />
                                            </v-avatar>
                                        </v-list-item-avatar>
                                    </v-col>
                                    <v-col class="d-flex justify-center" style="align-items: center;">
                                        <v-list-item-content>
                                            <v-list-item-title class="tutee-name"
                                                style="font-weight:400; text-align: center;"><h5>{{
                                                    tutee.tuteeName }}</h5></v-list-item-title>
                                        </v-list-item-content>
                                    </v-col>
                                </v-row>
                            </v-list-item>
                        </v-list>

                    </v-card-text>
                </v-card>
            </v-tabs-window-item>
        </v-tabs-window>

        <!-- 과제 모달 -->
        <v-dialog v-model="assignmentCreateModal" max-width="500px">
            <v-card>
                <v-card-title class="text-h4 pa-4 d-flex justify-center">
                    과제 생성
                </v-card-title>
                <v-divider class="mb-4" style="height: 2px; background-color: black;"></v-divider>

                <v-card-text class="pa-4 pt-0">
                    <!-- 제목  -->
                    <h4 class="mb-1 ml-2 mr-2"> 제목 </h4>
                    <v-text-field v-model="assignmentTitle" type="text" rounded="xs" variant="outlined"
                        class="mb-2 ml-2 mr-2"></v-text-field>
                    <h4 class="mb-1 ml-2 mr-2"> 제출 일자 </h4>

                    <input class="mb-2 ml-2 mr-2" v-model="assignmentDate" type="datetime-local" outlined>
                    <h4 class="mb-1 ml-2 mr-2"> 내용 </h4>
                    <v-textarea v-model="assignmentContent" label="내용" variant="outlined" rows="5"
                        class="mb-2 ml-2 mr-2"></v-textarea>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-row justify="center">
                        <v-btn variant="outlined" @click="cancelAssignment()" class="mr-3">취소하기</v-btn>
                        <v-btn variant="outlined" @click="submitAssignmentCreate()">등록하기</v-btn>
                    </v-row>
                </v-card-actions>
                <v-divider class="mt-2 mb-10"></v-divider>

            </v-card>
        </v-dialog>
        <v-dialog v-model="assignmentUpdateModal" max-width="500px">
            <v-card>
                <v-card-title class="text-h4 pa-4 d-flex justify-center">
                    과제 수정
                </v-card-title>
                <v-divider class="mb-4" style="height: 2px; background-color: black;"></v-divider>

                <v-card-text class="pa-4 pt-0">
                    <!-- 제목  -->
                    <h4 class="mb-1 ml-2 mr-2"> 제목 </h4>
                    <v-text-field v-model="assignmentTitle" type="text" rounded="xs" variant="outlined"
                        class="mb-2 ml-2 mr-2"></v-text-field>
                    <h4 class="mb-1 ml-2 mr-2"> 제출 일자 </h4>
                    <input class="mb-2 ml-2 mr-2" v-model="assignmentDate" type="datetime-local" outlined>
                    <h4 class="mb-1 ml-2 mr-2"> 내용 </h4>
                    <v-textarea v-model="assignmentContent" label="내용" variant="outlined" rows="5"
                        class="mb-2 ml-2 mr-2"></v-textarea>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-row justify="center">
                        <v-btn variant="outlined" @click="assignmentUpdateModal = false" class="mr-3">취소하기</v-btn>
                        <v-btn variant="outlined" @click="assignmentUpdateModal = false" class="mr-3">삭제하기</v-btn>
                        <v-btn variant="outlined" @click="submitForm">등록하기</v-btn>
                    </v-row>
                </v-card-actions>
                <v-divider class="mt-2 mb-10"></v-divider>

            </v-card>
        </v-dialog>


        <!-- 공지사항 모달-->
        <v-dialog v-model="noticeCreateModal" max-width="500px">
            <v-card>
                <v-card-title class="text-h4 pa-4 d-flex justify-center">
                    게시판 작성
                </v-card-title>
                <v-divider class="mb-4" style="height: 2px; background-color: black;"></v-divider>

                <v-card-text class="pa-4 pt-0">

                    <v-switch v-model="isNotice" :label="isNotice ? '공지사항으로 등록' : '게시글로 등록'" class="mb-2 ml-2"
                        hide-details></v-switch>
                    <!-- 제목  -->
                    <h4 class="mb-1 ml-2 mr-2"> 제목 </h4>
                    <v-text-field v-model="title" type="text" rounded="xs" variant="outlined"
                        class="mb-2 ml-2 mr-2"></v-text-field>
                    <h4 class="mb-1 ml-2 mr-2"> 내용 </h4>
                    <v-textarea v-model="content" label="내용" variant="outlined" rows="5"
                        class="mb-2 ml-2 mr-2"></v-textarea>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-row justify="center">
                        <v-btn variant="outlined" @click="noticeCreateModal = false" class="mr-3">취소하기</v-btn>
                        <v-btn variant="outlined" @click="submitForm">등록하기</v-btn>
                    </v-row>
                </v-card-actions>
                <v-divider class="mt-2 mb-10"></v-divider>

            </v-card>
        </v-dialog>
        <v-dialog v-model="noticeUpdateModal" max-width="500px">
            <v-card>
                <v-card-title class="text-h4 pa-4 d-flex justify-center">
                    게시판 수정
                </v-card-title>
                <v-divider class="mb-4" style="height: 2px; background-color: black;"></v-divider>

                <v-card-text class="pa-4 pt-0">

                    <v-switch v-model="isNotice" :label="isNotice ? '공지사항으로 등록' : '게시글로 등록'" class="mb-2 ml-2"
                        hide-details></v-switch>
                    <!-- 제목  -->
                    <h4 class="mb-1 ml-2 mr-2"> 제목 </h4>
                    <v-text-field v-model="title" type="text" rounded="xs" variant="outlined"
                        class="mb-2 ml-2 mr-2"></v-text-field>
                    <h4 class="mb-1 ml-2 mr-2"> 내용 </h4>
                    <v-textarea v-model="content" label="내용" variant="outlined" rows="5"
                        class="mb-2 ml-2 mr-2"></v-textarea>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-row justify="center">
                        <v-btn variant="outlined" @click="noticeUpdateModal = false" class="mr-3">취소하기</v-btn>
                        <v-btn variant="outlined" @click="noticeUpdateModal = false" class="mr-3">삭제하기</v-btn>
                        <v-btn variant="outlined" @click="submitForm">수정하기</v-btn>
                    </v-row>
                </v-card-actions>
                <v-divider class="mt-2 mb-10"></v-divider>

            </v-card>
        </v-dialog>
        <v-dialog v-model="noticeViewModal" max-width="500px">
            <v-card>
                <v-card-title class="text-h4 pa-4 d-flex justify-center">
                    게시판 조회
                </v-card-title>
                <v-divider class="mb-4" style="height: 2px; background-color: black;"></v-divider>

                <v-card-text class="pa-4 pt-0">

                    <!-- 제목  -->
                    <h4 class="mb-1 ml-2 mr-2"> 제목 </h4>
                    <v-text-field v-model="title" type="text" rounded="xs" disabled
                        class="mb-2 ml-2 mr-2"></v-text-field>
                    <h4 class="mb-1 ml-2 mr-2"> 내용 </h4>
                    <v-textarea v-model="content" label="내용" disabled rows="5" class="mb-2 ml-2 mr-2"></v-textarea>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-row justify="center">
                        <v-btn variant="outlined" @click="noticeViewModal = false" class="mr-3">확인</v-btn>
                    </v-row>
                </v-card-actions>
                <v-divider class="mt-2 mb-10"></v-divider>

            </v-card>
        </v-dialog>
    </v-container>
</template>
<script setup>
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';
const coordinate = {
    lat: 33.450701,
    lng: 126.570667
};
</script>
<script>
import axios from 'axios';
import { useRoute } from 'vue-router';
export default {
    data() {
        return {
            infoData: {
                category: "",
                chatRoomId: 0,
                contents: "",
                image: "",
                latitude: "",
                limitPeople: null,
                longtitude: "",
                memberName: "",
                startDate: "",
                title: "",
                lectureGroupTimes: []
            },

            notice: [],
            tab: 0,
            lectureSchedules: "",
            lectureGroupId: 0,
            assignmentCreateModal: false,
            assignmentUpdateModal: false,
            noticeCreateModal: false,
            noticeUpdateModal: false,
            noticeViewModal: false,
            isNotice: false,
            breadItems: [
                {
                    title: '강의',
                    disabled: false,
                    href: 'breadcrumbs_dashboard',
                },

                {
                    title: '수학 천재가 되는 길',
                    disabled: true,
                    href: 'breadcrumbs_link_2',
                },
            ],
            headers: [
                { text: '작성자', value: 'memberName' },
                { text: '분류', value: 'type' },
                { text: '제목', value: 'title' },
                { text: '작성 일자', value: 'postDate' },
                { text: '수정/삭제', value: 'actions', sortable: false }
            ],
            assignments: [],
            assignmentTitle:"",
            assignmentDate:null,
            assignmentContent:"",
            notices: [],
            tutees: [],
        };
    },
    async created() {
        const route = useRoute();
        this.lectureGroupId = route.params.lectureGroupId;
        const infoGetResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-group-home/${this.lectureGroupId}`)
        console.log(infoGetResponse);
        const data = infoGetResponse?.data?.result;
        this.infoData.category = this.changeCategory(data.category);
        this.infoData.chatRoomId = data.chatRoomId;
        this.infoData.contents = data.contents;
        this.infoData.image = data.image;
        this.infoData.latitude = data.latitude;
        this.infoData.limitPeople = data.limitPeople;
        this.infoData.longtitude = data.longtitude;
        this.infoData.memberName = data.memberName;
        this.infoData.startDate = data.startDate;
        this.infoData.title = data.title;
        this.infoData.lectureGroupTimes = data.lectureGroupTimes;
        this.lectureSchedules = this.infoData.lectureGroupTimes.reduce((acc, cur) => {
            return acc + `<div>• ${this.changeDay(cur.lectureDay)} ${cur.startTime} ~ ${cur.endTime}</div>`;
        }, '');

        const tuteesResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/single-lecture-tutee-list/${this.lectureGroupId}`)
        this.tutees = tuteesResponse?.data?.result?.content;
        const noticeResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/${this.lectureGroupId}/board/list`)
        this.notices = noticeResponse?.data?.result?.content;
        const assignmentResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/${this.lectureGroupId}/assignment`)
        this.assignments = assignmentResponse?.data?.result?.content;
    },
    methods: {
        cancelAssignment(){
            this.assignmentCreateModal=false;
            this.assignmentTitle="";
            this.assignmentDate=null;
            this.assignmentContent="";
        },
        async submitAssignmentCreate(){
            try{
                console.log(this.assignmentTitle)
                console.log(this.assignmentDate)
                console.log(this.assignmentContent)
                const endDate = this.assignmentDate.split('T')[0];
                const endTime = this.assignmentDate.split('T')[1];
                const body={
                    title : this.assignmentTitle,
                    contents : this.assignmentContent,
                    endDate,
                    endTime
                }
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/${this.lectureGroupId}/assignment/create`,body)
                console.log(response);
                this.cancelAssignment();
            }
            catch(e){
                console.log(e);
            }
        },
        async updateAssignmentOpen(id){
            const getResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/assignment/${id}`);
            this.assignmentUpdateModal = true;
            this.assignmentTitle = getResponse?.data?.result?.title;
            this.assignmentContent = getResponse?.data?.result?.contents;
            this.assignmentDate = getResponse?.data?.result?.endDate + 'T'+ getResponse?.data?.result?.endTime;

            console.log(getResponse)
        },
        changeDay(day) {
            switch (day) {
                case 'MONDAY':
                    return '월요일';
                case 'TUESDAY':
                    return '화요일';
                case 'WEDNESDAY':
                    return '수요일';
                case 'THURSDAY':
                    return '목요일';
                case 'FRIDAY':
                    return '금요일';
                case 'SATURDAY':
                    return '토요일';
                case 'SUNDAY':
                    return '일요일';
            }
        },
        changeCategory(category) {
            switch (category) {
                case 'CAREER':
                    return '취업';
                case 'ADMISSION':
                    return '입시';
                case 'HOBBY':
                    return '취미';
                case 'DEVELOPMENT':
                    return '자기계발';
            }
        },
        clickChatRoom() {
            console.log("채팅방 입장" + this.infoData.chatRoomId);
        },
        getitemcontrols() {
            return `item.actions`;
        },
        editItem(item) {
            this.noticeUpdateModal = true;
            console.log(item)
        },
        deleteItem(item) {
            console.log(item)
        },
        
    }

};
</script>
<style scoped>
#map {
    width: 100%;
    height: 150px;
}


.text-left {
    text-align: left;
}

.tutee-list-item {
    border-radius: 20px;
    background-color: #f5f5f5;
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    /* 이미지와 텍스트를 같은 선상에 배치 */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    /* 그림자 추가 */
}

.v-list-item-avatar {
    margin-right: 10px;
}

</style>