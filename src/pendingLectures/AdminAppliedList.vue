<template>
    <v-container>
        <v-row justify="center">
            <v-col class="main-title" cols="12" align="center" style="font-size: 28px; font-weight: 700">
                <p>신청 내역</p>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-row class="header">
                    <v-col cols="1">순서</v-col>
                    <v-col cols="2">상태</v-col>
                    <v-col cols="3">강의명</v-col>
                    <v-col cols="3">신청날짜</v-col>
                    <v-col cols="3">결과 처리</v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="allLectures.length">
                <v-row v-for="(lecture, index) in allLectures" :key="lecture.applyId" class="item">
                    <v-col cols="1">{{ index + 1 }}</v-col>
                    <v-col cols="2">
                        <span :class="getStatusClass(lecture.status)" style="font-weight: bold;">{{ getStatusText(lecture.status) }}</span>
                    </v-col>
                    <v-col cols="3" class="lecture-title" @click="goToLectureDetail(lecture.id)">
                        {{ lecture.title }}
                    </v-col>
                    <!-- <v-col cols="3" class="lecture-title">{{ lecture.title }}</v-col> -->
                    <v-col cols="3">{{ formatDate(lecture.createdTime) }}</v-col>
                    <v-col cols="3">
                        <!-- 승인 버튼 -->
                        <v-btn color="#82D691" @click="updateLectureStatus(lecture.id, 'ADMIT')"><strong>승인</strong></v-btn>
                        <!-- 거절 버튼 -->
                        <v-btn color="#6C97FD" class="ml-2" @click="updateLectureStatus(lecture.id, 'REJECT')"><strong>거절</strong></v-btn>
                      </v-col>
                </v-row>
                <div v-if="isLoading" class="text-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
            </v-col>
            <v-col v-else>
                <div style="margin: 20px 0"> 개설 요청된 강의가 없습니다.</div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            allLectures: [],   // 모든 강의 목록
            page: 0,           // 현재 페이지
            size: 10,          // 페이지 당 불러올 강의 수
            isLoading: false,  // 로딩 상태
            hasMoreData: true, // 추가 데이터를 불러올 수 있는지 여부
        };
    },
    methods: {
            // 강의 상태 변경 메서드
    async updateLectureStatus(id, newStatus) {
      try {
        const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/member-service/lectures/${id}/status`, null, {
          params: {
            newStatus: newStatus,
          },
        });

        if (response.status === 200) {
          alert("상태 변경 완료");  // 성공 메시지 출력
          window.location.reload();
          this.fetchLectures();  // 상태 변경 후 강의 목록을 다시 불러옴
        }
      } catch (error) {
        console.error("상태 변경 실패:", error);
      }
    },
        goToLectureDetail(id) {
      this.$router.push(`/lecture/${id}`);
    },
        // 강의 목록을 서버에서 불러오는 메서드
        async fetchLectures() {
            if (this.isLoading || !this.hasMoreData) return;  // 이미 로딩 중이거나 더 이상 데이터가 없을 때 중복 요청 방지
            this.isLoading = true;
            
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/list-of-lecture`, {
                    params: {
                        status: 'STANDBY',
                        size: this.size,
                        page: this.page,
                    },
                });

                

                const lectures = response.data.result.content;
               
                // 페이지에 데이터가 있으면 추가
                if (lectures.length) {
                    this.allLectures.push(...lectures);
                    this.page += 1;  // 페이지 증가
                } else {
                    this.hasMoreData = false;  // 더 이상 데이터가 없음
                }

                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                console.log(this.allLectures);


            } catch (error) {
                console.error("Failed to fetch lectures:", error);
            } finally {
                this.isLoading = false;  // 로딩 완료
            }
        },
        // 날짜 포맷팅
        formatDate(date) {
            if (!date) return 'N/A';
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(date).toLocaleDateString(undefined, options);
        },
        // 상태에 따른 클래스 지정
        getStatusClass(status) {
            switch (status) {
                case 'STANDBY':
                    return 'status-standby';
                case 'REJECT':
                    return 'status-reject';
                default:
                    return '';
            }
        },
        // 상태 텍스트 반환
        getStatusText(status) {
            switch (status) {
                case 'STANDBY':
                    return '수락 대기';
                case 'REJECT':
                    return '거절';
                default:
                    return '상태 불명';
            }
        },
        // 무한 스크롤 이벤트 처리
        onScroll() {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.documentElement.offsetHeight - 200;
            if (scrollPosition >= threshold) {
                this.fetchLectures();  // 페이지 끝에 도달하면 새로운 데이터 로드
            }
        }
    },
    created() {
        this.fetchLectures();  // 컴포넌트가 생성될 때 첫 번째 데이터를 불러옴
        window.addEventListener('scroll', this.onScroll);  // 스크롤 이벤트 리스너 추가
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll);  // 컴포넌트가 소멸될 때 스크롤 이벤트 리스너 제거
    }
};
</script>

<style scoped>
.header {
    font-weight: bold;
    border-bottom: 2px solid #ccc;
}
.item {
    padding: 10px 0;
}
.lecture-title:hover {
    background-color: #ececec;
    border-radius: 15px;
    cursor: pointer;
}
.status-standby {
    color: orange;
}
.status-admit {
    color: green;
}
.status-rejected {
    color: red;
}
.status-waiting {
    color: blue;
}
.status-terminate {
    color: gray;
}
</style>
