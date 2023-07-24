<template>
    <el-card class="head">
        <input type="text" placeholder="留个言吧" v-model="dInfo.iptV" @change="fn" />
        <el-button :disabled="!dInfo.iptV || !loginInfo.userName" @click="publish">发表</el-button>
        <p>留言({{ total }})</p>
    </el-card>
    <el-card class="main" v-for="(item, index) in dataSptFn()" :key="item.id">
        <div class="uInfo">
            <img :src="item.img" height="55">
            <div class="uInfo_text">
                <span>{{ item.uname }}</span>
                <span>&nbsp;&nbsp;</span>
                <span>{{ Nindex(index) }}楼</span>
                <span>&nbsp;&nbsp;留言id({{ item.id }})</span>
                <span>{{ item.msg }}</span>
                <div>
                    <span></span>
                    <span>{{ item.time }}</span>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <i style="font-size:14px;" @click="replyFn(item.id)">回复</i>
                    <div v-show="item.iptsts">
                        <el-input type="textarea" v-model="dInfo.replyV"></el-input>
                        <el-button @click="confirmReply(index, item.id)">确定</el-button>
                        <el-button @click="cancelReply(item.id)">取消</el-button>
                    </div>
                    <div class="replyDiv" v-show="item.id === i.fid" v-for="(i, index) in replyArr" :key="i.id">
                        <img :src="i.img" height="38">
                        <div>
                            <span>{{ i.username }}</span>
                            <span>{{ i.msg }}</span>
                            <span>{{ i.time }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-card>
    <el-pagination background layout="prev, pager, next" :page-size="paginationData.pageSize" @current-change="chekPage"
        v-model="paginationData.currentPage" :total="total" @prev-click="pFn" @next-click="nFn" />
</template>
<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, onMounted, computed } from 'vue'
import { useMainStore } from "@/store/user";
import { messageBoard } from "@/store/messageBoard"
import { storeToRefs } from "pinia"
import { reqMsgBoardData, reqReplyMsgData } from "@/api"



const main = useMainStore()
const msgStore = messageBoard()
const { loginInfo } = storeToRefs(main)


const total = ref('')
let t = new Date()
const dInfo = reactive({
    iptV: '',
    replyV: '',
    time: t.toLocaleDateString() + '-' + t.toLocaleTimeString(),
    headImg: loginInfo.value.imgUrl
})

const replyArr = ref([])

//分页数据初始化
let paginationData = reactive({
    tableData: [],  // 总的数据
    pageData: [],   // 分页的数据
    currentPage: 1, // 当前页 默认是第一页
    pageSize: 3,   // 每页大小 默认每页5条数据
    pageTotal: 0 		// 总数据量 默认为 0
})

const str = /^[0-9a-zA-Z_@$%&*]{1,}$/g   //匹配数字字符字母
const str1 = /[\u4E00-\u9FA5]/  //匹配中文
const publish = async () => {

    if (str.test(dInfo.iptV) || str1.test(dInfo.iptV)) {    //处理发表留言逻辑
        ElMessage({
            message: '留言发布成功.',
            type: 'success',
        })
        await msgStore.addMsgBoardFn(dInfo)
        getMsgBoardData()   //重新获取留言列表
        dInfo.iptV = ''
    } else {

        ElMessage({
            message: '必须输入有效字符.',
            type: 'warning',
        })
    }
}

const getMsgBoardData = async () => {
    let res = await reqMsgBoardData()
    if (res.data.code === 0) {

        paginationData.tableData = res.data.data.results
        total.value = res.data.data.total

    }
}
const getreplymsgdata = async () => {
    let res = await reqReplyMsgData()
    if (res.data.code === 0) {

        replyArr.value = res.data.data.results
    }
}

const fn = (e) => {

}

//数据分割方法
const dataSptFn = () => {
    let { currentPage, pageSize, tableData } = paginationData
    //起始位置为当前页-1*每页展示大小
    let start = (currentPage - 1) * pageSize
    //结束位置为当前页*每页展示大小
    let end = currentPage * pageSize
    return tableData.slice(start, end)
}

//分页序号
const Nindex = (index) => {
    let { currentPage,pageSize } = paginationData
    return index + 1 + (currentPage - 1) * pageSize
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

const replyFn = (id) => {

    if (loginInfo.value.token) {
        paginationData.tableData.forEach(item => {
            item.iptsts = false
        });
        // paginationData.tableData[idx].iptsts = true
        let data = paginationData.tableData.filter(item => {
            return item.id === id
        })
        data[0].iptsts = true
    } else {
        ElMessage({
            type: 'error',
            message: '请先登录'
        })
    }

}

//确认回复fn
const confirmReply = (idx, i) => {
    if (!(str.test(dInfo.replyV) || str1.test(dInfo.replyV))) {
        ElMessage({
            message: '必须输入有效字符.',
            type: 'warning',
        })
    } else {
        if (loginInfo.value.userName) {
            paginationData.tableData[idx].iptsts = false
            paginationData.tableData[idx].replysts = true

            msgStore.replyMsgFn(dInfo, i)
            dInfo.replyV = ''

            ElMessage({
                message: '操作成功.',
                type: 'success',
            })
            setTimeout(() => {
                location.reload()
            }, 2000)
        } else {
            ElMessage({
                message: '必须先登录.',
                type: 'error',
            })
            dInfo.replyV = ''
        }
    }

}

//取消回复
const cancelReply = (id) => {
    // paginationData.tableData[idx].iptsts = false
    let data = paginationData.tableData.filter(item => {
        return item.id === id
    })
    data[0].iptsts = false
}

onMounted(() => {
    getMsgBoardData()
    getreplymsgdata()
})
</script>
<style lang="less" scoped>
.el-card {
    opacity: .7;
}

.head {
    .el-button {
        border-radius: 36%;
        background-color: rgba(65, 71, 83, 1.000);
        color: rgba(254, 254, 254, 1.000);
    }

    color: rgba(0, 0, 0, 1);

    input {
        width: 60%;
        border-radius: 15px;
        height: 32px;
        padding-left: 12px;
    }

    // @media (max-width: 520px) {
    //     input {
    //         width: 100%;
    //         border: rgba(0, 0, 1, 1);

    //     }
    // }

    p {
        float: right;
        height: 32px;
        line-height: 32px;
    }
}

.main {

    color: rgba(0, 0, 0, 1);

    .uInfo {
        width: 80%;
        min-height: 68px;
        float: left;
        display: flex;
        margin-bottom: 16px;

        img {
            flex: .08;
            margin-right: 16px;
        }

        .uInfo_text {
            flex: 1;

            i {
                cursor: pointer;
            }

            input {
                border-radius: 16px;
                margin-left: 2px;
            }

            .replyDiv {
                margin-top: 8px;
                width: 100%;
                min-height: 68px;
                display: flex;

                img {
                    flex: .06;
                }

                div {
                    flex: 1;
                    display: flex;
                    flex-direction: column;

                    span:nth-child(2) {
                        font-size: 14px;
                    }
                }

            }
        }

        .uInfo_text span:nth-child(4) {
            color: #F56C6C;
            margin: 8px 0px;
            font-size: 12px;
        }

        .uInfo_text span:nth-child(5) {
            display: block;
            margin: 8px 0px;
            font-size: 14px;
        }

        .uInfo_text span:nth-child(1) {
            color: rgba(64, 158, 255, 1.000);
            font-size: 16px;
        }

        .uInfo_text span:nth-child(3) {
            font-size: 12px;
        }

    }
}

.el-pagination {
    position: relative;
    bottom: 0;
    width: 60%;
    left: 28vw;
}

@media (max-width:520px) {
    .el-pagination {
        left: 0;
    }
}
</style>