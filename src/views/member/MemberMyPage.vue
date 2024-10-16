<template>
    <div 
    class="container"
    style="margin-top: 105px;"
    >
      <div class="row">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body text-center" :style="{ minHeight: '567px' }">
              <img
                :src="
                  memberInfo.profileImage || 'https://via.placeholder.com/150'
                "
                class="rounded-circle mb-3"
                alt="Profile"
                style="width: 150px"
              />
              <!-- 여기 나중에 수정하는거 고려해보기 -->
              <h4>{{ memberInfo.name }}</h4>
              <p>{{ "반갑습니다 "+memberInfo.name+"님"}}</p> 
              <hr />
              <div class="text-left">
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
  
              <form @submit.prevent="updateProfile">
                <div class="row">
                  <div class="col-md-12 mb-3 d-flex align-items-center">
                    <label for="name" class="mb-0 me-3" style="width: 100px;">이름</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="memberInfo.name"
                      :style="{
                        width: '300px',
                        backgroundColor: 'white',
                        color: '#000',
                        borderRadius: '0',
                        border: isEditing ? '1px solid #6C97FD' : 'none' // 수정 모드에서 테두리 표시
                      }"
                      :disabled="!isEditing"
                      required
                    />
                  </div>
                  <div class="col-md-12 mb-3 d-flex align-items-center">
                    <label for="phoneNumber" class="mb-0 me-3" style="width: 100px;">전화번호</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="phoneNumber"
                      v-model="memberInfo.phoneNumber"
                      :disabled="!isEditing"
                      :style="{
                        width: '300px',
                        backgroundColor: 'white',
                        color: '#000',
                        borderRadius: '0',
                        border: isEditing ? '1px solid #6C97FD' : 'none' // 수정 모드에서 테두리 표시
                      }"
                      required
                    />
                  </div>
                  <div class="col-md-12 mb-3 d-flex align-items-center">
                    <label for="email" class="mb-0 me-3" style="width: 100px;">이메일</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="memberInfo.email"
                      :style="{
                        width: '300px',
                        backgroundColor: 'white',
                        color: '#000',
                        borderRadius: '0',
                        border: 'none'
                      }"
                      disabled
                      required
                    />
                  </div>
                  <div class="col-md-12 mb-3 d-flex align-items-center">
                    <label for="address" class="mb-0 me-3" style="width: 100px;">주소</label>
                    <input
                      type="text"
                      class="form-control"
                      id="address"
                      v-model="memberInfo.address"
                      :disabled="!isEditing"
                      :style="{
                        width: '300px',
                        backgroundColor: 'white',
                        color: '#000',
                        borderRadius: '0',
                        border: isEditing ? '1px solid #6C97FD' : 'none' // 수정 모드에서 테두리 표시
                      }"
                      required
                    />
                  </div>
                  <div class="col-md-12 mb-3 d-flex align-items-center" v-if="role === 'TUTOR'">
                    <label for="education" class="mb-0 me-3" style="width: 100px;">학력</label>
                    <input
                      type="text"
                      class="form-control"
                      id="education"
                      v-model="memberInfo.education"
                      :disabled="!isEditing"
                      :style="{
                        width: '300px',
                        backgroundColor: 'white',
                        color: '#000',
                        borderRadius: '0',
                        border: isEditing ? '1px solid #6C97FD' : 'none' // 수정 모드에서 테두리 표시
                      }"
                      required
                    />
                  </div>
                  <div class="col-md-12 mb-3 d-flex align-items-center">
                    <label for="gender" class="mb-0 me-3" style="width: 100px;">성별</label>
                    <input
                      type="text"
                      class="form-control"
                      id="gender"
                      v-model="memberInfo.gender"
                      :style="{
                        width: '300px',
                        backgroundColor: 'white',
                        color: '#000',
                        borderRadius: '0',
                        border: 'none'
                      }"
                      disabled
                      required
                    />
                  </div>
                  <div class="col-md-12 mb-3 d-flex align-items-center">
                    <label for="birthday" class="mb-0 me-3" style="width: 100px;">생년월일</label>
                    <input
                      type="date"
                      class="form-control"
                      id="birthday"
                      v-model="memberInfo.birthday"
                      :disabled="!isEditing"
                      :style="{
                        width: '300px',
                        backgroundColor: 'white',
                        color: '#000',
                        borderRadius: '0',
                        border: isEditing ? '1px solid #6C97FD' : 'none' // 수정 모드에서 테두리 표시
                      }"
                      required
                    />
                  </div>
                  <div class="col-md-12 mb-3 d-flex align-items-center" v-if="role === 'TUTOR'">
                    <label for="introduce" class="mb-0 me-3" style="width: 100px;">자기 소개</label>
                    <input
                      type="text"
                      class="form-control"
                      id="introduce"
                      v-model="memberInfo.introduce"
                      :disabled="!isEditing"
                      :style="{
                        width: '300px',
                        backgroundColor: 'white',
                        color: '#000',
                        borderRadius: '0',
                        border: isEditing ? '1px solid #6C97FD' : 'none' // 수정 모드에서 테두리 표시
                      }"
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
          this.isEditing = false; // 수정 완료 후 수정 모드 종료
          alert("회원 정보가 업데이트 되었습니다.");
        } catch (error) {
          console.error("회원 정보 업데이트 중 오류 발생:", error);
          alert("회원 정보 업데이트에 실패했습니다.");
        }
      },
      selectImage() {
        this.$refs.fileInput.click();
      },
      onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/upload`, formData)
            .then(response => {
              this.memberInfo.profileImage = response.data.url;
              alert("프로필 이미지가 업로드 되었습니다.");
            })
            .catch(error => {
              console.error("이미지 업로드 중 오류 발생:", error);
              alert("프로필 이미지 업로드에 실패했습니다.");
            });
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
