<template>
  <div>
    <v-container class="calendar-container">
      <FullCalendar ref="fullCalendar" :options="calendarOptions" />
      <HandleScheduleModal
        v-if="isModalVisible"
        :selectedDate="selectedDate"
        :selectedSchedule="selectedEvent"
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
      // 이벤트가 'holiday-event' 클래스인 경우 action 없음
      if (info.event.classNames.includes('holiday-event')) {
        return;
      }

      // 클릭한 이벤트 정보를 모달에 전달
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
        }
        this.isModalVisible = false; // 모달 닫기
      } catch (error) {
        console.error('일정 저장 중 오류가 발생했습니다.', error);
      }
    },

    // 알림 설정만 처리
    async handleAlertSettingsSaved(alertData) {
      console.log(this.alertData)
      try {
        if (alertData.scheduleId) {
          // 알림 생성 요청
          await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/set-alert`, alertData);
        }
        console.log('알림 설정이 저장되었습니다.');
      } catch (error) {
        console.error('알림 설정 저장 중 오류가 발생했습니다.', error);
      }
    },

    // 알림 취소 처리
    async handleAlertCanceled(alertData) {
      try {
        if (alertData.scheduleId) {
          // 알림 삭제 요청
          await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/cancel-alert/${alertData.scheduleId}`);
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

<style scoped>
/* FullCalendar 스타일 */
.calendar-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px;
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
</style>

<style scoped>
/* FullCalendar 스타일 */
.calendar-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px;
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

</style>
