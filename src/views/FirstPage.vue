<template>
    <v-container style="margin-top: 60px">
        <div class="temporary-banner">
            임시 배너
        </div>
        <section class="menu">
            <div class="menu-list">
                <div class="menu-icon">🧘‍♀️</div>
                <div class="menu-title">자기계발</div>
            </div>
            <div class="menu-list">

                <div class="menu-icon">🧑‍🏫</div>
                <div class="menu-title">입시</div>
            </div>
            <div class="menu-list">
                <div class="menu-icon">🏄</div>
                <div class="menu-title">취미</div>
            </div>
            <div class="menu-list">
                <div class="menu-icon">👨‍💼</div>
                <div class="menu-title">취업/직무</div>
            </div>
        </section>
            
        <hr/>

        <section class="recommendation">
            <div class="title">✨ 재능 기부</div>
            <div class="lecture-list">
                <div
                    class="component"
                    v-for="lecture in freeLectures"
                    :key="lecture.id"
                    @click="goToLecture(lecture.id)"
                >
                    <img :src="getlectureImage(lecture)" alt="강의 썸네일" class="lecture-image" />
                    <div class="lecture-info">
                        <span v-if="lecture.lectureType === 'LECTURE'" class="tag lecture-tag">강의</span>
                        <span v-if="lecture.lectureType === 'LESSON'" class="tag lesson-tag">과외</span>
                        <span class="lecture-category">{{ getCategoryText(lecture.category) }}</span>
                        <div class="lecture-title">{{ lecture.title }}</div>
                        <div class="lecture-tutor">{{ lecture.memberName }} 튜터</div>
                    </div>
                </div>  
            </div>

            <div class="title">👀 요즘 뜨는 강의</div>
            <div class="lecture-list">
                <div
                    class="component"
                    v-for="lecture in latestLectures"
                    :key="lecture.id"
                    @click="goToLecture(lecture.id)"
                >
                    <img :src="getlectureImage(lecture)" alt="강의 썸네일" class="lecture-image" />
                    <div class="lecture-info">
                        <span v-if="lecture.lectureType === 'LECTURE'" class="tag lecture-tag">강의</span>
                        <span v-if="lecture.lectureType === 'LESSON'" class="tag lesson-tag">과외</span>
                        <span class="lecture-category">{{ getCategoryText(lecture.category) }}</span>
                        <div class="lecture-title">{{ lecture.title }}</div>
                        <div class="lecture-tutor">{{ lecture.memberName }} 튜터</div>
                    </div>
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
            latestLectures: [],
            freeLectures: []
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
        async fetchFreeLectures() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lectures/free`);
                this.freeLectures = response.data.result;
                console.log(response.data.result);
            } catch (error) {
                console.error("Failed to fetch free lectures:", error);
            }
        },
        goToLecture(lectureId) {
            this.$router.push({ name: 'LectureDetail', params: { id: lectureId } });
        },
        getlectureImage(lecture) {
            return lecture.image;
        },
        getCategoryText(category) {
        switch (category) {
            case 'CAREER':
                return '취업/직무';
            case 'HOBBY':
                return '취미';
            case 'ADMISSION':
                return '입시';
            case 'DEVELOPMENT':
                return '자기계발';
            default:
                return category;
        }
    }
    },
    created() {
        this.fetchLatestLectures(); // 컴포넌트가 생성될 때 최신 강의 목록을 가져옴
        this.fetchFreeLectures();
    }
};
</script>
<style scoped>
.v-container {
    color: #333;
    padding: none;
}
.banner {
    background-color: rgb(220, 219, 219);
    
}
.temporary-banner{
    height: 250px;
    width: auto;
    background-color: #999;
}
.menu {
    margin: 20px 0;
}
.menu-list {
    width: 80px;
    height: 110px;
    margin: 0 10px;
    display: inline-block;
}
.menu-list:hover {
    background-color: #EEE;
    border-radius: 10px;
    cursor: pointer;
}
.menu-icon{
    font-size: 60px;
    width: 80px;
    height: 80px;
}
.menu-title {
    font-weight: 700;
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
    justify-content: center;
    gap: 10px

}
.component {
    cursor: pointer;
    margin: 20px;
    width: 250px;
    text-align: center;
    overflow: hidden;
    transition: transform 0.1s;
}

.component:hover {
    transform: scale(1.05);
}

.lecture-image {
    width: 250px;
    height: 200px;
    object-fit: cover;
}
.lecture-info {
    text-align: left;
    padding: 7px;
}
.tag {
    padding: 3px 8px;
    border-radius: 10px;
    color: white;
    font-size: 12px;
    font-weight: bold;
    margin-right: 5px;
}
.lecture-tag {
    background-color: #007bff;
}
.lesson-tag {
   background-color: #28a745;
}
.lecture-category {
    font-size: 15px;
}
.lecture-title {
    font-size: 18px;
    font-weight: 700;
    padding: 8px 3px 0;
}
.lecture-tutor {
    padding: 0 3px 0;
}
</style>