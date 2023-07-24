<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="150px">
                <div>
                    <span @click="router.replace('/admin/bloghome/writeblog')">写文章</span>
                    <span @click="router.replace('/admin/bloghome/articlemanagement')">文章管理</span>
                    <span @click="router.replace('/admin/bloghome/addclassify')">分类管理</span>
                    <span @click="router.push('/admin/index')">返回</span>
                </div>
                <div></div>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()

</script>
<style lang="less" scoped>
.common-layout{
    .el-container{
        min-height: 730px;
        .el-aside{
            background-color: rgba(0,0,0,.6);
            display: flex;
            flex-direction: column;
            div{
                flex: 1;
                span{
                    color: rgba(255,255,255,1.000);
                }
            }
            div:nth-child(1){
                display: flex;
                flex-direction: column;
                padding: 16px 16px;
                span{
                    flex: .1;
                }
                span:hover{
                    cursor: pointer;
                    color: rgba(0,255,255,1.000);
                }
            }
        }
        .el-main{
            padding: 0;
        }
    }
}
</style>