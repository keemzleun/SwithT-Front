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
          class="pa-4 d-flex"
          elevation="3"
          :style="{ borderRadius: '12px' }"
        >
          <v-row>
            <!-- 출금 가능 금액 -->
            <v-col class="text-center">
              <div class="text-h6" :style="{ color: '#1A237E' }"><strong>출금 가능 금액</strong></div>
              <div class="text-h4 font-weight-bold">10,000,000원</div>
              <v-btn class="mt-2" color="primary" large outlined>출금하기</v-btn>
            </v-col>

            <!-- 세로 구분선 -->
            <v-divider 
              vertical
              :style="{ borderRightWidth: '2px', borderColor: 'lightgray' }"
            ></v-divider>

            <!-- 예상 수익금 -->
            <v-col class="text-center">
              <div class="text-h6" :style="{ color: '#1A237E' }"><strong>예상 수익금</strong></div>
              <div class="text-h4 font-weight-bold">5,000,000원</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 차트 -->
    <v-row>
      <v-col>
        <v-card
          class="pa-4 mb-4"
          elevation="3"
          :style="{ borderRadius: '12px' }"
        >
          <div class="text-h5 mb-4 " :style="{ color: 'black' }"><strong>매출 차트</strong></div>
          <div
            class="chart-container"
            style="display: flex; justify-content: center; position: relative; height: 35vh; width: 100%;"
          >
            <canvas id="earningsChart" style="width: 80%;"></canvas>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 탭 메뉴 -->
    <v-tabs
    v-model="tab"
    grow
    background-color="primary"
    :style="{
      backgroundColor: 'white', 
      border: '1px solid lightgray', 
      borderRadius: '6px'
    }"
  >
    <!-- 전체 탭 텍스트 크기 및 중앙 정렬 -->
    <v-tab                      
    :style="{ color: 'black', padding: '12px 16px', fontSize: '18px', textAlign: 'center', display: 'flex', justifyContent: 'center' }">
      <strong>전체</strong>
    </v-tab>
  
    <!-- 수익 목록 탭 텍스트 크기 및 중앙 정렬 -->
    <v-tab :style="{ color: 'black', padding: '12px 16px', fontSize: '18px', textAlign: 'center', display: 'flex', justifyContent: 'center' }">
      <strong>수익 목록</strong>
    </v-tab>
  
    <!-- 출금 목록 탭 텍스트 크기 및 중앙 정렬 -->
    <v-tab :style="{ color: 'black', padding: '12px 16px', fontSize: '18px', textAlign: 'center', display: 'flex', justifyContent: 'center' }">
      <strong>출금 목록</strong>
    </v-tab>
  </v-tabs>

    <!-- 데이터 테이블 -->
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-data-table
          :headers="headers"
          :items="filteredData"
          class="elevation-1"
          :items-per-page="10"
          :style="{ border: '1px solid lightgray', borderRadius: '6px' }"
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
      // 더미 데이터 추가
      allData: [
        { date: "24/09/12", description: "정산금 출금", amount: "-2,000,000" },
        { date: "24/09/11", description: "최고의 고등 수학 과외", amount: "500,000" },
        { date: "24/09/10", description: "정산금 출금", amount: "-3,000,000" },
        { date: "24/09/09", description: "영어 과외 수익", amount: "300,000" },
        { date: "24/09/08", description: "정산금 출금", amount: "-1,500,000" },
        { date: "24/09/07", description: "정산금 출금", amount: "-1,200,000" },
        { date: "24/09/06", description: "영어 과외 수익", amount: "600,000" },
        { date: "24/09/05", description: "정산금 출금", amount: "-500,000" },
        { date: "24/09/04", description: "과학 과외 수익", amount: "400,000" },
        { date: "24/09/03", description: "정산금 출금", amount: "-700,000" },
        { date: "24/09/02", description: "정산금 출금", amount: "-800,000" },
        { date: "24/09/01", description: "수학 과외 수익", amount: "200,000" },
      ],
      incomeData: [
        { date: "24/09/11", description: "최고의 고등 수학 과외", amount: "500,000" },
        { date: "24/09/09", description: "영어 과외 수익", amount: "300,000" },
        { date: "24/09/06", description: "영어 과외 수익", amount: "600,000" },
        { date: "24/09/04", description: "과학 과외 수익", amount: "400,000" },
        { date: "24/09/01", description: "수학 과외 수익", amount: "200,000" },
      ],
      withdrawalData: [
        { date: "24/09/12", description: "정산금 출금", amount: "-2,000,000" },
        { date: "24/09/10", description: "정산금 출금", amount: "-3,000,000" },
        { date: "24/09/08", description: "정산금 출금", amount: "-1,500,000" },
        { date: "24/09/07", description: "정산금 출금", amount: "-1,200,000" },
        { date: "24/09/05", description: "정산금 출금", amount: "-500,000" },
        { date: "24/09/03", description: "정산금 출금", amount: "-700,000" },
        { date: "24/09/02", description: "정산금 출금", amount: "-800,000" },
      ],
    };
  },
  computed: {
    // 선택한 탭에 따라 필터링된 데이터를 반환
    filteredData() {
      if (this.tab === 1) {
        return this.incomeData;
      } else if (this.tab === 2) {
        return this.withdrawalData;
      }
      return this.allData;
    },
  },
  mounted() {
    const ctx = document.getElementById("earningsChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["23/11", "23/12", "24/01", "24/02", "24/03"],
        datasets: [
          {
            label: "수익",
            backgroundColor: "#3949AB",
            data: [500000, 600000, 700000, 800000, 900000],
            barThickness: 25,
          },
          {
            label: "출금",
            backgroundColor: "#FF1744",
            data: [300000, 200000, 100000, 400000, 500000],
            barThickness: 25,
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
.text-h4 {
  font-size: 1.6rem;
}

.chart-container {
  max-width: 100%;
}
</style>
