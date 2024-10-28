<template>
    <v-container style="margin-top: 60px;">
      <div class="temporary-banner" style="height: 300px; margin: 20px 0 50px;">
        <img src="@/assets/banner1.png" style="height: 300px" />
      </div>
  
      <!-- 추천 강의 섹션 -->
      <section class="recommendation">
        <div class="title">✨ 재능 기부</div>
        
        <!-- 로딩 중인 경우 스피너 표시 -->
        <v-progress-circular
          v-if="isLoadingFreeLectures"
          indeterminate
          color="primary"
          size="50"
          class="mx-auto"
        ></v-progress-circular>
        
        <!-- 강의 데이터가 있을 때만 Carousel 표시 -->
        <v-carousel
          v-if="!isLoadingFreeLectures && freeLectures.length > 0"
          hide-delimiter-background
          height="350px"
          style="margin-right:100px;"
          cycle
        >
          <v-carousel-item v-for="(lectureGroup, index) in groupedLectures(freeLectures)" :key="index">
            <v-row justify="center" align="center" style="margin-right:50px">
              <v-col v-for="lecture in lectureGroup" :key="lecture.id" cols="2">
                <div class="lecture-slide">
                  <img
                    :src="getlectureImage(lecture)"
                    alt="강의 썸네일"
                    class="lecture-image"
                  />
                  <div class="lecture-info">
                    <span
                      v-if="lecture.lectureType === 'LECTURE'"
                      class="tag lecture-tag"
                      >강의</span
                    >
                    <span
                      v-if="lecture.lectureType === 'LESSON'"
                      class="tag lesson-tag"
                      >과외</span
                    >
                    <span class="lecture-category">
                      {{ getCategoryText(lecture.category) }}
                    </span>
                    <div class="lecture-title">{{ lecture.title }}</div>
                    <div class="lecture-tutor">{{ lecture.memberName }} 튜터</div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </section>
  
      <!-- 최신 강의 섹션 -->
      <div class="title">👀 요즘 뜨는 강의</div>
      
      <!-- 로딩 중인 경우 스피너 표시 -->
      <v-progress-circular
        v-if="isLoadingLatestLectures"
        indeterminate
        color="primary"
        size="50"
        class="mx-auto"
      ></v-progress-circular>
      
      <!-- 강의 데이터가 있을 때만 Carousel 표시 -->
      <v-carousel
        v-if="!isLoadingLatestLectures && latestLectures.length > 0"
        hide-delimiter-background
        height="350px"
        cycle
      >
        <v-carousel-item v-for="(lectureGroup, index) in groupedLectures(latestLectures)" :key="index">
          <v-row justify="center" align="center">
            <v-col v-for="lecture in lectureGroup" :key="lecture.id" cols="2" >
              <div class="lecture-slide">
                <img
                  :src="getlectureImage(lecture)"
                  alt="강의 썸네일"
                  class="lecture-image"
                />
                <div class="lecture-info">
                  <span
                    v-if="lecture.lectureType === 'LECTURE'"
                    class="tag lecture-tag"
                    >강의</span
                  >
                  <span
                    v-if="lecture.lectureType === 'LESSON'"
                    class="tag lesson-tag"
                    >과외</span
                  >
                  <span class="lecture-category">
                    {{ getCategoryText(lecture.category) }}
                  </span>
                  <div class="lecture-title">{{ lecture.title }}</div>
                  <div class="lecture-tutor">{{ lecture.memberName }} 튜터</div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
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
        freeLectures: [],
        isLoadingFreeLectures: true,  // 로딩 상태 변수 추가
        isLoadingLatestLectures: true,  // 로딩 상태 변수 추가
      };
    },
    methods: {
      groupedLectures(lectures) {
        const groups = [];
        for (let i = 0; i < lectures.length; i += 3) {
          groups.push(lectures.slice(i, i + 3));
        }
        return groups;
      },
      async fetchSuggestions() {
        if (this.searchValue.length > 0) {
          try {
            const response = await axios.post(
              `${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/recommend`,
              null,
              {
                params: { keyword: this.searchValue }
              }
            );
            this.suggestions = response.data;
          } catch (error) {
            console.error("추천 검색어 가져오기 실패:", error);
          }
        } else {
          this.suggestions = [];
        }
      },
      async fetchLatestLectures() {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lectures/latest`);
          this.latestLectures = response.data.result;
        } catch (error) {
          console.error("Failed to fetch latest lectures:", error);
        } finally {
          this.isLoadingLatestLectures = false;  // 로딩 완료 상태로 변경
        }
      },
      async fetchFreeLectures() {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lectures/free`);
          this.freeLectures = response.data.result;
        } catch (error) {
          console.error("Failed to fetch free lectures:", error);
        } finally {
          this.isLoadingFreeLectures = false;  // 로딩 완료 상태로 변경
        }
      },
      goToLecture(lectureId) {
        this.$router.push({ name: "LectureDetail", params: { id: lectureId } });
      },
      getlectureImage(lecture) {
        return lecture.image;
      },
      getCategoryText(category) {
        switch (category) {
          case "CAREER":
            return "취업/직무";
          case "HOBBY":
            return "취미";
          case "ADMISSION":
            return "입시";
          case "DEVELOPMENT":
            return "자기계발";
          default:
            return category;
        }
      }
    },
    created() {
      this.fetchLatestLectures();
      this.fetchFreeLectures();
    }
  };
  </script>
  
  <style scoped>
  
  .lecture-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
    white-space: nowrap; /* 텍스트가 한 줄로만 표시되도록 설정 */
    overflow: hidden; /* 넘치는 텍스트를 숨김 */
    text-overflow: ellipsis; /* 넘치는 텍스트는 ...으로 표시 */
    max-width: 250px; /* 최대 너비를 설정하여 ...이 잘 보이도록 조정 */
  }
  .lecture-tutor {
    padding: 0 3px 0;
  }
  </style>
  