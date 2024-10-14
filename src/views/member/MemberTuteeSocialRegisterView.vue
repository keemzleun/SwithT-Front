<template>
  <v-container>
    <h1>TUTEE 추가 정보 입력 화면</h1>
    <br />

    <v-card>
      <v-card-text>
        <v-form @submit.prevent="addInfo">
          <!-- 이름 -->
          <v-row>
            <v-col><h2>이름</h2></v-col>
            <v-col>
              <v-text-field label="이름" v-model="name" required hide-details />
            </v-col>
          </v-row>

          <!-- 생년월일 -->
          <v-row>
            <v-col><h2>생년월일</h2></v-col>
            <v-col>
              <v-text-field
                label="생년월일"
                v-model="birthday"
                required
                hide-details
                type="date"
              />
            </v-col>
          </v-row>

          <!-- 성별 -->
          <v-row>
            <v-col><h2>성별</h2></v-col>
            <v-col>
              <v-select
                label="성별"
                v-model="displayGender"
                :items="['남성', '여성']"
                item-text="text"
                item-value="value"
                required
                hide-details
              ></v-select>
            </v-col>
          </v-row>

          <!-- 핸드폰 -->
          <v-row>
            <v-col><h2>핸드폰</h2></v-col>
            <v-col>
              <v-text-field
                label="핸드폰"
                v-model="phoneNumber"
                required
                hide-details
              />
            </v-col>
          </v-row>

          <!-- 주소 -->
          <v-row>
            <v-col><h2>주소</h2></v-col>
            <v-col>
              <v-text-field
                label="주소"
                v-model="address"
                required
                hide-details
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col><h2>프로필 이미지</h2></v-col>
            <v-col>
              <v-file-input
                label="프로필 이미지"
                accept="image/*"
                @change="fileUpdate"
                hide-details
              />
            </v-col>
          </v-row>

          <!-- 제출 버튼 -->
          <v-btn type="submit" block class="join-btn">회원가입</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode'

export default {
  data() {
    return {
      id: "",
      name: "",
      birthday: "",
      phoneNumber: "",
      address: "",
      gender: "",
      displayGender: "",
      role: "TUTEE",
      profileImage:
        "https://minseong-file.s3.ap-northeast-2.amazonaws.com/member/%ED%95%99%EC%83%9D%EC%9E%84%ED%8B%B0.png", // 디폴트 프로필 이미지
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
          phoneNumber: this.phoneNumber,
          gender: this.gender,
          address: this.address,
          profileImage: this.profileImage,
          role: this.role,
        };

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/AddInfoUpdate`, updateDate );
        
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
