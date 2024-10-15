<template>
  <div class="container mt-15">
    <h3 class="text-center mb-4">TUTEE 회원 가입</h3>
    <hr />
    <form @submit.prevent="handleSubmit">
      <div class="form-group row mb-3">
        <label for="email" class="col-sm-2 col-form-label">이메일</label>
        <div class="col-sm-10">
          <input
            type="email"
            id="email"
            class="form-control"
            placeholder="이메일을 입력하세요."
            v-model="email"
            required
          />
        </div>
      </div>

      <div class="form-group row mb-3">
        <label for="verificationCode" class="col-sm-2 col-form-label">인증 코드</label>
        <div class="col-sm-10 d-flex align-items-center">
          <input
            type="text"
            id="verificationCode"
            class="form-control me-2"
            placeholder="인증 코드를 입력하세요."
            v-model="otp"
            required
          />
          <button
            v-if="!codeSent"
            @click="requestVerificationCode"
            class="btn"
            type="button"
            style="background-color: #6C97FD; color: white; border: none; width: 100px;"
          >
            코드 전송
          </button>
          <button
            v-else-if="!verificationSuccess"
            @click="verifyCode"
            class="btn"
            type="button"
            style="background-color: #82D691; color: white; border: none; width: 100px;"
          >
            코드 인증
          </button>
          <button v-else class="btn btn-secondary" disabled style="width: 120px;">
            인증 완료
          </button>
        </div>
      </div>

      <div class="form-group row mb-3">
        <label for="password" class="col-sm-2 col-form-label">비밀번호</label>
        <div class="col-sm-10">
          <input
            type="password"
            id="password"
            class="form-control"
            placeholder="비밀번호를 입력하세요."
            v-model="password"
            required
          />
        </div>
      </div>

      <div class="form-group row mb-3">
        <label for="passwordConfirm" class="col-sm-2 col-form-label">비밀번호 확인</label>
        <div class="col-sm-10">
          <input
            type="password"
            id="passwordConfirm"
            class="form-control"
            placeholder="비밀번호를 다시 입력하세요."
            v-model="passwordConfirm"
            required
          />
        </div>
      </div>

      <div class="form-group row mb-3">
        <label for="name" class="col-sm-2 col-form-label">이름</label>
        <div class="col-sm-10">
          <input
            type="text"
            id="name"
            class="form-control"
            placeholder="이름을 입력하세요."
            v-model="name"
            required
          />
        </div>
      </div>

      <div class="form-group row mb-3">
        <label class="col-sm-2 col-form-label">성별</label>
        <div class="col-sm-10 text-left">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="gender"
              id="male"
              value="남성"
              v-model="displayGender"
              required
            />
            <label class="form-check-label" for="male">남성</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="gender"
              id="female"
              value="여성"
              v-model="displayGender"
            />
            <label class="form-check-label" for="female">여성</label>
          </div>
        </div>
      </div>

      <div class="form-group row mb-3">
        <label for="birthDate" class="col-sm-2 col-form-label">생년월일</label>
        <div class="col-sm-10">
          <input
            type="date"
            id="birthDate"
            class="form-control"
            v-model="birthday"
            required
          />
        </div>
      </div>

      <div class="form-group row mb-3">
        <label for="address" class="col-sm-2 col-form-label">주소</label>
        <div class="col-sm-10">
          <input
            type="text"
            id="address"
            class="form-control"
            placeholder="주소를 입력하세요."
            v-model="address"
            required
          />
        </div>
      </div>

      <div class="form-group row mb-3">
        <label for="phoneNumber" class="col-sm-2 col-form-label">휴대전화</label>
        <div class="col-sm-10">
          <input
            type="tel"
            id="phoneNumber"
            class="form-control"
            placeholder="휴대전화를 입력하세요."
            v-model="phoneNumber"
            required
          />
        </div>
      </div>

      <div class="form-group row mb-3">
        <label for="profileImage" class="col-sm-2 col-form-label">프로필 이미지</label>
        <div class="col-sm-10">
          <input
            type="file"
            id="profileImage"
            class="form-control file-input"
            @change="fileUpdate"
            accept="image/*"
          />
        </div>
      </div>


      <div class="form-group row mb-3 text-center mt-4">
        <div class="col-sm-12">
          <button 
          type="submit" 
          class="btn"
          style="background-color: #6C97FD; color: white; border: none;"
          >가입하기</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      // 회원가입 form data
      name: "",
      email: "",
      password: "",
      birthday: "",
      phoneNumber: "",
      address: "",
      gender: "",
      displayGender: "",
      role: "TUTEE", // 튜터 회원가입 페이지이므로 TUTOR로 명시할 것.
      otp: "",
      profileImage: null, // 프로필 이미지 초기화

      // 인증 코드 관련 상태
      codeSent: false,
      verificationSuccess: false,
    };
  },
  methods: {
    async handleSubmit() {
      // 회원 가입 폼 제출 처리
      try {
        // 성별 값 설정
        this.gender = this.displayGender === "남성" ? "MAN" : "WOMAN";

        let registerData = new FormData();
        const data = {
          name: this.name,
          email: this.email,
          password: this.password,
          birthday: this.birthday,
          phoneNumber: this.phoneNumber,
          gender: this.gender,
          address: this.address,
          role: this.role,
        };

        registerData.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );
        registerData.append("file", this.profileImage); // 이미지 파일 추가

        await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/member/create`,
          registerData
        );
        alert("회원 가입 성공");
        this.$router.push("/member/email/login");
      } catch (e) {
        const error_message =
          e.response?.data?.error_message || "회원가입 중 오류가 발생했습니다.";
        console.error(error_message);
        alert(error_message);
      }
    },
    async requestVerificationCode() {
      try {
        
        this.codeSent = true;

        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/email/requestCode?email=${this.email}`
        );
        alert(response.data.status_message);
      } catch (error) {
        console.error(error);
        this.codeSent = false;
        alert("이메일 인증 코드 전송에 실패했습니다.");
      }
    },
    async verifyCode() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/email/requestCode?email=${this.email}&code=${this.otp}`
        );
        alert(response.data.status_message);
        this.verificationSuccess = true;
      } catch (error) {
        console.error(error);
        this.verificationSuccess = false;
        alert("인증 코드가 올바르지 않습니다.");
      }
    },
    fileUpdate(event) {
      this.profileImage = event.target.files[0]; // 파일 선택 시 profileImage에 저장
    },
  },
};
</script>

<style scoped>
.form-group {
  width: 75%;
  margin: 0 auto;
}

.file-input {
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
}
</style>
