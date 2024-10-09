<template>
    <v-container class="d-flex justify-center align-center" style="height: 65vh;">
      <v-card 
        class="pa-16" 
        outlined
        style="width: 800px; height: 500px; background-color: #FFF490;"
      >
      <v-tabs v-model="activeTab" background-color="#fff9db" grow centered>
        <v-tab style="font-weight: bold; color: black;">TUTOR 로그인</v-tab>
        <v-tab style="font-weight: bold; color: black;">TUTEE 로그인</v-tab>
      </v-tabs>
  
        <v-tabs-window v-model="activeTab"> 
          <v-tabs-window-item value="tutor">
            <br>
            <br>
            <v-btn :to="{ path: '/member/email/login' }" block style="height: 50px; width: 100%;" outlined >
                이메일로 로그인
            </v-btn>
            <br>
            <v-btn 
              block 
              style="height: 50px; width: 100%; background-color: #FEE500; color: black;" 
              outlined
              @click="redirectToKakao"
            >
              <v-icon left>mdi-chat</v-icon>카카오 계정으로 로그인
            </v-btn>
            <br>
            <v-btn 
              block 
              style="height: 50px; width: 100%; background-color: white; color: #4285F4;" 
              outlined
              @click="redirectToGoogle"
            >
              <v-icon left>mdi-google</v-icon>구글 계정으로 로그인
            </v-btn>
            <v-divider class="my-4"></v-divider>
            <v-card-subtitle class="text-center">
              <router-link :to="{ path: '/member/email/register' }">
                <h3>TUTOR 회원가입</h3>
              </router-link>
            </v-card-subtitle>
          </v-tabs-window-item> 
          <!-- v-tabs-window-item 1개 -->
  
          <v-tabs-window-item value="tutee">
            <br>
            <br>
            <v-btn :to="{ path: '/member/email/login' }" block style="height: 50px; width: 100%;" outlined>
                이메일로 로그인
            </v-btn>
            <br>
            <v-btn 
              block 
              style="height: 50px; width: 100%; background-color: #FEE500; color: black;" 
              outlined
              @click="redirectToKakao"
            >
              <v-icon left>mdi-chat</v-icon>카카오 계정으로 계속하기
            </v-btn>
            <br>
            <v-btn 
              block 
              style="height: 50px; width: 100%; background-color: white; color: #4285F4;" 
              outlined
              @click="redirectToGoogle"
            >
              <v-icon left>mdi-google</v-icon>구글 계정으로 계속하기
            </v-btn>
  
            <v-divider class="my-4"></v-divider>
            <v-card-subtitle class="text-center">
              <router-link :to="{ path: '/member/TuteeEmailRegisterView' }">
                <h3>TUTEE 회원가입</h3>
              </router-link>
            </v-card-subtitle>
          </v-tabs-window-item>

        </v-tabs-window>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activeTab: 0,
      };
    },
    methods: {
      redirectToGoogle() {
        window.location.href = 'http://localhost:8080/member-service/oauth2/authorization/google' 
      },
      redirectToKakao() {
        window.location.href = 'http://localhost:8080/member-service/oauth2/authorization/kakao' 
      }
    }
  };
  </script>
  
  <style scoped>
  .v-btn {
      font-weight: bold;
  }
  </style>
  