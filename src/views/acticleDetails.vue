<template>
    <div class="containel">
        <div class="head">
            <div>
                <h1>{{ articleList[0].title }}</h1>
                <h2>作者:{{ articleList[0].username }}</h2>
                <span>{{ articleList[0].time }}</span>
            </div>
        </div>
        <!-- <div class="main" v-html="articleList[0].html">

        </div> -->
        <v-md-preview-html class="main" :html="articleList[0].html" preview-class="vuepress-markdown-body"></v-md-preview-html>
    </div>
</template>
<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { getArticleList } from "@/api"
import { useRoute } from 'vue-router';

const route = useRoute()
const articleList = ref([])

const getArticleL = async () => {
    let res = await getArticleList()
    if (res.data.code === 0) {
        articleList.value = res.data.data.filter(item => {
            return item.id == route.params.id     //根据路由参数渲染对应的文章内容
        })
    }
}

onBeforeMount(() => {
    getArticleL()
})

watch(() => route.query, (n, o) => {
    getArticleL()
})
</script>
<style lang="less" scoped>
.containel {
    // display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;

    .head {
        height: 160px;
        background-color: rgba(0, 0, 0, .7);

        div {
            position: absolute;
            top: 18px;
            left: 72px;
            color: #fefefe;
            
        }
    }

    .main {
        
        min-height: 700px;
        background-color: rgba(254, 254, 254, 1.000);
        padding: 32px 32px;

        ul,
        ol {
            padding: 0;

        }
    }
}
</style>