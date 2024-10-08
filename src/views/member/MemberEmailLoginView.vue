<template>
  <v-container class="d-flex justify-center align-center" style="height: 65vh">
    <v-card class="pa-16" outlined style="width: 800px; height: 500px">
      
        <v-tabs 
        v-model="activeTab" 
        align-tabs="center"
        align-with-title>
        <v-tab value="tutee">튜터 로그인</v-tab>
        <v-tab value="tutor">튜티 로그인</v-tab>
      </v-tabs>

      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item value="tutee">
            <div>
                <br>
                <br>
                <v-form>
                    <v-text-field
                      label="이메일"
                      v-model="tutorEmail"
                      type="email"
                      required
                    ></v-text-field>
                    <v-text-field
                      label="비밀번호"
                      v-model="tutorPassword"
                      type="password"
                      required
                    ></v-text-field>
                    <v-btn color="skyblue" type="submit" class="ma-3">
                      튜터 로그인
                    </v-btn>
                  </v-form>
            </div>
        </v-tabs-window-item>
      </v-tabs-window>

      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item value="tutor">
            <div>
                <br>
                <br>
                <v-form>
                    <v-text-field
                      label="이메일"
                      v-model="tuteeEmail"
                      type="email"
                      required
                    ></v-text-field>
                    <v-text-field
                      label="비밀번호"
                      v-model="tuteePassword"
                      type="password"
                      required
                    ></v-text-field>
                    <v-btn color="skyblue" type="submit" class="ma-3">
                      튜터 로그인
                    </v-btn>
                </v-form>
            </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
    };
  },
  methods: {},
};
</script>

<style scoped>
.v-btn {
  font-weight: bold;
}
</style>
