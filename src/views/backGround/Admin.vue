<template>
  <div>
    <!-- <Particles :options="pConfig.options" class="login-particles" id="tsparticles"  :particlesInit="particlesInit" :particlesLoaded="particlesLoaded" /> -->
    <!-- <Login v-if="route.path === '/admin/login'"></Login> -->
    <!-- <Index v-else-if="route.path === '/admin/index'"></Index> -->
    <!-- <Register v-else-if="route.path === '/admin/register'"></Register> -->
    <router-view></router-view>
  </div>
</template>
<script setup>
import Login from "@/views/backGround/Login.vue";
import Index from "@/views/backGround/Index.vue";
import Register from "@/views/backGround/Register.vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import pConfig from "@/assets/particlesConfig.js"

import { loadFull } from 'tsparticles'

let uname = ''

const route = useRoute();
const particlesInit = async (engine) => {
  await loadFull(engine)
}

const particlesLoaded = async (container) => {
  console.log('Particles container loaded', container)
}


onMounted(()=>{
  uname = route.query.uname
})
</script>
<style scoped>
#particles {
  height: 100%;
}
</style>