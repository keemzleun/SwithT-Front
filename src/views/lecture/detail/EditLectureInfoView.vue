<template>
    <v-container>
        <h2 style="font-weight: bold">강의 수정</h2>
        <hr style="margin: 40px 0">
        <v-form>
            <!-- 수업 방식 -->
            <v-row class="form-group align-center">
                <v-col cols="3" class="d-flex align-center justify-center">
                    <label>수업 방식</label>
                </v-col>
                <v-col cols="8">
                    <div class="custom-select-box">
                        <transition name="fade">
                            <div style="display: flex; flex-wrap: wrap; gap: 8px">
                                <div v-for="method in teachingMethods" :key="method.value"
                                    :class="['custom-option', teachingMethod === method.value ? 'selected' : '']"
                                    @click="teachingMethod === method.value && $event.stopPropagation()">
                                    {{ method.label }}
                                </div>
                            </div>
                        </transition>
                    </div>
                </v-col>
            </v-row>

            <!-- 분야 -->
            <v-row class="form-group align-center">
                <v-col cols="3" class="d-flex align-center justify-center">
                    <label>분야</label>
                </v-col>
                <v-col cols="8">
                    <div class="custom-select-box">
                        <transition name="fade">
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                <div v-for="option in fieldOptions" :key="option.value"
                                    :class="['custom-option', field === option.value ? 'selected' : '']"
                                    @click="field = option.value">
                                    {{ option.label }}
                                </div>
                            </div>
                        </transition>
                    </div>
                </v-col>
            </v-row>

            <!-- 강의명 -->
            <v-row class="form-group align-center">
                <v-col cols="3" class="d-flex align-center justify-center">
                    <label>강의명</label><br />
                </v-col>
                <v-col cols="8">
                    <input v-model="title" class="form-control" placeholder="강의명을 입력해주세요" type="text" />
                </v-col>
            </v-row>

            <!-- 썸네일 -->
            <v-row class="form-group align-center">
                <v-col cols="3" class="d-flex align-center justify-center">
                    <label>썸네일</label>
                </v-col>
                <v-col cols="8">
                    <input type="file" id="thumbnail" @change="onFileChange" accept="image/*" class="form-control" />
                </v-col>
            </v-row>

            <!-- 강의 정보 -->
            <v-row class="form-group align-center">
                <v-col cols="3" class="d-flex align-center justify-center">
                    <label>강의 소개</label>
                </v-col>
                <v-col cols="8">
                    <textarea v-model="contents" class="form-control" placeholder="강의 소개를 입력해주세요" style="height: 30vh" />
                </v-col>
            </v-row>
            
            <!-- 강의 주소, 시작일, 종료일 -->
            <v-row v-if="teachingMethod === 'LECTURE'" class="form-group align-center">
                <v-col cols="3" class="d-flex align-center justify-center">
                    <label>강의 주소</label>
                </v-col>
                <v-col cols="8">
                    <v-row align="center">
                        <v-col cols="2" class="align-left">
                            <v-btn style="border: 1px solid #dee2e6; background-color: #f8f9fa; font-size: 14px" variant="outlined"
                                @click="updateAddress()">주소 검색</v-btn>
                        </v-col>
                        <v-col class="align-center justify-center">
                            <div class="text-left" style="font-weight: 700">{{ this.address }}</div>
                        </v-col>
                    </v-row>
                    <v-row style="padding: 0 12px 10px;">
                        <input v-model="detailAddress" class="form-control" placeholder="상세주소를 입력해주세요" type="text"/>
                    </v-row>
                </v-col>
            </v-row>
            <v-row v-if="teachingMethod === 'LECTURE'" class="form-group align-center">
                <v-col cols="3" class="d-flex align-center justify-center">
                    <label>강의 기간</label>
                </v-col>
                <v-col cols="1">시작일</v-col>
                <v-col cols="3">
                    <input v-model="startDate" class="form-control" type="date" />
                </v-col>
                <v-col cols="1">종료일</v-col>
                <v-col cols="3">
                    <input v-model="endDate" class="form-control" type="date" />
                </v-col>
            </v-row>

            <!-- 강의 수정 버튼 -->
            <v-row class="form-group align-center">
                <v-col cols="3"></v-col>
                <v-col cols="8">
                    <v-btn color="primary" @click="updateLecture">강의 수정</v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
/* global kakao */
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
    data() {
        return {
            teachingMethod: '',
            field: '',
            title: '',
            address: '',
            detailAddress: '',
            startDate: '',
            endDate: '',
            contents: '',
            teachingMethods: [
                { value: 'LECTURE', label: '강의' },
                { value: 'LESSON', label: '과외' },
            ],
            fieldOptions: [
                { value: 'ADMISSION', label: '입시' },
                { value: 'CAREER', label: '취업 & 직무' },
                { value: 'HOBBY', label: '취미' },
                { value: 'DEVELOPMENT', label: '자기계발' }
            ],
            thumbnail: null,
        };
    },
    mounted() {
        this.fetchLectureDetail();
        this.loadDaumPostcodeScript();
        this.loadKakaoMapScript(); 
    },
    methods: {
        async fetchLectureDetail() {
            const route = useRoute();
            const lectureId = route.params.id;
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/lecture-detail/${lectureId}`);
                const data = response.data.result;

                // this를 사용하여 data에 직접 접근
                this.teachingMethod = data.lectureType;
                this.field = data.category;
                this.title = data.title;
                this.contents = data.contents;
                this.thumbnail = data.image;
                this.startDate = data.startDate;
                this.endDate = data.endDate;
            } catch (error) {
                console.error('강의 정보를 가져오는 데 실패했습니다:', error);
            }
        },
        onFileChange(event) {
            this.thumbnail = event.target.files[0];
        },
        async updateLecture() {
            const lectureId = this.$route.params.id;

            const updateData = {
                category: this.field,
                title: this.title,
                contents: this.contents,
            };
            // FormData를 사용하여 데이터와 파일을 함께 전송
            const formData = new FormData();
            formData.append('data', new Blob([JSON.stringify(updateData)], { type: 'application/json' }));

            if (this.thumbnail) {
                formData.append('file', this.thumbnail); // 이미지 파일 추가
            }

            try {
                const token = localStorage.getItem('token');
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/lecture-service/update/${lectureId}`,
                formData,
                {
                    headers: {
                    'Authorization': `Bearer ${token}`, // 토큰 설정
                    'Content-Type': 'multipart/form-data' // FormData 전송 형식 설정
                    }
                }
            );
                alert('강의가 성공적으로 수정되었습니다.');
                window.location.href = `/lecture/${lectureId}`;
            } catch (error) {
                console.error('강의 수정에 실패했습니다:', error);
            }
        },
        loadDaumPostcodeScript() {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        this.isDaumScriptLoaded = true;
      };
      document.head.appendChild(script);
    },
    loadKakaoMapScript() {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=03a055c21377bee26ab1559dedf4af6f&libraries=services&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          this.isKakaoScriptLoaded = true;
        });
      };
      document.head.appendChild(script);
    },
    updateAddress() {
      if (window.daum && window.daum.Postcode) {
        // eslint-disable-next-line no-undef
        new daum.Postcode({
          oncomplete: (data) => {
            this.address = data?.roadAddress;

            // 주소 검색한 거 기반으로 위도 경도
            // 좌표 검색을 위해 Kakao 지도 Geocoder 사용
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(this.roadAddress, (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                console.log('위도 : ' + result[0].y);
                console.log('경도 : ' + result[0].x);

                // 지도에 마커를 추가하는 로직
                this.initMap(result[0].y, result[0].x);
              }
            });
          }
        }).open();
      } else {
        console.error("Daum Postcode 스크립트가 로드되지 않았습니다.");
      }
    },
        
    },
    
    
};
</script>


<style scoped>
.v-container {
    margin: 60px 0;
    width: 70vw;
}
.custom-select-box {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
  
.custom-option {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.custom-option.selected {
    border-color: #007bff;
    background-color: #e7f0ff;
    transform: scale(1.05);
}
</style>