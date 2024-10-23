<template>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">리뷰 작성</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="제목"
            v-model="reviewTitle"
            required
          ></v-text-field>
          <v-textarea
            label="내용"
            v-model="reviewContent"
            required
          ></v-textarea>
          <v-rating
            v-model="rating"
            filled
            hover
            clearable
            icon="mdi-star"
          ></v-rating>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">취소</v-btn>
          <v-btn color="blue darken-1" text @click="submitReview">작성</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialog: false,
        reviewTitle: '',
        reviewContent: '',
        rating: null,
      };
    },
    methods: {
      close() {
        this.dialog = false;
      },
      submitReview() {
        // 리뷰 제출 로직 구현
        console.log('제목:', this.reviewTitle);
        console.log('내용:', this.reviewContent);
        console.log('평점:', this.rating);
        // API 호출 등의 로직 추가
        this.close(); // 제출 후 모달 닫기
      },
    },
  };
  </script>
  
  <style scoped>
  /* 필요한 스타일 추가 */
  </style>
  