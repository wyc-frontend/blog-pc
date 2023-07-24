<template>
  <div class="sideL">
    <div class="authorInfo">
      <img src="@/assets/1.jpg" alt="" />
      <div class="info">
        <p>wyc</p>
        <span style="display: inline-block">A good developer</span>
      </div>
    </div>
    <div class="navigation">
      <p>导航</p>
      <ul ref="ul">
        <li @click="selected(0)"><span>首页</span></li>
        <li @click="selected(1)"><span>照片墙</span></li>
        <li @click="selected(2)"><span>留言板</span></li>
        <li @click="selected(3)"><span>个人信息</span></li>
        <li @click="selected(4)"><span>在线聊天室</span></li>
      </ul>
      <div class="qt">
        <p>其它</p>
        <div @click="router.push('/admin/login')">后台管理</div>
        <div @click="ulTransitionFn">文章分类</div>
        <ul style="height:0px;" ref="ulList">
          <li @click="goArticleC(item.cname)" v-for="(item,index) in classifyArr" :key="item.id">{{ item.cname }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router"
import { getClassifyList } from "@/api";

let ul = ref("ul");
const ulList = ref('ulList')
const router = useRouter()
const route = useRoute()
const clickV = ref('')
const classifyArr = ref([])


const goArticleC = (cname) => {
    router.push('/classifylistshow/?cname=' + cname)
}

const ulTransitionFn = () => {
  if (ulList.value.style.height === '0px') {
    ulList.value.style.height = classifyArr.value.length * 32 + 'px'    //根据数组元素个数来计算ul的高度
    ulList.value.style.transition = 'height 1s'
  }else{
    ulList.value.style.height = '0px'
   
  }
}

function selected(p) {
  for (const iterator of ul.value.children) {
    iterator.style.color = "white";
  }
  // ul.value.children[p].style.color = "gold";
  clickV.value = p
  switch (p) {
    case 1:
      router.push('/photowall')
      break;
    case 0:
      router.push('/')
      break;
    case 2:
      router.push('/messageboard')
      break;
    case 3:
      router.push('/userinfo')
      break;
    case 4:
      router.push('/chatroom')
      break;
    default:
      break;
  }
}

watch(()=>route.params, (o, n) => {
  if (route.path.indexOf('/home')!==-1||route.path.indexOf('/photowall')!==-1||route.path.indexOf('/messageboard')!==-1||route.path.indexOf('/userinfo')!==-1||route.path.indexOf('/chatroom')!==-1) {
    ul.value.children[clickV.value].style.color = "gold";
  }
},{
  deep:true,
  // immediate:true
})

const getClassifyL = async () => {
  let res = await getClassifyList()
  if (res.data.code===0) {
    classifyArr.value = res.data.data
  }
}
onBeforeMount(()=>{
  getClassifyL()
})
</script>
<style lang="less" scoped>
.sideL {
  flex: 0.25;
  margin-right: 3px;
  min-height: 730px;
  background-color: rgba(0, 0, 0, 0.6);

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
    min-height: 730px;
    // height: calc(100% - 84px);

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

        span::before {
          content: url("@/assets/home0.png");
          vertical-align: middle;
          margin-right: 14px;
        }

        span:hover {
          cursor: pointer;
        }
      }

      li:nth-child(2) {
        span::before {
          content: url("@/assets/picture.png");
          vertical-align: middle;
          margin-right: 14px;
        }
      }

      li:nth-child(3) {
        span::before {
          content: url("@/assets/msgBoard.png");
          vertical-align: middle;
          margin-right: 14px;
        }
      }

      li:nth-child(4) {
        span::before {
          content: url("@/assets/person.png");
          vertical-align: middle;
          margin-right: 14px;
        }
      }

      li:nth-child(5) {
        span::before {
          content: url("@/assets/speak.png");
          vertical-align: middle;
          margin-right: 14px;
        }
      }
    }

    .qt {
      div {
        margin-top: 12px;
        padding-left: 16px;

      }

      div:hover {
        cursor: pointer;
      }

      div:nth-child(2)::before {
        content: url("@/assets/bgIcon.png");
        vertical-align: middle;
        margin-right: 14px;
      }
      div:nth-child(3)::before {
        content: url("@/assets/classify.png");
        vertical-align: middle;
        margin-right: 14px;
      }
      ul{
        height: 0px;
        overflow: hidden;
        li{
          line-height: 32px;
          // border-top: 1px solid #999999;
          cursor: pointer;
        }
      }
    }
  }
}
</style>