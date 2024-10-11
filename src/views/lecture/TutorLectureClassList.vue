<template>
    <v-container width="60%">
        <h1>썸네일 자리</h1>
        <v-row justify="center">
            <v-col cols="auto">
                <v-tabs v-model="tab" color="black" slider-color="#FFF490">
                    <v-tab value="NOT_AVAILABLE_CLASS_LIST"
                        v-if="lectureType === 'LESSON' && lectureStatus === 'ADMIT'">진행중인 수업</v-tab>
                    <v-tab value="AVAILABLE_CLASS_LIST"
                        v-if="lectureType === 'LESSON' && lectureStatus === 'ADMIT'">모집중인 수업</v-tab>
                    <v-tab value="ALL_CLASS_LIST" v-if="lectureType === 'LECTURE'">전체 수업</v-tab>

                </v-tabs>
            </v-col>
        </v-row>

        <v-card-text>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="NOT_AVAILABLE_CLASS_LIST">
                    <v-row v-for="lesson in notAvailableClassList" :key="lesson.id">
                        <v-col>
                            <v-card class="custom-border">
                                <v-card-text class="d-flex justify-space-between align-center">
                                    <div>
                                        {{ lesson.title }}
                                    </div>
                                    <v-btn class="admit-color" small>강의홈</v-btn>
                                </v-card-text>
                                <v-card-text class="d-flex justify-space-between align-center">
                                    <div> {{ lesson.memberName }} </div>

                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>
                <v-tabs-window-item value="AVAILABLE_CLASS_LIST">
                    <v-row v-for="lesson in availableClassList" :key="lesson.id">
                        <v-col>
                            <v-card class="custom-border">
                                <v-card-text class="d-flex justify-space-between align-center">
                                    <div>
                                        {{ lesson.title }}
                                    </div>
                                    <v-btn color="#FFF490" @click="clickLessonApplyList(lesson.lectureGroupId, lesson.title)"
                                        small>모집중</v-btn>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>

                <v-tabs-window-item value="ALL_CLASS_LIST">
                    <v-row v-for="lesson in allClassList" :key="lesson.id">
                        <v-col>
                            <v-card class="custom-border">
                                <v-card-text class="d-flex justify-space-between align-center">
                                    <div>
                                        {{ lesson.title }}
                                    </div>
                                    <v-btn color="#FFF490" small>강의홈</v-btn>
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
export default {

    data() {
        return {
            tab: 'ALL_CLASS_LIST',
            allClassList: [],  //전체 수업리스트
            availableClassList: [], //모집중인 수업리스트
            notAvailableClassList: [],  //진행중인 수업리스트
            isAvailable: '',

        };

    },
    watch: {
        tab(newTab) {
            if (newTab === 'ALL_CLASS_LIST') {
                this.tab = 'ALL_CLASS_LIST';
                this.isAvailable = '';
            } else if (newTab === 'NOT_AVAILABLE_CLASS_LIST') {
                this.tab = 'NOT_AVAILABLE_CLASS_LIST';
                this.isAvailable = 'N';

            } else if (newTab === 'AVAILABLE_CLASS_LIST') {
                this.tab = 'AVAILABLE_CLASS_LIST';
                this.isAvailable = 'Y';
            }

            this.showLessonClassList();


        }
    },
    created() {
        this.lectureId = this.$route.query.lectureId;
        this.lectureType = this.$route.query.lectureType;
        this.lectureStatus = this.$route.query.lectureStatus;

        console.log(this.lectureId, this.lectureType, this.lectureStatus);

        if (this.lectureType === 'LESSON' && this.lectureStatus === 'ADMIT') {
            this.tab = 'NOT_AVAILABLE_CLASS_LIST';
            this.isAvailable = 'N';
        }

        this.showLessonClassList();



    },

    methods: {
        async showLessonClassList() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-class-list/${this.lectureId}?isAvailable=${this.isAvailable}`);
                if (this.tab === 'NOT_AVAILABLE_CLASS_LIST') {
                    this.notAvailableClassList = response.data.result.content;
                }
                if (this.tab === 'AVAILABLE_CLASS_LIST') {
                    this.availableClassList = response.data.result.content;
                }
                if (this.tab === 'ALL_CLASS_LIST') {
                    this.allClassList = response.data.result.content;
                }

            } catch (e) {
                console.log(e.response.data.error_message);
            }
        },

        clickLessonApplyList(lectureGroupId, title) {
            console.log(lectureGroupId, "lectureGroup Id");
            this.$router.push(`/lesson-apply-list?lectureGroupId=${lectureGroupId}&title=${title}`);

        }


    }
}
</script>

<style scoped>
.custom-border {
    border: 2px solid #cccccc;
    border-radius: 8px;
    box-shadow: none !important;
}

.v-tab {
    font-size: 18px;
    font-weight: 900;
}

.admit-color {
    background-color: #90CDFF;
}
</style>