<template>
  <div class="container mt-16">
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body text-center" :style="{ minHeight: '485px' }">
            <img
              :src="
                memberInfo.profileImage || 'https://via.placeholder.com/150'
              "
              class="rounded-circle mb-3"
              alt="Profile"
              style="width: 150px"
            />
            <h4>{{ memberInfo.name }}</h4>
            <p>{{ memberInfo.company || "반갑습니다" }}</p>
            <hr />
            <div class="text-left">
              <!-- 추가 정보 등 -->
            </div>
            <a
              href="#"
              class="btn btn-block mt-0 ml-5"
            :style="{ backgroundColor: '#6C97FD', color: 'white' }"
              @click="selectImage"
              >프로필 이미지 수정</a
            >
            <input
              type="file"
              ref="fileInput"
              @change="onFileChange"
              style="display: none"
              accept="image/*"
            />
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">회원 정보</h5>
            <ul class="nav nav-tabs mb-3">
              <li class="nav-item">
                <a class="nav-link active" href="#">계정 정보</a>
              </li>
            </ul>

            <!-- Account Settings Form -->
            <form @submit.prevent="updateProfile">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="name">이름</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="memberInfo.name"
                    disabled
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="phoneNumber">전화번호</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="phoneNumber"
                    v-model="memberInfo.phoneNumber"
                    :disabled="!isEditing"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="email">이메일</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="memberInfo.email"
                    disabled
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="address">주소</label>
                  <input
                    type="text"
                    class="form-control"
                    id="address"
                    v-model="memberInfo.address"
                    :disabled="!isEditing"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3" v-if="role === 'TUTOR'">
                  <label for="education">학력</label>
                  <input
                    type="text"
                    class="form-control"
                    id="education"
                    v-model="memberInfo.education"
                    :disabled="!isEditing"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="gender">성별</label>
                  <input
                    type="text"
                    class="form-control"
                    id="gender"
                    v-model="memberInfo.gender"
                    disabled
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="birthday">생년월일</label>
                  <input
                    type="date"
                    class="form-control"
                    id="birthday"
                    v-model="memberInfo.birthday"
                    :disabled="!isEditing"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3" v-if="role === 'TUTOR'">
                  <label for="introduce">자기 소개</label>
                  <input
                    type="text"
                    class="form-control"
                    id="introduce"
                    v-model="memberInfo.introduce"
                    :disabled="!isEditing"
                    required
                  />
                </div>
              </div>
              <br />
              <button
                type="button"
                class="btn"
                :style="{ backgroundColor: '#6C97FD', color: 'white' }"
                @click="isEditing = true"
              >
                수정하기 
                <!-- '#82D691' -->
              </button>
              <button 
               type="submit" 
               class="btn ml-3" 
               v-if="isEditing"
               :style="{ backgroundColor: '#82D691', color: 'white' }"
               >
                수정 완료
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      memberInfo: {},
      role: localStorage.getItem("role"),
      isEditing: false, // 수정 모드 상태 추가
    };
  },
  async created() {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/member-service/infoGet`
    );
    this.memberInfo = response.data.result;
  },
  methods: {
    async updateProfile() {
      try {
        const updatedInfo = {
          id: this.memberInfo.id,
          name: this.memberInfo.name, // 여기서 name이 null이 아닌지 확인
          birthday: this.memberInfo.birthday,
          gender: this.memberInfo.gender, // 이 필드를 추가해 주어야 함
          address: this.memberInfo.address,
          phoneNumber: this.memberInfo.phoneNumber,
          education: this.memberInfo.education,
          introduce: this.memberInfo.introduce,
        };

        await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/infoUpdate`,
          updatedInfo
        );

        alert("회원 정보가 성공적으로 수정되었습니다!");
        this.isEditing = false; // 수정 완료 후 수정 모드 종료
      } catch (error) {
        alert("회원 정보 수정 중 오류가 발생했습니다.");
        console.error(error); // 에러 상세 정보 콘솔에 출력
      }
    },
    selectImage() {
      this.$refs.fileInput.click(); // 파일 선택 대화 상자 열기
    },
    async onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/member-service/imageUpdate`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          window.location.reload(); // 페이지를 새로 고침
          alert("프로필 이미지가 성공적으로 수정되었습니다!");
          this.memberInfo.profileImage = response.data.result; // 새로운 이미지 URL로 업데이트
        } catch (error) {
          alert("이미지 수정 중 오류가 발생했습니다.");
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.card {
  margin-bottom: 20px;
}

.rounded-circle {
  border-radius: 50%;
}

.mt-16 {
  margin-top: 16px;
}
</style>
