<template>
    <v-container>
        <h1>튜터 회원 가입</h1>
        <br>
        <v-card>
            <v-card-text>
                <v-form>
                    <!-- 이름 -->
                    <v-row>
                        <v-col><h2>이름</h2></v-col>
                        <v-col>
                            <v-text-field
                                label="이름"
                                v-model="name"
                                required hide-details
                            >

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
                                required hide-details
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
                                required hide-details
                                v-model="otp"
                                
                            >

                            <template v-slot:append>
                                  <v-btn 
                                  @click="requestVerificationCode"
                                  style="background-color: #42A5F5; color: white;"
                                  v-if="!codeSent"
                                  ><h3>인증 코드 전송</h3>
                                  </v-btn>
                                  
                                  <v-btn 
                                  v-else 
                                  @click="verifyCode"
                                  style="background-color: #66BB6A; color: white;"
                                  >
                                  <h3>코드 검증</h3>
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
                                required hide-details
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
                                required hide-details
                                type="date"
                            >

                            </v-text-field>
                        </v-col>
                    </v-row>

                    <!-- 성별 -->
                    <v-row>
                        <v-col><h2>성별</h2></v-col>
                        <v-col>
                            <v-text-field
                                label="성별"
                                v-model="gender"
                                required hide-details
                            >

                            </v-text-field>
                        </v-col>
                    </v-row>                   
                    <!-- 핸드폰 -->
                    <v-row>
                        <v-col><h2>핸드폰</h2></v-col>
                        <v-col>
                            <v-text-field
                                label="핸드폰"
                                v-model="phoneNumber"
                                required hide-details
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
                                required hide-details
                            >

                            </v-text-field>
                        </v-col>
                    </v-row>

                    <!-- 학력 -->
                    <v-row>
                        <v-col><h2>학력</h2></v-col>
                        <v-col>
                            <v-text-field
                                label="학력"
                                v-model="address"
                                required hide-details
                            >

                            </v-text-field>
                        </v-col>
                    </v-row>

                    <!-- 자기 소개 -->
                    <v-row>
                        <v-col><h2>자기 소개</h2></v-col>
                        <v-col>
                            <v-text-field
                                label="자기 소개"
                                v-model="introduce"
                                required hide-details
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
                                accept="image/*" @change="fileUpdate" 
                                hide-details>
                                </v-file-input>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
import axios from 'axios'
export default{
    data(){
        return{

            // 회원가입 form data
            name:"",
            email:"",
            password:"",
            birthday:"",
            phoneNumber:"",
            introduce:"",
            education:"",
            avgScore:"",
            gender:"",
            role:"TUTOR",
            otp:"",

            // 인증 코드 data
            codeSent: false, // 인증 코드가 전송되었는지 여부를 관리하는 상태

        }
    
    },
    methods:{
        async requestVerificationCode() {
            try {
                this.showOtpInput = true;
                this.codeSent = true;
                console.log(this.email)
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/email/requestCode?email=${this.email}`);
                alert(response.data.status_message);
            
            } catch (error) {
                console.error(error);
                alert('이메일 인증 코드 전송에 실패했습니다.');
            }
        
        },
        async verifyCode() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/email/requestCode?email=${this.email}&code=${this.otp}`);
                alert(response.data.status_message);
                this.showOtpInput = false;
                this.showRequestBtn = false;
            } catch (error) {
                console.error(error);
                alert('인증 코드가 올바르지 않습니다.');
            }
        }
    }
}



</script>
<style>

</style>