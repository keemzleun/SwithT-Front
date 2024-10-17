<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-button" @click="close">&times;</button>

      <h2 class="modal-title">
        <span class="mdi mdi-calendar"></span> {{ selectedSchedule ? '일정 수정' : '일정 등록' }}
      </h2>

      <form @submit.prevent="handleSubmit" style="text-align: left">
        <!-- 제목 입력 -->
        <label for="title">제목</label>
        <input type="text" v-model="title" :readonly="isReadOnly" required />

        <!-- 날짜 선택 -->
        <label for="schedulerDate">일자</label>
        <input type="date" v-model="schedulerDate" :readonly="isReadOnly" required />

        <!-- 시간 선택 -->
        <label for="schedulerTime">시간</label>
        <input type="time" v-model="schedulerTime" :readonly="isReadOnly" required />

        <!-- 내용 입력 -->
        <label for="content">내용</label>
        <textarea v-model="content" :readonly="isReadOnly" class="content-textarea" required></textarea>

        <!-- 알림 여부 및 시간 설정 -->
        <div class="alert-setting">
          <label for="alertYn">
            알림 여부:
            <input type="checkbox" v-model="alertYn" @change="onAlertYnChange" />
            <!-- 알림 수정 버튼 추가 -->
            <button v-if="alertYn && !isAlertEditable" type="button" @click="enableAlertEdit" class="alert-edit-btn">수정</button>
          </label>

          <div v-if="alertYn" class="alert-time">
            <!-- 알림 정보 표시 -->
            <div v-if="!isAlertEditable">
              <p v-if="alertInfo">알림 일자: {{ alertInfo?.reserveDay || '설정되지 않음' }}</p>
              <p v-if="alertInfo">알림 시간: {{ alertInfo?.reserveTime || '설정되지 않음' }}</p>
            </div>

            <!-- 알림 시간 설정 -->
            <div v-if="isAlertEditable">
              <label><input type="radio" value="1시간 전" v-model="alertTime" /> 1시간 전</label>
              <label><input type="radio" value="10분 전" v-model="alertTime" /> 10분 전</label>
              <label><input type="radio" value="직접 입력" v-model="alertTime" /> 직접 입력</label>
              <input v-if="alertTime === '직접 입력'" type="time" v-model="customAlertTime" />
            </div>
          </div>
        </div>

        <!-- 버튼들 -->
        <div class="modal-buttons">
          <button v-if="selectedSchedule && isEditable" type="submit">완료</button>
          <button v-if="selectedSchedule && !isEditable" type="button" @click="enableEdit">수정하기</button>
          <button v-if="!selectedSchedule" type="submit">등록하기</button>

          <!-- 일정 삭제 버튼 -->
          <button v-if="selectedSchedule" type="button" @click="deleteSchedule" class="delete-button">삭제하기</button>

          <!-- 알림 수정 버튼 (새 일정 생성 시에는 표시되지 않음) -->
          <button v-if="alertYn && isAlertEditable && selectedSchedule" type="button" @click="saveAlertSettings">알림 수정</button>

          <!-- 알림 취소 버튼 -->
          <button v-if="alertInfo && !isAlertEditable" type="button" @click="cancelAlert">알림 취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';

export default {
  props: {
    selectedDate: {
      type: String,
      required: true
    },
    selectedSchedule: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isEditable: false,
      title: this.selectedSchedule ? this.selectedSchedule.title : '',
      schedulerDate: this.selectedSchedule ? this.selectedSchedule.schedulerDate : this.selectedDate,
      schedulerTime: this.selectedSchedule ? this.formatTime(this.selectedSchedule.schedulerTime) : '',
      content: this.selectedSchedule ? this.selectedSchedule.content : '',
      alertYn: false, // 알림 여부 기본값 설정
      alertTime: '',
      customAlertTime: '',
      alertInfo: null, // 알림 정보 객체
      isAlertEditable: false // 알림 수정 모드 여부
    };
  },
  computed: {
    isReadOnly() {
      return this.selectedSchedule ? !this.isEditable : false;
    }
  },
  methods: {
    formatTime(timeString) {
      return timeString ? timeString.substring(0, 5) : '';
    },
    enableEdit() {
      this.isEditable = true;
    },
    enableAlertEdit() {
      this.isAlertEditable = true; // 알림 수정 모드 활성화
      
      // 기존 알림 정보가 있을 때 기존 데이터를 알림 폼에 반영
      if (this.alertInfo) {
        const existingAlertTime = this.alertInfo.reserveTime;

        if (existingAlertTime === '01:00') {
          this.alertTime = '1시간 전';
        } else if (existingAlertTime === '00:10') {
          this.alertTime = '10분 전';
        } else {
          this.alertTime = '직접 입력';
          this.customAlertTime = existingAlertTime; // 기존 알림 시간이 있다면 customAlertTime에 저장
        }
      }
    },
    async handleSubmit() {
      try {
        const scheduleData = {
          title: this.title,
          schedulerDate: this.schedulerDate,
          schedulerTime: this.schedulerTime,
          content: this.content,
        };

        let scheduleId;
        if (this.selectedSchedule) {
          // 일정 수정
          await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/${this.selectedSchedule.id}/update`, scheduleData);
          scheduleId = this.selectedSchedule.id;
        } else {
          // 새 일정 등록
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/make`, scheduleData);
          scheduleId = response.data.result;

          // 새 일정 등록 후 알림 생성
          if (this.alertYn) {
            const alertTimeInMinutes = this.calculateAlertTimeInMinutes();
            const alertTimeValue = dayjs(this.schedulerTime, 'HH:mm').subtract(alertTimeInMinutes, 'minute').format('HH:mm');
            const reserveTime = alertTimeValue !== 'Invalid Date' ? alertTimeValue : this.schedulerTime;

            const alertData = {
              scheduleId: scheduleId, // 등록된 일정의 ID 사용
              reserveTime: reserveTime,
              reserveDay: this.schedulerDate
            };
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/set-alert`, alertData);
          }
        }

        this.$emit('calendarUpdated'); // 캘린더 업데이트 요청
        this.close();
      } catch (error) {
        console.error('일정 저장 중 오류가 발생했습니다.', error);
      }
    },
    async deleteSchedule() {
      try {
        if (confirm('정말로 이 일정을 삭제하시겠습니까?')) {
          // 서버로 PATCH 요청을 보내서 일정 삭제
          const response = await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/${this.selectedSchedule.id}/delete`);
          
          if (response.status === 200) {
            alert(response.data.message || '해당 스케줄이 삭제되었습니다.');
            this.$emit('calendarUpdated'); // 캘린더 업데이트 요청
            this.close();
          } else {
            console.error('일정 삭제 중 오류가 발생했습니다.', response.data);
          }
        }
      } catch (error) {
        console.error('일정 삭제 중 오류가 발생했습니다.', error);
      }
    },
    calculateAlertTimeInMinutes() {
      if (this.alertTime === '1시간 전') {
        return 60;
      } else if (this.alertTime === '10분 전') {
        return 10;
      } else if (this.customAlertTime) {
        const [customHour, customMinute] = this.customAlertTime.split(':');
        const [scheduleHour, scheduleMinute] = this.schedulerTime.split(':');
        return (scheduleHour - customHour) * 60 + (scheduleMinute - customMinute);
      }
      return 0; // 기본값
    },
    onAlertYnChange() {
      // 알림 여부가 체크 해제된 경우 알림 정보 초기화
      if (!this.alertYn) {
        this.isAlertEditable = false; // 알림 수정 모드 비활성화
        this.alertInfo = null;
        this.alertTime = '';
        this.customAlertTime = '';
      } else {
        this.isAlertEditable = true; // 알림을 새로 설정하는 경우 입력 가능
      }
    },
    async saveAlertSettings() {
      // 알림 수정 요청
      const alertTimeInMinutes = this.calculateAlertTimeInMinutes();
      const alertTimeValue = dayjs(this.schedulerTime, 'HH:mm').subtract(alertTimeInMinutes, 'minute').format('HH:mm');

      const reserveTime = alertTimeValue !== 'Invalid Date' ? alertTimeValue : this.schedulerTime;

      const alertData = {
        scheduleId: this.selectedSchedule.id,
        reserveTime: reserveTime,
        reserveDay: this.schedulerDate
      };

      try {
        await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/update-alert`, alertData);
        console.log('알림이 수정되었습니다.');
        this.close();
      } catch (error) {
        console.error('알림 수정 중 오류가 발생했습니다.', error);
      }
    },
    async cancelAlert() {
      const alertData = { alertId: this.alertInfo?.id }; // 알림 ID로 취소 요청
      if (alertData.alertId) {
        await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/delete-alert/${alertData.alertId}`);
        console.log('알림이 취소되었습니다.');
        this.$emit('calendarUpdated'); // 캘린더 업데이트 요청
        this.close(); // 모달 창 닫기
      }
    },
    close() {
      this.$emit('close');
      this.isEditable = false;
      this.isAlertEditable = false; // 창 닫을 때 수정 모드 초기화
    },
    async fetchAlertInfo() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/scheduler/get-alert/${this.selectedSchedule.id}`);
        this.alertInfo = response.data.result;
        if (this.alertInfo) {
          this.alertYn = true; // 알림이 설정되어 있을 경우 체크
        } else {
          this.alertYn = false; // 알림이 없을 경우 false로 설정
        }
      } catch (error) {
        console.error('알림 정보를 불러오는 중 오류가 발생했습니다.', error);
      }
    }
  },
  mounted() {
    if (this.selectedSchedule) {
      this.fetchAlertInfo(); // 스케줄이 있을 경우 알림 정보를 불러옴
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh; /* 모달 창의 최대 높이 설정 */
  overflow-y: auto; /* 내용이 길어질 경우 스크롤 가능 */
  position: relative;
}

.modal-title {
  display: flex;
  align-items: center;
  font-size: 20px;
  margin-bottom: 15px;
}

.modal-title .mdi-calendar {
  font-size: 28px;
  margin-right: 8px;
}

label {
  display: block;
  margin-bottom: 6px;
}

input[type="text"],
input[type="date"],
input[type="time"],
textarea {
  width: calc(100% - 8px);
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

textarea.content-textarea {
  height: 100px;
  max-height: 100px;
  resize: none;
  overflow-y: auto;
}

.alert-setting {
  margin-bottom: 20px;
}

.alert-time {
  margin-top: 10px;
}

.alert-time h4 {
  margin-bottom: 10px;
}

.alert-time label {
  display: inline-block;
  margin-right: 15px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.modal-buttons button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
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

/* X 버튼 스타일 */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

/* 알림 수정 버튼 스타일: 체크박스와 간격 추가 */
.alert-edit-btn {
  margin-left: 10px;
}
</style>
