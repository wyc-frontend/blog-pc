<template>
    <el-card v-show="classifyArrLength">空空如也~</el-card>
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
        <el-pagination background layout="prev, pager, next" v-model="paginationData.currentPage" :total="computedTotal" :page-size="paginationData.pageSize" @current-change="chekPage"  @prev-click="pFn" @next-click="nFn" />
    </div>
</template>
<script setup>
import { ref,reactive,onMounted,nextTick,computed } from 'vue';
import { getArticleList } from '@/api';
import { onBeforeRouteUpdate,useRouter,useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()
const articleList = ref([])
const classifyArr = ref([])

//分页数据初始化
let paginationData = reactive({
    tableData: [],  // 总的数据
    pageData: [],   // 分页的数据
    currentPage: 1, // 当前页 默认是第一页
    pageSize: 4,   // 每页大小 默认每页4条数据
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
    console.log(tableData);
    return tableData.slice(start, end)
}


const classifyArrLength = computed(()=>{
    if (classifyArr.value.length===0) {
        return true
    }else{
        return false
    }
})

const getArticleL = async () => {
    let res = await getArticleList()
    if (res.data.code === 0) {
        articleList.value = res.data.data
        classifyArr.value = articleList.value.filter(item=>item.cname === route.query.cname)
        paginationData.tableData = classifyArr.value
    }
}
const goArticleDetails = (id) => {
  router.push('/article/' + id)
}

onBeforeRouteUpdate((to, from) => {
    console.log(to.query);
    if (to.query.cname) {
        nextTick(() => {
            classifyArr.value = articleList.value.filter(item => {
                return item.cname === to.query.cname
            })
            paginationData.tableData = classifyArr.value
        })
    }
})

onMounted(() => {
    getArticleL()
    
})
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  position: absolute;
  bottom: 18px;
  right: 12px;
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
</style>