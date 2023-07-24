<template>
    <v-md-editor placeholder="提示: 文章内容最少需大于10个字符" v-model="blogInfo.main" height="730px" @save="saveFn"></v-md-editor>
    <el-dialog v-model="centerDialogVisible" title="完善文章信息" width="30%" align-center :show-close="false">
        <p>文章分类</p>
        <el-select v-model="blogInfo.classifyVal" class="m-2" placeholder="选择对应分类" size="small">
            <el-option v-for="item in classifyList" :key="item.cid" :label="item.cname" :value="item.cname" />
        </el-select>
        <p>文章标题</p>
        <el-input v-model="blogInfo.title" size="small"></el-input>
        <p>文章描述</p>
        <el-input type="textarea" placeholder="请用简短的语言描述这篇文章所概述的内容" v-model="blogInfo.description"></el-input>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancelFn">取消</el-button>
                <el-button type="primary" @click="ensureFn">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { useMainStore } from '@/store/user';
import { articleStores } from '../../store/article';
import { storeToRefs } from 'pinia';
import { writeBlog, getClassifyList } from '@/api'
import { ElMessage } from 'element-plus'

const articleStore = articleStores()
const centerDialogVisible = ref(false)
const useStore = useMainStore()
const { loginInfo } = storeToRefs(useStore)

const blogInfo = reactive({
    main: '',                           //文章内容
    description: '',                    //文章简介
    time: '',                           //文章发布时间
    author: loginInfo.value.userName,   //作者
    title: '',                          //文章标题
    classifyVal: '',                    //分类绑定
    text: ''
})
const classifyList = ref([])

const fn = () => {

}

const saveFn = async (text, html) => {
    if (text.length <= 10) {
        ElMessage({
            type: 'error',
            message: '你输入的内容太少啦'
        })
    } else {
        let date = new Date()
        let t = date.toLocaleDateString() + '-' + date.toLocaleTimeString()
        blogInfo.main = html
        blogInfo.text = text
        blogInfo.time = t
        centerDialogVisible.value = true
        let res = await getClassifyList()
        if (res.data.code === 0) {
            classifyList.value = res.data.data
            ElMessage({
                message: res.data.message,
                type: 'success',
            })
        }
    }

}

const ensureFn = async () => {//发布文章回调

    if (blogInfo.classifyVal === '') {   //如果文章分类或者文章介绍为空值
        ElMessage({
            type: 'error',
            message: '没有绑定分类标签'
        })
    } else if (blogInfo.description === '') {
        ElMessage({
            type: 'error',
            message: '没有描述文章介绍'
        })
    } else if (blogInfo.title === ''){
        ElMessage({
            type: 'error',
            message: '文章没有标题'
        })
    } else if (blogInfo.title.length >= 21){
        ElMessage({
            type: 'error',
            message: '标题过长'
        })
    } else {
        let res = await writeBlog(blogInfo)
        
        if (res.data.code === 0) {
            centerDialogVisible.value = false
            ElMessage({
                message: res.data.message,
                type: 'success',
            })
            blogInfo.main = ''
            blogInfo.classifyVal = ''
            articleStore.getArticleList()

        }
    }

}
const cancelFn = () => {
    centerDialogVisible.value = false
    blogInfo.classifyVal = ''
}

</script>
<style lang="less" scoped>
.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>