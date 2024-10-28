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
              <div class="text-h6" :style="{ color: '#1A237E' }">
                <strong>출금 가능 금액</strong>
              </div>
              <div class="text-h4 font-weight-bold">
                {{ formatMoney(memberInfo.availableMoney) }}원
              </div>
              <v-btn
                class="mt-2"
                color="primary"
                large
                outlined
                @click="showModal = true"
              >
                출금하기
              </v-btn>
            </v-col>

            <!-- 세로 구분선 -->
            <v-divider
              vertical
              :style="{ borderRightWidth: '2px', borderColor: 'lightgray' }"
            ></v-divider>

            <!-- 예상 수익금 -->
            <v-col class="text-center">
              <div class="text-h6" :style="{ color: '#1A237E' }">
                <strong>예상 수익금</strong>
              </div>
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
          <div class="text-h5 mb-4" :style="{ color: 'black' }">
            <strong>매출 차트</strong>
          </div>
          <div
            class="chart-container"
            style="
              display: flex;
              justify-content: center;
              position: relative;
              height: 35vh;
              width: 100%;
            "
          >
            <canvas id="earningsChart" style="width: 80%"></canvas>
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
        borderRadius: '6px',
      }"
    >
      <v-tab
        :style="{
          color: 'black',
          padding: '12px 16px',
          fontSize: '18px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
        }"
      >
        <strong>전체</strong>
      </v-tab>
      <v-tab
        :style="{
          color: 'black',
          padding: '12px 16px',
          fontSize: '18px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
        }"
      >
        <strong>수익 목록</strong>
      </v-tab>
      <v-tab
        :style="{
          color: 'black',
          padding: '12px 16px',
          fontSize: '18px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
        }"
      >
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

    <!-- 출금 모달 -->
    <v-dialog v-model="showModal" max-width="500px">
      <v-card style="border-radius: 12px">
        <!-- 제목에 색상 추가 -->
        <v-card-title
          class="d-flex justify-center text-h5"
          style="
            font-size: 1.4rem;
            font-weight: bold;
            color: white;
            background-color: #1a237e;
            padding: 12px;
            border-radius: 0px;
          "
        >
          출금 요청
        </v-card-title>

        <v-card-text>
          <v-form ref="withdrawalForm">
            <!-- 출금 가능 금액 (v-text-field 모양, 읽기 전용) -->
            <v-row class="mb-1" align="center">
              <v-col class="text-left mt-15" cols="12">
                <v-text-field
                  label="출금 가능 금액"
                  v-model="formattedAvailableMoney"
                  readonly
                  variant="outlined"
                  outlined
                  style="border-radius: 8px; width: 100%;"
                ></v-text-field>
              </v-col>
            </v-row>
        
            <!-- 출금 요청 금액 입력 -->
            <v-row align="center">
              <v-col class="text-left" cols="12">
                <v-text-field
                  label="출금할 금액"
                  v-model="withdrawAmount"
                  required
                  variant="outlined"
                  clearable
                  @input="updateRemainingMoney"
                  style="border-radius: 8px; width: 100%;"
                ></v-text-field>
              </v-col>
            </v-row>
        
            <!-- 출금 예정 금액 (v-text-field 모양, 읽기 전용) -->
            <v-row class="mb-10" align="center">
              <v-col class="text-left" cols="12">
                <v-text-field
                  label="출금 예정 금액"
                  v-model="formattedRemainingMoney"
                  readonly
                  outlined
                  style="border-radius: 8px; width: 100%;"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <!-- 확인/취소 버튼 -->
        <v-card-actions class="d-flex justify-center mt-4">
          <v-btn
            style="
              background-color: #6c97fd;
              width: 100px;
              height: 40px;
              border-radius: 8px;
              color: white;
            "
            @click="handleWithdrawal"
          >
            확인
          </v-btn>
          <v-btn
            style="
              background-color: #82d691;
              width: 100px;
              height: 40px;
              border-radius: 8px;
              color: white;
              margin-left: 16px;
            "
            @click="showModal = false"
          >
            취소
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
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
  async created() {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/member-service/infoGet`
    );
    this.memberInfo = response.data.result;
    const chartWithdrawalResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chart/withdrawal`);
    console.log("chartWithdrawal"+JSON.stringify(chartWithdrawalResponse));
    const chartWBalanceResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/payment-service/chart/balance`);
    console.log("chartWBalance"+JSON.stringify(chartWBalanceResponse));
    const withDrawalListResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/payment-service/list/balance`);
    console.log("withDrawalList",JSON.stringify(withDrawalListResponse));
    const BalanceListResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/list/withdrawal`);
    console.log("BalanceList",JSON.stringify(BalanceListResponse))
  },
  data() {
    return {
      memberInfo: {},
      tab: 0,
      showModal: false, // 모달 상태
      withdrawAmount: "", // 출금 요청 금액
      remainingMoney: 0, // 출금 예정 금액
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
      ],
    };
  },
  computed: {
    filteredData() {
      if (this.tab === 1) {
        return this.incomeData; // 수익 목록
      } else if (this.tab === 2) {
        return this.withdrawalData; // 출금 목록
      }
      return this.allData; // 전체 목록
    },
    formattedAvailableMoney() {
      return this.formatMoney(this.memberInfo.availableMoney);
    },
    formattedRemainingMoney() {
      return this.formatMoney(this.remainingMoney);
    },
  },
  methods: {
    formatMoney(value) {
      return value ? value.toLocaleString() : "0";
    },
    updateRemainingMoney() {
      const requestedAmount = this.withdrawAmount || 0;
      this.remainingMoney = requestedAmount * 0.9;
    },
    async handleWithdrawal() {
      if (!this.withdrawAmount || this.withdrawAmount <= 0) {
        alert("유효한 출금 금액을 입력하세요.");
        return;
      }

      try {
        const dto = {
          amount: this.withdrawAmount, 
          requestTime: new Date().toISOString(),
        };

        await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/withdrawal`,
          dto
        );
        alert("출금 요청 완료");
        this.showModal = false;
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("출금 요청 중 오류가 발생했습니다.");
      }
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
