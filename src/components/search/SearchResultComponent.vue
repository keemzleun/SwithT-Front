<template>
    <v-container>
        <div class="search-container" style="margin-top: 60px">
            <v-text-field
                v-model="searchValue"
                label="SwithT와 함께 배우고, 나누고, 성장하세요"
                dense
                hide-details="true"
                class="search-bar"
                @input="fetchSuggestions"
                @keyup.enter="performSearch"
            />

            <v-btn @click="performSearch" class="search-btn">검색</v-btn>
            <!-- 추천 검색어 표시 -->
            <ul v-if="suggestions.length > 0" class="suggestions-list">
                <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)">
                    {{ suggestion }}
                </li>
            </ul>
        </div>
        <section class="menu">
            <div
                class="menu-list"
                :class="{ 'highlighted': selectedCategory === 'DEVELOPMENT' }"
                @click="performCategorySearch('DEVELOPMENT')"
            >
                <div class="menu-icon">🧘‍♀️</div>
                <div class="menu-title">자기계발</div>
            </div>
            <div
                class="menu-list"
                :class="{ 'highlighted': selectedCategory === 'ADMISSION' }"
                @click="performCategorySearch('ADMISSION')"
            >
                <div class="menu-icon">🧑‍🏫</div>
                <div class="menu-title">입시</div>
            </div>
            <div
                class="menu-list"
                :class="{ 'highlighted': selectedCategory === 'HOBBY' }"
                @click="performCategorySearch('HOBBY')"
            >
                <div class="menu-icon">🏄</div>
                <div class="menu-title">취미</div>
            </div>
            <div
                class="menu-list"
                :class="{ 'highlighted': selectedCategory === 'CAREER' }"
                @click="performCategorySearch('CAREER')"
            >
                <div class="menu-icon">👨‍💼</div>
                <div class="menu-title">취업/직무</div>
            </div>
        </section>
        <div v-if="searchResult.length === 0">검색 결과가 없습니다.</div>
        <div v-else>
            <div v-for="lecture in searchResult" :key="lecture.id">
                <img :src="getlectureImage(lecture)" alt="강의 썸네일" class="lecture-image" />
                <p>{{ lecture.title }}</p>
                <p>{{ lecture.memberName }} 튜터</p>
                <p v-if="lecture.isContainsFree">재능기부</p>
            </div>
        </div>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            searchValue: "",
            suggestions: [],  // 추천 검색어 저장 배열
            searchResult: [], // 검색 결과 저장할 배열
            selectedCategory: "", // 선택된 카테고리를 저장
        };
    },
    async mounted() {
        // 초기 검색 요청
        this.fetchSearchResults();
    },
    watch: {
        // 라우터의 쿼리 파라미터가 변경될 때마다 검색 결과 갱신
        '$route.query': 'fetchSearchResults'
    },
    methods: {
        getlectureImage(lecture) {
            return lecture.image;
        },
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
            }
        },

        async fetchSearchResults() {
            // 쿼리 파라미터로 전달된 requestData 받기
            const requestData = this.$route.query;

            // API 호출을 통해 검색 결과 가져오기
            try {
                const response = await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/search`,
                    requestData
                );

                if(requestData.searchTitle === ""  && requestData.category != "" && requestData.category) {
                    this.selectedCategory = requestData.category;  // 선택된 카테고리 저장
                }
                // 검색 결과를 content 배열에 저장
                this.searchResult = response.data.result.content;
            } catch (error) {
                console.error("Failed to fetch search results:", error);
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
                status: "ADMIT", 
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
        }

    }
};
</script>

<style scoped>
.v-container {
    color: #333;
    padding: none;
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
.menu-icon {
    font-size: 60px;
    width: 80px;
    height: 80px;
}
.menu-title {
    font-weight: 700;
}
.highlighted {
    background-color: #EEE;  /* 하이라이트 색상 */
    border-radius: 10px;
}
.suggestions-list {
    list-style: none;
    padding: 0;
    margin-top: 5px;
    position: absolute; 
    background-color: white;
    width: 100%;  
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
    z-index: 10;  
}
.suggestions-list li {
    padding: 5px;
    cursor: pointer;
    text-align: left;
}
.suggestions-list li:hover {
    background-color: #EEE;
}
</style>
