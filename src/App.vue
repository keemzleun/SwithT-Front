<template>
  <!-- <div id="app">
    <router-view></router-view>
  </div>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <v-app>
    <HeaderComponent />
    <SidebarComponent/>
    <v-main>
      <v-container fluid class="custom-container">
        <routerView />
      </v-container>
    </v-main>
    <FooterComponent />
  </v-app>
</template>

<script>
import FooterComponent from '@/components/footer/FooterComponent.vue'
import HeaderComponent from '@/components/header/HeaderComponent.vue'
import SidebarComponent from '@/components/sideBar/SideBarComponent.vue'

export default {
  name: 'App',
  components: {
    FooterComponent,
    HeaderComponent,
    SidebarComponent
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
