<template>
    <v-container class="d-flex justify-center align-center" style="height: 65vh;">
      <v-card 
        class="pa-16" 
        outlined
        style="width: 800px; height: 500px;"
      >
        <v-tabs v-model="activeTab" align-with-title>
          <v-tab value="tutor">튜터 로그인</v-tab>
          <v-tab value="tutee">튜티 로그인</v-tab>
        </v-tabs>
  
        <v-tabs-window v-model="activeTab"> 
          <v-tabs-window-item value="tutor">
            <br>
            <br>
            <v-btn :to="{ path: '/member/MemberEmailLoginView' }" block style="height: 50px; width: 100%;" outlined >
                이메일로 로그인
            </v-btn>
            <v-btn 
              block 
              style="height: 50px; width: 100%; background-color: #FEE500; color: black;" 
              outlined
              @click="redirectToKakao"
            >
              <v-icon left>mdi-chat</v-icon>카카오 계정으로 로그인
            </v-btn>
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
                <router-link :to="{ path: '/member/TutorEmailRegisterView' }">
                    <h3>튜터 회원가입</h3>
                  </router-link>
            </v-card-subtitle>
          </v-tabs-window-item>
  
          <v-tabs-window-item value="tutee">
            <br>
            <br>
            <v-btn block style="height: 50px; width: 100%;" outlined>
                이메일로 계속하기
            </v-btn>
            <v-btn 
              block 
              style="height: 50px; width: 100%; background-color: #FEE500; color: black;" 
              outlined
              @click="redirectToKakao"
            >
              <v-icon left>mdi-chat</v-icon>카카오 계정으로 계속하기
            </v-btn>
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
                <h3>튜티 회원가입</h3>
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
  