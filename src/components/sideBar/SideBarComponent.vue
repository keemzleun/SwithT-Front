<template>
<div class="side-bar">
    <div class="profile">
      <div class="profile-image"></div>
      <div class="profile-name">님</div>
    </div>
    <hr style="margin-bottom: 10px">
    <div class="side-menu">
      <div class="menu-list" v-for="(menu, index) in menuItems" :key="index">
        <span class="material-icons menu-icon">{{ menu.icon }}</span>
        <div class="menu-title">{{ menu.title }}</div>
      </div>
    </div>
    <div class="login" @click="logout">로그아웃</div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      userName: '사용자 이름', // 실제 사용자 이름으로 변경 필요
      userRole: 'tutee', // 또는 'tutor'로 변경 필요
      menuItems: []
    };
  },
  methods: {
    logout() {
      // 로그아웃 처리 로직 추가
      console.log("로그아웃");
    },
    setMenuItems() {
      if (this.userRole === 'tutee') {
        this.menuItems = [
          { title: '채팅', icon: 'chat' },
          { title: '내 강의', icon: 'book' },
          { title: '내 스케줄', icon: 'calendar_today' },
          { title: '신청 내역', icon: 'assignment' },
          { title: '내 정보', icon: 'person' },
        ];
      } else if (this.userRole === 'tutor') {
        this.menuItems = [
          { title: '채팅', icon: 'chat' },
          { title: '내 강의', icon: 'book' },
          { title: '내 스케줄', icon: 'calendar_today' },
          { title: '강의 신청 내역', icon: 'assignment' },
          { title: '리뷰 관리', icon: 'rate_review' },
          { title: '정산금 관리', icon: 'monetization_on' },
          { title: '내 정보', icon: 'person' },
        ];
      }
    }
  },
  created() {
    this.setMenuItems();
  }
};
</script>

<style scoped>
.side-bar {
  width: 120px;
  height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  position: fixed;
  right: 0;
}


.profile {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-direction: column;
}

.profile-image {
  width: 50px;
  height: 50px;
  background-color: gray;
  border-radius: 50%;
  margin: 10px;
}

.menu-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
}

.menu-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.menu-title {
  font-weight: bold;
  align-items: center;
}

.login {
  cursor: pointer;
  margin-top: 20px;

}
</style>