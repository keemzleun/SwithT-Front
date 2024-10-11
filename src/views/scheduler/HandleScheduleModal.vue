<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2 class="modal-title">
        <span class="mdi mdi-calendar"></span> {{ selectedSchedule ? '일정 수정' : '일정 등록' }}
      </h2>
      <form @submit.prevent="createOrUpdateSchedule">
        <!-- 제목 입력 -->
        <label for="title">제목:</label>
        <input type="text" v-model="title" required />

        <!-- 날짜 선택 -->
        <label for="schedulerDate">일자:</label>
        <input type="date" v-model="schedulerDate" required />

        <!-- 시간 선택 -->
        <label for="schedulerTime">시간:</label>
        <input type="time" v-model="schedulerTime" required />

        <!-- 내용 입력 -->
        <label for="content">내용:</label>
        <textarea v-model="content" required></textarea>

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
          <button v-if="selectedSchedule" type="button" @click="deleteSchedule">삭제하기</button>
          <!-- 등록일 땐 등록 버튼, 수정일 땐 수정 버튼 -->
          <button type="submit">{{ selectedSchedule ? '수정하기' : '등록하기' }}</button>
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
      title: this.selectedSchedule ? this.selectedSchedule.title : '',
      schedulerDate: this.selectedSchedule ? this.selectedSchedule.schedulerDate : this.selectedDate,
      schedulerTime: this.selectedSchedule ? this.selectedSchedule.schedulerTime : '',
      content: this.selectedSchedule ? this.selectedSchedule.content : '',
      alertYn: this.selectedSchedule ? this.selectedSchedule.alertYn : false,
      alertTime: this.selectedSchedule ? this.selectedSchedule.alertTime : '',
      customAlertTime: ''
    };
  },
  methods: {
    createOrUpdateSchedule() {
      const scheduleData = {
        title: this.title,
        schedulerDate: this.schedulerDate,
        schedulerTime: this.schedulerTime,
        content: this.content,
        alertYn: this.alertYn,
        alertTime: this.alertTime === '직접 입력' ? this.customAlertTime : this.alertTime
      };
      this.$emit('scheduleSaved', scheduleData);
      this.close();
    },
    deleteSchedule() {
      this.$emit('scheduleDeleted');
      this.close();
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style>
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
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
}

.modal-title {
  display: flex;
  align-items: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.modal-title .mdi-calendar {
  font-size: 28px;
  margin-right: 8px;
}

label {
  display: block;
  margin-bottom: 8px;
}

input[type="text"],
input[type="date"],
input[type="time"],
textarea {
  width: calc(100% - 10px);
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

textarea {
  height: 100px;
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
  padding: 10px 15px;
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
