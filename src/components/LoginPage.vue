<template>
    <div>
      <h2>로그인</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">아이디:</label>
          <input type="text" v-model="email" id="email" required />
        </div>
        <div>
          <label for="password">비밀번호:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit">로그인</button>
      </form>
      <div v-if="errorMessage">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        errorMessage: '',
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/doLogin`, {
            email: this.email,
            password: this.password,
          });
          console.log(this.email)
  
          localStorage.setItem('token', response.data.result.token);
          alert('로그인 성공!');
        } catch (error) {
          this.errorMessage = '로그인 실패: 잘못된 아이디 또는 비밀번호.';
          console.error('로그인 오류:', error);
        }
      },
    },
  };
  </script>
  