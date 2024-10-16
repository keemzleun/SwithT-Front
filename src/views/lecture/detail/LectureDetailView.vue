<template>
    <LectureDetailInfoComponent/>
    <v-container>
        <v-tabs v-model="activeTab" style="margin-bottom: 30px;">
            <v-tab value="lecture-info" style="font-size: 18px;">강의 정보</v-tab>
            <v-tab value="tutor-info" style="font-size: 18px;">강사 정보</v-tab>
            <v-tab value="tutor-review" style="font-size: 18px;">리뷰</v-tab>
        </v-tabs>
        <v-tabs-window v-model="activeTab">
            <v-tabs-window-item value="lecture-info">
                
            </v-tabs-window-item>
            <v-tabs-window-item value="tutor-info">
                <!-- 강사 정보 내용 -->
            </v-tabs-window-item>
            <v-tabs-window-item value="tutor-review">
                <!-- 리뷰 내용 -->
            </v-tabs-window-item>
        </v-tabs-window>
        <!-- 강의 정보 내용 -->
        <div>
            <h3>강의 시간표</h3>
            <table border="3" style="border: 1px solid #999; border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th>시간</th>
                        <th>월</th>
                        <th>화</th>
                        <th>수</th>
                        <th>목</th>
                        <th>금</th>
                        <th>토</th>
                        <th>일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(hour, index) in hours" :key="index">
                        <td>{{ hour }}</td>
                        <td v-for="day in days" :key="day" :style="{ backgroundColor: getCellColor(day, index) }">
                            <div v-if="schedule[day] && schedule[day][index]">
                                {{ schedule[day][index].name }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </v-container>
</template>

<script>
import axios from 'axios';
import LectureDetailInfoComponent from '@/components/LectureDetailInfoComponent.vue';

export default {
  components: {
    LectureDetailInfoComponent,
  },
  data() {
    return {
      activeTab: 'lecture-info',
      days: ['월', '화', '수', '목', '금', '토', '일'],
      hours: [
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
      ],
      schedule: {}
    };
  },
  created() {
    this.fetchLectureGroupInfo(1); // Replace 1 with the actual lecture group ID you want to fetch
  },
  methods: {
    async fetchLectureGroupInfo(id) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-group-info/${id}`);
        const data = response.data; // Adjust based on your API response structure

        this.schedule = this.formatSchedule(data.times);
        console.log(this.schedule)
      } catch (error) {
        console.error('Error fetching lecture group info:', error);
      }
    },
    formatSchedule(times) {
      const schedule = {};
      times.forEach(time => {
        const day = time.lectureDay;
        const startHour = parseInt(time.startTime.split(':')[0]);
        const endHour = parseInt(time.endTime.split(':')[0]);

        if (!schedule[day]) {
          schedule[day] = Array(this.hours.length).fill(null);
        }

        for (let hour = startHour; hour < endHour; hour++) {
          schedule[day][hour] = {
            title: time.title,
            // You can add more properties here if needed
          };
        }
      });
      return schedule;
    },
    getCellColor(day, index) {
      return this.schedule[day] && this.schedule[day][index] ? '#d0e2ff' : '';
    }
  }
}
</script>

<style scoped>
.time-table {
    margin-top: 20px;
}
</style>
