<template>
  <el-card class="box-card" v-for="(item, index) in dataSptFn()" :key="item.id">
    <template #header>
      <div class="card-header">
        <span>{{ item.title }}</span>

        <!-- <el-button class="button" text>Operation button</el-button> -->
        <span><el-tag>{{ item.cname }}</el-tag>
          {{ item.username }}</span>
      </div>
    </template>
    <div class="text item" style="cursor: pointer;" @click="goArticleDetails(item.id)">{{ item.description }}</div>
  </el-card>
  <div class="pagination">
    <el-pagination background layout="prev, pager, next" :total="computedTotal" v-model="paginationData.currentPage" :page-size="paginationData.pageSize" @current-change="chekPage" @prev-click="pFn" @next-click="nFn"/>
  </div>
  <div class="footer">
    <div></div>
    <a href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备2023001078号-1</a>
    <div></div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive,computed } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { getArticleList } from '@/api';
import { articleStores } from '@/store/article.js'
import { storeToRefs } from 'pinia';


const router = useRouter()
const articleList = ref([])

const articleStore = articleStores()
const { articleListArr } = storeToRefs(articleStore)


//分页数据初始化
let paginationData = reactive({
    tableData: [],  // 总的数据
    pageData: [],   // 分页的数据
    currentPage: 1, // 当前页 默认是第一页
    pageSize: 4,   // 每页大小 默认每页5条数据
    pageTotal: 0 		// 总数据量 默认为 0
})

const chekPage = (p) => {
  paginationData.currentPage = p
}

const pFn = () => {
    paginationData.currentPage = paginationData.currentPage--
}

const nFn = () => {
    paginationData.currentPage = paginationData.currentPage++
}

const computedTotal = computed(()=>{
  return paginationData.tableData.length
})

//数据分割方法
const dataSptFn = () => {
    let { currentPage, pageSize, tableData } = paginationData
    //起始位置为当前页-1*每页展示大小
    let start = (currentPage - 1) * pageSize
    //结束位置为当前页*每页展示大小
    let end = currentPage * pageSize

    return tableData.slice(start, end)
}

const getArticleL = async () => {
  let res = await getArticleList()
  if (res.data.code === 0) {
    console.log(res.data);
    articleList.value = res.data.data
    paginationData.tableData = res.data.data
    articleStore.getArticleList()
  }
}

const goArticleDetails = (id) => {
  router.push('/article/' + id)
}

onMounted(() => {
  getArticleL()

})


// onBeforeRouteUpdate((to, from, next) => {
//   // getArticleL()
//   if (to.query.cname) {
//     console.log(articleList.value);
//     getArticleL()
//     nextTick(() => {
     
//       articleList.value = articleList.value.filter(item => {
//         return item.cname === to.query.cname
//       })
//       console.log(articleList.value);
  
//     })
    
//   }
// })
</script>
<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  position: absolute;
  /* bottom: 0px; */
  right: 28vw;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  /* opacity: .7; */
  width: 100%;
  background: rgba(254, 254, 254, .6);
}
.footer{
  width: 100%;
  display: flex;
  // height: 50px;
  position: absolute;
  bottom: 0;
  background: rgba(254, 254, 254, .6);
  div{
    flex: 1;
  }
  a{
    display: inline-block;
    color: rgba(0, 0, 0);
    text-align: center;
    flex: .8;
  }
}
</style>