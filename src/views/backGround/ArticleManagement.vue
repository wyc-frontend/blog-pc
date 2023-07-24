<template>
    <el-table :data="articleListArr" style="width: 60%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="username" label="作者" width="120" />
        <el-table-column prop="description" label="文章简介" fit />
        <el-table-column label="操作" width="180">
            <template #default="scope">
                <el-button type="primary" @click='updateArt(scope.row.id)'>修改</el-button>
                <el-button type="primary" @click='delArticle(scope.row.id)'>删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup>
import { articleStores } from '@/store/article'
import { ElMessage, ElMessageBox } from 'element-plus';

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';


const router = useRouter()
const articleStore = articleStores()
const { articleListArr } = storeToRefs(articleStore)


const updateArt = (id) => {
    router.push('/admin/bloghome/modifyarticle/' + id)
}

const delArticle = (id) => {
    ElMessageBox({
        type: 'warning',
        message: '确定删除这条文章吗'
    }).then(() => {
        articleStore.delArticleFn(id).then(() => {
            ElMessage({
                type:'success',
                message:'删除成功,请等待页面更新'
            })
            setTimeout(()=>{
                articleStore.getArticleList()
            },1000)
        })
    })

}
</script>
<style scoped>

</style>