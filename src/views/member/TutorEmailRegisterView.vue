<template>
    <v-container>
        <h1>튜터 회원 가입</h1>

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
                                
                            >
                            <v-btn style="margin-left: auto;" >인증 코드 전송</v-btn> 
<!-- 버튼 위치 우측으로 옮기고 상태변경 처리하기. -->
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
                                type="password"
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
                            <v-file-input 
                            label="프로필 이미지" 
                            accept="image/*" @change="fileUpdate" 
                            hide-details>
                            </v-file-input>
                        </v-col>
                    </v-row>

                </v-form>
            </v-card-text>
        </v-card>

    </v-container>
</template>
<script>
// import axios from 'axios'
// export default{

//     data(){

//         return{
//             name:"",
//             email:"",
//             password:"",
//             birthday:"",
//             phoneNumber:"",
//             introduce:"",
//             education:"",
//             avgScore:"",
//             gender:"",
//             role:"TUTOR",

//         }
    
//     },
// }



</script>
<style>

</style>