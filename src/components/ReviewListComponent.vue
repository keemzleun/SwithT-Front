<template>
    <v-container class="mt-15">
      <v-row class="mt-15" justify="center">
        <v-row justify="center">
          <v-col
            cols="12"
            v-for="review in reviewList"
            :key="review.id"
            class="review-item"
            justify="center"
          >
            <v-row align="center">
              <v-col class="review-detail">
                <v-row no-gutters style="padding: 0">
                  <v-col cols="auto" v-for="n in 5" :key="n">
                    <v-icon color="pink" v-if="n <= review.star">mdi-star</v-icon>
                    <v-icon color="grey" v-else>mdi-star-outline</v-icon>
                  </v-col>

                  <span style="padding-left: 10px">{{ review.star }}</span>
                  <!-- 평점 -->
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span style="font-weight: 500; margin-bottom: 10px">{{ formatDate(review.createdTime) }}</span>
                  <!-- 시간 -->
                </v-row>
  
                <v-row justify="start" class="text-sm-left" style="padding: 0 10px">
                  <span style="color: #000000; font-size: 18px; padding-right: 10px">
                    {{ review.title }}
                  </span>
                </v-row>
  
                <br />
                <br />
                <v-row style="font-weight: 500">{{ review.contents }}</v-row>
              </v-col>
  
              <v-col>
                <v-row>
                  <v-img :src="review.imagePath" class="review-image" contain></v-img>
                </v-row>
              </v-col>
  
              <!-- 수정/삭제 버튼
              <v-col cols="12" class="text-right">
                <v-row justify="end" class="edit-delete-buttons">
                  <v-btn v-if="canDeleteReview(review)" color="pink" @click="openEditModal(review)" class="edit-btn">
                    수정
                  </v-btn>
                  <v-btn v-if="canDeleteReview(review)" color="dark pink" @click="deleteReview(review.id)" class="delete-btn ml-1">
                    삭제
                  </v-btn>
                </v-row>
              </v-col> -->
              
            </v-row>
            <v-divider :thickness="3"></v-divider>
          </v-col>
        </v-row>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        reviewList: [],
      };
    },
    methods: {
      async fetchReviews() {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/review/list`, {
            
            params: {
              tutorId: 2, // 예시로 tutorId를 1로 설정
              sortBy: 'star',
              order: 'DESC',
            },
          
        });
          
          console.log(response.data.result.content + "찍어보기");
          
          this.reviewList = response.data.result.content; // 서버로부터 받은 데이터를 reviewList에 저장
          

        } catch (error) {
          console.error('리뷰를 불러오는 중 에러 발생:', error);
        }
      },
      formatDate(date) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
      },

    //   canDeleteReview(review) {
    //     // 예시: 리뷰 삭제 가능 여부 로직
    //     return true;
    //   },
    //   openEditModal(review) {
    //     // 리뷰 수정 모달을 여는 로직
    //     console.log('Editing review', review);
    //   },
    //   deleteReview(reviewId) {
    //     // 리뷰 삭제 로직
    //     console.log('Deleting review', reviewId);
    //   },
    },
    created() {
      this.fetchReviews(); // 컴포넌트가 생성될 때 리뷰 데이터를 서버에서 가져옴
    },
  };
  </script>
  
  <style scoped>
  .review-item {
    margin-bottom: 20px;
  }
  .review-image {
    width: 100px;
    height: 100px;
  }
  .edit-btn {
    margin-right: 10px;
  }
  </style>
  