<template>
    <LectureDetailInfoComponent/>
    <v-container>
        <v-row>
            <v-col cols="8">
                <v-tabs v-model="activeTab" style="margin-bottom: 30px;">
                    <v-tab value="lecture-info" style="font-size: 18px;">강의 정보</v-tab>
                    <v-tab value="tutor-info" style="font-size: 18px;">강사 정보</v-tab>
                    <v-tab value="tutor-review" style="font-size: 18px;">리뷰</v-tab>
                </v-tabs>
                <div class="contents-section">
                    <v-tabs-window v-model="activeTab">
                        <v-tabs-window-item value="lecture-info">
                            <div style="font-size: 18px; margin: 0 10px; color: #333;">
                                {{ lectureInfo?.contents }}
                            </div>

                            <!-- 강의 그룹 목록 -->
                            <v-row v-for="(group, index) in lectureGroups" :key="index" class="mb-4">
                                <v-col>
                                    <v-card class="pa-3">
                                        <v-row justify="space-between" align="center">
                                            <v-col>
                                                <div style="font-weight: bold; font-size: 20px;">
                                                    {{ `강의 그룹 ${index + 1}` }}
                                                </div>
                                            </v-col>
                                            <v-col class="text-right">
                                                <v-btn icon @click="deleteLectureGroup(index)">
                                                    <v-icon color="red">mdi-delete</v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <div>
                                                    <strong>강의료/인원: </strong>{{ group.price }}원 (인원: {{ group.participants }})
                                                </div>
                                                <div>
                                                    <strong>강의 시간: </strong>{{ group.day }} {{ group.startTime }} ~ {{ group.endTime }}
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-tabs-window-item>
                        <v-tabs-window-item value="tutor-info">
                            <!-- 강사 정보 내용 -->
                        </v-tabs-window-item>
                        <v-tabs-window-item value="tutor-review">
                            <!-- 리뷰 내용 -->
                        </v-tabs-window-item>
                    </v-tabs-window>
                </div>
            </v-col>

            <v-col cols="4">
                <aside class="float-info">
                    <table border="3" class="time-table">
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
                            <td v-for="day in days" :key="day" :style="{ backgroundColor: schedule[day] && schedule[day][index] ? schedule[day][index].color : ''}">
                              <div v-if="schedule[day] && schedule[day][index]" style="color: #fff; font-weight: bold;">
                                {{ schedule[day][index].index }}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                    </table>
                </aside>
            </v-col>
        </v-row>
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
      schedule: {},
      lectureInfo: null,
      lectureGroups: [] // 강의 그룹 데이터
    };
  },
  created() {
    this.fetchLectureGroupInfo();
    this.fetchLectureDetail();
  },
  methods: {
    async fetchLectureDetail() {
        const lectureId = this.$route.params.id; // URL에서 강의 ID 가져오기
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-detail/${lectureId}`);
            this.lectureInfo = response.data.result; // 가져온 강의 정보를 저장
        } catch (error) {
            console.error('강의 정보를 가져오는 데 실패했습니다:', error);
        }
    },
    async fetchLectureGroupInfo() {
      try {
          const id = this.$route.params.id; // URL에서 강의 ID 가져오기
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-group-info/${id}`);
          const data = response.data;

          if (data.result && Array.isArray(data.result) && data.result.length > 0) {
              // 강의 그룹 데이터를 lectureGroups에 저장
              this.lectureGroups = data.result.map(group => ({
                  price: group.price || 0,
                  participants: group.participants || 1,
                  day: this.convertDayToKorean(group.groupTimes[0].lectureDay),
                  startTime: group.groupTimes[0].startTime,
                  endTime: group.groupTimes[0].endTime,
              }));

              // 시간표에 맞는 스케줄 데이터 포맷
              const allGroupTimes = data.result.flatMap(group => group.groupTimes);
              this.schedule = this.formatSchedule(allGroupTimes);
          }
      } catch (error) {
          console.error('강의 그룹 정보를 가져오는 데 실패했습니다:', error);
      }
    },
    deleteLectureGroup(index) {
      // 강의 그룹 삭제 기능 (단순히 배열에서 삭제)
      this.lectureGroups.splice(index, 1);
    },
    convertDayToKorean(day) {
        const dayMap = {
            MONDAY: '월요일',
            TUESDAY: '화요일',
            WEDNESDAY: '수요일',
            THURSDAY: '목요일',
            FRIDAY: '금요일',
            SATURDAY: '토요일',
            SUNDAY: '일요일'
        };
        return dayMap[day] || '요일 미상';
    },
    formatSchedule(times) {
        const schedule = {};
        const dayMap = {
            MONDAY: '월',
            TUESDAY: '화',
            WEDNESDAY: '수',
            THURSDAY: '목',
            FRIDAY: '금',
            SATURDAY: '토',
            SUNDAY: '일'
        };

        times.forEach((time, index) => {
            const day = dayMap[time.lectureDay];
            const startHourIndex = this.hours.indexOf(time.startTime.split(':')[0] + ':00');
            const endHourIndex = this.hours.indexOf(time.endTime.split(':')[0] + ':00');
            const color = this.getRandomColor();

            if (!schedule[day]) {
                schedule[day] = Array(this.hours.length).fill(null);
            }

            for (let hour = startHourIndex; hour < endHourIndex; hour++) {
                schedule[day][hour] = {
                    name: time.title || '강의',
                    color: color,
                    index: index + 1
                };
            }
        });
        return schedule;
    },
    getRandomColor() {
        const colors = ['#d0e2ff', '#9ec5fe', '#6ea8fe', '#3d8bfd', '#0d6efd', '#2f6fd4', '#bad2f8', '#abc3ea', '#7fa3dd', '#5982c4', '#426caf'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
  }
}
</script>

<style scoped>
.v-container {
    position: relative;
}

.contents-section {
    display: flex;
    justify-content: space-between;
}

.float-info {
    width: 300px;
    background-color: #fff;
    position: sticky;
    border: 2px solid #f0efef;
    border-radius: 10px;
    padding: 30px 5px;
    margin-top: 60px;
    top: 40px;
}

.time-table {
    margin: auto;
    width: 250px;
}

table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #cdcdcd !important;
}
  
th, td {
    padding: 5px;
    text-align: center;
    font-size: 11px;
    border: 1px solid #e6e4e4 !important;
}
  
td {
    height: 10px;
}
</style>
