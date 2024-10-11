<template>
  <div>
    <v-container class="container">
      <FullCalendar ref="fullCalendar" :options="calendarOptions" />
      <HandleScheduleModal
        v-if="isModalVisible"
        :selectedDate="selectedDate"
        :selectedSchedule="selectedEvent"
        @close="isModalVisible = false"
        @scheduleSaved="handleScheduleSaved"
        @scheduleDeleted="handleScheduleDeleted"
      />
    </v-container>
  </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
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
    };
  },
  methods: {
    // 달력에 일정 데이터 세팅
    async handleDatesSet(info) {
      const year = info.view.currentStart.getFullYear();
      let month = (info.view.currentStart.getMonth() + 1).toString().padStart(2, '0');

      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.removeAllEventSources();

      await this.fetchHolidays(year, month); // 공휴일 데이터 가져오기
      await this.fetchSchedules(year, month); // 사용자 일정 데이터 가져오기
    },
    calculateAlertTime(schedulerDate, schedulerTime, offsetHours) {
      const scheduleDateTime = new Date(`${schedulerDate}T${schedulerTime}`);
      scheduleDateTime.setHours(scheduleDateTime.getHours() + offsetHours);
      return scheduleDateTime.toISOString().substring(0, 16); // "YYYY-MM-DDTHH:MM" 형식으로 반환
    },

    // 공휴일 데이터 가져오기
    async fetchHolidays(year, month) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/get-holidays`, {
          params: {
            year: year,
            month: month,
          },
        });

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, 'text/xml');
        const items = xmlDoc.getElementsByTagName('item');

        const holidays = Array.from(items).map(item => ({
          title: item.getElementsByTagName('dateName')[0].textContent,
          start: item.getElementsByTagName('locdate')[0].textContent,
          allDay: true,
          classNames: ['holiday-event'],
        }));

        this.$refs.fullCalendar.getApi().addEventSource(holidays);
      } catch (error) {
        console.error('공휴일 정보를 가져오는 중 오류가 발생했습니다.', error);
      }
    },

    // 사용자 일정 데이터 가져오기
    async fetchSchedules(year, month) {
      try {
        const data = { year: year, month: month };
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
            start: start,
            end: end,
            description: schedule.content,
            classNames: [customClass],
            extendedProps: { groupId: groupId },
          };
        }).filter(event => event !== null);

        this.$refs.fullCalendar.getApi().addEventSource(events);
      } catch (error) {
        console.error('스케줄을 가져오는 중 오류가 발생했습니다.', error);
      }
    },

    // 이벤트가 캘린더에 렌더링된 후 실행되는 메서드
    handleEventDidMount(info) {
      const eventElement = info.el;
      const groupId = info.event.extendedProps.groupId;
      if (groupId === 1) {
        eventElement.style.backgroundColor = '#82B1FF';
      } else if (groupId === 2) {
        eventElement.style.backgroundColor = '#FF8F00';
      } else {
        eventElement.style.backgroundColor = '#FFF490';
      }

      if (info.event.classNames.includes('alert-event')) {
        const icon = document.createElement('span');
        icon.classList.add('mdi', 'mdi-bell-ring');
        icon.style.color = '#666';
        icon.style.marginRight = '4px';
        eventElement.querySelector('.fc-event-title').prepend(icon);
      }

      const dot = eventElement.querySelector('.fc-daygrid-event-dot');
      if(dot){
        dot.remove();
      }
    },

    // 날짜 선택 시 일정 생성 모달 표시
    handleDateSelect(selectionInfo) {
      this.selectedDate = selectionInfo.startStr;
      this.selectedEvent = null; // 새 일정이므로 선택된 이벤트는 없음
      this.isModalVisible = true;
    },

    // 이벤트 클릭 시 수정 모달 표시
    handleEventClick(info) {
      this.selectedEvent = {
        id: info.event.id,
        title: info.event.title,
        schedulerDate: info.event.startStr.split('T')[0],
        schedulerTime: info.event.startStr.split('T')[1],
        content: info.event.extendedProps.description
      };
      this.isModalVisible = true; // 수정 모달 표시
    },

    // 새 일정 등록 또는 수정된 일정 저장 후 처리
    async handleScheduleSaved(savedSchedule) {
      try {
        if (this.selectedEvent) {
          // 서버로 수정 요청 보내기
          await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/${this.selectedEvent.id}/update`, savedSchedule);

          // 기존 이벤트 수정
          const eventApi = this.$refs.fullCalendar.getApi().getEventById(this.selectedEvent.id);
          eventApi.setProp('title', savedSchedule.title);
          eventApi.setStart(`${savedSchedule.schedulerDate}T${savedSchedule.schedulerTime}`);
          eventApi.setEnd(`${savedSchedule.schedulerDate}T${savedSchedule.schedulerTime}`);
        } else {
          // 새 일정 등록 요청 보내기
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/make`, savedSchedule);

          // 서버에서 반환된 데이터로 새 일정 등록
          const createdEvent = {
            id: response.data.id, // 서버에서 생성된 ID
            title: savedSchedule.title,
            start: `${savedSchedule.schedulerDate}T${savedSchedule.schedulerTime}`,
            end: `${savedSchedule.schedulerDate}T${savedSchedule.schedulerTime}`,
            description: savedSchedule.content,
            allDay: false,
          };

          // 캘린더에 이벤트 추가
          this.$refs.fullCalendar.getApi().addEvent(createdEvent);

          // 알림 설정이 Y인 경우 추가 처리
          if (savedSchedule.alertYn === 'Y') {
            // 알림 시간이 1시간 전, 10분 전 또는 직접 입력한 경우에 따른 추가 로직
            let alertTime;
            if (savedSchedule.alertTime === '1시간 전') {
              alertTime = this.calculateAlertTime(savedSchedule.schedulerDate, savedSchedule.schedulerTime, -1);
            } else if (savedSchedule.alertTime === '10분 전') {
              alertTime = this.calculateAlertTime(savedSchedule.schedulerDate, savedSchedule.schedulerTime, -0.167);
            } else if (savedSchedule.alertTime === '직접 입력') {
              alertTime = `${savedSchedule.schedulerDate}T${savedSchedule.customAlertTime}`;
            }

            // 서버에 알림 설정을 위한 API 호출 (예시)
            const alertData = {
              schedulerId: response.data.id,
              reserveDay: savedSchedule.schedulerDate,
              reserveTime: alertTime,
            };
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/set-alert`, alertData);
          }
        }
        this.isModalVisible = false; // 모달 닫기
      } catch (error) {
        console.error('일정 저장 중 오류가 발생했습니다.', error);
      }
    },

    // 일정 삭제 처리
    async handleScheduleDeleted() {
      try {
        if (this.selectedEvent) {
          // 서버로 삭제 요청 보내기
          await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/${this.selectedEvent.id}/delete`);

          // 이벤트 삭제
          const eventApi = this.$refs.fullCalendar.getApi().getEventById(this.selectedEvent.id);
          eventApi.remove();
        }
        this.isModalVisible = false; // 모달 닫기
      } catch (error) {
        console.error('일정 삭제 중 오류가 발생했습니다.', error);
      }
    }
  }
};
</script>

<style>
.mdi {
  font-family: 'Material Design Icons';
  font-size: 14px; /* 아이콘 크기 줄임 */
}

/* 공휴일 이벤트 스타일 */
.holiday-event {
  background-color: #FFCDD2 !important;
  border-color: #FFCDD2 !important;
  color: #B71C1C !important;
}

/* 개인 스케줄 막대 스타일 */
.my-schedule-bar {
  width: 80px; /* 막대 너비 줄임 */
  height: 8px; /* 막대 높이 줄임 */
  background-color: #FFF490;
  border-radius: 5px;
}

.assignment-schedule-bar {
  width: 80px; /* 막대 너비 줄임 */
  height: 8px; /* 막대 높이 줄임 */
  background-color: #FF8F00;
  border-radius: 5px;
}

.lecture-schedule-bar {
  width: 80px; /* 막대 너비 줄임 */
  height: 8px; /* 막대 높이 줄임 */
  background-color: #82B1FF;
  border-radius: 5px;
}
.container{
  max-width: 800px;
}

/* 캘린더 컨테이너 크기 조정 */
.calendar-container {
  max-width: 800px; /* 캘린더 전체 크기를 줄임 */
  margin: 0 auto;
}

/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 오버레이 투명도를 조정 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 모달 콘텐츠 크기 조정 */
.modal-content {
  background-color: #fff;
  padding: 15px; /* 내부 여백 줄임 */
  border-radius: 8px;
  max-width: 450px; /* 모달 전체 너비 줄임 */
  width: 100%;
}

/* 모달 타이틀 크기 조정 */
.modal-title {
  display: flex;
  align-items: center;
  font-size: 18px; /* 타이틀 폰트 크기 줄임 */
  margin-bottom: 15px; /* 하단 여백 줄임 */
}

.modal-title .mdi-calendar {
  font-size: 22px; /* 아이콘 크기 줄임 */
  margin-right: 6px;
}

label {
  display: block;
  margin-bottom: 6px; /* 라벨과 입력 필드 사이 여백 줄임 */
}

input[type="text"],
input[type="date"],
input[type="time"],
textarea {
  width: calc(100% - 8px);
  padding: 8px; /* 입력 필드 안쪽 여백 줄임 */
  margin-bottom: 15px; /* 입력 필드 사이 여백 줄임 */
  border-radius: 4px;
  border: 1px solid #ccc;
}

textarea {
  height: 80px; /* 텍스트 영역 높이 줄임 */
}

.alert-setting {
  margin-bottom: 15px; /* 알림 설정 영역 여백 줄임 */
}

.alert-time {
  margin-top: 10px;
}

.alert-time h4 {
  margin-bottom: 8px;
}

.alert-time label {
  display: inline-block;
  margin-right: 10px; /* 라디오 버튼 사이 여백 줄임 */
}

/* 모달 버튼 크기 조정 */
.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.modal-buttons button {
  padding: 8px 12px; /* 버튼 크기 줄임 */
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.modal-buttons button[type="submit"] {
  background-color: #007bff;
  color: white;
}

.modal-buttons button[type="button"]:nth-child(1) {
  background-color: #dc3545;
  color: white;
}
</style>
