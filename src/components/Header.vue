<template>
  <div class="header">
    <div class="logo">
      <el-button @click="visible = true" size="small"> ≡ </el-button>
      <el-drawer v-model="visible" :with-header="false" :show-close="false" size="40%"
        style="--el-drawer-padding-primary: none">
        <Side-Left></Side-Left>
      </el-drawer>
      <h2>wyc's Blog</h2>
    </div>
    <div class="search">
      <el-input ref="ipt" v-model="searchV" class="w-50 m-2" placeholder="请输入关键字">
        <template #suffix>
          <el-icon class="el-input__icon" @click="searchArticle"><search /></el-icon>
        </template>

      </el-input>
    </div>
    <div class="zw"></div>
    <div v-if="loginInfo.token" class="loginStatus">
      <div class="headImg">
        <img :src="loginInfo.imgUrl" alt="" />
      </div>
      <div class="uN">
        <span>{{ loginInfo.userName }}</span>
        <em @click="exitLogin">退出</em>
      </div>
    </div>
    <div v-else class="pleaseL">
      <i @click="loginFn('login')">登录</i>
      &nbsp;
      <i @click="loginFn('register')">注册</i>
      <Login :status="status" :visible="bool"></Login>
    </div>

  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { ElButton, ElDrawer, ElMessage } from "element-plus";
// import { CircleCloseFilled } from "@element-plus/icons-vue";
import SideLeft from "@/components/SideLeft.vue";
import Login from "@/components/Login.vue"
import { useMainStore } from "@/store/user"
import { storeToRefs } from "pinia"
import { reqExitLoginWeb } from "@/api";
import { useRouter } from "vue-router";

const ipt = ref('ipt')
const useStore = useMainStore()
const router = useRouter()
const { loginInfo, dialog } = storeToRefs(useStore)
let searchV = ref("");

//抽屉组件弹出状态
let visible = ref(false);
//登录注册组件弹窗状态
// let proxy = new Proxy(dialog, {
//   get(target, property) {
//     return target[property]
//   },
//   set(target, property, value) {
//     if (target[property] === value) return
//     target[property] = value
//     observer()
//   }
// })

let status = ref('')
let bool = ref(false)
//方法
const exitLogin = async () => {
  let obj = {
    username: loginInfo.value.userName,
    token: loginInfo.value.token
  }
  let res = await reqExitLoginWeb(obj)
  if (res.data.code === 0) {
    loginInfo.value.status = false
    loginInfo.value.userName = ''
    loginInfo.value.imgUrl = ''
    loginInfo.value.token = ''

    ElMessage({
      message: '退出成功',
      type: 'success',
    })
  }

}
const loginFn = (param) => {
  if (param === 'login') {
    status.value = 'login'

  } else {
    status.value = param
  }
  bool.value = !bool.value
}
const searchArticle = () => {
  router.push('/searchshow?keyword='+searchV.value)
}
</script>
<style lang="less" scoped>
.header {
  height: 50px;
  background-color: #414753;
  width: 100%;
  display: flex;

  div {
    flex: 1;
  }

  @media (max-width: 1024px) {
    .zw {
      display: none;
    }
  }

  .logo {
    .el-drawer {
      padding: 0;
    }

    .el-button {
      display: none;
      margin: 12px 14px;
    }

    h2 {
      color: #fefefe;
      margin-top: 4px;

      padding-left: 50px;
    }
  }

  @media (max-width: 1024px) {
    .logo>h2 {
      display: none;
    }

    .logo>.el-button {
      display: block;
    }
  }

  .search {
    @media (min-width: 1024px) {
      .el-input {
        width: 66%;
      }
    }

    .el-input {
      margin-top: 10px;
      width: 88%;
      height: 60%;
    }
  }

  .pleaseL {
    color: #fefefe;
    text-align: center;
    line-height: 50px;

    i {
      font-style: normal;
    }

    i:hover {
      color: antiquewhite;
      cursor: pointer;
    }
  }

  .loginStatus {
    display: flex;

    .headImg {
      flex: 0.6;

      img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        float: right;
        margin-right: 16px;
        margin-top: 8px;
      }
    }

    .uN {
      flex: 1;

      span {
        color: #fefefe;
        line-height: 50px;
        font-size: 22px;
      }

      em {
        font-style: normal;
        color: #fefefe;
        margin-left: 8px;
        font-size: 12px;
        cursor: pointer;
      }

      em:hover {
        color: antiquewhite;
      }
    }
  }
}
</style>