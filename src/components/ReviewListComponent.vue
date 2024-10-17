<template>
  <v-container class="mt-16" style="max-width: 1000px">
    <v-row class="mt-15" justify="center">
      <v-row justify="center">
        <v-col
          cols="12"
          v-for="review in reviewList"
          :key="review.id"
          class="review-item"
          justify="center"
        >
          {{ review.id }}
          <v-row align="center">
            <v-col cols="1" class="d-flex flex-column align-start">
              <v-row class="mb-3 ml-4">{{ review.name }}</v-row>

              <v-avatar size="80" class="mb-10">
                <v-img
                  :src="
                    review.profileImage || 'https://via.placeholder.com/150'
                  "
                  alt="Profile"
                ></v-img>
              </v-avatar>
            </v-col>

            <v-col class="review-detail ml-3 mb-10" cols="8">
              <v-row no-gutters style="padding: 0">
                <v-col cols="auto" v-for="n in 5" :key="n">
                  <v-icon color="pink" v-if="n <= review.star">mdi-star</v-icon>
                  <v-icon color="grey" v-else>mdi-star-outline</v-icon>
                </v-col>

                <span style="padding-left: 10px"
                  ><strong>{{ review.star }}</strong></span
                >

                <span
                  class="ml-5"
                  style="
                    font-weight: 500;
                    margin-left: 20px;
                    margin-bottom: 10px;
                  "
                >
                  {{ formatDate(review.createdTime) }}
                </span>
              </v-row>

              <v-row
                justify="start"
                class="text-sm-left"
                style="padding: 0 10px"
              >
                <span
                  class="ml-2"
                  style="
                    color: #000000;
                    font-size: 18px;
                    padding-right: 10px;
                    font-size: x-large;
                  "
                >
                  {{ review.title }}
                </span>
              </v-row>

              <br />
              <v-row class="ml-1 mt-3" style="font-weight: 500">
                {{ review.contents }}</v-row
              >
            </v-col>
            <v-col cols="12" class="text-right">
              <v-row justify="end" class="edit-delete-buttons">
                <v-btn
                  color="#82D691"
                  @click="openEditModal(review)"
                  class="edit-btn mb-6 mr-5"
                >
                  수정
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
          <v-divider :thickness="3"></v-divider>
        </v-col>
      </v-row>
    </v-row>

    <!-- 수정 모달 -->
    <v-dialog v-model="editDialog" max-width="600px">
        <v-card class="bg-light text-dark" style="padding-top: 10px">
          <v-card-title class="d-flex justify-end" style="padding-top: 10px; margin-right: 10px">
            <v-btn icon @click="closeEditModal" class="modal-close-btn">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
      
          <v-card-text>
            <v-form @submit.prevent="updateReview">
              <v-text-field
                label="제목"
                v-model="editedReview.title"
                outlined
                required
                class="mb-3"
              ></v-text-field>
      
              <v-textarea
                label="내용"
                v-model="editedReview.contents"
                outlined
                required
                class="mb-3"
              ></v-textarea>
      
              <v-row justify="center" class="mt-3">
                <v-btn type="submit" color="#6C97FD" justify="center" class="mb-6">수정하기</v-btn>
              </v-row>
            </v-form>
          </v-card-text>

        </v-card>
      </v-dialog>
      

  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      reviewList: [],
      reviewId: null,
      editDialog: false,
      editedReview: {
        title: "",
        contents: "",
      },
    };
  },
  methods: {
    openEditModal(review) {
      this.reviewId = review.id; // 리뷰 ID 저장
      this.editedReview.title = review.title; // 기존 제목 불러오기
      this.editedReview.contents = review.contents; // 기존 내용 불러오기
      this.editDialog = true; // 모달 열기
    },
    closeEditModal() {
      this.editDialog = false; // 모달 닫기
    },
    async fetchReviews() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/review/list`,
          {
            params: {
              tutorId: 5, // 예시로 tutorId를 1로 설정 추후에 반드시 동적으로 처리하도록 수정해야함.
              sortBy: "DESC",
              order: "ASC",
            },
          }
        );

        console.log(response.data.result.content + "찍어보기");

        this.reviewList = response.data.result.content; // 서버로부터 받은 데이터를 reviewList에 저장
        console.log(this.reviewList + "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      } catch (error) {
        console.error("리뷰를 불러오는 중 에러 발생:", error);
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    async updateReview() {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/review/update/${this.reviewId}`,
          this.editedReview
        );
        // 성공 메시지나 알림을 추가할 수 있습니다.
        console.log(response.data); // 응답 데이터 확인
        this.closeEditModal(); // 모달 닫기
      } catch (error) {
        console.error("리뷰 업데이트 중 에러 발생:", error);
        // 에러 처리 로직 추가
      }
    },
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
