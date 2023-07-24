<template>
    <el-card>
        <el-descriptions :title="showArticle[0].title">
            <el-descriptions-item label="作者">{{ showArticle[0].username }}</el-descriptions-item>
            <el-descriptions-item label="文章id">{{ showArticle[0].id }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ showArticle[0].time }}</el-descriptions-item>
            <el-descriptions-item label="文章标签">
                <el-tag size="small">{{ showArticle[0].cname }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="文章简介">{{ showArticle[0].description }}</el-descriptions-item>
        </el-descriptions>
    </el-card>
    <v-md-editor v-model="showArticle[0].text" @save="modifyFn" height="500px"
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save " />

    <!-- <div class="btns" v-if="loginInfo.userName === showArticle[0].username">
        <el-button type="primary" label="取消编辑">重新发布</el-button>
       
    </div> -->

</template>
<script setup>
import { articleStores } from "@/store/article"
import { useMainStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from 'element-plus'

const articleStore = articleStores()
const mainStore = useMainStore()
const { articleListArr } = storeToRefs(articleStore)
const { loginInfo } = storeToRefs(mainStore)
const route = useRoute()


const showArticle = computed(() => {
    return articleListArr.value.filter(item => {
        return item.id == route.params.id
    })
})

const modifyFn = (text, html) => {
    console.log(text);
    console.log(html);
    if (text.length <= 10) {
        ElMessage({
            type: 'error',
            message: '你输入的内容太少啦'
        })
    } else {
        ElMessage({
            type: 'success',
            message: '文章修改成功'
        })
        let obj = {
            text,
            html,
            id: showArticle.value[0].id
        }
        articleStore.updArticle(obj)
    }
}
const confirmFn = () => {

}
</script>
<style lang="less" scoped>
.el-descriptions {
    background-color: rgba(254, 254, 254, .7);
}

.v-md-editor-preview {
    .vuepress-markdown-body {
        min-height: 500px;
    }
}

.btns {
    width: 160px;
    float: right;
    margin-top: 3px;
}
</style>