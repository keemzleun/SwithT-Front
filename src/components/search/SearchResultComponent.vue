<template>
    <v-container>
        <div v-if="searchResult.length === 0">검색 결과가 없습니다.</div>
        <div v-else>
            <div v-for="lecture in searchResult" :key="lecture.id">
                <p> {{lecture.title}} </p>
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
            searchResult: [] // 검색 결과 저장할 배열
        };
    },
    async mounted() {
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
    methods: {
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
    }
};
</script>
