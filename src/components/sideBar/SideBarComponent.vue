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
import { jwtDecode } from 'jwt-decode'

export default {
  data() {
    return {
      isLogin: false,
      profileUrl: null,
      userName: null,
      userRole: null,
      menuItems: [],

      count: 0,
      eventSource: null,
      member: "",
      title: "",
      price: "",
      applyId: "",
      eventList: [],
      alertDialogSSE: false,
      eventId: "",
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
    await this.checkLoginStatus()
        const storedEvents = localStorage.getItem('eventList')
        this.member = JSON.parse(localStorage.getItem('memberInfo'))
        if (storedEvents) {
            this.eventList = JSON.parse(storedEvents) // localStorage에서 불러오기
            this.count = this.eventList.length // 이벤트 리스트의 길이에 따라 카운트 설정
        }
        // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/payment-service/hello`)

        // console.log(response) 헬스체크 메서드 주석처리.
        
        // const token = localStorage.getItem('token')
        if (token) {
            let sse = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/subscribe`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            console.log("EventSource created") // 디버깅용 로그
            sse.addEventListener('connect', (event) => {
                console.log(event)
            });
            sse.addEventListener('notification', (event) => { // 'notification' 이벤트
                console.log('Notification event received:', event) // 이벤트 수신 확인
                if (event.data && event.data !== '""') {
                    const newEvent = JSON.parse(event.data)

                    // 중복 확인: 동일한 id의 알림이 있는지 확인
                    const isDuplicate = this.eventList.some(e => e.id === newEvent.id)

                    if (!isDuplicate) {
                        this.eventList.push(newEvent) // 중복이 아니면 리스트에 추가
                        this.count = this.eventList.length // 카운트 증가
                        localStorage.setItem('eventList', JSON.stringify(this.eventList)) // localStorage에 저장
                    }
                }
            });
        } else {
            console.log("Token not found"); // 토큰이 없을 경우
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
          { title: '내 강의', icon: 'book' },
          { title: '내 스케줄', icon: 'calendar_today', route: '/schedule' },
          { title: '신청 내역', icon: 'assignment', route: '/tutee-applied-list'},
          { title: '내 정보', icon: 'person', route: '/member/mypage' },
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
            this.alertDialogSSE = true
        },
        closeAlertListModal() {
            this.alertDialogSSE = false
        },
        async checkLoginStatus() {
            const token = localStorage.getItem('token')
            if (token) {
            
            this.isLogin = true;
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/infoGet`)
            
            this.member = response.data.result
            
            const memberInfo = {
                name: this.member.name,
                profileImage: this.member.profileImage
            }
            localStorage.setItem('memberInfo',JSON.stringify(memberInfo))
        
            }

        },
        login() {
            this.$router.push("/member/main") //김민성 수정
        },
        logout() {
            localStorage.clear();
            this.isLogin = false
            window.redirect
            window.location.href = '/home';
        },
        LecturePageBtn() {
            this.$router.push("/lecture")
        },
        LessonPageBtn() {
            this.$router.push("/lesson")
        },
        async goToAlertDetail(event){
            const messageType = event.messageType
            this.eventId = event.id
            // console.log(this.eventId)
            if(messageType === '결제요청'){
                try{
                    // 결제에 필요한 데이터 추출
                    const lectureApplyId = event.contents
                    await this.handlePaymentRequest(lectureApplyId)

                    // 결제 시작
                    this.initiatePayment() // initiatePayment()로 결제 요청 시작
                } catch(error){
                    console.error('결제 처리 중 오류 발생:', error)
                }
            }
        },
        async handlePaymentRequest(applyId) {
            try {
                const lectureApplyId = Number(applyId)
                this.applyId = lectureApplyId 

                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture/group/${lectureApplyId }`)
                this.title = response.data.result.lectureName
                this.price = response.data.result.price
                console.log('결제 요청 처리 결과:', response.data)
            } catch (error) {
                console.error('결제 요청 처리 중 오류 발생:', error)
            }
        },
        initiatePayment() {
            
            const IMP = window.IMP  // 아임포트 전역 객체
            IMP.init("imp00575764") // 아임포트 상점 고유코드로 초기화

            const paymentData = {
                pg: "html5_inicis", // 결제 PG사
                pay_method: "card", // 결제 방법
                merchant_uid: `merchant_${new Date().getTime()}`, // 주문번호
                name: this.title, // 결제 내역
                amount: this.price, // 결제 금액
                buyer_email: this.member.email,
                buyer_name: this.member.name,
                buyer_tel: this.member.phoneNumber,
            }

            IMP.request_pay(paymentData, this.processPayment) // 결제 요청
        },
        async processPayment(rsp){
            const token = localStorage.getItem('token')
            const decodedToken = jwtDecode(token)
            if(token){
                this.memberId = decodedToken.sub
            }
            if(rsp.success) {
                const data = {
                    impUid: rsp.imp_uid, // 아임포트 거래 고유번호
                    title: this.title,
                    price: this.price,
                    memberId: this.memberId,
                    id: this.applyId
                }

                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/payment-service/complete`, data)
                alert(response.data.responseMessage)

                const eventList = JSON.parse(localStorage.getItem('eventList')) || []
                const updatedEventList = eventList.filter(event => event.id !== this.eventId) // 결제된 알림 제거
                localStorage.setItem('eventList', JSON.stringify(updatedEventList))

            
                this.count = updatedEventList.length
                this.closeAlertListModal()
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
  bottom: 50px;
  width: 80px;
  align-items: center;
  cursor: pointer;
}
.logout:hover {
  font-weight: bold;
}
</style>