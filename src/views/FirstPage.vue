<template>
    <v-container style="margin-top: 60px">
        <div class="temporary-banner" style="height: 300px; margin: 20px 0 50px;" >
            <img src="@/assets/banner1.png" style="height: 300px">
        </div>
        <div class="search-container" style="margin-top: 60px">
            <input
                v-model="searchValue"
                dense
                hide-details="true"
                class="search-bar"
                placeholder="SwithT와 함께 배우고, 나누고, 성장하세요"
                @input="fetchSuggestions"
                @keyup.enter="performSearch"
            />
            <span @click="performSearch" class="search-btn mdi mdi-magnify"></span>
            <!-- 추천 검색어 표시 -->
            <ul v-if="suggestions.length > 0" class="suggestions-list">
                <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)">
                    {{ suggestion }}
                </li>
            </ul>
        </div>
        <section class="menu">
            <div class="menu-list" @click="performCategorySearch('DEVELOPMENT')">
                <img src="@/assets/target_2656366.png" class="menu-icon">
                <div class="menu-title">자기계발</div>
            </div>
            <div class="menu-list" @click="performCategorySearch('ADMISSION')">
                <img src="@/assets/mortarboard_2655764.png" class="menu-icon">
                <div class="menu-title">입시</div>
            </div>
            <div class="menu-list" @click="performCategorySearch('HOBBY')">
                <img src="@/assets/painting_2655642.png" class="menu-icon">
                <div class="menu-title">취미</div>
            </div>
            <div class="menu-list" @click="performCategorySearch('CAREER')">
                <img src="@/assets/manager_2704454.png" class="menu-icon">
                <div class="menu-title">취업/직무</div>
            </div>
            <div class="menu-list">
                <img src="@/assets/meeting-room_2645420.png" class="menu-icon">
                <div class="menu-title">강의</div>
            </div>
            <div class="menu-list">
                <img src="@/assets/conversation_2821731.png" class="menu-icon">
                <div class="menu-title">과외</div>
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
            searchValue: "",
            suggestions: [],
            latestLectures: [],
            freeLectures: []
        };
    },
    methods: {
        async fetchSuggestions() {
            if (this.searchValue.length > 0) {  // 1글자 이상 입력 시 추천 검색어 요청
                try {
                    const response = await axios.post(
                        `${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/recommend`, 
                        null,  // 바디를 비워두고
                        { 
                            params: { keyword: this.searchValue }  // 쿼리 스트링에 keyword 전달
                        }
                    );
                    this.suggestions = response.data;  // 추천 검색어 저장
                } catch (error) {
                    console.error("추천 검색어 가져오기 실패:", error);
                }
            } else{
                this.suggestions = [];
            }
        },
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
        },
        performSearch() {
            const requestData = {
                searchTitle: this.searchValue,  // 입력된 검색어
                category: "",  
                status: "ADMIT", // status는 ADMIT 고정
                lectureType: "" 
            };
            // 검색 데이터를 쿼리 파라미터로 넘기면서 페이지 이동
            this.$router.push({ 
                name: 'SearchResult', 
                query: requestData 
            });
        },
        performCategorySearch(category) {
            const requestData = {
                searchTitle: "",  // 빈 검색어
                category: category,  
                status: "ADMIT", // status는 ADMIT 고정
                lectureType: ""  // 모든 강의 유형
            };
            // 카테고리별 검색 데이터를 쿼리 파라미터로 넘기면서 페이지 이동
            this.$router.push({ 
                name: 'SearchResult', 
                query: requestData 
            });
        },
        selectSuggestion(suggestion) {
            this.searchValue = suggestion;  // 선택된 추천어로 검색어 설정
            this.performSearch();  // 선택된 추천어로 바로 검색 실행
            this.suggestions = [];
        },
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
    height: 100px;
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
    width: 60px;
    height: 60px;
    margin: 5px;
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
.search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    position: relative;
}
.search-bar {
    width: 40vw;
    height: 50px;
    border-radius: 50px;
    background-color: #d1e4fb;
    border: 1px solid #a7caef;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
    padding: 14px 20px;
    border-radius: 28px;
    height: auto;
    transition: all .2s ease;
}
.search-bar:focus {
    outline: unset;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .2);
    border: 1px solid #dedede;
    background-color: #fff;
}

.search-btn {
    color: #555;
    margin-left: 10px;
    font-size: 30px;
    transition: all .2s ease;
}
.search-btn:hover {
    cursor: pointer;
    font-size: 35px;
}
.suggestions-list {
    list-style: none;
    padding: 0;
    margin-top: 23%;
    position: absolute; 
    background-color: white;
    width: 39vw;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
    z-index: 10;
    border-radius: 28px;
    height: auto;
    left: 28%;
}
.suggestions-list li {
    padding: 5px;
    margin: 0px;
    width: 38.9vw;
    border-radius: 28px;
    cursor: pointer;
    text-align: left;
}
.suggestions-list li:hover {
    background-color: #EEE;
}

</style>