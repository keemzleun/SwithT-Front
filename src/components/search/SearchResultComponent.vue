<template>
    <v-container>
        <div class="search-container" style="margin-top: 60px">
            <v-text-field
                v-model="searchValue"
                label="SwithT와 함께 배우고, 나누고, 성장하세요"
                dense
                hide-details="true"
                class="search-bar"
                @keyup.enter="performSearch"
            />
            <v-btn @click="performSearch" class="search-btn">검색</v-btn>
        </div>
        <section class="menu">
            <div class="menu-list" @click="performCategorySearch('DEVELOPMENT')">
                <div class="menu-icon">🧘‍♀️</div>
                <div class="menu-title">자기계발</div>
            </div>
            <div class="menu-list" @click="performCategorySearch('ADMISSION')">
                <div class="menu-icon">🧑‍🏫</div>
                <div class="menu-title">입시</div>
            </div>
            <div class="menu-list" @click="performCategorySearch('HOBBY')">
                <div class="menu-icon">🏄</div>
                <div class="menu-title">취미</div>
            </div>
            <div class="menu-list" @click="performCategorySearch('CAREER')">
                <div class="menu-icon">👨‍💼</div>
                <div class="menu-title">취업/직무</div>
            </div>
        </section>
        <div v-if="searchResult.length === 0">검색 결과가 없습니다.</div>
        <div v-else>
            <div v-for="lecture in searchResult" :key="lecture.id">
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
            searchResult: [] // 검색 결과 저장할 배열
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
        async fetchSearchResults() {
            // 쿼리 파라미터로 전달된 requestData 받기
            const requestData = this.$route.query;

            // API 호출을 통해 검색 결과 가져오기
            try {
                const response = await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/search`,
                    requestData
                );

                // 콘솔에서 응답을 JSON 문자열 형태로 확인
                console.log('result: ', JSON.stringify(response.data.result.content, null, 2));

                // 검색 결과를 content 배열에 저장
                this.searchResult = response.data.result.content;
            } catch (error) {
                console.error("Failed to fetch search results:", error);
            }
        },
        performSearch() {
            const requestData = {
                searchTitle: this.searchValue,  // 입력된 검색어
                category: null,  
                status: "ADMIT", // status는 ADMIT 고정
                lectureType: null 
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
.menu-icon{
    font-size: 60px;
    width: 80px;
    height: 80px;
}
.menu-title {
    font-weight: 700;
}
</style>