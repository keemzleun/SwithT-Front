<template>
    <v-container>
        <section class="banner">
            <div class="temporary-banner">

            </div>
        </section>
        <section class="menu">
            <div class="menu-list">
                <span class="menu-icon">🧘‍♀️</span>
                <span class="menu-title">자기계발</span>
            </div>
            <div class="menu-list">
                <!-- <img src="@/assets/admission.png" alt="입시" class="menu-icon"> -->
                <span class="menu-icon">🧑‍🏫</span>
                <span class="menu-title">입시</span>
            </div>
            <div class="menu-list">
                <span class="menu-icon">🏄</span>
                <span class="menu-title">취미</span>
            </div>
            <div class="menu-list">
                <span class="menu-icon">👨‍💼</span>
                <span class="menu-title">취업/직무</span>
            </div>
        </section>
            
        <hr/>

        <section class="recommendation">
            <div class="title">✨재능 기부</div>
            <div class="lecture-list">
                <div
                    class="component"
                    v-for="lecture in latestLectures"
                    :key="lecture.id"
                    @click="goToLecture(lecture.id)"
                >
                    <img :src="getlectureImage(lecture)" alt="강의 썸네일" class="lectureImage" />
                    <div class="lectureTitle">
                        <span v-if="lecture.lectureType === 'LECTURE'" class="tag lecture-tag">강의</span>
                        <span v-if="lecture.lectureType === 'LESSON'" class="tag lesson-tag">과외</span>
                        {{ lecture.title }}</div>
                </div>  
            </div>   
        </section>
        
    </v-container>
</template>
<script>
import axios from "axios";

export default {
    data() {
        return {
            latestLectures: []
        };
    },
    methods: {
        async fetchLatestLectures() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lectures/latest`);
                this.latestLectures = response.data.result;
                console.log(response.data.result);
            } catch (error) {
                console.error("Failed to fetch latest lectures:", error);
            }
        },
        goToLecture(lectureId) {
            this.$router.push({ name: 'LectureDetail', params: { id: lectureId } });
        },
        getlectureImage(lecture) {
            return lecture.image;
        }
    },
    created() {
        this.fetchLatestLectures(); // 컴포넌트가 생성될 때 최신 강의 목록을 가져옴
    }
};
</script>
<style>
.banner {
    background-color: rgb(220, 219, 219);
    
}
.temporary-banner{
    height: 250px;
    width: auto;
}
.menu-list {
    width: 60px;
    height: 100px;
    display: inline-block;
}
.menu-list .menu-icon{
    font-size: 60px;
    width: 100px;
    height: 100px;
}

.recommendation {
    margin-top: 20px;
}

.recommendation .title {
    font-size: 32px;
    font-weight: 700;
    text-align: left;
    margin: 0 0 15px 10px;
}

.lecture-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.component {
    cursor: pointer;
    margin: 10px;
    width: 180px;
    text-align: center;
    overflow: hidden;
    transition: transform 0.1s;
}

.component:hover {
    transform: scale(1.05);
}

.lectureImage {
    width: 100%;
    height: auto;
}

.lectureTitle {
    padding: 10px;
    font-size: 18px;
    font-weight: 600;
}
.lectureTitle .tag {
    padding: 5px 10px;
    border-radius: 10px;
    color: white;
    font-size: 13px;
    font-weight: bold;
    margin-right: 5px;
}
.lecture-tag {
    background-color: #007bff;
}

.lesson-tag {
    background-color: #28a745;
}
</style>