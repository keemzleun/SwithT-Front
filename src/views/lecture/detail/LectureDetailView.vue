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
                            
                            <div class="contents-title">강의 소개</div>
                            
                            <div style="font-size: 18px; margin: 0px 10px 50px; color: #333; text-align: left;">
                                {{ lectureInfo?.contents }}
                            </div>
                            <hr/>
                            <div class="contents-title">강의 시간</div>
                            <div v-if="lectureInfo?.lectureType === 'LECTURE'" class="date-info" >
                                <span style="font-weight: 800; margin-right: 10px;">📅 진행기간 </span> {{ lectureGroups[0]?.startDate }} ~ {{ lectureGroups[0]?.endDate }}
                            </div>
                            <v-row v-for="(group, index) in lectureGroups" :key="index">
                                
                                <v-col>
                                    
                                  <div class="pa-3 groups-info">
                                    
                                    <v-row style="padding: 20px 0">
                                      <v-col cols="3" class="d-flex align-center justify-center">
                                        <div style="font-weight: bold; font-size: 17px;">
                                          {{ `강의 그룹 ${index + 1}` }}
                                        </div>
                                      </v-col>
                                      <v-col cols="9" style="text-align: left; font-size: 15px">
                                        <v-row>
                                            <v-col cols="4" class="align-center justify-start" style="padding: 10px">
                                                <strong>강의료</strong>
                                            </v-col>
                                            <v-col class="d-flex align-center justify-start" style="padding: 10px">
                                                {{ group.price }}원</v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="4" class="align-center justify-start" style="padding: 10px">
                                                <strong>모집인원</strong>
                                            </v-col>
                                            <v-col class="d-flex align-center justify-start" style="padding: 10px">
                                                {{ group.participants }}명
                                            </v-col>
                                        </v-row>
                                        
                                        <v-row>
                                            <v-col cols="4" class="d-flex align-center justify-start" style="padding: 10px">
                                                <strong>강의시간</strong>
                                            </v-col>
                                            <v-col class="d-flex align-center justify-start" style="padding: 10px">
                                                <div>
                                                    <div v-for="time in group.groupTimes" :key="time.groupTimeId">
                                                        <span style="font-weight: bold; color: #6C97FD">{{ time.day }}요일</span>
                                                        {{ formatTime(time.startTime) }} ~ {{ formatTime(time.endTime) }}
                                                    </div>
                                                </div>
                                            </v-col>
                                        </v-row>
                                      </v-col>
                                    </v-row>
                                  </div>
                                </v-col>
                              </v-row>
                        </v-tabs-window-item>

                        <v-tabs-window-item value="tutor-info">
                            <!-- 강사 정보 내용 -->
                             <v-col>
                                <v-row class="d-flex align-center justify-center">
                                    <div class="tutor-profile">
                                        <img :src="tutorInfo?.profileImage" alt="tutor profile"/>
                                    </div>
                                </v-row>

                                <v-row class="d-flex align-center justify-center">
                                    <div style="font-style: italic; font-size: 24px; margin: 20px 0"> 안녕하세요.<br/>
                                        <span style="font-size: 27px; font-style: normal; font-weight: 700; color:#6C97FD;">
                                            {{ tutorInfo.name }}
                                        </span>
                                        튜터입니다.
                                    </div>
                                </v-row>
                               
                                <v-row class="d-flex align-center justify-center">
                                    <div class="tutor-info" style="padding: 20px">
                                        <v-row>
                                            <v-col cols="3" class="d-flex align-center justify-center">
                                                <span style="font-weight: bold; margin-right: 15px">평점</span>
                                            </v-col>
                                            <v-col>
                                                <span class="mdi mdi-star" style="font-size: 18px;"> </span>
                                                {{tutorInfo.avgScore}} / 5.0
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="3" class="d-flex align-center justify-center">
                                                <span style="font-weight: bold; margin-right: 15px">최종 학력</span>
                                            </v-col>
                                            <v-col>
                                                {{tutorInfo.education}}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="3" class="d-flex align-center justify-center">
                                                <span style="font-weight: bold; margin-right: 15px">성별</span>
                                            </v-col>
                                            <v-col>
                                                {{ convertGender(tutorInfo.gender) }} 
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="3" class="d-flex align-center justify-center">
                                                <span style="font-weight: bold; margin-right: 15px">연락처</span>
                                            </v-col>
                                            <v-col>
                                                {{tutorInfo.email}}
                                            </v-col>
                                        </v-row>
                                    </div>
                                </v-row>

                                <v-row style="margin: 20px 50px">
                                    <div style="font-size: 18px; text-align: left; padding: 30px" >{{tutorInfo.introduce}}</div>
                                </v-row>
                             </v-col>
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
                    <v-btn style="width: 90%; margin: 20px 0 10px; background-color: #0d6efd; color: #fff; font-weight: 700;">신청하기</v-btn>
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
      lectureGroups: [], // 강의 그룹 데이터
      tutorInfo: null,
      tutorId: null,
    };
  },
  created() {
    this.fetchLectureGroupInfo();
  },
  async mounted() {
    await this.fetchLectureDetail(); // 강의 세부 정보를 먼저 가져옵니다.
    await this.fetchTutorInfo(); // 이후 강사 정보를 가져옵니다.
  },
  methods: {
    async fetchLectureDetail() {
      const lectureId = this.$route.params.id; // URL에서 강의 ID 가져오기
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-detail/${lectureId}`);
        this.lectureInfo = response.data.result; // 가져온 강의 정보를 저장
        this.tutorId = this.lectureInfo.memberId;
        console.log('Lecture Type:', this.lectureInfo.lectureType);
      } catch (error) {
        console.error('강의 정보를 가져오는 데 실패했습니다:', error);
      }
    },
    async fetchLectureGroupInfo() {
      try {
        const id = this.$route.params.id; // URL에서 강의 ID 가져오기
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-group-info/${id}`);
        const data = response.data;

        console.log(data);

        if (data.result && Array.isArray(data.result) && data.result.length > 0) {
          // 강의 그룹 데이터를 lectureGroups에 저장
          this.lectureGroups = data.result.map((group, index) => ({
            startDate: group.startDate,
            endDate: group.endDate,
            price: group.price || 0,
            participants: group.participants || 1,
            groupTimes: group.groupTimes.map(time => ({
              day: this.convertDayToKorean(time.lectureDay), // 요일을 한글로 변환
              startTime: time.startTime,
              endTime: time.endTime,
              groupIndex: index + 1 // 인덱스를 강의 그룹 순서대로 부여
            }))
          }));

          // 시간표에 맞는 스케줄 데이터 포맷
          const allGroupTimes = data.result.flatMap((group, index) => 
            group.groupTimes.map(time => ({ ...time, groupIndex: index + 1 })) // 그룹 인덱스를 추가로 부여
          );
          this.schedule = this.formatSchedule(allGroupTimes);
        }
      } catch (error) {
        console.error('강의 그룹 정보를 가져오는 데 실패했습니다:', error);
      }
    },
    formatTime(time) {
      // 시간에서 앞의 5자리만 잘라서 반환 (HH:MM)
      return time.substring(0, 5);
    },

    deleteLectureGroup(index) {
      // 강의 그룹 삭제 기능 (단순히 배열에서 삭제)
      this.lectureGroups.splice(index, 1);
    },
    convertDayToKorean(day) {
      const dayMap = {
        MONDAY: '월',
        TUESDAY: '화',
        WEDNESDAY: '수',
        THURSDAY: '목',
        FRIDAY: '금',
        SATURDAY: '토',
        SUNDAY: '일'
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

      const groupColors = {}; // 그룹 인덱스별 색상을 저장

      times.forEach((time) => {
        const day = dayMap[time.lectureDay]; // 요일 변환
        const startHourIndex = this.hours.indexOf(time.startTime.split(':')[0] + ':00'); // 시작 시간의 index
        const endHourIndex = this.hours.indexOf(time.endTime.split(':')[0] + ':00'); // 종료 시간의 index

        // 그룹 인덱스로 색을 할당하고, 해당 색상이 없으면 새롭게 생성
        if (!groupColors[time.groupIndex]) {
          groupColors[time.groupIndex] = this.getRandomColor(); // 그룹 인덱스별로 고유 색상 할당
        }

        const color = groupColors[time.groupIndex]; // 해당 그룹의 색상 가져오기

        if (!schedule[day]) {
          schedule[day] = Array(this.hours.length).fill(null); // 해당 요일에 스케줄 배열 초기화
        }

        // 시작 시간부터 종료 시간까지 색상 및 그룹 인덱스 설정
        for (let hour = startHourIndex; hour < endHourIndex; hour++) {
          schedule[day][hour] = {
            name: '강의',
            color: color, // 그룹별 색상 적용
            index: time.groupIndex // 그룹 인덱스
          };
        }
      });
      return schedule;
    },

    getRandomColor() {
      const colors = ['#d0e2ff', '#9ec5fe', '#6ea8fe', '#3d8bfd', '#0d6efd', '#2f6fd4', '#bad2f8', '#abc3ea', '#7fa3dd', '#5982c4', '#426caf'];
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    },

    async fetchTutorInfo() {
      console.log(this.tutorId);
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/public-infoGet/${this.tutorId}`);
        this.tutorInfo = response.data.result; // 강사 정보를 저장
        console.log(this.tutorInfo);
      } catch (error) {
        console.error('강사 정보를 가져오는 데 실패했습니다:', error);
      }
    },
    convertGender(gender) {
        return gender === 'MAN' ? '남성' : '여성';
    }
  }
}
</script>


<style scoped>
.v-container {
    position: relative;
    
}

.contents-section {
    /*display: flex;*/
    justify-content: space-between;
    gap: 20px;
    height: 1000px;
}

.float-info {
    width: 300px;
    background-color: #fff;
    position: sticky;
    border: 2px solid #f0efef;
    border-radius: 10px;
    padding: 30px 5px;
    margin-top: 60px; /* 화면 상단과 40px 거리 */
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
.groups-info {
    border: 1px solid #f0efef;
    border-radius: 10px;
}
.contents-title {
    text-align: left;
    margin: 20px 10px;
    font-size: 22px;
    font-weight: 700;
}
.tutor-profile img{
    width: 200px;
    height: 200px;
    border-radius: 50%;
}
.tutor-info {
     background-color: #e1e8fa;
     border-radius: 10px;
     width: 80%;
     padding: 20px 50px;
     font-size: 17px;
     text-align: left;
}
.date-info {
    background-color: #d0e2ff;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
    font-size: 18px;
    color: #333;
    text-align: left;

}
</style>