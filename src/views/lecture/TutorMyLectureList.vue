<template>
    <v-container width="60%">
        <v-row justify="center">
            <v-col cols="auto">
                <v-tabs v-model="tab" color="black" slider-color="#FFF490">
                    <v-tab value="LESSON">나의 과외</v-tab>
                    <v-tab value="LECTURE">나의 강의</v-tab>
                </v-tabs>
            </v-col>
        </v-row>

        <br>
        <v-row justify="left">
            <v-col cols="1">
                <v-btn class="admit-color" @click="changeStatus('ADMIT')">진행중</v-btn>
            </v-col>
            <v-col cols="1">
                <v-btn color="#CFCFCF" @click="changeStatus('TERMINATE')">종료</v-btn>
            </v-col>


        </v-row>
        <v-row justify="center">
            <v-col>
                <v-btn width="100%" color="#CFCFCF">과외/강의 개설하기</v-btn>
            </v-col>
        </v-row>


        <v-card-text>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="LESSON">
                    <v-row v-for="lesson in lessons" :key="lesson.id">
                        <v-col>
                            <v-card class="custom-border">
                                <v-card-text class="d-flex justify-space-between align-center">
                                    <div>
                                        {{ lesson.title }}
                                        <span>
                                            <v-chip v-if="status === 'ADMIT'" color="primary" class="mr-2">진행중</v-chip>
                                            <v-chip v-if="status === 'TERMINATE'" color="#CFCFCF" class="mr-2">종료</v-chip>
                                        </span>
                                    </div>
                                    <v-btn v-if="status === 'ADMIT'" class="admit-color"
                                        @click="clickLectureDetail(lesson.id)" small>강의 상세</v-btn>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>
                <v-tabs-window-item value="LECTURE">
                    <v-row v-for="lecture in lectures" :key="lecture.id">
                        <v-col>
                            <v-card class="custom-border">
                                <v-card-text class="d-flex justify-space-between align-center">
                                    <div>
                                        {{ lecture.title }}
                                        <span>
                                            <v-chip v-if="status === 'ADMIT'" color="primary" class="mr-2">진행중</v-chip>
                                            <v-chip v-if="status === 'TERMINATE'" color="#CFCFCF" class="mr-2">종료</v-chip>
                                        </span>
                                    </div>
                                    <v-btn v-if="status === 'ADMIT'" class="admit-color"
                                        @click="clickLectureDetail(lecture.id)" small>강의 상세</v-btn>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
        <v-pagination v-model="frontendPage" :length="totalPages" @click="handlePageChange"></v-pagination>

    </v-container>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            tab: 'LESSON',
            lessons: [],
            lectures: [],
            status: 'ADMIT',
            page: 0,
            size: 5,
            totalPages: 0,
            frontendPage: 1

        };

    },
    async created() {
        this.showLessonList();
    },
    watch: {
        tab(newTab) {
            if (newTab === 'LESSON') {
                this.tab = 'LESSON';
            } else if (newTab === 'LECTURE') {
                this.tab = 'LECTURE';
            }
            this.status = 'ADMIT';
            this.page = 0;
            this.frontendPage = 1;

            this.showLessonList();

        }
    },
    methods: {

        async showLessonList() {

            try {
                let params = {
                    searchTitle: '',
                    lectureType: this.tab,
                    category: '',
                    status: this.status,
                    size: this.size,
                    page: this.page,

                };
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/my-lecture-list`, { params });
                this.totalPages = response.data.result.totalPages;
                if (this.tab === 'LESSON') {
                    this.lessons = response.data.result.content;
                }
                else if (this.tab === 'LECTURE') {
                    this.lectures = response.data.result.content;
                }
            } catch (e) {
                console.log(e.response.data.error_message);
            }

        },
        changeStatus(changedStatus) {
            this.status = changedStatus;
            this.page = 0;
            this.frontendPage = 1;
            this.showLessonList();
        },
        handlePageChange() {
            this.page = this.frontendPage - 1;
            this.showLessonList();
        },

        clickLectureDetail(id) {
            this.$router.push(`/tutor-lecture-class-list?lectureId=${id}&lectureType=${this.tab}&lectureStatus=${this.status}`);
        }

    }
}
</script>

<style scoped>
.custom-border {
    border: 2px solid #cccccc;
    /* Custom border */
    border-radius: 8px;
    /* Rounded corners */
    box-shadow: none !important;
    /* Remove any shadow */
}

.v-tab {
    margin-right: 50px;
    margin-left: 50px;
    font-size: 18px;
    font-weight: 900;
}


.admit-color {
    background-color: #90CDFF;
}
</style>