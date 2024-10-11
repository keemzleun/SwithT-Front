import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import vuetify from './plugins/vuetify.js';
import axios from 'axios';
import '@mdi/font/css/materialdesignicons.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import BootstrapVue3 from 'bootstrap-vue-3'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import '@vuepic/vue-datepicker/dist/main.css'

import '@mdi/font/css/materialdesignicons.css'
import { useKakao } from 'vue3-kakao-maps/@utils';

const app = createApp(App);

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => response,
  async error => {
    const token = localStorage.getItem("token");
    if (error.response && error.response.status === 401 && token != null) {
      try {
        localStorage.clear();
        alert("토큰이 만료되었습니다 재로그인 해주세요!!");
        window.location.href = "/login";
      } catch (e) {
        console.log(e.response);
      }
    }
    return Promise.reject(error);
  }
);
useKakao('03a055c21377bee26ab1559dedf4af6f',['clusterer', 'services', 'drawing']);
app.use(router);
app.use(vuetify);
// app.use(BootstrapVue3);
app.mount('#app');
