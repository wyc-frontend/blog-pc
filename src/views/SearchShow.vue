<template>
    <el-card v-for="(item, index) in dataSptFn()" :key="item.id">
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
    <el-pagination background layout="prev, pager, next" :page-size="paginationData.pageSize" @current-change="chekPage"
        v-model="paginationData.currentPage" :total="paginationData.pageTotal" @prev-click="pFn" @next-click="nFn" />
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { articleStores } from '@/store/article';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';

const articleStore = articleStores()
const { articleListArr } = storeToRefs(articleStore)
const route = useRoute()

const router = useRouter()
let list = ref([])

//分页数据初始化
let paginationData = reactive({
    tableData: [],  // 总的数据
    pageData: [],   // 分页的数据
    currentPage: 1, // 当前页 默认是第一页
    pageSize: 5,   // 每页大小 默认每页5条数据
    pageTotal: 0 		// 总数据量 默认为 0
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

const chekPage = (n) => {
    paginationData.currentPage = n
}

const pFn = () => {
    paginationData.currentPage = paginationData.currentPage--
}

const nFn = () => {
    paginationData.currentPage = paginationData.currentPage++
}

const goArticleDetails = (id) => {
    router.push('/article/' + id)
}

watch(() => route.query, (n, o) => {
    getArticleList()
    paginationData.pageTotal = list.value.length
    paginationData.tableData = list.value
    
})

const getArticleList = () => {
    if (route.query.keyword) {
        ElMessage({
            message: '为你搜索到以下文章',
            type: 'success',
            duration: 1000
        })
        list.value = articleListArr.value.filter(item => {
            return item.html.indexOf(route.query.keyword) !== -1 || item.title.indexOf(route.query.keyword) !== -1
        })
    }else{
        ElMessage({
            message: '已显示全部文章列表',
            type: 'success',
            duration: 1000
        })
        list.value = articleListArr.value
    }

}

onMounted(() => {
    getArticleList()
    paginationData.tableData = list.value
    paginationData.pageTotal = list.value.length
})
</script>
<style scoped>

.el-pagination {
    position: relative;
    bottom: 0;
    width: 60%;
    left: 28vw;
}
</style>