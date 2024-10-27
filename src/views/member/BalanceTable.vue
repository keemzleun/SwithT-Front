<template>
    <v-container fluid class="py-4 px-2 mt-15">
      <!-- 상단 출금 가능 금액과 예상 수익금 -->
      <v-row class="mb-4 mt-15">
        <v-col cols="12" md="6">
          <v-card class="pa-3">
            <div class="text-h6">출금 가능한 금액</div>
            <div class="text-h5 font-weight-bold">10,000,000원</div>
            <v-btn class="mt-2" color="primary" large>출금하기</v-btn>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="pa-3">
            <div class="text-h6">예상 수익금</div>
            <div class="text-h5 font-weight-bold">5,000,000원</div>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 그래프 (임의 더미 데이터) -->
      <v-card class="pa-3 mb-4">
        <div class="text-h6 mb-2">그래프 (입금 파란색, 출금 빨간색)</div>
        <div class="chart-container" style="position: relative; height: 35vh; width: 100%;">
          <canvas id="earningsChart"></canvas>
        </div>
      </v-card>
  
      <!-- 테이블 (수익 목록, 출금 목록) -->
      <v-tabs v-model="tab" background-color="white" grow>
        <v-tab>전체</v-tab>
        <v-tab>수익 목록</v-tab>
        <v-tab>출금 목록</v-tab>
      </v-tabs>
  
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-data-table :headers="headers" :items="allData" class="elevation-1"></v-data-table>
        </v-tab-item>
        <v-tab-item>
          <v-data-table :headers="headers" :items="incomeData" class="elevation-1"></v-data-table>
        </v-tab-item>
        <v-tab-item>
          <v-data-table :headers="headers" :items="withdrawalData" class="elevation-1"></v-data-table>
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
  } from 'chart.js';
  
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
          { date: "24/09/11", description: "최고의 고등 수학 과외", amount: "500,000" },
          { date: "24/09/10", description: "정산금 출금", amount: "-3,000,000" },
        ],
        incomeData: [
          { date: "24/09/11", description: "최고의 고등 수학 과외", amount: "500,000" },
        ],
        withdrawalData: [
          { date: "24/09/10", description: "정산금 출금", amount: "-3,000,000" },
        ],
      };
    },
    mounted() {
      // 차트 생성 (더미 데이터)
      const ctx = document.getElementById('earningsChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['23/11', '23/12', '24/01', '24/02', '24/03'],
          datasets: [
            {
              label: '수익',
              backgroundColor: 'blue',
              data: [500000, 600000, 700000, 800000, 900000],
            },
            {
              label: '출금',
              backgroundColor: 'red',
              data: [300000, 200000, 100000, 400000, 500000],
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
  .chart-container {
    max-width: 100%;
  }
  </style>
  