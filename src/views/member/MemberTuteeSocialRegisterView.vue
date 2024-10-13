<template>
  <v-container>
    <h1>TUTEE 추가 정보 입력 화면</h1>
    <br />

    <v-card>
      <v-card-text>
        <v-form>
          <!-- 이름 -->
          <v-row>
            <v-col><h2>이름</h2></v-col>
            <v-col>
              <v-text-field label="이름" v-model="name" required hide-details />
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
              />
            </v-col>
          </v-row>

          <!-- 성별 -->
          <v-row>
            <v-col><h2>성별</h2></v-col>
            <v-col>
              <v-select
                label="성별"
                v-model="displayGender"
                :items="['남성', '여성']"
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
              />
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
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col><h2>프로필 이미지</h2></v-col>
            <v-col>
              <v-file-input
                label="프로필 이미지"
                accept="image/*"
                @change="fileUpdate"
                hide-details
              />
            </v-col>
          </v-row>

          <!-- 제출 버튼 -->
          <v-btn type="submit" block class="join-btn">회원가입</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
// import axios from 'axios';
export default {
  data() {
    return {

      name: "",
      birthday: "",
      phoneNumber: "",
      address: "",
      gender: "",
      displayGender: "",
      role: "TUTEE", // 튜터 회원가입 페이지 이므로 TUTOR로 명시할 것.
      profileImage: null, // 프로필 이미지 초기화

    };
  },
  methods:{

    

  }
};
</script>
<style></style>
