<template>
    <LectureDetailInfoComponent 
        :lectureId=this.lectureId
        />
    <v-container width="50%"  style="margin-top: 60px;">
        
        
        <!-- <v-row justify="center">
            <v-col cols="auto">
                <v-tabs v-model="tab" color="black" slider-color="#6C97FD">
                    <v-tab value="NOT_AVAILABLE_CLASS_LIST"
                        v-if="lectureType === 'LESSON' && lectureStatus === 'ADMIT'">진행중인 수업</v-tab>
                    <v-tab value="AVAILABLE_CLASS_LIST"
                        v-if="lectureType === 'LESSON' && lectureStatus === 'ADMIT'">모집중인 수업</v-tab>

                    <v-tab value="ALL_CLASS_LIST" v-if="lectureType === 'LECTURE'">전체 수업</v-tab>

                </v-tabs>
            </v-col>
        </v-row> -->

        <v-row>
            <v-col>
                <div class="lecture-groups">
                    <div>
                        <div v-for="group in lectureGroupList" :key="group.lectureGroupId" class="lecture-group">
                              <span v-for="time in group.groupTimes" :key="time.groupTimeId">
                                <p><strong>요일:</strong> {{ time.lectureDay }}</p>
                                <p><strong>시작 시간:</strong> {{ time.startTime }}</p>
                                <p><strong>종료 시간:</strong> {{ time.endTime }}</p>
                            </span>
                          <p><strong>강의 그룹 ID:</strong> {{ group.lectureGroupId }}</p>
                          <p><strong>주소:</strong> {{ group.address || '주소 없음' }}</p>
                          <p><strong>상세 주소:</strong> {{ group.detailAddress }}</p>
                          <p><strong>가격:</strong> {{ group.price }} 원</p>
                          <p><strong>남은 자리:</strong> {{ group.remaining }}</p>
                          <p><strong>시작 날짜:</strong> {{ group.startDate || '미정' }}</p>
                          <p><strong>종료 날짜:</strong> {{ group.endDate || '미정' }}</p>
                          <p><strong>사용 가능 여부:</strong> {{ group.isAvailable === 'Y' ? '사용 가능' : '사용 불가' }}</p>
                          
                         
                        </div>
                      </div>

                </div>
            </v-col>
            <v-col>

            </v-col>
        </v-row>

        <v-card-text>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="NOT_AVAILABLE_CLASS_LIST">
                    <v-row v-for="lesson in notAvailableClassList" :key="lesson.id">
                        <v-col>
                            <v-card class="custom-border">
                                <v-card-text class="d-flex justify-space-between  align-center">
                                    <v-col cols="10" class="text-left card-text-class">
                                        <div class="lecture-group-title">
                                            {{lesson.title}}
                                        </div>
                                        <br>
                                        <div class="lecture-group-info">
                                            <v-row >
                                                <v-col cols="1" class="lecture-group-info-col">튜티</v-col>
                                                <v-col class="lecture-group-info-col">{{lesson.memberName}}</v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="1" class="lecture-group-info-col">기간</v-col>
                                                <v-col class="lecture-group-info-col">{{lesson.startDate}} ~ {{lesson.endDate}}</v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="auto" class="lecture-group-info-col">강의료</v-col>
                                                <v-col class="lecture-group-info-col">{{formatPrice(lesson.price)}}</v-col>
                                            </v-row>
                                              
                                        </div>
                                    </v-col>
                                    <v-col cols="1" >
                                        <v-btn color="#6C97FD" style="font-size:18px;"  @click="clickLectureHome(lesson.lectureGroupId)" >강의 홈</v-btn>
                                    </v-col>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>
                <v-tabs-window-item value="AVAILABLE_CLASS_LIST">
                    <v-row v-for="lesson in availableClassList" :key="lesson.id">
                        <v-col>
                            <v-card class="custom-border" style="height: 104px;">
                                <v-card-text class="d-flex justify-space-between  align-center">
                                    <v-col cols="10" class="text-left card-text-class">
                                        <div class="lecture-group-title">
                                            {{lesson.title}}
                                        </div>
                                        <br>
                                        <div class="lecture-group-info">
                                            <v-row>
                                                <v-col cols="auto" class="lecture-group-info-col">강의료</v-col>
                                                <v-col class="lecture-group-info-col">{{formatPrice(lesson.price)}}</v-col>
                                            </v-row>
                                        </div>
                                    </v-col>
                                    <v-col cols="1" >
                                        <v-btn color="#82D691" style="font-size:18px;" @click="clickLessonApplyList(lesson.lectureGroupId, lesson.title)"
                                        class="white-text" small>모집중</v-btn>

                                    </v-col>
                                </v-card-text>
                                
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>

                <v-tabs-window-item value="ALL_CLASS_LIST">
                    <v-row v-for="lesson in allClassList" :key="lesson.id">
                        <v-col>
                            <v-card class="custom-border">
                                <v-card-text class="d-flex justify-space-between  align-center">
                                    <v-col cols="10" class="text-left card-text-class">
                                        <div class="lecture-group-title">
                                            {{lesson.title}}
                                        </div>
                                        <br>
                                        
                                        <div class="lecture-group-info">
                                            <v-row >
                                                <v-col cols="2" class="lecture-group-info-col">모집인원</v-col>
                                                <v-col class="lecture-group-info-col">{{lesson.limitPeople}}</v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="2" class="lecture-group-info-col">기간</v-col>
                                                <v-col class="lecture-group-info-col">{{lesson.startDate}} ~ {{lesson.endDate}}</v-col>
                                            </v-row>
                                            
                                            
                                            <v-row>
                                                <v-col cols="2" class="lecture-group-info-col">강의료</v-col>
                                                <v-col class="lecture-group-info-col">{{formatPrice(lesson.price)}}</v-col>
                                            </v-row>
                                              
                                        </div>
                                    </v-col>
                                    <v-col cols="1" >
                                        <v-btn color="#6C97FD" style="font-size:18px;"  @click="clickLectureHome(lesson.lectureGroupId)" >강의 홈</v-btn>
                                    </v-col>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
    </v-container>
</template>

<script>
import axios from 'axios';
import LectureDetailInfoComponent from '@/components/LectureDetailInfoComponent.vue';
export default {
    components:{
        LectureDetailInfoComponent,
    },
    data() {
        return {
            lectureGroupList: []
        }
    },
    created() {
            this.lectureId = this.$route.query.lectureId;
            this.lectureType = this.$route.query.lectureType;
            this.lectureStatus = this.$route.query.lectureStatus;
    
            console.log(this.lectureId, this.lectureType, this.lectureStatus);

    },
    mounted() {
        this.fetchLectureGroups();
    },
    methods: {
        async fetchLectureGroups(){
            try {
                console.log(this.lectureId);
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-group-info/${this.lectureId}`);
                console.log(response)
                if (response.data.status_code === 200 ) {
                    this.lectureGroupList = response.data.result;
                } else {
                    console.error("강의 그룹 정보를 불러오는 중 오류 발생:", response.data.message);
                }
            } catch (error) {
                console.error("강의 그룹 정보를 불러오는 중 오류 발생:", error);
            }
        },
        
    }
}

//     data() {
//         return {
//             tab: 'ALL_CLASS_LIST',
//             allClassList: [],  //전체 수업리스트
//             availableClassList: [], //모집중인 수업리스트
//             notAvailableClassList: [],  //진행중인 수업리스트
//             isAvailable: '',
//             isLastPage: false,
//             isLoading: false,
//             page: 0,
//             size: 5,

//         };

//     },
//     watch: {
//         tab(newTab) {

//             this.page = 0;
//             this.isLastPage = false;
//             this.isLoading = false;
//             if (newTab === 'ALL_CLASS_LIST') {
//                 this.tab = 'ALL_CLASS_LIST';
//                 this.isAvailable = '';
//                 this.allClassList = [];
//             } else if (newTab === 'NOT_AVAILABLE_CLASS_LIST') {
//                 this.tab = 'NOT_AVAILABLE_CLASS_LIST';
//                 this.isAvailable = 'N';
//                 this.notAvailableClassList = [];

//             } else if (newTab === 'AVAILABLE_CLASS_LIST') {
//                 this.tab = 'AVAILABLE_CLASS_LIST';
//                 this.isAvailable = 'Y';
//                 this.availableClassList = [];
//             }

//             this.showLessonClassList();
            
//         }
//     },

    
//     beforeUnmount(){
//         window.removeEventListener('scroll', this.scrollPagination);
//     },
//     mounted(){
//         window.addEventListener('scroll', this.scrollPagination);
//     },
//     created() {
//         this.lectureId = this.$route.query.lectureId;
//         this.lectureType = this.$route.query.lectureType;
//         this.lectureStatus = this.$route.query.lectureStatus;

//         console.log(this.lectureId, this.lectureType, this.lectureStatus);

//         if (this.lectureType === 'LESSON' && this.lectureStatus === 'ADMIT') {
//             this.tab = 'NOT_AVAILABLE_CLASS_LIST';
//             this.isAvailable = 'N';
//         }
//         if(this.lectureType === 'LECTURE' && this.lectureStatus === 'ADMIT'){
//             this.tab = 'ALL_CLASS_LIST';
//             this.isAvailable = '';
//             this.showLessonClassList();

//         }

        
    

        
//     },

//     methods: {
//         async fetchLectureGroups(){
//             try {
//                 const response = await axios.get(`http://localhost:8081/lecture-group-info/${this.lectureId}`);
//                 if (response.data.status === 'OK') {
//                     this.lectureGroups = response.data.data;
//                     console.log(this.lectureGroups)
//                 } else {
//                     console.error("강의 그룹 정보를 불러오는 중 오류 발생:", response.data.message);
//                 }
//             } catch (error) {
//                 console.error("강의 그룹 정보를 불러오는 중 오류 발생:", error);
//             }
//         },
//         async showLessonClassList() {
//             console.log(this.page);
//             try {
//                 if(this.isLoading || this.isLastPage){
//                     return;
//                 }
//                 this.isLoading = true;
//                 let params = {
//                     size: this.size,
//                     page: this.page,
//                     isAvailable: this.isAvailable,
//                 };
//                 const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service//lecture-group-info/${this.lectureId}`, {params});

//                 const additionalData = response.data.result.content;
                
//                 if(additionalData.length == 0){
//                     this.isLastPage = true;
//                     return;
//                 }
//                 if (this.tab === 'NOT_AVAILABLE_CLASS_LIST') {
//                     this.notAvailableClassList = [...this.notAvailableClassList, ...additionalData];
//                 }
//                 if (this.tab === 'AVAILABLE_CLASS_LIST') {
//                     console.log("모집 증");
//                     console.log(this.page);
//                     this.availableClassList = [...this.availableClassList, ...additionalData];
//                 }
//                 if (this.tab === 'ALL_CLASS_LIST') {
//                     this.allClassList = [...this.allClassList, ...additionalData];
//                 }
//                 this.page++;
//                 this.isLoading = false;

//             } catch (e) {
//                 console.log(e.response.data.error_message);
//             }
//         },

//         clickLessonApplyList(lectureGroupId, title) {
//             console.log(lectureGroupId, "lectureGroup Id");
//             this.$router.push(`/lesson-apply-list?lectureGroupId=${lectureGroupId}&title=${title}&lectureId=${this.lectureId}`);

//         },

//         scrollPagination(){
//             const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
//             if(isBottom && !this.isLastPage && !this.isLoading){
//                 this.showLessonClassList();
//             }
//         },

//        clickLectureHome(lectureGroupId){
//         this.$router.push(`/lecture-home/${lectureGroupId}`);
//        },

//        formatPrice(value) {
//             if (!value)  return '재능기부';
            
//             return new Intl.NumberFormat('ko-KR').format(value)+'원';
//         }


//     }
// }
</script>

<style scoped>

</style>