<template>
  <FullCalendar ref="fullCalendar" :options="calendarOptions" />
  <EventDetailDialog ref="EventDetail"></EventDetailDialog>
  <EventDialog ref="EventCreate"></EventDialog>
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
      },
    };
  },
  methods: {
    async handleDatesSet(info) {
      // info.view.currentStart: 현재 보고 있는 달의 첫 번째 날짜를 반환
      const year = info.view.currentStart.getFullYear(); // 시작 연도
      const month = info.view.currentStart.getMonth() + 1; // 시작 월 (0부터 시작하므로 +1)

      try {
        const data = { 
          year: year, 
          month: month 
        }

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/schedule/monthly-schedules`, data)

        const events = response.data.result.map(schedule => {
          if (!schedule.schedulerDate || !schedule.schedulerTime) {
            console.error("Invalid schedule data:", schedule)
            return null
          }
          // ISO 8601 형식으로 조립
          const start = `${schedule.schedulerDate}T${schedule.schedulerTime}`
          const end = `${schedule.schedulerDate}T${schedule.schedulerTime}`

          return {
            title: schedule.title,
            start: start,
            end: end,
            description: schedule.content,
          }
        }).filter(event => event !== null)  // 유효하지 않은 데이터를 필터링

        // FullCalendar 이벤트 추가 및 리렌더링
        this.$refs.fullCalendar.getApi().removeAllEventSources()  // 기존 소스 제거
        this.$refs.fullCalendar.getApi().addEventSource(events)   // 새 소스 추가
        this.$refs.fullCalendar.getApi().render()  // 강제 리렌더링

        console.log('추가된 이벤트:', this.$refs.fullCalendar.getApi().getEvents())

      } catch (error) {
        alert('스케줄을 가져오는 중 오류가 발생했습니다.', error)
      }
    },
},


};
</script>
