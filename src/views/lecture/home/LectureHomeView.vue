<template>
    <v-container>
        <v-breadcrumbs :items="breadItems">
            <template v-slot:divider>
                <v-icon>mdi-menu-right</v-icon>
            </template>
        </v-breadcrumbs>

        <!-- Lecture Info Card 컴포넌트 -->
        <LectureInfoCard :infoData="infoData" :lectureSchedules="lectureSchedules" />

        <!-- Lecture Tabs -->
        <v-tabs v-model="tab" align-tabs="center" class="mt-5">
            <v-tab value="assignment">과제</v-tab>
            <v-tab value="notice">게시판</v-tab>
            <v-tab value="tuteeList" v-if="isLecture&&istutor">튜티 리스트</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
            <!-- 과제 탭 -->
            <v-tabs-window-item value="assignment">
                <v-card flat>
                    <v-card-text>
                        <v-row justify="end" class="mr-4">
                            <v-btn color="#90CDFF" @click="assignmentCreateModal = true"
                                v-if="this.istutor"><strong>생성</strong></v-btn>
                        </v-row>

                        <!-- 과제 목록 -->
                        <v-row>
                            <v-col cols="12" md="12" v-for="assignment in assignments" :key="assignment.id"
                                class="text-left">
                                <v-card class="pa-4 mb-3" outlined>
                                    <v-row>
                                        <v-col @click="viewAssignmentOpen(assignment.id)">
                                            <h3>{{ assignment.title }}</h3>
                                            <p>제출 시작 날짜: {{ assignment.startDate }}</p>
                                            <p>제출 마감 날짜: {{ assignment.endDate }}</p>
                                        </v-col>

                                        <v-col cols="auto">
                                            <v-btn color="#90CDFF" @click="updateAssignmentOpen(assignment.id)"
                                                v-if="this.istutor"><strong>수정</strong></v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-pagination v-model="assignmentPage" :length="assignmentPages"
                            @click="handleAssignmentPageChange()"></v-pagination>

                    </v-card-text>
                </v-card>
            </v-tabs-window-item>
            <!-- 게시글 리스트 -->
            <v-tabs-window-item value="notice">
                <v-row justify="end" class="mt-4 mb-4 mr-12">
                    <v-btn color="#90CDFF" @click="assignmentCreateModal = true"><strong>생성</strong></v-btn>
                </v-row>
                <v-row>
                    <v-col>

                        <v-row class="header">
                            <v-col cols="2">작성자</v-col>
                            <v-col cols="2">분류</v-col>
                            <v-col cols="4">제목</v-col>
                            <v-col cols="2">작성 일자</v-col>
                            <v-col cols="2">수정/삭제</v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>

                    <v-col v-if="notices.length">

                        <v-row v-for="(notice) in notices" :key="notice.id" class="item" @click="noticeView(notice)">
                            <v-col cols="2">{{ notice.memberName }}</v-col>
                            <v-col cols="2">{{ notice.type }}</v-col>
                            <v-col cols="4">{{ notice.title }}</v-col>
                            <v-col cols="2">{{ notice.postDate }}</v-col>
                            <v-col cols="2">
                                <!-- <template v-slot:[getitemcontrols()]="{ item }"> -->

                                <v-icon class="me-2" size="small" @click.stop="editItem(notice)" v-if="notice.author">
                                    mdi-pencil
                                </v-icon>
                                <v-icon size="small" @click.stop="deleteItem(notice)" v-if="notice.author">
                                    mdi-delete
                                </v-icon>
                                <!-- </template> -->
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-pagination v-model="noticePage" :length="noticePages"
                    @click="handleNoticePageChange()"></v-pagination>

                <!-- <v-card flat>
                    <v-card-text>
                        <v-row justify="end" class="mr-4">
                            <v-btn color="#90CDFF" @click="noticeCreateModal = true"><strong>생성</strong></v-btn>
                        </v-row>
                        <v-data-table :headers="headers" :items="notices" class="elevation-1"
                            @click:row="(item) => noticeView(item)">
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
                </v-card> -->

            </v-tabs-window-item>
            <!-- 튜티 리스트 탭 -->
            <v-tabs-window-item value="tuteeList" v-if="this.isLecture&&this.istutor">
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
                                                style="font-weight:400; text-align: center;">
                                                <h5>{{
                                                    tutee.tuteeName }}</h5>
                                            </v-list-item-title>
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
                        <v-btn variant="outlined" @click="renewAssignment()" class="mr-3">취소하기</v-btn>
                        <v-btn variant="outlined" @click="submitAssignmentCreate()">등록하기</v-btn>
                    </v-row>
                </v-card-actions>
                <v-divider class="mt-2 mb-10"></v-divider>

            </v-card>
        </v-dialog>

        <v-dialog v-model="assignmentViewModal" max-width="500px">
            <v-card>
                <v-card-title class="text-h4 pa-4 d-flex justify-center">
                    과제 조회
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
                        <v-btn variant="outlined" @click="assignmentViewModal = false" class="mr-3">확인</v-btn>
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
                        <v-btn variant="outlined" @click="deleteAssignments()" class="mr-3">삭제하기</v-btn>
                        <v-btn variant="outlined" @click="updateAssignment()">등록하기</v-btn>
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
                    <v-text-field v-model="noticeTitle" type="text" rounded="xs" variant="outlined"
                        class="mb-2 ml-2 mr-2"></v-text-field>
                    <h4 class="mb-1 ml-2 mr-2"> 내용 </h4>
                    <v-textarea v-model="noticeContent" label="내용" variant="outlined" rows="5"
                        class="mb-2 ml-2 mr-2"></v-textarea>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-row justify="center">
                        <v-btn variant="outlined" @click="noticeCreateModal = false" class="mr-3">취소하기</v-btn>
                        <v-btn variant="outlined" @click="noticeCreate()">등록하기</v-btn>
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
                    <v-text-field v-model="noticeTitle" type="text" rounded="xs" variant="outlined"
                        class="mb-2 ml-2 mr-2"></v-text-field>
                    <h4 class="mb-1 ml-2 mr-2"> 내용 </h4>
                    <v-textarea v-model="noticeContent" label="내용" variant="outlined" rows="5"
                        class="mb-2 ml-2 mr-2"></v-textarea>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-row justify="center">
                        <v-btn variant="outlined" @click="noticeUpdateModal = false" class="mr-3">취소하기</v-btn>
                        <v-btn variant="outlined" @click="submitEditNotice()">수정하기</v-btn>
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
                    <v-row class="mb-4 ml-5 mr-2 mt-2">{{ this.noticeTitle }}</v-row>

                    <h4 class="mb-1 ml-2 mr-2"> 내용 </h4>
                    <v-row class="mb-4 ml-5 mr-2 mt-2">{{ this.noticeContent }}</v-row>
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

<script>
import LectureInfoCard from './LectureInfoCard.vue';
// import LectureTabs from './LectureTabs.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
export default {
    components: {
        LectureInfoCard,
        // LectureTabs,
    },
    data() {
        return {
            istutor: false,
            page: 0,
            size: 5,
            noticePages: 0,
            noticePage: 1,
            assignmentPages: 0,
            assignmentPage: 1,
            coordinate: {
                lat: 33.450701,
                lng: 126.570667
            },
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
            noticeTitle: "",
            noticeContent: "",
            noticeId: null,

            tab: 0,
            lectureSchedules: "",
            lectureGroupId: 0,
            assignmentCreateModal: false,
            assignmentUpdateModal: false,
            assignmentViewModal: false,
            noticeCreateModal: false,
            noticeUpdateModal: false,
            noticeViewModal: false,
            isNotice: false,
            breadItems: [
                {
                    title: '',
                    disabled: false,
                    href: 'breadcrumbs_dashboard',
                },

                {
                    title: '',
                    disabled: true,
                    href: 'breadcrumbs_link_2',
                },
            ],

            assignments: [],
            assignmentTitle: "",
            assignmentDate: null,
            assignmentContent: "",
            assignmentId: null,
            notices: [],
            tutees: [],
            isLecture: false,
        };
    },
    async created() {
        const route = useRoute();
        this.lectureGroupId = route.params.lectureGroupId;
        const infoGetResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-group-home/${this.lectureGroupId}`)
        console.log(infoGetResponse);
        const data = infoGetResponse?.data?.result;
        this.infoData.category = this.changeCategory(data.category);
        this.isLecture = data.lectureType === "LECTURE" ? true : false;
        console.log("강의야?" + this.isLecture)
        this.breadItems[0].title = this.isLecture ? "강의" : "과외"
        this.infoData.chatRoomId = data.chatRoomId;
        this.infoData.contents = data.contents;
        this.infoData.image = data.image;
        this.infoData.latitude = data.latitude;
        this.infoData.limitPeople = data.limitPeople;
        this.infoData.longtitude = data.longtitude;
        this.infoData.memberName = data.memberName;
        this.infoData.startDate = data.startDate;
        this.infoData.title = data.title;
        this.breadItems[1].title = this.infoData.title
        this.infoData.lectureGroupTimes = data.lectureGroupTimes;
        this.lectureSchedules = this.infoData.lectureGroupTimes.reduce((acc, cur) => {
            return acc + `<div>• ${this.changeDay(cur.lectureDay)} ${cur.startTime} ~ ${cur.endTime}</div>`;
        }, '');

        const tuteesResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/single-lecture-tutee-list/${this.lectureGroupId}`)
        this.tutees = tuteesResponse?.data?.result?.content;
        let params = {
            size: this.size,
            page: this.page,
        };
        const noticeResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/${this.lectureGroupId}/board/list`, { params })
        this.notices = noticeResponse?.data?.result?.content;
        this.noticePages = noticeResponse?.data?.result?.totalPages;
        console.log(this.notices)
        const assignmentResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/${this.lectureGroupId}/assignment`, { params })
        this.assignments = assignmentResponse?.data?.result?.content;
        this.assignmentPages = assignmentResponse?.data?.result?.totalPages;

        console.log(this.assignments);
        const memberInfo = localStorage.getItem('memberInfo');
        if (memberInfo && JSON.parse(memberInfo).name === this.infoData.memberName) {
            this.istutor = true;
        }
    },
    methods: {
        async handleNoticePageChange() {
            this.page = this.noticePage - 1;
            let params = {
                size: this.size,
                page: this.page,
            };
            const noticeResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/${this.lectureGroupId}/board/list`, { params })
            this.notices = noticeResponse?.data?.result?.content;
            this.noticePages = noticeResponse?.data?.result?.totalPages;
        },
        async handleAssignmentPageChange() {
            this.page = this.assignmentPage - 1;
            let params = {
                size: this.size,
                page: this.page,
            };
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/${this.lectureGroupId}/assignment`, { params })
            this.assignments = response?.data?.result?.content;
            this.assignmentPages = response?.data?.result?.totalPages;
        },
        async noticeView(item) {
            this.noticeViewModal = true;
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/board/${item.id}`);
            console.log(response)
            this.noticeTitle = response?.data?.result?.title;
            this.noticeContent = response?.data?.result?.contents;
        },
        renewNotice() {
            this.noticeTitle = "";
            this.noticeContent = "";
            this.isNotice = false;
        },
        async noticeCreate() {
            let type = null;
            if (this.isNotice) type = "NOTICE";
            else type = "POST"
            const body = {
                title: this.noticeTitle,
                contents: this.noticeContent,
                type
            }
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/${this.lectureGroupId}/board/create`, body)

            console.log(response)

        },
        // 과제 CRUD 메서드
        renewAssignment() {
            this.assignmentCreateModal = false;
            this.assignmentUpdateModal = false;
            this.assignmentTitle = "";
            this.assignmentDate = null;
            this.assignmentContent = "";
            this.assignmentId = null;
        },
        async submitAssignmentCreate() {
            try {
                console.log(this.assignmentTitle)
                console.log(this.assignmentDate)
                console.log(this.assignmentContent)
                const endDate = this.assignmentDate.split('T')[0];
                const endTime = this.assignmentDate.split('T')[1];
                const body = {
                    title: this.assignmentTitle,
                    contents: this.assignmentContent,
                    endDate,
                    endTime
                }
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/${this.lectureGroupId}/assignment/create`, body)
                console.log(response);
                this.renewAssignment();
            }
            catch (e) {
                console.log(e);
            }
        },
        async viewAssignmentOpen(id) {
            const getResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/assignment/${id}`);
            this.assignmentViewModal = true;
            this.assignmentTitle = getResponse?.data?.result?.title;
            this.assignmentContent = getResponse?.data?.result?.contents;
            this.assignmentDate = getResponse?.data?.result?.endDate + 'T' + getResponse?.data?.result?.endTime;
            this.assignmentId = getResponse?.data?.result?.id;
            console.log(getResponse)
        },
        async updateAssignmentOpen(id) {
            const getResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/assignment/${id}`);
            this.assignmentUpdateModal = true;
            this.assignmentTitle = getResponse?.data?.result?.title;
            this.assignmentContent = getResponse?.data?.result?.contents;
            this.assignmentDate = getResponse?.data?.result?.endDate + 'T' + getResponse?.data?.result?.endTime;
            this.assignmentId = getResponse?.data?.result?.id;
            console.log(getResponse)
        },
        async updateAssignment() {
            try {
                // 날짜 및 시간 분리
                const [endDate, endTime] = this.assignmentDate.split('T');

                const body = {
                    title: this.assignmentTitle,
                    contents: this.assignmentContent,
                    endDate,
                    endTime
                };

                // axios 요청
                const response = await axios.put(
                    `${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/assignment/${this.assignmentId}/update`,
                    body
                );
                this.renewAssignment();
                // 응답이 성공적이면 새로고침
                if (response && response.status === 200) {
                    console.log('Update successful:', response);
                    this.assignmentUpdateModal = false;
                    await this.fetchAssignments();
                } else {
                    console.error('Update failed:', response);
                }
            } catch (error) {
                console.error('Error updating assignment:', error);
            }
        },
        // todo : update reload 잘 해보기
        async fetchAssignments() {
            const assignmentResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/${this.lectureGroupId}/assignment`)
            this.assignments = assignmentResponse?.data?.result?.content;
        },
        async deleteAssignments() {
            const response = await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/assignment/${this.assignmentId}/delete`);
            console.log(response);
            window.location.reload()
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
        async editItem(item) {
            this.renewNotice();
            const getResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/board/${item.id}`);
            console.log(getResponse)
            this.noticeTitle = getResponse?.data?.result?.title;
            this.noticeContent = getResponse?.data?.result?.contents;
            this.noticeUpdateModal = true;
            this.noticeId = item.id;
        },
        async submitEditNotice() {
            let type = null;
            if (this.isNotice) type = "NOTICE";
            else type = "POST"
            const body = {
                title: this.noticeTitle,
                contents: this.noticeContent,
                type
            }
            const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/board/${this.noticeId}`, body)
            console.log(response)
            this.noticeUpdateModal = false;

        },
        async deleteItem(item) {
            const response = await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/board/${item.id}/delete`)
            console.log(response)
        },

    }

};
</script>
<style scoped>
#map {
    width: 100%;
    height: 150px;
}

.header {
    font-weight: bold;
    border-bottom: 2px solid #ccc;
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