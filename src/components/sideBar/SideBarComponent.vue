<template>
<section v-if="isLogin" class="side-bar">
    <div class="profile">
        <v-avatar class="profile-image" style="height: 70px; width: 70px;">
          <v-img :src="profileUrl" ></v-img>
        </v-avatar>
      <div class="profile-name">
        <span style="font-weight: 700">{{userName}}</span>
        <span> 님</span>
      </div>
    </div>
    <hr style="margin-bottom: 10px">
    <div class="side-menu">
      <div class="menu-list" v-for="(menu, index) in menuItems" :key="index" @click="navigateTo(menu.title)">
        <span class="material-icons menu-icon">{{ menu.icon }}</span>
        <div class="menu-title">{{ menu.title }}</div>
      </div>
    </div>
    <div class="logout" @click="logout">로그아웃</div>
</section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isLogin: false,
      profileUrl: null,
      userName: null,
      userRole: null,
      menuItems: []
    };
  },
  async created() {
    await this.getMyInfo();
    const token = localStorage.getItem('token');
      if (token) {
        this.isLogin = true;
        this.userRole = localStorage.getItem('role');
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/infoGet`);
        this.profileUrl = response.data.profileImage;
        this.profileUrl = localStorage.getItem('profileImage');
        this.userName = localStorage.getItem('name');
        
        console.log(this.userRole);
        this.setMenuItems();
      }
  },
  methods: {
    logout() {
      localStorage.clear();
      window.location.reload();
    },
    async getMyInfo() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/infoGet`);
        this.profileUrl = response.data.profileImage;
        this.userName = response.data.name;
        this.userRole = response.data.role;
      } catch (e) {
        console.log(e);
      }
    },
    setMenuItems() {
      if (this.userRole === 'TUTEE') {
        this.menuItems = [
          { title: '채팅', icon: 'chat' },
          { title: '내 강의', icon: 'book' },
          { title: '내 스케줄', icon: 'calendar_today' },
          { title: '신청 내역', icon: 'assignment', route: '/tutee-applied-list'},
          { title: '내 정보', icon: 'person', route: '/member/mypage' },
        ];
      } else if (this.userRole === 'TUTOR') {
        this.menuItems = [
          { title: '채팅', icon: 'chat' },
          { title: '내 강의', icon: 'book' },
          { title: '내 스케줄', icon: 'calendar_today' },
          { title: '신청 내역', icon: 'assignment', route: '/tutor-applied-list'},
          { title: '리뷰 관리', icon: 'rate_review' },
          { title: '정산금 관리', icon: 'monetization_on' },
          { title: '내 정보', icon: 'person', route: '/member/mypage' },
        ];
      } else if (this.userRole === 'ADMIN') {
        this.menuItems = [
          { title: '승인 관리', icon: 'assignment', route: '/admin-applied-list' },
          { title: '정산금 관리', icon: 'monetization_on' },
        ]
      }
    },
    navigateTo(title) {
        const menuItem = this.menuItems.find(item => item.title === title);
        if (menuItem && menuItem.route) {
            this.$router.push(menuItem.route); // Vue Router를 통해 이동
        }
    },
  },  
};
</script>

<style scoped>
.side-bar {
  width: 120px;
  height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  position: fixed;
  z-index: 2 !important;
  right: 0;
}
.profile {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-direction: column;
}
.profile-image {
  object-fit: cover;
}
.profile-name {
  margin-top: 15px;
}
.menu-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
}
.menu-list:hover {
    background-color: #EEE;
    border-radius: 10px;
    cursor: pointer;
}
.menu-icon {
  font-size: 32px;
  margin-bottom: 10px;
}
.menu-title {
  font-weight: bold;
  align-items: center;
  font-size: 14px;
}
.logout {
  position: absolute;
  bottom: 120px;
  width: 80px;
  align-items: center;
  cursor: pointer;
}
.logout:hover {
  font-weight: bold;
}
</style>