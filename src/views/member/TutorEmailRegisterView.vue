<template>
  <v-container>
    <h1>튜터 회원 가입</h1>
    <br />
    <v-card>
      <v-card-text>
        <v-form 
            @submit.prevent="memberCreate"
        >
          <!-- 이름 -->
          <v-row>
            <v-col><h2>이름</h2></v-col>
            <v-col>
              <v-text-field label="이름" v-model="name" required hide-details>
              </v-text-field>
            </v-col>
          </v-row>
          <!-- 이메일 -->
          <v-row>
            <v-col><h2>이메일</h2></v-col>
            <v-col>
              <v-text-field
                label="이메일"
                v-model="email"
                required
                hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>
          <!-- 인증코드 -->
          <v-row>
            <v-col><h2>인증 코드</h2></v-col>
            <v-col>
              <v-text-field
                label="인증코드"
                required
                hide-details
                v-model="otp"
              >
                <template v-slot:append>
                  <v-btn
                    @click="requestVerificationCode"
                    style="background-color: #42a5f5; color: white"
                    v-if="!codeSent"
                    ><h3>코드 전송</h3>
                  </v-btn>

                  <v-btn
                    v-else-if="!verificationSuccess"
                    @click="verifyCode"
                    style="background-color: #0d47a1; color: white"
                  >
                    <h3>코드 인증</h3>
                  </v-btn>

                  <v-btn v-else style="background-color: #bdbdbd; color: white">
                    <h3>인증 완료</h3>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <!-- 비밀번호 -->
          <v-row>
            <v-col><h2>비밀번호</h2></v-col>
            <v-col>
              <v-text-field
                label="비밀번호"
                v-model="password"
                required
                hide-details
                type="password"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <!-- 생년월일 -->
          <v-row>
            <v-col><h2>생년월일</h2></v-col>
            <v-col>
              <v-text-field
                label="생년월일"
                v-model="birthday"
                required
                hide-details
                type="date"
              >
              </v-text-field>
            </v-col>
          </v-row>

          <!-- 성별 -->
          <v-row>
            <v-col><h2>성별</h2></v-col>
            <v-col>
              <v-select
                label="성별"
                v-model="gender"
                :items="genderOptions"
                item-text="text"
                item-value="value"
                required
                hide-details
              ></v-select>
            </v-col>
          </v-row>
          <!-- 핸드폰 -->
          <v-row>
            <v-col><h2>핸드폰</h2></v-col>
            <v-col>
              <v-text-field
                label="핸드폰"
                v-model="phoneNumber"
                required
                hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>
          <!-- 주소 -->
          <v-row>
            <v-col><h2>주소</h2></v-col>
            <v-col>
              <v-text-field
                label="주소"
                v-model="address"
                required
                hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>
          <!-- 학력 -->
          <v-row>
            <v-col><h2>학력</h2></v-col>
            <v-col>
              <v-select
                label="학력"
                v-model="education"
                :items="['학사', '석사', '박사']"
                required
                hide-details
              >
              </v-select>
            </v-col>
          </v-row>
          <!-- 자기 소개 -->
          <v-row>
            <v-col><h2>자기 소개</h2></v-col>
            <v-col>
              <v-text-field
                label="자기 소개"
                v-model="introduce"
                required
                hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col><h2>프로필 이미지</h2></v-col>
            <v-col>
              <v-text-field>
                <v-file-input
                  label="프로필 이미지"
                  accept="image/*"
                  @change="fileUpdate"
                  hide-details
                >
                </v-file-input>
              </v-text-field>
            </v-col>
          </v-row>
          <v-btn type="submit" block class="join-btn">회원가입</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      // 회원가입 form data
      name: "",
      email: "",
      password: "",
      birthday: "",
      phoneNumber: "",
      introduce: "",
      address:"",
      education: "",
      avgScore: "",
      gender: "",
      genderOptions: [
        { text: "남성", value: "MAN" },
        { text: "여성", value: "WOMAN" },
      ],
      role: "TUTOR",
      otp: "",

      // 인증 코드 data
      codeSent: false, // 인증 코드가 전송되었는지 여부를 관리하는 상태
      verificationSuccess: false,
    };
  },
  methods: {
    async memberCreate() {
      
        try {
        let registerData = new FormData();

        const data = {
          name: this.name,
          email: this.email,
          password: this.password,
          birthday: this.birthday,
          phoneNumber: this.phoneNumber,
          introduce: this.introduce,
          education: this.education,
          gender: this.gender,
          role: this.role
        };

        registerData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
        registerData.append("file", this.profileImage);
        
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/create` , registerData);

        registerData.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );
        registerData.append("file", this.profileImage); // 이미지 파일 추가
        console.log(data);
        this.$router.push("/member/email/login");

      } catch (e) {
        const error_message = e.response.data.error_message;
        console.error(error_message);
        alert(error_message);
      }

    },
    async requestVerificationCode() {
      try {
        this.showOtpInput = true;
        this.codeSent = true;
        console.log(this.email);
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/email/requestCode?email=${this.email}`
        );
        alert(response.data.status_message);
      } catch (error) {
        console.error(error);
        this.codeSent = false;
        alert("이메일 인증 코드 전송에 실패했습니다.");
      }
    },
    async verifyCode() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/email/requestCode?email=${this.email}&code=${this.otp}`
        );
        alert(response.data.status_message);
        this.verificationSuccess = true;
      } catch (error) {
        console.error(error);
        this.verificationSuccess = false;
        alert("인증 코드가 올바르지 않습니다.");
      }
    },
  },
};
</script>
<style></style>
