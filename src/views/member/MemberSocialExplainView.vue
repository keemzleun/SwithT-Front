<template>
  <div>
    <h1>SwithT에 처음 오셨군요, 추가 정보를 입력하러 이동하시겠습니까?</h1>
    <v-btn @click="navigateToRegister">
      계속하기
    </v-btn>
  </div>
</template>

<script>
import Cookies from 'js-cookie'; // js-cookie 라이브러리 import

export default {
  methods: {
    navigateToRegister() {
      const role = Cookies.get('role'); // 쿠키에서 role을 읽어옴

      // role 값에 따라 라우팅 처리
      if (role === 'TUTOR') {
        this.$router.push('/member/social/register/tutor'); // 튜터 추가 정보 입력 화면으로 이동
      } else if (role === 'TUTEE') {
        this.$router.push('/member/social/register/tutee'); // 튜티 추가 정보 입력 화면으로 이동
      } else {
        // role이 없거나 다른 경우 기본 경로로 이동
        this.$router.push('/member/social/register');
      }
    }
  }
};
</script>

<style>
</style>
