<template>
  <div>월간 스케줄 목록</div>
  <div style="display: flex; align-items: center; justify-content: flex-end; margin-right: 20px;">
    <span style="margin-right: 10px;">과제:</span><a></a>
    <div class="assignment-schedule-bar"></div>
    <span style="margin-right: 10px;">수업:</span><a></a>
    <div class="lecture-schedule-bar"></div>
    <span style="margin-right: 10px;">개인 스케줄:</span><a></a>
    <div class="my-schedule-bar"></div>
  </div>
  <div class="calendar-container">
    <FullCalendar ref="fullCalendar" :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: [], // 서버에서 가져온 이벤트를 저장
        datesSet: this.handleDatesSet, // 달력이 변경될 때 실행되는 이벤트 핸들러
        eventTimeFormat: { // 24시간 형식 적용
          hour: 'numeric',
          minute: '2-digit',
          hour12: false, // 24시간 형식 사용
        },
        eventDidMount: this.handleEventDidMount, // 이벤트 렌더링 후 실행
      },
    };
  },
  methods: {
    async handleDatesSet(info) {
      const year = info.view.currentStart.getFullYear();
      let month = (info.view.currentStart.getMonth() + 1).toString().padStart(2, '0'); // 한 자리 수일 때 앞에 0 추가

      // 이전 이벤트 소스를 모두 제거
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.removeAllEventSources();

      // 공휴일 및 사용자 일정 정보 가져오기
      await this.fetchHolidays(year, month);
      await this.fetchSchedules(year, month);
    },

    // 공휴일 정보를 이벤트로 등록
    async fetchHolidays(year, month) {
      console.log("year", year, "month", month)
      try {
        const apiUrl = 'http://localhost:8080/member-service/get-holidays';
        const response = await axios.get(apiUrl, {
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
          start: item.getElementsByTagName('locdate')[0].textContent, // 공휴일 날짜
          allDay: true, // 하루 종일 이벤트로 설정
          classNames: ['holiday-event'], // 공휴일을 구분하기 위한 클래스
        }));

        // 공휴일 이벤트를 FullCalendar에 추가
        this.$refs.fullCalendar.getApi().addEventSource(holidays);
      } catch (error) {
        console.error('공휴일 정보를 가져오는 중 오류가 발생했습니다.', error);
      }
    },

    // 사용자 스케줄 정보 가져오기
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

          // AlertYn 값에 따라 커스텀 클래스를 설정
          const customClass = schedule.alertYn === "Y" ? "alert-event" : "";

          // groupId 설정
          let groupId = 3; // 기본값으로 기타 그룹을 설정

          if (schedule.lectureAssignmentId === null && schedule.lectureGroupId != null) {
            groupId = 1; // 수업 그룹일 때
          } else if (schedule.lectureGroupId != null && schedule.lectureAssignmentId != null) {
            groupId = 2; // 과제 그룹일 때
          }

          return {
            id: schedule.id,
            title: schedule.title,
            start: start,
            end: end,
            description: schedule.content,
            classNames: [customClass], // 커스텀 클래스 추가
            extendedProps: { groupId: groupId }, // groupId를 extendedProps로 추가
          };
        }).filter(event => event !== null);

        // 사용자 스케줄 이벤트를 FullCalendar에 추가
        this.$refs.fullCalendar.getApi().addEventSource(events);
      } catch (error) {
        console.error('스케줄을 가져오는 중 오류가 발생했습니다.', error);
      }
    },

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
    },
  },
};
</script>

<style>
/* FullCalendar에서 기본 파란색 점을 없앰 */
.fc .fc-event-dot {
  display: none !important;
}

/* MDI 아이콘 사용 설정 */
.mdi {
  font-family: 'Material Design Icons';
  font-size: 16px;
}

/* 공휴일 이벤트 스타일 */
.holiday-event {
  background-color: #FFCDD2 !important;
  border-color: #FFCDD2 !important;
  color: #B71C1C !important;
}

/* 개인 스케줄 가로 막대 스타일 */
.my-schedule-bar {
  width: 100px;
  height: 12px;
  background-color: #FFF490; /* 개인 스케줄의 색상 */
  border-radius: 5px;
}
.assignment-schedule-bar {
  width: 100px;
  height: 12px;
  background-color: #FF8F00; /* 과제 스케줄의 색상 */
  border-radius: 5px;
}
.lecture-schedule-bar {
  width: 100px;
  height: 12px;
  background-color: #82B1FF; /* 수업 스케줄의 색상 */
  border-radius: 5px;
}

/* 캘린더 크기 제한 */
.calendar-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
