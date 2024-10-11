<template>
  <v-container>
    <h1>TUTEE 소셜 추가 정보 입력 화면</h1>
    <v-form @submit.prevent="memberAddInfo">
      <v-text-field v-model="name" label="Name" required></v-text-field>

      <v-text-field
        v-model="introduce"
        label="Introduce"
        placeholder="Introduce yourself"
      ></v-text-field>

      <v-date-picker
        v-model="birthday"
        label="Birthday"
        required
      ></v-date-picker>

      <v-select
        v-model="gender"
        :items="['MALE', 'FEMALE']"
        label="Gender"
        required
      ></v-select>

      <v-text-field
        v-model="phoneNumber"
        label="Phone Number"
        required
      ></v-text-field>

      <v-text-field
        v-model="education"
        label="Education"
        placeholder="Your education level"
      ></v-text-field>

      <v-text-field
        v-model="address"
        label="Address"
        placeholder="Your address"
      ></v-text-field>

      <v-file-input
        label="Profile Image"
        @change="fileUpdate"
        accept="image/*"
      ></v-file-input>

      <v-btn type="submit" color="primary">Submit</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import Cookies from "js-cookie"; // Assuming you're using the 'js-cookie' package to handle cookies

export default {
  data() {
    return {
      id: "", // ID from cookie
      name: "", // 이름
      introduce: "", // 자기소개
      birthday: "", // 생년월일
      gender: "", // 성별
      phoneNumber: "", // 휴대폰 번호
      education: "", // 학력
      address: "", // 주소
      profileImage: null, // 프로필 이미지
      avgScore: 0.0, // 평균 점수
      role: "", // 역할 from cookie
    };
  },
  mounted() {
    // 쿠키에서 id와 role 값을 가져와서 셋팅
    this.id = Cookies.get("id");
    this.role = Cookies.get("role");
  },
  methods: {
    async memberAddInfo() {
      // 서버로 전송할 데이터를 구성합니다.
      const memberData = {
        id: this.id, // 쿠키에서 가져온 값
        name: this.name,
        introduce: this.introduce,
        birthday: this.birthday,
        gender: this.gender,
        phoneNumber: this.phoneNumber,
        education: this.education,
        address: this.address,
        profileImage: this.profileImage, // 이미지는 현재 null로 설정됨 (추후 필요시 처리)
        avgScore: this.avgScore,
        role: this.role, // 쿠키에서 가져온 값
      };

      try {
        // 백엔드에 회원 추가 정보 전송
        const response = await this.$http.post(
          "/member/AddInfoUpdate",
          memberData
        );

        // 성공 시 토큰 처리
        if (response.data && response.status === 200) {
          const loginInfo = response.data.data; // CommonResDto의 data 부분에서 정보를 받음
          const token = loginInfo.token;
          const refreshToken = loginInfo.refreshToken;

          // 로컬 스토리지에 토큰 저장
          localStorage.setItem("accessToken", token);
          localStorage.setItem("refreshToken", refreshToken);

          // 추가로 필요한 로직 (예: 페이지 이동)
          this.$router.push({ name: "home" }); // 회원 정보 추가 후 홈으로 이동
        }
      } catch (error) {
        console.error("회원 추가 정보 입력 중 오류 발생: ", error);
      }
    },
    fileUpdate(event) {
      // 프로필 이미지 파일을 처리하는 함수
      const file = event.target.files[0];
      if (file) {
        this.profileImage = file;
      }
    },
  },
};
</script>

<style scoped>
/* 스타일을 필요에 맞게 추가 */
</style>
