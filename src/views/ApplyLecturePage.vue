<template>
    <v-container>
        <h2>강의 개설</h2>
        <hr style="margin: 40px 0">
        <v-form>
            <!-- 수업 방식 -->
            <v-row class="form-group align-center">
              <v-col cols="3" class="d-flex align-center justify-center">
                <label>수업 방식</label>
                <span class="essential">*</span>
              </v-col>
              <v-col cols="8">
                <div class="custom-select-box">
                  <div
                    v-for="method in teachingMethods"
                    :key="method.value"
                    :class="['custom-option', teachingMethod === method.value ? 'selected' : '']"
                    @click="teachingMethod = method.value"
                  >
                    {{ method.label }}
                  </div>
                </div>
              </v-col>
            </v-row>
          
            <!-- 분야 -->
            <v-row class="form-group align-center">
              <v-col cols="3" class="d-flex align-center justify-center">
                <label>분야</label>
                <span class="essential">*</span>
              </v-col>
              <v-col cols="8">
                <div class="custom-select-box">
                  <div
                    v-for="option in fieldOptions"
                    :key="option.value"
                    :class="['custom-option', field === option.value ? 'selected' : '']"
                    @click="field = option.value"
                  >
                    {{ option.label }}
                  </div>
                </div>
              </v-col>
            </v-row>
          
            <!-- 강의명 -->
            <v-row class="form-group align-center">
              <v-col cols="3" class="d-flex align-center justify-center">
                <label>강의명</label><br/>
                <span class="essential"> *</span>
              </v-col>
              <v-col cols="8">
                <input
                  v-model="title"
                  class="form-control"
                  placeholder="강의명을 입력해주세요"
                  type="text"
                />
              </v-col>
            </v-row>
          
            <!-- 썸네일 -->
            <v-row class="form-group align-center">
              <v-col cols="3" class="d-flex align-center justify-center">
                <label>썸네일</label>
              </v-col>
              <v-col cols="8">
                <input
                  type="file"
                  id="thumbnail"
                  @change="onFileChange"
                  accept="image/*"
                  class="form-control"
                />
              </v-col>
            </v-row>
          
            <!-- 강의 정보 -->
            <v-row class="form-group align-center">
              <v-col cols="3" class="d-flex align-center justify-center">
                <label>강의 소개</label>
                <span class="essential">*</span>
              </v-col>
              <v-col cols="8">
                <textarea
                  v-model="contents"
                  class="form-control"
                  placeholder="강의 소개를 입력해주세요"
                  style="height: 30vh"
                />
              </v-col>
            </v-row>
          </v-form>
          
          
        <div class="section">
            <v-row>
                <v-col cols="3" class="d-flex justify-center">
                    <label style="margin-top: 40px;">강의 그룹</label>
                </v-col>

                <!-- 시간표 -->
                <v-col cols="2" class="d-flex justify-center">
                    <table border="3" style="border: 1px solid green; border-collapse: collapse; height: 555px;">
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
                            <td >{{ hour }}</td>
                            <td v-for="day in days" :key="day" :style="{ backgroundColor: schedule[day] && schedule[day][index] ? schedule[day][index].color : ''}" >
                              <div v-if="schedule[day] && schedule[day][index]">
                                {{ schedule[day][index].name }}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                </v-col>

                <v-col cols="6">
                    
                    <!-- 강의 그룹 표시 -->
                    <div class="lecture-group-list">
                        <div v-if="lectureGroups.length === 0" style="text-align: center; color: #888; margin-top: 20px;">
                            강의 그룹을 생성해주세요
                        </div>
                        <div v-else>
                            <div v-for="(lectureGroup, index) in lectureGroups" :key="lectureGroup.name" class="lecture-group">
                                <v-row>
                                    <v-col cols="3" class="d-flex align-center justify-center">
                                        <label>강의 그룹 {{ index + 1 }}</label> <!-- 강의 그룹 번호 표시 -->
                                    </v-col>
                                    <v-col>
                                        <v-row>
                                            <v-col cols="3" class="d-flex align-center justify-center">
                                                <label style="font-size: 13px; color: #555;">강의료/인원</label>
                                            </v-col>
                                            <v-col class="d-flex justify-start">
                                                {{ lectureGroup.fee }}원 (인원: {{ lectureGroup.capacity }})
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="3" class="d-flex align-center justify-center">
                                                <label style="font-size: 13px; color: #555;">강의 시간</label>
                                            </v-col>
                                            <v-col class="d-flex justify-start">
                                                <div>
                                                    <div v-for="(slot, slotIndex) in lectureGroup.timeSlots" :key="slotIndex">
                                                        {{ slot.day }}요일 {{ slot.startTime }} ~ {{ slot.endTime }}
                                                    </div>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                    </div>

                    <hr>
                    
                    
                    <div v-if="!showForm" @click="addLectureGroup" class="time-form time-add" style="padding: 10px 0; display: flex; align-items: center; justify-content: center;">
                        <span class="material-icons-outlined" style="margin-right: 5px;">
                            add_box
                        </span>
                        <span style="padding: 10px 0; display: flex; align-items: center; justify-content: center;">
                            강의 그룹 생성
                        </span>
                    </div>
                   
                    <!-- 강의 그룹 정보 입력 폼 -->
                    <div v-if="showForm" class="form">
                        
                        <v-row class="form-group align-center">
                            <v-col cols="3" class="d-flex align-center justify-center">
                                <label class="label-width">강의료</label>
                            </v-col>
                            <v-col cols="4">
                                <input
                                    v-model="currentLecture.fee"
                                    type="money"
                                    placeholder="강의료를 입력하세요"
                                    class="form-control input-width"
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3" class="d-flex align-center justify-center">
                                <label class="label-width">모집 인원</label>
                            </v-col>
                            <v-col cols="4">
                                <input
                                    v-model="currentLecture.capacity"
                                    :disabled="teachingMethod === 'tutoring'"
                                    type="number"
                                    placeholder="모집 인원을 입력하세요"
                                    class="form-control input-width"
                                />
                            </v-col>
                        </v-row>

                        <!-- 시간 및 요일 추가 -->
                        <div v-for="(timeSlot, index) in currentLecture.timeSlots" :key="index" class="time-form">
                            <v-row>
                                <v-col cols="3" class="d-flex align-center justify-center">
                                    <label style="margin: 0 10px">강의 시간</label>
                                </v-col>
                                <v-col>
                                    <v-row>
                                        <div
                                        v-for="day in days"
                                        :key="day"
                                        :class="['custom-option', timeSlot.day === day ? 'selected' : '']"
                                        @click="timeSlot.day = day"
                                        style="margin: 0 3px"
                                    >
                                        {{ day }}
                                    </div>
                                    </v-row>
                                    <v-row style="margin-top: 30px;">
                                        <select v-model="timeSlot.startTime" class="form-control" style="margin: 0 3px">
                                            <option value="" disabled selected>시작 시간</option>
                                            <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                                        </select>
                                        <span style="margin: 0 10px; font-weight: bold; font-size: 18px;">~</span>
                                        <select v-model="timeSlot.endTime" class="form-control" style="margin: 0 3px;">
                                            <option value="" disabled selected>종료 시간</option>
                                            <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                                        </select>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </div>

                        <div @click="addTimeSlot" class="time-form time-add" style="padding: 10px 0; display: flex; align-items: center; justify-content: center;">
                            <span class="material-icons-outlined" style="margin-right: 5px;">
                                add_box
                            </span>
                            <span style="padding: 10px 0; display: flex; align-items: center; justify-content: center;">
                                강의 시간 추가
                            </span>
                        </div>
                        <v-row class="justify-end" style="padding: 0 10px">
                            <div @click="submitLectureGroup" class="submit-group">추가하기</div>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
            <v-row class="justify-center" style="padding: 0 10px">
                <div @click="createLecture" class="create-lecture">개설 신청하기</div>
            </v-row>
        </div>
    </v-container>
    
      
  </template>
  
  <script>
import axios from 'axios';

  export default {
    data() {
      return {
        title: '',
        teachingMethod: '', // Make sure this is defined
        field: '',
        teachingMethods: [
            { value: 'LECTURE', label: '강의' },
            { value: 'LESSON', label: '과외' },
        ],
        fieldOptions: [
            { value: 'ADMISSION', label: '입시' },
            { value: 'CAREER', label: '취업 & 직무' },
            { value: 'HOBBY', label: '취미' },
            { value: 'DEVELOPMENT', label: '자기계발' }
        ],
        thumbnail: null,
        showForm: false,
        currentLecture: {
            name: '',
            fee: 0,
            capacity: 0,
            timeSlots: [
                { day: '', startTime: '', endTime: '' }
            ]
        },
        lectureGroups: [], // 여러 강의를 저장
        days: ['월', '화', '수', '목', '금', '토', '일'],
        hours: [
            '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
            '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
            '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
        ],
        schedule: {}
      };
    },
    methods: {
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.thumbnail = file;
            }
        },
        submitForm() {
            // 여기서 폼 제출 로직 처리
            console.log({
                title: this.title,
                teachingMethod: this.teachingMethod,
                field: this.field,
                thumbnail: this.thumbnail
            });
        },
        addLectureGroup() {
            this.showForm = true;
            this.currentLecture = {
                name: '',
                fee: 0,
                capacity: this.teachingMethod === 'tutoring' ? 1 : 0,
                timeSlots: [{ day: '', startTime: '', endTime: '' }]
            };
        },
        addTimeSlot() {
            this.currentLecture.timeSlots.push({ day: '', startTime: '', endTime: '' });
        },
        getRandomColor() {
            const colors = [
                '#d0e2ff', '#9ec5fe', '#6ea8fe',
                '#3d8bfd', '#0d6efd', '#0b58ca',
                '#084298', '#052c65', '#031633'
            ];
            const randomIndex = Math.floor(Math.random() * colors.length);
            return colors[randomIndex];
        },
        isOverlapping(day, startHour, endHour) {
            if (!this.schedule[day]) {
                return false;
            }

            for (let i = startHour; i <= endHour; i++) {
                if (this.schedule[day][i]) {
                    return true;
                }
            }

            return false;
        },
        submitLectureGroup() {
            // 모집 인원이 0인지 확인
            if (this.currentLecture.capacity <= 0) {
                alert('모집인원은 0명이 될 수 없습니다.');
                return; // 조건에 맞지 않으면 함수 종료
            }

            const color = this.getRandomColor();
            let hasOverlap = false; // 겹치는 강의 체크

            for (const timeSlot of this.currentLecture.timeSlots) {
                const startHour = this.hours.indexOf(timeSlot.startTime);
                const endHour = this.hours.indexOf(timeSlot.endTime);
                const day = timeSlot.day;

                // 겹치는 시간 확인
                if (this.isOverlapping(day, startHour, endHour)) {
                    hasOverlap = true; // 겹치는 경우 플래그 설정
                    break; // 더 이상 체크하지 않음
                }
            }

            if (hasOverlap) {
                alert('겹치는 강의 시간이 존재합니다. 다른 시간을 선택해주세요.');
                return; // 겹치는 경우 강의 추가 중단
            }

            // 색상 추가: 모든 타임 슬롯에 대해 겹치지 않는 경우에만 색상 추가
            for (const timeSlot of this.currentLecture.timeSlots) {
                const startHour = this.hours.indexOf(timeSlot.startTime);
                const endHour = this.hours.indexOf(timeSlot.endTime);
                const day = timeSlot.day;

                if (!this.schedule[day]) {
                    this.schedule[day] = {};
                }

                for (let i = startHour; i <= endHour; i++) {
                    this.schedule[day][i] = {
                        name: this.currentLecture.name,
                        color: color
                    };
                }
            }

            this.lectureGroups.push({ ...this.currentLecture }); // 강의 목록에 추가
            this.showForm = false; // 폼 닫기
        },
        formatCurrency(value) {
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        // 한글 요일을 영어 요일로 변환하는 함수
    convertDayToEnglish(day) {
        const dayMapping = {
            '월': 'MONDAY',
            '화': 'TUESDAY',
            '수': 'WEDNESDAY',
            '목': 'THURSDAY',
            '금': 'FRIDAY',
            '토': 'SATURDAY',
            '일': 'SUNDAY'
        };
        return dayMapping[day];
    },

    // 날짜와 시간을 LocalDateTime 형식으로 변환하는 함수
    convertToLocalDateTime(day, startTime, date) {
        // date는 'YYYY-MM-DD' 형식으로 받아온다고 가정
        const dateObj = new Date(date); // 주어진 날짜를 기준으로 Date 객체 생성

        // startTime을 시간:분 형식으로 분리
        const [hour, minute] = startTime.split(':');
        dateObj.setHours(hour, minute, 0); // 시간을 설정

        // LocalDateTime 형식으로 변환 (YYYY-MM-DDTHH:mm:ss)
        const localDateTime = dateObj.toISOString().replace('Z', ''); // UTC 포맷을 제거하여 ISO 형식 유지
        return localDateTime;
    },

    async createLecture() {
        // 강의 생성 요청 객체 정의
        const lectureCreateReqDto = {
            lectureReqDto: {
                title: this.title,
                content: this.contents,
                status: "STANDBY",  // 기본값 설정
                category: this.field,
                lectureType: this.teachingMethod
            },
            lectureGroupReqDtos: this.lectureGroups.map(group => ({
                price: group.fee.replace(/,/g, ''), // 쉼표 제거 후 숫자로 변환
                limitPeople: group.capacity,
                groupTimeReqDtos: group.timeSlots.map(slot => ({
                    // 요일을 영어로 변환
                    lectureDay: this.convertDayToEnglish(slot.day),
                    // 시작 시간과 종료 시간을 LocalDateTime 형식으로 변환
                    startTime: this.convertToLocalDateTime(slot.day, slot.startTime, slot.date),
                    endTime: this.convertToLocalDateTime(slot.day, slot.endTime, slot.date)
                }))
            }))
        };

        // FormData를 사용하여 데이터와 파일을 함께 전송
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(lectureCreateReqDto)], { type: 'application/json' }));

        if (this.thumbnail) {
            formData.append('imgFile', this.thumbnail); // 이미지 파일 추가
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.VUE_APP_API_BASE_URL}/lecture-service/create`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // 토큰 설정
                        'Content-Type': 'multipart/form-data' // FormData 전송 형식 설정
                    }
                }
            );

            if (response.status === 200) {
                alert('강의가 성공적으로 생성되었습니다!');
            }
        } catch (e) {
            console.error('강의 생성 중 오류 발생:', e);
            alert('강의 생성에 실패했습니다. 다시 시도해주세요.');
        }
    }
    },
    watch: {
        'currentLecture.fee'(newValue) {
            if (typeof newValue === 'number' || typeof newValue === 'string') {
                // 숫자만 추출
                let numericValue = newValue.toString().replace(/[^0-9]/g, '');

                // 가격이 0으로 시작하면 그걸 방지하는 로직
                if (numericValue.length > 1 && numericValue.startsWith('0')) {
                    numericValue = numericValue.replace(/^0+/, ''); // 선행 0 제거
                }

                // 쉼표 추가한 값을 업데이트
                this.currentLecture.fee = this.formatCurrency(numericValue);
            }
        },
    }
  };
  </script>
  
  <style>
  .section {
    margin: 50px 0;
  }
  table {
    width: 20%;
    border-collapse: collapse;
    border: 2px solid #cdcdcd !important;
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
  

.lecture-group {
    border: 1px solid #cdcdcd; /* 각 그룹의 테두리 */
    padding: 10px; /* 안쪽 여백 */
    margin-bottom: 20px;
    border-radius: 5px; /* 모서리 둥글게 */
    background-color: #f9f9f9; /* 배경 색상 */
}
  .time-form {
    border: 1px solid #e1e1e1;
    border-radius: 10px;
    margin: 30px 0;
    padding: 40px 0;
  }
  .time-form select {
    width: 120px;
    display: inline-block;
  }
  .time-add:hover {
    cursor: pointer;
  }
  .custom-select-box {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .custom-option {
    padding: 7px 12px; /* 패딩을 줄여 크기 조정 */
    border: 1px solid #cdcdcd;
    border-radius: 3px; /* 모서리를 조금 더 각지게 */
    cursor: pointer;
    background-color: #f5f5f5;
    color: #7d7d7d;
}

.custom-option.selected {
    border-color: #0d6efd;
    background-color: white;
    color: #0d6efd;
}
  .label-width {
    width: 120px; /* 원하는 너비로 조정 */
  }
  
  .input-width {
    width: 100px; /* 원하는 너비로 조정 */
  }
  .essential {
    font-weight: bold;
    color: #0d6efd;
  }
  .submit-group {
    background-color: #0d6efd;
    color: #f5f5f5;
    width: 100px;
    height: 40px;
    line-height: 40px;
    border-radius: 10px;
    right: 0;
    font-weight: bold;
  }
  .submit-group:hover {
    cursor: pointer;
  }
  .create-lecture {
    background-color: #78CB67;
    color: #f5f5f5;
    font-size: 16px;
    font-weight: bold;
    height: 50px;
    width: 300px;
    border-radius: 10px;
    line-height: 50px;
    margin-top: 40px;
  }
  .create-lecture:hover{
    cursor: pointer;
  }
</style>