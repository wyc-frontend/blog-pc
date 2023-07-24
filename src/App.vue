<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineAsyncComponent } from 'vue';
import pConfig from "@/assets/particlesConfig.js"
import { loadFull } from 'tsparticles'

const center = ref("center");
const router = useRouter();
const route = useRoute();

// const musicSml = ref("musicSml")
//延迟加载这几个组件解决闪屏问题
const Header = defineAsyncComponent(() =>
  import('@/components/Header.vue')
)
const SideLeft = defineAsyncComponent(() =>
  import('@/components/SideLeft.vue')
)
const SideRight = defineAsyncComponent(() =>
  import('@/components/SideRight.vue')
)
const particlesInit = async (engine) => {
  await loadFull(engine)
}
const particlesLoaded = async (container) => {
  console.log('Particles container loaded', container)
}


</script>

<template>
  <div class="container">

    <Header v-if="route.path.indexOf('/admin') == -1"></Header>
    <div class="main">
      <Particles :options="pConfig.options" :particlesLoaded="particlesLoaded" id="tsparticles" class="login-partic"
        :particlesInit="particlesInit" />
      <SideLeft v-if="route.path.indexOf('/admin') == -1"></SideLeft>
      <div class="center" ref="center">
    
        <router-view></router-view>
      </div>
      <SideRight v-if="route.path.indexOf('/admin') == -1"></SideRight>
    </div>
  </div>
</template>

<style scoped lang="less">
#app {

  @media (min-width: 1024px) {
    .container {
      width: 78%;
      height: 100%;
    }
  }

  .container {
    width: 100%;
    height: 100%;
    margin: 0 auto;

    .main {
      display: flex;
      width: 100%;
      height: 100%;

      // opacity: 0.7;
      // background: rgba(254,254,254,.6);
      .sideL {
        flex: 0.25;
        margin-right: 3px;

        .authorInfo {
          width: 100%;
          height: 80px;
          background: rgba(0, 0, 0, 0.6);
          margin: 2px 0px;
          padding: 6px;

          img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            float: left;
            margin: 10px 12px;
          }

          .info {
            margin-top: 8px;
            float: left;
            width: calc(100% - 48px - 32px);
            color: white;

            span {
              font-size: 12px;
            }
          }
        }

        .navigation {
          color: white;
          width: 100%;
          height: calc(100% - 84px);
          background: rgba(0, 0, 0, 0.6);

          p {
            font-size: 16px;
            padding-left: 12px;
          }

          ul {
            margin-top: 12px;
            width: 100%;
            height: 200px;
            display: flex;
            flex-direction: column;
            padding-left: 16px;

            li {
              // box-sizing: border-box;
              // padding: 16px;
              font-size: 13px;
              list-style: none;
              flex: 1;

              span:nth-child(1)::before {
                content: url("@/assets/home0.png");
                vertical-align: middle;
                margin-right: 14px;
              }

              span:hover {
                cursor: pointer;
              }
            }
          }
        }
      }

      @media (max-width: 1024px) {
        .sideL {
          display: none;
        }
      }

      .center {
        flex: 1;
        min-height: 730px;
        .musicSml{
          position: absolute;
          z-index: 99;
          
        }
        // background-repeat: no-repeat;
        // background-size: cover;
      }

      @media (max-width: 1024px) {
        .sideR {
          display: none;
        }
      }
    }
  }
}
</style>