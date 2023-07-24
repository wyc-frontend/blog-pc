<template>
    <el-table :data="classifyList" border style="width:30%">
        <el-table-column prop="cid" label="分类ID" width="80" />
        <el-table-column prop="cname" label="分类名称"></el-table-column>
        <el-table-column label="操作">
            <template #header>
                <span>操作</span>
                <el-button size="small" style="margin-left:12px;" type="primary"
                    @click="addDialog = true">添加分类</el-button>
            </template>
            <template #default="scope">
                <el-button size="small" type="primary" @click="delFn(scope.row.cid)">删除</el-button>
                <el-button size="small" type="primary" @click="updFn(scope.row.cid,scope.$index)">修改</el-button>
                <div class="actionBarDiv" v-if="(scope.$index + 1) ===updDialog">
                    <el-input placeholder="新的分类名称" size="small" v-model="updInfo.cname"></el-input>
                    <el-button type="primary" size="small" @click="ensureFn">确定</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog v-model="addDialog" title="新增分类" width="30%" center>
        <el-input v-model="addName" placeholder="输入分类名称"></el-input>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addDialog = false">取消</el-button>
                <el-button type="primary" @click="addFn">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { addClassify, getClassifyList, delClassify, updClassify } from '@/api'


const addDialog = ref(false)
const updDialog = ref(0)

const addName = ref('')
const updInfo = reactive({
    cid: '',
    cname: ''
})


const classifyList = ref([])

const addFn = async () => {
    let res = await addClassify(addName.value)
    if (res.data.code === 0) {
        ElMessage({
            type: 'success',
            message: res.data.message
        })
        addDialog.value = false
        setTimeout(() => {
            location.reload()
        }, 1000)
    }

}
const delFn = (id) => {
    ElMessageBox.confirm(
        '确定删除这个分类吗?',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let res = await delClassify(id)
        if (res.data.code === 0) {
            ElMessage({
                type: 'success',
                message: res.data.message
            })
            addDialog.value = false
            setTimeout(() => {
                location.reload()
            }, 1000)
        }
    })

}
const updFn = (id,idx) => {
    updDialog.value = idx + 1
    updInfo.cid = id
}
const ensureFn = async() => {
    updDialog.value = 0
    let res = await updClassify(updInfo)
    if (res.data.code===0) {
        ElMessage({
            type: 'success',
            message: res.data.message
        })
        setTimeout(()=>{
            location.reload()
        },1000)
    }
}

const getList = async () => {
    let res = await getClassifyList()
    if (res.data.code === 0) {
        classifyList.value = res.data.data
        ElMessage({
            type: 'success',
            message: res.data.message
        })
    }
}

onMounted(() => {
    getList()
})
</script>
<style lang="less" scoped>
.dialog-footer button:first-child {
    margin-right: 10px;
}

.actionBarDiv{
    margin-top: 8px;
    position: relative;
    width: 100%;
    .el-button{
        position: absolute;
        right: 0;
        border-radius: 0px 12px 12px 0px;
    }
}
</style>