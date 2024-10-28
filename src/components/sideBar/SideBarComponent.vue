<template>
  <section v-if="isLogin" class="side-bar">
      <div class="profile" >
        <div style="position: relative;">
          <v-avatar class="profile-image" style="height: 80px; width: 80px; border: 4px solid #6C97FD">
            <v-img :src="profileUrl" ></v-img>
          </v-avatar>
          <div @click="openAlertListModal()" style="position: absolute; right: 0; bottom: 0; background-color: #6C97FD; color: #fff; width: 35px; border-radius: 8px">
            <span>{{ count }}</span>
          </div>
        </div>
        <v-dialog v-model="alertDialogSSE" style="width: 700px">
          <v-card>
            <v-card-title style="text-align: center;">
              <v-row>
                <!-- 결제 알림 탭 -->
                <v-col
                  :class="{ 'highlight': selectedTab === 'payment' }"
                  style="cursor: pointer;"
                  @click="selectTab('payment')"
                >
                  결제 알림
                </v-col>
      
                <!-- 일반 알림 탭 -->
                <v-col
                  :class="{ 'highlight': selectedTab === 'general' }"
                  style="cursor: pointer;"
                  @click="selectTab('general')"
                >
                  일반 알림
                </v-col>
              </v-row>
            </v-card-title>
      
            <v-card-text>
              <!-- 알림 목록 표시 -->
              <div v-if="filteredEventList.length === 0">
                새로운 알림이 없습니다.
              </div>
              <div v-else>
                <ul>
                  <li
                    v-for="event in filteredEventList"
                    :key="event.id"
                    @click="goToAlertDetail(event)"
                  >
                    {{ event.title }}
                  </li>
                </ul>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
  
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
  import { EventSourcePolyfill } from 'event-source-polyfill'
  
  export default {
    data() {
      return {
        isLogin: false,
        profileUrl: null,
        userName: null,
        userRole: null,
        menuItems: [],
        eventSource: null,
        member: "",
        title: "",
        price: "",
        applyId: "",
        eventList: [],
        alertDialogSSE: false,
        selectedTab: 'general',
        paymentEvents: [], // 결제 알림을 저장할 배열
        generalEvents: [], // 일반 알림을 저장할 배열
        count: 0,
        eventId: "",
      };
    },
    watch:{
      paymentEvents: {
        handler() {
          this.setAlertCount();
        },
        deep: true, // 배열 내부의 요소 변화를 감지
      },
      generalEvents: {
        handler() {
          this.setAlertCount();
        },
        deep: true, // 배열 내부의 요소 변화를 감지
      },
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
        
        this.setMenuItems();
      }
  
      await this.checkLoginStatus();
  
      // localStorage에서 알림 데이터를 불러옴
      const storedPaymentEvents = localStorage.getItem('paymentEvents');
      const storedGeneralEvents = localStorage.getItem('generalEvents');
      
      if (storedPaymentEvents) {
        this.paymentEvents = JSON.parse(storedPaymentEvents); // 결제 알림 불러오기
      }
      if (storedGeneralEvents) {
        this.generalEvents = JSON.parse(storedGeneralEvents); // 일반 알림 불러오기
      }

      this.count = this.paymentEvents.length + this.generalEvents.length;
  
      // SSE 연결 설정
      if (token) {
        let sse = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/subscribe`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
  
        sse.addEventListener('notification', (event) => {
          console.log('Notification event received:', event);
          if (event.data && event.data !== '""') {
            const newEvent = JSON.parse(event.data);
  
            // 중복 확인: 동일한 id의 알림이 있는지 확인
            const isDuplicatePayment = this.paymentEvents.some(e => e.id === newEvent.id);
            const isDuplicateGeneral = this.generalEvents.some(e => e.id === newEvent.id);
  
            // 결제 알림일 경우
            if (newEvent.messageType === '결제요청' && !isDuplicatePayment) {
              this.paymentEvents.push(newEvent);
              localStorage.setItem('paymentEvents', JSON.stringify(this.paymentEvents)); // 저장
            } 
            // 일반 알림 처리
            else if (newEvent.messageType !== 'WAITING-SUCCESS' && newEvent.messageType !== '결제요청' && !isDuplicateGeneral) {
              this.generalEvents.push(newEvent);
              localStorage.setItem('generalEvents', JSON.stringify(this.generalEvents)); // 저장
            }
  
            // 전체 알림 개수 업데이트
            this.count = this.paymentEvents.length + this.generalEvents.length;
          }
        });
      } else {
        console.log("Token not found");
      }
    },

    computed: {
      filteredEventList() {
        if (this.selectedTab === 'payment') {
          return this.paymentEvents;
        } else {
          return this.generalEvents;
        }

      }
    },
    methods: {
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
            { title: '채팅', icon: 'chat' , route: '/chat-room?chatRoomId='},
            { title: '내 강의', icon: 'book', route: '/tutee-my-lecture-list'},
            { title: '내 스케줄', icon: 'calendar_today', route: '/schedule' },
            { title: '신청 내역', icon: 'assignment', route: '/tutee-applied-list'},
            { title: '내 정보', icon: 'person', route: '/member/mypage' },
            { title: '내 결제내역', icon: 'payments', route: 'payments/list' },
          ];
        } else if (this.userRole === 'TUTOR') {
          this.menuItems = [
            { title: '채팅', icon: 'chat' , route: '/chat-room?chatRoomId='},
            { title: '내 강의', icon: 'book', route:'/tutor-lecture-list'},
            { title: '내 스케줄', icon: 'calendar_today', route: '/schedule' },
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
      openAlertListModal() {
          this.alertDialogSSE = true;
      },
      closeAlertListModal() {
          this.alertDialogSSE = false;
      },
      async checkLoginStatus() {
          const token = localStorage.getItem('token');
          if (token) {
              this.isLogin = true;
              const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/infoGet`);
              this.member = response.data.result;
              const memberInfo = {
                  name: this.member.name,
                  profileImage: this.member.profileImage
              };
              localStorage.setItem('memberInfo', JSON.stringify(memberInfo));
          }
      },
      login() {
          this.$router.push("/member/main"); //김민성 수정
      },
      logout() {
          localStorage.clear();
          this.isLogin = false;
          window.redirect;
          window.location.href = '/home';
      },
      async goToAlertDetail(event) {
        const messageType = event.messageType;
        this.eventId = event.id;
  
        if (messageType === '결제요청') {
          try {
            this.$router.push('/tutee-applied-list'); // 결제 알림의 경우 리다이렉트
          } catch (error) {
            console.error('결제 처리 중 오류 발생:', error);
          }
        }
  
        this.alertDialogSSE = false;
      },
      setAlertCount() {
        this.count = this.paymentEvents.length + this.generalEvents.length;
      },
      selectTab(tab) {
        this.selectedTab = tab;
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
  top: 0;
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
  bottom: 50px;
  width: 80px;
  align-items: center;
  cursor: pointer;
}
.logout:hover {
  font-weight: bold;
}
.highlight {
  font-weight: bold;
  background-color: grey;
}
</style>  
