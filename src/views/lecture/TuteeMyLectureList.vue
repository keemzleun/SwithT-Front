<template>
    <v-container width="60%" style="margin-top: 60px;">
        <br>
        <v-row justify="center">
            <h1 style="font-weight:bolder;">내 강의</h1>
        </v-row>
        <hr />


        <v-row justify="left">
            <v-col cols="1">
                <v-btn color="#6C97FD" @click="changeStatus('ADMIT')">진행중</v-btn>
            </v-col>
            <v-col cols="1">
                <v-btn color="#CFCFCF" @click="changeStatus('TERMINATE')">종료</v-btn>
            </v-col>
        </v-row>

        <v-card-text>
            <v-row class="lessons-container">
                <v-col v-for="lecture in lectures" :key="lecture.id" cols="4" class="mb-4">
                    <div @click="clickLectureImage(lecture.lectureGroupId)" class="lesson-card"
                        :class="{ 'terminated-lecture': lecture.status === 'TERMINATE' }">
                        <img :src="lecture.lectureImage" alt="강의 썸네일" class="lecture-image" />
                        <br>
                        <v-chip v-if="lecture.lectureType === 'LESSON'" color="primary" class="mr-2">과외</v-chip>
                        <v-chip v-else color="#82D691" class="mr-2">강의</v-chip>
                        <span class="lecture-title">
                            {{ lecture.title }}
                        </span>

                        <br>
                        {{ lecture.startDate }} ~ {{ lecture.endDate }}


                        <v-btn @click="showModal"
                            style="background-color: #6c97fd; width: 100px; height: 50px; border: 1px solid #003366;"
                            color="white" class="review-button">
                            <v-icon left>mdi-pencil</v-icon>
                            <b>리뷰 작성</b>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
        <v-pagination v-model="frontendPage" :length="totalPages" @click="handlePageChange"></v-pagination>

    </v-container>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            lectures: [],
            status: 'ADMIT',
            page: 0,
            size: 6,
            totalPages: 0,
            frontendPage: 1
        };

    },
    created() {
        this.showLectureList();
    },

    methods: {

        async showLectureList() {
            try {
                let params = {
                    status: this.status,
                    size: this.size,
                    page: this.page,
                };
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/tutee-my-lecture-list`, { params });
                this.totalPages = response.data.result.totalPages;
                this.lectures = response.data.result.content;
                console.log(response.data.result.content);
            } catch (e) {
                console.log(e.response.data.error_message);
            }

        },
        changeStatus(changedStatus) {
            this.status = changedStatus;
            this.page = 0;
            this.frontendPage = 1;
            this.showLectureList();
        },
        handlePageChange() {
            this.page = this.frontendPage - 1;
            this.showLectureList();
        },

        clickLectureImage(lectureGroupId) {
            if (this.status === 'ADMIT') {
                this.$router.push(`/lecture-home/${lectureGroupId}`);
            }
        },


    }
}
</script>

<style scoped>


.custom-border {
    border: 2px solid #cccccc;
    border-radius: 8px;
    box-shadow: none !important;
}

.lecture-title {
    font-size: 15px;
    font-weight: bold;
}



.admit-color {
    background-color: #90CDFF;
}

.lesson-card {
    position: relative;
    overflow: hidden;
}

.review-button {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    opacity: 0.9;
    transition: opacity 0.3s ease;
}

/* Show the review button on hover only if the lecture is terminated */
.terminated-lecture:hover .review-button {
    display: inline-block;
    opacity: 1;
    

}


  .thumbnail-container {
    position: relative;
    display: inline-block;
  }

  .lecture-image {
    width: 250px;
    height: 200px;
    object-fit: cover;
    margin-bottom: 10px;
}
</style>