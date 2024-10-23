<template>
    <v-dialog v-model="dialog" max-width="500px" max-height="500px">
      <v-card style="border-radius: 20px;">
        <div class="d-flex justify-center align-center mt-10">
          <h4><strong>힘이 되는 수강평을 남겨주세요!</strong></h4>
        </div>
  
        <v-card-text>
          <!-- 별점 선택 -->
          <div class="d-flex justify-center my-2 mb-3">
            <div class="rating-container">
              <v-icon
                v-for="star in 5"
                :key="star"
                :class="{'active-star': star <= rating}"
                @click="setRating(star)"
                large
                class="rating-star"
              >
                mdi-star
              </v-icon>
            </div>
          </div>
  
          <!-- 제목과 내용 입력창은 별점을 선택하고 작성하기 버튼을 누르면 보이도록 v-if -->
          <v-form v-if="isFormVisible">
            <v-text-field
              clearable
              variant="outlined"
              placeholder="제목"
              required
              class="mt-3"
            ></v-text-field>
  
            <v-textarea
              clearable
              variant="outlined"
              placeholder="수강평을 작성해보세요!"

              required
            ></v-textarea>
            
          </v-form>
          <v-card-actions class="d-flex justify-center">
            <!-- 별점 선택 전 -->
            <v-btn 
              v-if="!isFormVisible"
              color="white" 
              style="background-color: #6C97FD; width: 220px; height: 40px;"  
              @click="confirmClose"> 
              <b>취소</b>
            </v-btn>
          
  <!-- 별점 선택 후, 흰색 배경 취소 버튼 (검은색 테두리) -->
  <v-btn 
    v-else
    color="black" 
    style="background-color: white; width: 220px; height: 40px; border: 1px solid black;"  
    @click="confirmClose"> 
    <b>취소</b>
  </v-btn>
          
            <!-- 작성하기 버튼 -->
            <v-btn
              style="background-color: #6C97FD; width: 220px; height: 40px;" 
              color="white"
              text
              @click="showForm"
              v-if="!isFormVisible"
            >
              <b>작성하기</b>
            </v-btn>
          
            <!-- 작성 버튼 -->
            <v-btn
              style="background-color: #6C97FD; width: 220px; height: 40px;" 
              color="white"
              text
              v-if="isFormVisible"
              @click="submitReview"
              :loading="loading"
            >
              <b>작성하기</b>
            </v-btn>
          </v-card-actions>
        </v-card-text>

      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialog: false,
        reviewTitle: "",
        reviewContent: "",
        rating: 0, // 선택된 별점
        isFormVisible: false, // 제목과 내용 입력창 표시 여부
        image: null,
        error: false,
        errorMessage: "",
        loading: false,
      };
    },
    methods: {
      setRating(star) {
        this.rating = star; // 선택한 별점 설정
      },
      showForm() {
        // 별점이 선택되었는지 확인 후 제목과 내용 입력창을 표시
        if (this.rating > 0) {
          this.isFormVisible = true;
        } else {
          alert("별점을 먼저 선택해주세요.");
        }
      },
      confirmClose() {
        if (this.reviewTitle || this.reviewContent || this.rating) {
          if (confirm("작성 중인 내용이 사라집니다. 닫으시겠습니까?")) {
            this.close();
          }
        } else {
          this.close();
        }
      },
      close() {
        this.dialog = false;
        this.clearForm();
      },
      clearForm() {
        this.reviewTitle = "";
        this.reviewContent = "";
        this.rating = 0; // 별점 초기화
        this.isFormVisible = false; // 입력창 숨기기
        this.image = null;
        this.showErrors = false; // 폼이 초기화되면 에러 메시지와 테두리 색상도 초기화
      },
    },
  };
  </script>
  
  <style scoped>
  .rating-container {
    display: flex;
    align-items: center;
  }
  
  .rating-star {
    font-size: 40px; /* 별 크기 조정 */
    color: lightgray; /* 기본 별 색상 */
    cursor: pointer;
  }
  
  .active-star {
    color: #FFEB3B; /* 선택된 별 색상 */
  }
  </style>
  