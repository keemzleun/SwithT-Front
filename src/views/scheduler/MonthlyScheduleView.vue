<template>
  <div class="calendar-wrapper">
    <div class="sidebar">
      <!-- <div class="today-schedule " v-if="sortedTodayEvents.length!=0">
        <h5><strong>오늘의 일정</strong></h5>
        <v-row v-for="event in sortedTodayEvents" :key="event.id">
        <v-card
        variant="outlined"
        class="mx-auto mb-3 mt-1"
        color="surface-variant"
        max-width="344"
        :subtitle="event.title+' - ' +formatTime(event.start)"
      >
      </v-card>
    </v-row>
    <v-row>
      <v-card
      variant="outlined"
      class="mx-auto mb-3 mt-1"
      color="surface-variant"
      max-width="344"
      :subtitle="'체크체크'+' - ' + '09:33'"
    >
    </v-card>
    </v-row>
    <v-row>
      <v-card
      variant="outlined"
      class="mx-auto mb-3 mt-1"
      color="surface-variant"
      max-width="344"
      :subtitle="'체크체크'+' - ' + '09:33'"
    >
    </v-card>
    </v-row>
    <v-row>
      <v-card
      variant="outlined"
      class="mx-auto mb-3 mt-1"
      color="surface-variant"
      max-width="344"
      :subtitle="'체크체크'+' - ' + '09:33'"
    >
    </v-card>
    </v-row>

      </div> -->

      <div class="today-schedule text-left" v-if="sortedTodayEvents.length!=0">
        <span style="font-size: 22px;"><strong>오늘의 일정</strong></span>
        <div>
            <div v-for="event in sortedTodayEvents" :key="event.id" style="list-style: none; margin-top: 20px; background-color: #f5f5f5; padding: 10px; border-radius: 10px; margin-bottom: 10px;">
              <span v-if="event.extendedProps.groupId==1" class="color-box" style="background-color: #82B1FF;"></span>
              <span v-if="event.extendedProps.groupId==2" class="color-box" style="background-color: #FF8F00;"></span>
              <span v-if="event.extendedProps.groupId==3" class="color-box" style="background-color: #FFF490;"></span>
              <span style="font-weight: 700;">{{ formatTime(event.start) }}</span> {{ event.title }} 
            </div>
         
          </div>
      </div>
      <div class="week-alert-schedule" v-if="sortedWeekAlertEvents.length!=0">
        <span style="font-size: 22px;"><strong>주간 알림 일정</strong></span>
          <div v-for="event in sortedWeekAlertEvents" :key="event.id" style="list-style: none; margin: 0; background-color: #f5f5f5; padding: 10px; border-radius: 10px; margin-bottom: 10px;">
            <span v-if="event.extendedProps.groupId==1" class="color-box" style="background-color: #82B1FF;"></span>
            <span v-if="event.extendedProps.groupId==2" class="color-box" style="background-color: #FF8F00;"></span>
            <span v-if="event.extendedProps.groupId==3" class="color-box" style="background-color: #FFF490;"></span>
            {{ event.title }} - {{
            formatWeekAlertTime(event.start) }}
          </div>
      </div>


    </div>

    <!-- 메인 캘린더 -->
    <v-container class="calendar-container">
      <div class="d-flex flex-row-reverse mb-5">
        <span class="color-box" style="background-color: #82B1FF;"><v-tooltip location="top" activator="parent">수업 일정</v-tooltip></span>
        <span class="color-box" style="background-color: #FF8F00;"><v-tooltip location="top" activator="parent">과제 일정</v-tooltip></span>
        <span class="color-box" style="background-color: #FFF490;"><v-tooltip location="top" activator="parent">개인 일정</v-tooltip></span>
      </div>
      <FullCalendar ref="fullCalendar" :options="calendarOptions" class="full-calender" />

      <HandleScheduleModal v-if="isModalVisible" :selectedDate="selectedDate" :selectedSchedule="selectedEvent"
        :alertInfo="alertInfo" @close="isModalVisible = false" @scheduleSaved="handleScheduleSubmitted"
        @scheduleDeleted="handleScheduleDeleted" @saveAlert="handleSaveAlert" @createAlert="handleCreateAlert"
        @cancelAlert="handleCancelAlert" />
    </v-container>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from "@fullcalendar/timegrid";
import koLocale from '@fullcalendar/core/locales/ko';
import axios from 'axios';
import HandleScheduleModal from './HandleScheduleModal.vue'; // 일정 처리 모달

export default {
  components: {
    FullCalendar,
    HandleScheduleModal,
  },
  data() {
    return {
      isModalVisible: false, // 모달 표시 여부
      selectedDate: '', // 선택한 날짜
      selectedEvent: null, // 선택한 이벤트 데이터
      alertData: null, // 알림 정보 저장
      todayEvents: [], // 오늘의 일정
      weekAlertEvents: [], // 이번 주 알림 일정
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: koLocale,
        events: [
          
        ],
        datesSet: this.handleDatesSet,
        height: 700,
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        },
        selectable: true,
        select: this.handleDateSelect, // 날짜 선택 시 호출
        eventClick: this.handleEventClick, // 이벤트 클릭 시 호출
        eventDidMount: this.handleEventDidMount,
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        },
      },
    };
  },
  computed: {
    // todayEvents를 시간 기준으로 정렬
    sortedTodayEvents() {
      return [...this.todayEvents].sort((a, b) => new Date(a.start) - new Date(b.start));
    },
    sortedWeekAlertEvents() {
      return [...this.weekAlertEvents].sort((a, b) => new Date(a.start) - new Date(b.start));
    },
  },
  methods: {
    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    },
    formatWeekAlertTime(dateString) {
      const date = new Date(dateString);
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0'); // 시
      const minutes = date.getMinutes().toString().padStart(2, '0'); // 분
      return `${day}일 ${hours}:${minutes}`;
    },
    // 메인 캘린더에 일정 데이터 세팅
    async handleDatesSet(info) {
      this.$nextTick(async () => {
        if (!this.$refs.fullCalendar) {
          console.error('fullCalendar 참조가 없습니다.');
          return;
        }

        const year = info.view.currentStart.getFullYear();
        let month = (info.view.currentStart.getMonth() + 1).toString().padStart(2, '0');

        const calendarApi = this.$refs.fullCalendar.getApi();
        calendarApi.removeAllEventSources();

        await this.fetchHolidays(year, month); // 공휴일 데이터 가져오기
        await this.fetchSchedules(year, month); // 사용자 일정 데이터 가져오기
        this.setTodayEvents();
        this.setWeekAlertEvents();
      });
    },
    // 공휴일 데이터 가져오기
    async fetchHolidays(year, month) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/get-holidays`, {
          params: { year, month },
        });

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, 'text/xml');
        const items = xmlDoc.getElementsByTagName('item');

        const holidays = Array.from(items).map(item => ({
          title: item.getElementsByTagName('dateName')[0].textContent, // 공휴일 이름 (메인 캘린더에만 적용)
          start: item.getElementsByTagName('locdate')[0].textContent,
          allDay: true,
          classNames: ['holiday-event'],
        }));

        this.$refs.fullCalendar.getApi().addEventSource(holidays); // 메인 캘린더에 추가
      } catch (error) {
        console.error('공휴일 정보를 가져오는 중 오류가 발생했습니다.', error);
      }
    },

    // 사용자 일정 데이터 가져오기
    async fetchSchedules(year, month) {
      try {
        const data = { year, month };
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/schedule/monthly-schedules`, data);

        const events = response.data.result.map(schedule => {
          if (!schedule.schedulerDate || !schedule.schedulerTime) {
            console.error("Invalid schedule data:", schedule);
            return null;
          }

          const start = `${schedule.schedulerDate}T${schedule.schedulerTime}`;
          const end = `${schedule.schedulerDate}T${schedule.schedulerTime}`;

          const customClass = schedule.alertYn === "Y" ? "alert-event" : "";
          let groupId = 3;

          // 수업 일정
          if (schedule.lectureAssignmentId === null && schedule.lectureGroupId != null) {
            groupId = 1;
          } else if (schedule.lectureGroupId != null && schedule.lectureAssignmentId != null) {
            // 과제 일정
            groupId = 2;
          }

          return {
            id: schedule.id,
            title: schedule.title,
            start,
            end,
            description: schedule.content,
            classNames: [customClass],
            extendedProps: {
              groupId,
              alertYn: schedule.alertYn
            },
          };
        }).filter(event => event !== null);

        this.$refs.fullCalendar.getApi().addEventSource(events); // 메인 캘린더
      } catch (error) {
        console.error('스케줄을 가져오는 중 오류가 발생했습니다.', error);
      }
    },

    // 오늘의 일정 가져오기
    setTodayEvents() {
      this.$nextTick(() => {
        if (!this.$refs.fullCalendar) {
          console.error('fullCalendar 참조가 없습니다.');
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정 (로컬 타임존 기준)

        const allEvents = this.$refs.fullCalendar.getApi().getEvents();

        this.todayEvents = allEvents.filter(event => {
          console.log("오늘 이벤트",event)
          const eventDate = new Date(event.start);
          eventDate.setHours(0, 0, 0, 0); // 이벤트 날짜도 00:00:00으로 설정 (로컬 타임존 기준)
          return eventDate.getTime() === today.getTime(); // 날짜를 비교하여 일치하는 이벤트만 필터링
        });
      });
    },

    // 이번 주 알림 일정 가져오기
    setWeekAlertEvents() {
      const startOfWeek = new Date().getTime() - new Date().getDay() * 86400000;
      const endOfWeek = startOfWeek + 6 * 86400000;
      this.weekAlertEvents = this.$refs.fullCalendar.getApi().getEvents().filter(event => {
        const eventTime = new Date(event.startStr).getTime();
        return eventTime >= startOfWeek && eventTime <= endOfWeek && event.classNames.includes('alert-event');
      });
    },

    // 이벤트가 캘린더에 렌더링된 후 실행되는 메서드
    handleEventDidMount(info) {
      const eventElement = info.el;
      const groupId = info.event.extendedProps.groupId;

      // 그룹별 색상 설정
      if (groupId === 1) {
        eventElement.style.backgroundColor = '#82B1FF'; // 수업 그룹
      } else if (groupId === 2) {
        eventElement.style.backgroundColor = '#FF8F00'; // 과제 그룹
      } else {
        eventElement.style.backgroundColor = '#FFF490'; // 기타 그룹
      }

      if (info.event.classNames.includes('alert-event')) {
        const icon = document.createElement('span');
        icon.classList.add('mdi', 'mdi-bell-ring');
        icon.style.color = '#666';
        icon.style.marginRight = '4px';
        eventElement.querySelector('.fc-event-title').prepend(icon);
      }

      const dot = eventElement.querySelector('.fc-daygrid-event-dot');
      if (dot) {
        dot.remove();
      }
    },

    // 날짜 선택 시 일정 생성 모달 표시
    handleDateSelect(selectionInfo) {
      this.selectedDate = selectionInfo.startStr;
      this.selectedEvent = null; // 새 일정이므로 선택된 이벤트는 없음
      this.isModalVisible = true;
      this.alertData = null; // 새 일정이므로 알림 정보 초기화
    },

    // 이벤트 클릭 시 호출
    async handleEventClick(info) {
      // 스케줄 ID 확인
      const scheduleId = info.event.id;
      // 클릭한 이벤트 정보를 모달에 전달
      this.selectedEvent = {
        id: scheduleId,
        title: info.event.title,
        schedulerDate: info.event.startStr.split('T')[0],
        schedulerTime: info.event.startStr.split('T')[1],
        content: info.event.extendedProps.description,
        alertYn: info.event.extendedProps.alertYn || false // alertYn 값 추가
      };

      // 알림 여부를 확인한 후, 알림이 설정된 경우에만 API 요청을 보냄
      if (this.selectedEvent.alertYn === 'Y') {
        try {
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/get-alert/${scheduleId}`);
          if (response.data && response.data.result) {
            // 받은 알림 정보를 alertInfo에 저장
            this.alertInfo = {
              id: response.data.result.id, // 알림 ID
              reserveDay: response.data.result.reserveDay,
              reserveTime: response.data.result.reserveTime,
              schedulerId: response.data.result.schedulerId // 스케줄 ID
            };
          } else {
            this.alertInfo = { reserveDay: null, reserveTime: null };  // 기본값으로 설정
          }
        } catch (error) {
          this.alertInfo = { reserveDay: null, reserveTime: null };  // 에러 발생 시 기본값 설정
          console.error('알림 정보를 가져오는 중 오류가 발생했습니다:', error);
        }
      } else {
        this.alertInfo = { reserveDay: null, reserveTime: null };  // 알림이 없을 경우 기본값 설정
      }

      this.isModalVisible = true;
    },

    // 일정 데이터가 모달에서 넘어왔을 때 처리
    async handleScheduleSubmitted({ scheduleData, alertData }) {
      try {
        console.log("AlertData Parent Component", this.dataToSend)
        let response;
        if (this.selectedEvent) {
          // 일정 수정 처리
          response = await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/${this.selectedEvent.id}/update`, scheduleData);
        } else {
          // 새 일정 등록 처리
          response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/make`, scheduleData);
        }
        // 스케줄 저장 후 반환된 ID를 알림 데이터에 사용
        const savedScheduleId = response.data.result || this.selectedEvent.id;
        console.log(console.log("alertData", alertData))
        console.log("scheudleID", savedScheduleId)
        if (alertData) {
          alertData.scheduleId = savedScheduleId; // 알림 데이터에 스케줄 ID 설정
          console.log("alertData", alertData)
          await this.handleCreateAlert(alertData); // 알림 저장
        }

        this.isModalVisible = false;
        await this.refreshCalendarEvents(); // 일정 새로고침
      } catch (error) {
        console.error('Error during schedule saving process:', error);
      }
    },

    // 알림 데이터를 서버에 저장하는 함수
    async handleCreateAlert(alertData) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/set-alert`, alertData);
        console.log("Alert created successfully:", response.data);
        this.isModalVisible = false;
        alert(response.data.status_message)
        await this.refreshCalendarEvents(); // 일정 새로고침
      } catch (error) {
        console.error('Error while creating alert:', error);
      }
    },

    async handleSaveAlert(alertData) {
      try {
        const response = await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/update-alert`, alertData);
        console.log("알림 수정 완료:", response.data);

        this.isModalVisible = false;
        alert(response.data.status_message)
        await this.refreshCalendarEvents(); // 일정 새로고침
      } catch (error) {
        alert('알림 수정 중 오류 발생:', error);
      }
    },

    // 일정 삭제 처리
    async handleScheduleDeleted(scheduleId) {
      try {
        if (scheduleId) {
          const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/${scheduleId}/delete`);
          console.log(response.data);
          alert(response.data.status_message);
          await this.refreshCalendarEvents(); // 일정 삭제 후 캘린더 새로고침
        }
        this.isModalVisible = false;
      } catch (error) {
        console.error('일정 삭제 중 오류가 발생했습니다.', error);
      }
    },

    async handleCancelAlert(alertData) {
      try {
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/cancel-alert/${alertData.alertId}`);
        console.log("Alert canceled successfully:", response.data);
        this.isModalVisible = false;
        alert(response.data.status_message)
        await this.refreshCalendarEvents(); // 캘린더 새로고침
      } catch (error) {
        console.error('Error while canceling alert:', error);
      }
    },

    // 캘린더 이벤트 새로고침
    async refreshCalendarEvents() {
      try {
        const calendarApi = this.$refs.fullCalendar.getApi();
        calendarApi.removeAllEvents(); // 기존 이벤트 제거

        // 현재 년도와 월을 가져옴
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1; // 기본값으로 현재 월 설정
        month = month.toString().padStart(2, '0'); // 01, 02 형식으로 설정

        const response = await this.fetchSchedules(year, month); // fetchSchedules 호출
        if (response && response.data && response.data.result) {
          calendarApi.addEventSource(response.data.result); // 새로운 일정 데이터 추가
        }
      } catch (error) {
        alert(error);
      }
    },
  },
};
</script>

<style scoped>
.calendar-wrapper {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.sidebar {
  width: 350px;
  padding: 10px 0 0 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

::v-deep .fc-media-screen fc-direction-ltr fc-theme-standard {
  height: 700px;
}

/* 메인 캘린더 */
::v-deep .calendar-container {
  margin-left: 5%;
  margin-top: 5%;
  max-width: 1250px;
  flex-grow: 0;
  padding: 10px;
  color: #000;
  height: 800px;
}

.today-schedule,
.week-alert-schedule {
  margin-top: 40%;
}

.group-color-info ul {
  list-style-type: none;
  padding: 0;
}

.color-box {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 10px;
}

/* FullCalendar 내부 스타일에 영향 주기 위해 deep 사용 */
::v-deep .fc-event {
  font-size: 15px !important;
  color: #555 !important;
}

::v-deep .holiday-event {
  background-color: #FFCDD2 !important;
  border-color: #FFCDD2 !important;
  color: #B71C1C !important;
}

::v-deep .fc-prev-button,
::v-deep .fc-next-button {
  background: none;
  border: none !important;
  font-size: 14px;
  /* 버튼 텍스트 크기 줄이기 */
  cursor: pointer;
  color: #c2c2c2;
  padding: 4px 8px;
  /* 패딩 추가 */
  width: 24px;
  /* 버튼 너비 */
  height: 24px;
  /* 버튼 높이 */
}

::v-deep .fc-prev-button:hover,
::v-deep .fc-next-button:hover {
  background: none;
  border: none;
  color: #000; /* Change text color on hover */
}
::v-deep .fc-prev-button:active,
::v-deep .fc-next-button:active {
  background: none !important;
  color: #000 !important;
  box-shadow: none !important;
  border: none !important;
  outline: none !important; 
}

::v-deep .fc-prev-button:focus,
::v-deep .fc-next-button:focus {
  outline: none !important;
  border: none !important;
}


::v-deep .fc-daygrid-day-number {
  color: #000;
  text-decoration: none;
}

::v-deep .fc-col-header-cell-cushion {
  color: #000;
  text-decoration: none;
}


</style>