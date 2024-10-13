<template>
  <v-container class="d-flex justify-center align-center" style="height: 65vh">
    <v-card 
      class="pa-8" 
      outlined 
      style="background-color: ; width: 800px; height: 400px; border-radius: 25px">
      
      <!-- 탭 메뉴 -->
      <v-tabs v-model="activeTab" background-color="#FFF490" grow centered>
        <v-tab style="font-weight: bold; color: black;">TUTOR 로그인</v-tab>
        <v-tab style="font-weight: bold; color: black;">TUTEE 로그인</v-tab>
      </v-tabs>

      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item value="tutor">
          <!-- 튜터 로그인 -->
          <v-form @submit.prevent="doLogin" class="pa-4">
            <v-text-field
              label="이메일"
              v-model="email"
              type="email"
              solo
              required
              hide-details
            ></v-text-field>
            <v-text-field
              label="비밀번호"
              v-model="password"
              type="password"
              solo
              required
              hide-details
            ></v-text-field>

            <v-btn color="#70b8ff" class="mx-auto mt-3" large style="width: 700px;" type="submit">
              로그인
            </v-btn>

            <div class="text-center mt-3">
              <a href="/member/email/register/tutor" class="no-underline">TUTOR 회원가입</a>
            </div>
          </v-form>
        </v-tabs-window-item>
        
        <v-tabs-window-item>
          <!-- 튜티 로그인 -->
          <v-form @submit.prevent="doLogin" class="pa-4">
            <v-text-field
              label="아이디"
              v-model="email"
              type="email"
              solo
              required
              hide-details
            ></v-text-field>
            <v-text-field
              label="비밀번호"
              v-model="password"
              type="password"
              solo
              required
              hide-details
            ></v-text-field>

            <v-btn color="#70b8ff" class="mx-auto mt-3" large style="width: 700px;" type="submit">
              로그인
            </v-btn>

            <div class="text-center mt-3">
              <a href="/member/email/register/tutee" class="no-underline">TUTEE 회원가입</a>
            </div>
          </v-form>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export default {
  data() {
    return {
      activeTab: 0, // 기본 탭을 튜터 로그인으로 설정
      email: "",
      password: ""
    };
  },
  methods: {
    async doLogin() {
      try {
        const loginData = {
          email: this.email,
          password: this.password,
        };

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/doLogin`, loginData);
        console.log("로그인 성공");

        const token = response.data.result.token;
        const refreshToken = response.data.result.refreshToken;
        const role = jwtDecode(token).role;
        const id = response.data.result.id;

        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', role);
        localStorage.setItem('id', id);

        window.location.href = "/home";

      } catch (e) {
        const error_message = e.response.data.error_message;
        console.error(error_message);
        alert(error_message); // 추후 수정 할 것.
      }
    },
  }
};
</script>

<style scoped>
.v-btn {
  font-weight: bold;
  border-radius: 20px;
}
.v-text-field input {
  border-radius: 10px;
}
a {
  color: black;
  font-weight: bold;
}
.no-underline {
  text-decoration: none; /* 언더라인 제거 */
}
.no-underline:hover {
  text-decoration: underline; /* 마우스 오버 시 언더라인 추가 */
}
</style>
