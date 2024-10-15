<template>
  <div class="calendar-wrapper">
    <!-- 작은 캘린더 -->
    <div class="sidebar">
      <div class="mini-calendar-container">
        <FullCalendar
          ref="miniCalendar"
          :options="miniCalendarOptions"
        />
      </div>

      <!-- 오늘의 일정 -->
      <div class="today-schedule">
        <h3>오늘의 일정</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li v-for="event in sortedTodayEvents" :key="event.id">{{ event.title }} - {{ formatTime(event.start) }}</li>
        </ul>
      </div>
      
      <!-- 이번 주 알림 일정 -->
      <div class="week-alert-schedule">
        <h3>이번 주 알림 일정</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li v-for="event in sortedWeekAlertEvents" :key="event.id">{{ event.title }} - {{ formatWeekAlertTime(event.start) }}</li>
        </ul>
      </div>

      <!-- 그룹별 일정 색상 설명 -->
      <div class="group-color-info">
        <h3>그룹 색상 설명</h3>
        <ul>
          <li><span class="color-box" style="background-color: #82B1FF;"></span> 수업 일정</li>
          <li><span class="color-box" style="background-color: #FF8F00;"></span> 과제 일정</li>
          <li><span class="color-box" style="background-color: #FFF490;"></span> 개인 일정</li>
        </ul>
      </div>
    </div>

    <!-- 메인 캘린더 -->
    <v-container class="calendar-container">
      <FullCalendar ref="fullCalendar" :options="calendarOptions" class="full-calender"/>
      <HandleScheduleModal
        v-if="isModalVisible"
        :selectedDate="selectedDate"
        :selectedSchedule="selectedEvent"
        :alertInfo="alertInfo"
        @close="isModalVisible = false"
        @scheduleSaved="handleScheduleSaved"
        @alertSettingsSaved="handleAlertSettingsSaved"
        @alertCanceled="handleAlertCanceled"
        @scheduleDeleted="handleScheduleDeleted"
      />
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
      alertInfo: null, // 알림 정보 저장
      todayEvents: [], // 오늘의 일정
      weekAlertEvents: [], // 이번 주 알림 일정
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: koLocale,
        events: [],
        datesSet: this.handleDatesSet,
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
      miniCalendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: "prev",
          center: "title",
          right: "next"
        },
        titleFormat: { year: 'numeric', month: 'long' },
        selectable: false,
        events: [],
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        },
        dayCellDidMount: this.handleMiniCalendarDayCellDidMount,
        dayHeaderFormat: { weekday: 'narrow' },
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
  mounted() {
    // miniCalendar가 완전히 마운트된 후에 setTodayEvents 호출
    this.$nextTick(() => {
      this.setTodayEvents();
    });
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
        // this.$refs.miniCalendar.getApi().addEventSource(holidays); // 작은 캘린더에 공휴일 추가
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

          if (schedule.lectureAssignmentId === null && schedule.lectureGroupId != null) {
            groupId = 1;
          } else if (schedule.lectureGroupId != null && schedule.lectureAssignmentId != null) {
            groupId = 2;
          }

          return {
            id: schedule.id,
            title: schedule.title,
            start,
            end,
            description: schedule.content,
            classNames: [customClass],
            extendedProps: { groupId },
          };
        }).filter(event => event !== null);

        this.$refs.fullCalendar.getApi().addEventSource(events); // 메인 캘린더
        // this.$refs.miniCalendar.getApi().addEventSource(events); // 작은 캘린더에 일정 추가
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
        console.log("오늘 날짜: " + today);

        const allEvents = this.$refs.fullCalendar.getApi().getEvents();

        this.todayEvents = allEvents.filter(event => {
          const eventDate = new Date(event.start);
          eventDate.setHours(0, 0, 0, 0); // 이벤트 날짜도 00:00:00으로 설정 (로컬 타임존 기준)
          return eventDate.getTime() === today.getTime(); // 날짜를 비교하여 일치하는 이벤트만 필터링
        });

        console.log("오늘 일정: ", this.todayEvents); // 필터링된 오늘의 이벤트 로그 출력
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
      this.alertInfo = null; // 새 일정이므로 알림 정보 초기화
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
        alertYn: info.event.extendedProps.alertYn // alertYn 값 추가
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
            this.alertInfo = null;
          }
        } catch (error) {
          this.alertInfo = null;
          console.error('알림 정보를 가져오는 중 오류가 발생했습니다:', error);
        }
      } else {
        this.alertInfo = null;
      }

      this.isModalVisible = true;
    },

    // 새 일정 등록 또는 수정된 일정 저장 후 처리
    async handleScheduleSaved(savedSchedule) {
      try {
        if (this.selectedEvent) {
          await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/${this.selectedEvent.id}/update`, savedSchedule);
          const eventApi = this.$refs.fullCalendar.getApi().getEventById(this.selectedEvent.id);
          if (eventApi) {
            eventApi.remove();
          }

          const updatedEvent = {
            id: this.selectedEvent.id,
            title: savedSchedule.title,
            start: `${savedSchedule.schedulerDate}T${savedSchedule.schedulerTime}`,
            end: `${savedSchedule.schedulerDate}T${savedSchedule.schedulerTime}`,
            description: savedSchedule.content,
            allDay: false,
          };
          this.$refs.fullCalendar.getApi().addEvent(updatedEvent);
        } else {
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/make`, savedSchedule);

          const newEvent = {
            id: response.data.id,
            title: savedSchedule.title,
            start: `${savedSchedule.schedulerDate}T${savedSchedule.schedulerTime}`,
            end: `${savedSchedule.schedulerDate}T${savedSchedule.schedulerTime}`,
            description: savedSchedule.content,
            allDay: false,
          };
          this.$refs.fullCalendar.getApi().addEvent(newEvent);
        }

        this.isModalVisible = false;
      } catch (error) {
        console.error('일정 저장 중 오류가 발생했습니다.', error);
      }
    },

    // 알림 설정만 처리
    async handleAlertSettingsSaved(alertData) {
      try {
        if (alertData.scheduleId) {
          await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/update-alert`, alertData);
          await this.refreshCalendarEvents();
        }
        console.log('알림 설정이 저장되었습니다.');
      } catch (error) {
        console.error('알림 설정 저장 중 오류가 발생했습니다.', error);
      }
    },

    // 알림 취소 처리
    async handleAlertCanceled(alertData) {
      try {
        if (alertData.alertId) {
          await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/cancel-alert/${alertData.alertId}`);
          await this.refreshCalendarEvents();
        }
        console.log('알림이 취소되었습니다.');
      } catch (error) {
        console.error('알림 취소 중 오류가 발생했습니다.', error);
      }
    },

    // 일정 삭제 처리
    async handleScheduleDeleted() {
      try {
        if (this.selectedEvent) {
          await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/${this.selectedEvent.id}/delete`);
          await this.refreshCalendarEvents();
        }
        this.isModalVisible = false;
      } catch (error) {
        console.error('일정 삭제 중 오류가 발생했습니다.', error);
      }
    },

    // 캘린더 이벤트 새로고침
    async refreshCalendarEvents() {
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.removeAllEvents();
      await this.fetchSchedules();
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
  width: 250px;
  background-color: #f5f5f5;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

::v-deep .mini-calendar-container {
  margin-top: 25%;
  margin-bottom: 20px;
}

::v-deep .mini-calendar-container .fc-header-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::v-deep .mini-calendar-container .fc-toolbar-title {
  margin-top: 10%;
  font-size: 20px;
}

::v-deep .mini-calendar-container .fc-prev-button,
::v-deep .mini-calendar-container .fc-next-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #000;
}

::v-deep .mini-calendar-container .fc-col-header-cell-cushion {
  color: #000;
  font-size: 12px;
  padding: 5px 0;
}


/* 메인 캘린더 */
::v-deep .calendar-container {
  margin-left: 5%;
  margin-top: 5%;
  max-width: 950px;
  flex-grow: 0;
  padding: 10px;
  color: #000;
}

.today-schedule,
.week-alert-schedule {
  margin-bottom: 20px;
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
  font-size: 12px !important;
  color: black !important;
}

::v-deep .holiday-event {
  background-color: #FFCDD2 !important;
  border-color: #FFCDD2 !important;
  color: #B71C1C !important;
}

::v-deep .fc-prev-button, 
::v-deep .fc-next-button {
  background: none;
  border: none;
  font-size: 14px; /* 버튼 텍스트 크기 줄이기 */
  cursor: pointer;
  color: #000;
  padding: 4px 8px; /* 패딩 추가 */
  width: 24px; /* 버튼 너비 */
  height: 24px; /* 버튼 높이 */
}

::v-deep .fc-prev-button:hover, 
::v-deep .fc-next-button:hover {
  color: #000;
}
::v-deep .fc-daygrid-day-number{
  color: #000;
  text-decoration: none;
}

::v-deep .fc-col-header-cell-cushion{
  color: #000;
  text-decoration: none;
}
</style>
