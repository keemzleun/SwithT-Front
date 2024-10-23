<template>
    <div class="mt-15">
      <v-btn @click="showModal">리뷰 작성</v-btn>
      <ReviewCreate ref="ReviewCreate" />
    </div>
  </template>
  
  <script>
  import ReviewCreate from '@/components/ReviewCreate.vue';
  
  export default {
    components: {
        ReviewCreate,
    },
    methods: {
      showModal() {
        this.$refs.ReviewCreate.dialog = true; // 모달 열기
      },
    },
  };
  </script>
  