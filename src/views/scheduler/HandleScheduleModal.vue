<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2 class="modal-title">
        <span class="mdi mdi-calendar"></span> {{ selectedSchedule ? '일정 수정' : '일정 등록' }}
      </h2>
      <form @submit.prevent="createOrUpdateSchedule">
        <!-- 제목 입력 -->
        <label for="title">제목:</label>
        <input type="text" v-model="title" :readonly="isReadOnly" required />

        <!-- 날짜 선택 -->
        <label for="schedulerDate">일자:</label>
        <input type="date" v-model="schedulerDate" :readonly="isReadOnly" required />

        <!-- 시간 선택 -->
        <label for="schedulerTime">시간:</label>
        <input type="time" v-model="schedulerTime" :readonly="isReadOnly" required />

        <!-- 내용 입력 -->
        <label for="content">내용:</label>
        <textarea v-model="content" :readonly="isReadOnly" class="content-textarea" required></textarea>

        <!-- 알림 여부 및 시간 설정 -->
        <div class="alert-setting">
          <label for="alertYn">
            알림 여부:
            <input type="checkbox" v-model="alertYn" />
          </label>
          <div v-if="alertYn" class="alert-time">
            <h4>알림 시간 설정</h4>
            <label><input type="radio" value="1시간 전" v-model="alertTime" /> 1시간 전</label>
            <label><input type="radio" value="10분 전" v-model="alertTime" /> 10분 전</label>
            <label><input type="radio" value="직접 입력" v-model="alertTime" /> 직접 입력</label>
            <input v-if="alertTime === '직접 입력'" type="time" v-model="customAlertTime" />
          </div>
        </div>

        <!-- 버튼들 -->
        <div class="modal-buttons">
          <!-- 수정 모드일 때만 삭제 버튼 보임 -->
          <button v-if="selectedSchedule && isEditable" type="submit">완료</button>
          <button v-if="selectedSchedule && !isEditable" type="button" @click="enableEdit">수정하기</button>
          <button v-if="!selectedSchedule" type="submit">등록하기</button>
          <!-- 알림 설정 버튼 -->
          <button type="button" @click="saveAlertSettings" :disabled="!alertYn">알림 설정</button>
          <!-- 알림 취소 버튼 -->
          <button v-if="alertYn" type="button" @click="cancelAlert">알림 취소</button>
          <button type="button" @click="close">취소하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
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
      isEditable: false, // 수정 가능 여부
      title: this.selectedSchedule ? this.selectedSchedule.title : '',
      schedulerDate: this.selectedSchedule ? this.selectedSchedule.schedulerDate : this.selectedDate,
      schedulerTime: this.selectedSchedule ? this.formatTime(this.selectedSchedule.schedulerTime) : '',
      content: this.selectedSchedule ? this.selectedSchedule.content : '',
      alertYn: this.selectedSchedule ? this.selectedSchedule.alertYn === 'Y' : false, // 알림 여부
      alertTime: this.selectedSchedule ? this.selectedSchedule.alertTime : '',
      customAlertTime: ''
    };
  },
  computed: {
    isReadOnly() {
      // 일정 등록 시 바로 입력 가능, 수정 시 수정 버튼 클릭 전까지 읽기 전용
      return this.selectedSchedule ? !this.isEditable : false;
    }
  },
  methods: {
    formatTime(timeString) {
      // 스케줄 시간을 "HH:MM" 형식으로 변환 
      return timeString ? timeString.substring(0, 5) : '';
    },
    enableEdit() {
      this.isEditable = true; // 수정 가능 상태로 변경
    },
    createOrUpdateSchedule() {
      const scheduleData = {
        title: this.title,
        schedulerDate: this.schedulerDate,
        schedulerTime: this.schedulerTime,
        content: this.content,
        alertYn: this.alertYn ? 'Y' : 'N',
        alertTime: this.alertTime === '직접 입력' ? this.customAlertTime : this.alertTime
      };

      this.$emit('scheduleSaved', scheduleData); // 부모 컴포넌트로 데이터 전송
      this.close();
    },
    saveAlertSettings() {
      const alertData = {
        scheduleId: this.selectedSchedule ? this.selectedSchedule.id : null,
        reserveTime: this.alertTime === '직접 입력' ? this.customAlertTime : this.alertTime,
        reserveDay: this.schedulerDate
      };
      this.$emit('alertSettingsSaved', alertData); // 부모 컴포넌트에 알림 설정 데이터 전송
    },
    cancelAlert() {
      const alertData = {
        scheduleId: this.selectedSchedule ? this.selectedSchedule.id : null
      };
      this.$emit('alertCanceled', alertData); // 부모 컴포넌트로 알림 취소 이벤트 전송
    },
    close() {
      this.$emit('close');
      this.isEditable = false; // 창 닫을 때 수정 불가 상태로 초기화
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
  height: 100px; /* 고정 높이 */
  max-height: 100px; /* 고정 높이로 스크롤 */
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
</style>
