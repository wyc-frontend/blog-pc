<template>
  <div class="sideR">
    <div class="recentArticle">
      <p>最近文章</p>
      <ul>
        <li v-for="(item,index) in articleList" :key="item.id">
          <div @click="goArticleDetails(item.id)" class="ArtTitle">{{ item.title }}</div>
          <div class="ArtTime">{{ item.time }}</div>
        </li>

      </ul>
    </div>
    <div class="blogInfo">
      <div class="infoT infoSon">博客信息</div>
      <div class="artTotal artTotals infoSon">
        <div class="_text">文章总数</div>
        <div class="_num">{{ articleListLenth }}</div>
      </div>
      <div class="startDay artTotal infoSon">
        <div class="_text">运行天数</div>
        <div class="_num">10</div>
      </div>
    </div>
    <Music></Music>
  </div>
</template>
<script setup>
import Music from '@/components/Music.vue';
import { articleStores } from '@/store/article'
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const articleStore = articleStores()
const { articleListArr } = storeToRefs(articleStore)

const articleListLenth = computed(() => {
  return articleListArr.value.length
})
const articleList = computed(() => {
  return articleListArr.value.sort(dateData("time",false)).slice(0,6) 
})

const goArticleDetails = (id) => {
    router.push('/article/' + id)
}

//排序方法
const dateData = (property, type) => {
  //property是你需要排序传入的时间,type为true时是升序，false为降序
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    if (type) {
      // 升序
      return Date.parse(value1) - Date.parse(value2);
    } else {
      // 降序
      return Date.parse(value2) - Date.parse(value1)
    }

  }
}

</script>
<style lang="less" scoped>
.sideR {
  margin-left: 3px;
  flex: 0.3;
  background: rgba(254, 254, 254, .6);
  opacity: .6;

  .recentArticle {
    p {
      font-weight: bold;
    }

    p::before {
      content: url("@/assets/artNews.png");
      vertical-align: middle;
      margin-right: 12px;
      margin-left: 8px;
    }

    width: calc(100% - 2px);
    min-height: 260px;

    ul {
      height: calc(100% - 24px);
      display: flex;
      padding-left: 0;
      flex-direction: column;

      li {
        flex: 1;
        // background-color: #f2f6fc;
        border-bottom: 1px solid rgba(153, 153, 153, 1.000);
        list-style: none;
        display: flex;

        div:nth-child(1){
          cursor: pointer;
        }

        div {
          text-align: left;
          font-size: 13px;
          line-height: 39px;
        }

        .ArtTitle {
          flex: 1;
          padding-left: 12px;
        }

        .ArtTime {
          flex: 0.8;
        }
      }
    }
  }

  .blogInfo {
    background-color: #f2f6fc;
    margin-top: 32px;
    width: 100%;
    height: 120px;
    display: flex;
    flex-direction: column;

    .infoSon {
      flex: 1;
    }

    .artTotals {

      ._text,
      ._num {
        font-size: 13px;
      }

      ._text::before {
        content: url("@/assets/artTotal.png");
        vertical-align: middle;
        margin-right: 12px;
        margin-left: 8px;
      }
    }

    .startDay {

      ._text,
      ._num {
        font-size: 13px;
      }

      ._text::before {
        content: url("@/assets/Days.png");
        vertical-align: middle;
        margin-right: 12px;
        margin-left: 8px;
      }
    }

    .infoT {
      font-weight: bold;
    }

    .infoT::before {
      content: url("@/assets/blog.png");
      vertical-align: middle;
      margin-right: 12px;
      margin-left: 8px;
    }

    .artTotal {
      display: flex;

      div:nth-child(1) {
        flex: 1;
      }

      div:nth-child(2) {
        flex: 0.3;
      }
    }
  }
}
</style>