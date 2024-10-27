<template>
  <v-container
    fluid
    class="py-4 px-2 mt-15"
    :style="{
      maxWidth: '1650px',
      maxHeight: '1400px',
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <!-- 상단 출금 가능 금액과 예상 수익금 -->
    <v-row>
      <v-col cols="12">
        <v-card
          class="pa-3 d-flex"
          :style="{ border: '1px solid lightgray', borderRadius: '20px' }"
        >
          <v-row>
            <!-- 출금 가능 금액 -->
            <v-col class="text-center">
              <div class="text-h6">출금 가능 금액</div>
              <div class="text-h5 font-weight-bold">10,000,000원</div>
              <v-btn class="mt-2" color="primary" large>출금하기</v-btn>
            </v-col>

            <!-- 세로 구분선 -->
            <v-divider 
            vertical
            :style="{ borderRightWidth: '2px', borderColor: 'black' }"
          ></v-divider>

            <!-- 예상 수익금 -->
            <v-col class="text-center">
              <div class="text-h6">예상 수익금</div>
              <div class="text-h5 font-weight-bold">5,000,000원</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <!-- 그래프 (임의 더미 데이터) -->
        <v-card
          class="pa-3 mb-4"
          :style="{ border: '1px solid lightgray', borderRadius: '20px' }"
        >
          <div class="text-h6 mb-2">매출 차트</div>
          <div
            class="chart-container"
            style="display: flex; justify-content: center; position: relative; height: 35vh; width: 100%;"
          >
            <canvas id="earningsChart" style="width: 80%;"></canvas>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-tabs 
    v-model="tab" 
    grow 
    :style="{
      backgroundColor: 'white', 
      border: '1px solid Lightgray', 
      borderRadius: '3px'
    }"
  >
    <v-tab :style="{ color: 'black' }"><h5><strong>전체</strong></h5></v-tab>
    <v-tab :style="{ color: 'black' }"><h5><strong>수익 목록</strong></h5></v-tab>
    <v-tab :style="{ color: 'black' }"><h5><strong>출금 목록</strong></h5></v-tab>
  </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <!-- 탭 전환에 따른 필터링된 데이터 출력 -->
        <v-data-table
          :headers="headers"
          :items="filteredData"
          class="elevation-1"
          :style="{ border: '1px solid lightgray' }"
        ></v-data-table>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default {
  data() {
    return {
      tab: 0,
      headers: [
        { text: "날짜", value: "date" },
        { text: "수익/출금 항목", value: "description" },
        { text: "금액", value: "amount" },
      ],
      allData: [
        { date: "24/09/12", description: "정산금 출금", amount: "-2,000,000" },
        { date: "24/09/11", description: "최고의 고등 수학 과외", amount: "500,000" },
        { date: "24/09/10", description: "정산금 출금", amount: "-3,000,000" },
        { date: "24/09/09", description: "영어 과외 수익", amount: "300,000" },
        { date: "24/09/08", description: "정산금 출금", amount: "-1,500,000" },
      ],
      incomeData: [
        { date: "24/09/11", description: "최고의 고등 수학 과외", amount: "500,000" },
        { date: "24/09/09", description: "영어 과외 수익", amount: "300,000" },
      ],
      withdrawalData: [
        { date: "24/09/12", description: "정산금 출금", amount: "-2,000,000" },
        { date: "24/09/10", description: "정산금 출금", amount: "-3,000,000" },
        { date: "24/09/08", description: "정산금 출금", amount: "-1,500,000" },
      ],
    };
  },
  computed: {
    // 선택한 탭에 따라 필터링된 데이터를 반환
    filteredData() {
      if (this.tab === 1) {
        return this.incomeData; // 수익 목록만 출력
      } else if (this.tab === 2) {
        return this.withdrawalData; // 출금 목록만 출력
      }
      return this.allData; // 전체 데이터 출력
    },
  },
  mounted() {
    // 차트 생성 (더미 데이터)
    const ctx = document.getElementById("earningsChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["23/11", "23/12", "24/01", "24/02", "24/03"],
        datasets: [
          {
            label: "수익",
            backgroundColor: "blue",
            data: [500000, 600000, 700000, 800000, 900000],
            barThickness: 25, // 막대 두께 설정
          },
          {
            label: "출금",
            backgroundColor: "red",
            data: [300000, 200000, 100000, 400000, 500000],
            barThickness: 25, // 막대 두께 설정
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  },
};
</script>

<style scoped>
/* 추가 스타일 */
.text-h6 {
  font-weight: bold;
}

.text-h5 {
  font-size: 1.5rem;
}

.chart-container {
  max-width: 100%;
}
</style>
