<template>
    <LectureDetailInfoComponent/>
    <v-container height="2000px">
        <v-tabs v-model="activeTab" style="margin-bottom: 30px;">
            <v-tab value="lecture-info" style="font-size: 18px;">강의 정보</v-tab>
            <v-tab value="tutor-info" style="font-size: 18px;">강사 정보</v-tab>
            <v-tab value="tutor-review" style="font-size: 18px;">리뷰</v-tab>
        </v-tabs>
            <div class="float-info">
                왜 그래..
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
            </div>
            
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
    this.fetchLectureGroupInfo(); // 실제 강의 그룹 ID로 교체 필요
  },
  methods: {
    async fetchLectureGroupInfo() {
      try {
          const id = this.$route.params.id; // URL에서 강의 ID 가져오기
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-group-info/${id}`);
          const data = response.data;

          console.log('API Response:', data); // 응답 로깅

          if (data.result && Array.isArray(data.result) && data.result.length > 0) {
              const allGroupTimes = []; // 모든 groupTimes를 저장할 배열

              // 모든 강의 그룹에서 groupTimes 수집
              data.result.forEach(group => {
                  if (Array.isArray(group.groupTimes)) {
                      allGroupTimes.push(...group.groupTimes); // groupTimes 추가
                  } else {
                      console.error('Invalid groupTimes data:', group.groupTimes);
                  }
              });

              console.log('All Group Times:', allGroupTimes); // 모든 강의 시간 데이터 로깅

              // 포맷된 스케줄 설정
              this.schedule = this.formatSchedule(allGroupTimes);
              console.log('Formatted Schedule:', this.schedule); // 포맷된 스케줄 로깅
          } else {
              console.error('Invalid result data:', data.result);
          }

      } catch (error) {
          console.error('Error fetching lecture group info:', error);
      }
    },

    formatSchedule(times) {
        const schedule = {};
        
        // 요일을 한국어로 매핑
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
            const day = dayMap[time.lectureDay]; // 요일 변환
            const startHourIndex = this.hours.indexOf(time.startTime.split(':')[0] + ':00'); // 시작 시간의 인덱스
            const endHourIndex = this.hours.indexOf(time.endTime.split(':')[0] + ':00'); // 종료 시간의 인덱스
            
            const color = this.getRandomColor(); // 랜덤 색상 생성

            if (!schedule[day]) {
                schedule[day] = Array(this.hours.length).fill(null);
            }

            for (let hour = startHourIndex; hour < endHourIndex; hour++) {
                schedule[day][hour] = {
                    name: time.title || '강의', // title이 없으면 기본값 설정
                    color: color, // 색상 추가
                    index: index + 1 // 인덱스를 저장 (1부터 시작)
                };
            }
        });
        
        return schedule;
    },


    getRandomColor() {
        const colors = [
                '#d0e2ff', '#9ec5fe', '#6ea8fe',
                '#3d8bfd', '#0d6efd', '#2f6fd4', '#bad2f8',
                '#abc3ea', '#7fa3dd', '#5982c4', '#426caf', 

            ];
            const randomIndex = Math.floor(Math.random() * colors.length);
            return colors[randomIndex];

    }
  }
}
</script>

<style scoped>
.float-info {
    width: 300px;
    background-color: #fff;
    position: sticky;
    border: 2px solid #f0efef;
    border-radius: 10px;
    margin-left: 70%;
    top: 80px;
}
.time-table {
    margin: auto;
    width: 250px;
   
}
table {
    width: 20%;
    border-collapse: collapse;
    border: 1px solid #cdcdcd !important;
  }
  
  th, td {
    padding: 5px;
    text-align: center;
    font-size: 11px;
    border: 1px solid #e6e4e4 !important;
    
  }
  
  .form {
    margin-top: 20px;
  }
  label {
    font-weight: bold;
    font-size: 17px;
  }
  td {
    height: 10px;
    
  }
</style>
