<template>
    <v-container class="d-flex justify-center align-center" style="height: 100vh;">
      <v-card 
        class="pa-8" 
        outlined
      >
        
        <v-tabs 
          v-model="activeTab" 
          align-with-title
        >
          <v-tab value="tutor" style="flex: 1; text-align: center;">
            Tutor 로그인
          </v-tab>
          <v-tab value="tutee" style="flex: 1; text-align: center;" >
            Tutee 로그인
          </v-tab>

        </v-tabs>

        <v-tabs-window v-model="activeTab">
          <v-tabs-window-item value="tutor">
            
            <!-- Tutor 로그인 내용 -->
            <v-card-title class="text-center">튜터 asdasdasd로그인</v-card-title>
            
            <v-btn block color="yellow darken-2" class="mb-4" outlined>
              <v-icon left>mdi-chat</v-icon>카카오 계정으로 계속하기
            </v-btn>
            <v-btn block color="white" outlined>이메일로 계속하기</v-btn>
            
            <v-divider class="my-10"></v-divider>
            <v-card-subtitle class="text-center">튜터 회원가입</v-card-subtitle>
          </v-tabs-window-item>

          <v-tabs-window-item value="tutee">
            
            <!-- Tutee 로그인 내용 -->
            <v-card-title class="text-center">튜티 로그인</v-card-title>
            <v-btn block color="yellow darken-2" class="mb-4" outlined>
              <v-icon left>mdi-chat</v-icon>카카오 계정으로 계속하기
            </v-btn>
            <v-btn block color="white" outlined>이메일로 계속하기</v-btn>
            <v-divider class="my-4"></v-divider>
            <v-card-subtitle class="text-center">튜티 회원가입</v-card-subtitle>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-container>
  </template>

  <script>
  export default {
    data() {
      return {
        activeTab: 0,  // 탭 인덱스 (튜터 로그인이 기본값)
      };
    },
  };
  </script>

  <style scoped>
  .v-btn {
    font-weight: bold;
  }
  </style>