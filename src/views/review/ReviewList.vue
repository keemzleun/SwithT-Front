<template>
  <div class="user-page mt-15">
    <!-- 프로필 영역 -->
    <div class="profile-container">
      <div class="profile-header">
        <img
          :src="memberInfo.profileImage || 'https://via.placeholder.com/150'"
          alt="Profile Image"
          class="profile-image"
        />

        <div class="profile-details">
          <h2>{{ memberInfo.name }}</h2>
          <p>{{ memberInfo.introduce }}</p>
        </div>
      </div>
      <div class="profile-rating">
        <h3>⭐ {{ memberInfo.avgScore }}</h3>
      </div>
    </div>

    <!-- 리뷰 리스트 영역 -->
    <div class="review-list">
      <div class="review-item">
        <div class="review-header">
          <span class="review-rating">⭐ 3.0</span>
          <span class="review-date">24.09.24</span>
        </div>
        <h4>최상위권을 위한 수업..</h4>
        <p>8등급에게도 따라가기 너무 어려운 수업이었습니다...</p>
      </div>
      <div class="review-item">
        <div class="review-header">
          <span class="review-rating">⭐ 4.5</span>
          <span class="review-date">24.09.24</span>
        </div>
        <h4>최상위권을 위한 수업..</h4>
        <p>8등급에게도 따라가기 너무 어려운 수업이었습니다...</p>
      </div>
      <div class="review-item">
        <div class="review-header">
          <span class="review-rating">⭐ 5.0</span>
          <span class="review-date">24.09.24</span>
        </div>
        <h4>최상위권을 위한 수업..</h4>
        <p>8등급에게도 따라가기 너무 어려운 수업이었습니다...</p>
      </div>
    </div>

    <!-- 페이지네이션 영역 -->
    <div class="pagination">
      <button disabled>Previous</button>
      <span>1</span>
      <button>Next</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      memberInfo: {},
    };
  },
  async created() {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/member-service/infoGet`
    );
    this.memberInfo = response.data.result;
  },
};
</script>

<style scoped>
.user-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.profile-container {
  padding: 20px;
  background-color: #6c97fd;
  border-radius: 10px;
  margin-bottom: 20px;
}
.profile-header {
  display: flex;
  align-items: center;
}
.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}
.profile-details {
  font-size: 16px;
}
.profile-rating {
  text-align: center;
  font-size: 24px;
  margin-top: 10px;
}
.review-list {
  padding: 20px;
}
.review-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}
.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
button {
  margin: 0 10px;
}
</style>
