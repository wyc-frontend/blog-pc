<template>
    <el-card>
        <div class="main">
            <img :src="loginInfo.imgUrl">
            <div class="userName">
                <span>用户名:</span>
                <el-input v-model="userInfoData.userName" placeholder="重置用户名长度在3~6位" :disabled="iptDabl"></el-input>
            </div>
            <div class="passWord">
                <span>密码:</span>
                <el-input v-model="userInfoData.pwd" placeholder="重置密码长度在6~11位" :disabled="iptDabl" show-password></el-input>
            </div>
            <div class="btn">
                <el-button type="primary" ref="editBtn" @click="editFn">编辑</el-button>
                <el-button @click="saveFn">保存</el-button>
            </div>
        </div>
    </el-card>
</template>
<script setup>
import { useMainStore } from '@/store/user'
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { ref, reactive } from 'vue';


const mainStore = useMainStore()
const { loginInfo, updateUserInfoData } = storeToRefs(mainStore)
const iptDabl = ref(true)
const editBtn = ref(null)
const userInfoData = reactive({
    id: loginInfo.value.userId,
    pwd: '',
    userName: ''
})


const editFn = () => {
    iptDabl.value = false
    console.log(editBtn.value);
}

const saveFn = () => {
    if ((userInfoData.userName.length >= 3 && userInfoData.userName.length <= 6) && (userInfoData.pwd.length >= 6 && userInfoData.pwd.length <= 11)) {
        let res = mainStore.updateUserInfoData(userInfoData).then(() => {
            userInfoData.userName = ''
            userInfoData.pwd = ''
            iptDabl.value = true
            ElMessage({
                type: 'success',
                message: '用户信息更新成功,请重新登录'
            })
        }).catch(() => {
            ElMessage({
                type: 'error',
                message: '发生了未知错误'
            })
        })
    } else {
        ElMessage({
            type: 'error',
            message: '设置的长度不符合规则'
        })
    }
}

</script>
<style lang="less" scoped>
.el-card {
    min-height: 818px;
    background-color: rgba(254, 254, 254, .6);

    .main {
        width: 60%;
        height: calc(818px * .8);
        margin: 12vh auto;

        img {
            width: 16vw;
            border-radius: 50%;
        }

        .el-input {
            width: 60%;
            display: inline-block;
        }

        .passWord {
            margin-top: 16px;
        }

        .userName {
            margin-top: 16px;
        }

        .btn {
            margin-top: 16px;
        }
    }
}
</style>