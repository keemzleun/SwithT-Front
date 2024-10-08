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
                    <v-img src="https://via.placeholder.com/150" alt="썸네일" width="90%" height="100%"></v-img>
                </v-col>

                <v-col cols="9" class="pa-4">
                    <div class="d-flex align-center">
                        <h2>수학 천재가 되는 길</h2>
                        <v-btn variant="tonal" class="ma-2">단체 채팅방</v-btn>
                    </div>
                    <v-row>
                        <v-col cols="6" class="text-left">
                            <div style="margin-bottom: 10px;"><strong>분야:</strong> 대학/입시</div>
                            <div style="margin-bottom: 10px;"><strong>시작 일자:</strong> 2024.09.19</div>
                            <div style="margin-bottom: 10px;"><strong>강의 일정:</strong> 월 오전 9시, 화 오전 9시</div>
                            <div style="margin-bottom: 10px;"><strong>튜터:</strong> 김민성</div>
                        </v-col>

                        <v-col cols="6" class="text-left">
                            <div><strong>장소:</strong> 서울특별시 동작구 신대방동 플레이데이터 4층</div>
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
                                                @click="assignmentUpdateModal = true"><strong>수정</strong></v-btn>
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
                        <v-data-table :headers="headers" :items="items" class="elevation-1"
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
                            <v-list-item v-for="tutee in tutees" :key="tutee.id"
                                class="tutee-list-item pa-1 mx-auto d-flex " rounded="lg"
                                style="align-items: center; justify-content: flex-start; padding: 12px; border-radius: 20px; margin-bottom: 10px; background-color: #f5f5f5; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); display: flex;">
                                <v-row>
                                    <v-col>
                                        <v-list-item-avatar>
                                            <!-- 아바타 이미지 -->
                                            <v-avatar size="50">
                                                <v-img :src="tutee.avatar" :alt="tutee.name" />
                                            </v-avatar>
                                        </v-list-item-avatar>
                                    </v-col>
                                    <v-col class="d-flex justify-center" style="align-items: center;">
                                        <v-list-item-content>
                                            <v-list-item-title class="tutee-name"
                                                style="font-weight: 600; text-align: center;">{{
                                                    tutee.name }}</v-list-item-title>
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
                    <v-text-field v-model="title" type="text" rounded="xs" variant="outlined"
                        class="mb-2 ml-2 mr-2"></v-text-field>
                    <h4 class="mb-1 ml-2 mr-2"> 제출 일자 </h4>
                    <div><Datepicker v-model="date" /></div>
                    <input class="mb-2 ml-2 mr-2" type="datetime-local" outlined>
                    <h4 class="mb-1 ml-2 mr-2"> 내용 </h4>
                    <v-textarea v-model="content" label="내용" variant="outlined" rows="5"
                        class="mb-2 ml-2 mr-2"></v-textarea>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-row justify="center">
                        <v-btn variant="outlined" @click="assignmentCreateModal = false" class="mr-3">취소하기</v-btn>
                        <v-btn variant="outlined" @click="submitForm">등록하기</v-btn>
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
                    <v-text-field v-model="title" type="text" rounded="xs" variant="outlined"
                        class="mb-2 ml-2 mr-2"></v-text-field>
                    <h4 class="mb-1 ml-2 mr-2"> 제출 일자 </h4>
                    <input class="mb-2 ml-2 mr-2" type="datetime-local" outlined>
                    <h4 class="mb-1 ml-2 mr-2"> 내용 </h4>
                    <v-textarea v-model="content" label="내용" variant="outlined" rows="5"
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

export default {
    data() {
        return {
            tab: 0,
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
            assignments: [
                {
                    id: 1,
                    title: '수학 천재가 되는 강의의 과제물 1',
                    startDate: '2024/09/11',
                    endDate: '2024/09/17',
                },
                {
                    id: 2,
                    title: '수학 천재가 되는 강의의 과제물 2',
                    startDate: '2024/09/11',
                    endDate: '2024/09/17',
                },
            ],
            headers: [
                { text: '작성자', value: 'author' },
                { text: '분류', value: 'category' },
                { text: '제목', value: 'title' },
                { text: '작성 일자', value: 'date' },
                { text: '수정/삭제', value: 'actions', sortable: false }
            ],
            items: [
                {
                    author: '튜터',
                    category: '공지사항',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '공지사항',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '게시글',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '공지사항',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '공지사항',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '게시글',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '공지사항',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '공지사항',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '게시글',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '공지사항',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '공지사항',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '게시글',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '공지사항',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '공지사항',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
                {
                    author: '튜터',
                    category: '게시글',
                    title: '여러분 워라밸이 매우 중요해요 항상 7시간은 잡시다',
                    date: '2024.09.14',
                },
            ],
            tutees: [
                {
                    id: 1,
                    name: '철수',
                    avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
                },
                {
                    id: 2,
                    name: '영수',
                    avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
                },
                {
                    id: 3,
                    name: '영희',
                    avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
                },
                {
                    id: 4,
                    name: '철수',
                    avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
                },
            ],
        };
    },

    methods: {
        getitemcontrols() {
            return `item.actions`;
        },
        editItem(item) {
            this.noticeUpdateModal = true;
            console.log(item)
        },
        deleteItem(item) {
            console.log(item)
        }
    }
    // mounted() {
    //     // Kakao Map API 호출
    //     const mapContainer = document.getElementById('map');
    //     const mapOption = {
    //         center: new kakao.maps.LatLng(37.484221, 126.927102), // 좌표
    //         level: 3, // 확대 수준
    //     };

    //     const map = new kakao.maps.Map(mapContainer, mapOption);

    //     // 마커 추가
    //     const marker = new kakao.maps.Marker({
    //         position: new kakao.maps.LatLng(37.484221, 126.927102),
    //     });
    //     marker.setMap(map);
    // },
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