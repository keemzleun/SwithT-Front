<template>
  <div class="container mt-15">
    <h3 class="text-center mb-4">회원 정보 입력</h3>
    <hr />

    <form @submit.prevent="addInfo">
      <!-- 이름 -->
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

      <!-- 생년월일 -->
      <div class="form-group row mb-3">
        <label for="birthday" class="col-sm-2 col-form-label">생년월일</label>
        <div class="col-sm-10">
          <input
            type="date"
            id="birthday"
            class="form-control"
            v-model="birthday"
            required
          />
        </div>
      </div>

      <!-- 성별 -->
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

      <!-- 핸드폰 -->
      <div class="form-group row mb-3">
        <label for="phoneNumber" class="col-sm-2 col-form-label">핸드폰</label>
        <div class="col-sm-10">
          <input
            type="tel"
            id="phoneNumber"
            class="form-control"
            placeholder="핸드폰 번호를 입력하세요."
            v-model="phoneNumber"
            required
          />
        </div>
      </div>

      <!-- 주소 -->
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

      <!-- 학력 -->
      <div class="form-group row mb-3">
        <label for="education" class="col-sm-2 col-form-label">학력</label>
        <div class="col-sm-10">
          <select id="education" class="form-control" v-model="education" required>
            <option value="" disabled>학력을 선택하세요</option>
            <option value="학사">학사</option>
            <option value="석사">석사</option>
            <option value="박사">박사</option>
          </select>
        </div>
      </div>

      <!-- 자기 소개 -->
      <div class="form-group row mb-3">
        <label for="introduce" class="col-sm-2 col-form-label">자기 소개</label>
        <div class="col-sm-10">
          <textarea
            id="introduce"
            class="form-control"
            placeholder="자기 소개를 입력하세요."
            v-model="introduce"
            required
          ></textarea>
        </div>
      </div>

      <!-- 제출 버튼 -->
      <div class="form-group row mb-3 text-center mt-4">
        <div class="col-sm-12">
          <button 
            type="submit" 
            class="btn"
            style="background-color: #6C97FD; color: white; border: none;"
          >
            완료
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
export default {
  data() {
    return {
      name: "",
      birthday: "",
      phoneNumber: "",
      introduce: "",
      address: "",
      education: "",
      gender: "",
      displayGender: "",
      role: "",
      profileImage:
        "https://minseong-file.s3.ap-northeast-2.amazonaws.com/member/%ED%95%99%EC%83%9D%EC%9E%84%ED%8B%B0.png",
    };
  },
  mounted() {
    // 쿠키에서 id와 role 값을 가져와서 셋팅
    this.id = Cookies.get("memberId");
    this.role = Cookies.get("role");
  },
  methods: {
    async addInfo() {
      try {
        this.gender = this.displayGender === "남성" ? "MAN" : "WOMAN";

        const updateDate = {
          id: this.id,
          name: this.name,
          birthday: this.birthday,
          introduce: this.introduce,
          phoneNumber: this.phoneNumber,
          gender: this.gender,
          address: this.address,
          role: this.role,
          education: this.education,
          profileImage: this.profileImage,
        };

        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/member/AddInfoUpdate`,
          updateDate
        );

        console.log("추가 정보 입력 성공");

        const token = response.data.result.token;
        const refreshToken = response.data.result.refreshToken;
        const role = jwtDecode(token).role;
        const id = response.data.result.id;

        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);
        localStorage.setItem("id", id);

        this.$router.push("/member/wellcome");
      } catch (e) {
        const error_message =
          e.response?.data?.error_message ||
          "추가정보 입력 중 오류가 발생했습니다.";
        console.error(error_message);
        alert(error_message);
      }
    },
  },
};
</script>
<style></style>
