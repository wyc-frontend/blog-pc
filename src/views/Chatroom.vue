<template>
    <el-card class="box-card" id="aDiv">
        <template #header>
            <div class="card-header">
                <span ref="head">聊天区</span>
                <span>当前在线人数：{{ count }}</span>
                <span></span>
            </div>
        </template>
        <div class="card-body">
            <el-scrollbar ref="eDiv" height="500px" @scroll="scrollFn">
                <div ref="pDiv" id="pDiv">

                </div>
            </el-scrollbar>
        </div>

        <div class="card-footer">
            <el-input type="textarea" @keyup="sendMsg" v-model="str" size="large" :rows="7" resize="none"></el-input>

        </div>
        <el-button type="primary" @click="sendMsgMouse">发送</el-button>
    </el-card>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useMainStore } from "@/store/user";
import { storeToRefs } from "pinia"
import { onBeforeRouteLeave } from 'vue-router';

const useStore = useMainStore()
const { loginInfo } = storeToRefs(useStore)
let str = ref('')
let step = ref(500)
let head = ref('head')
const pDiv = ref('pDiv')
const eDiv = ref('eDiv')
const msgData = reactive({
    msg: '',
    time: ''
})
const count = ref(0)
const TYPE_ENTER = 0
const TYPE_LEAVE = 1
const TYPE_MSG = 2


const CODE = 13 // 回车 的code是13
let preKeyCode = ""
let preTime = ""

// 1.创建websocket
// 参数：WebSocket(url [, protocols]);
const socket = new WebSocket(import.meta.env.VITE_APP_WSAPI_URL + `?${loginInfo.value.userName}?${loginInfo.value.imgUrl}`)

// 2. open:当和 websocket服务连接成功的时候触发
socket.addEventListener('open', function () {
    console.log('连接成功');
})

// 3.主动给 websocket服务发送消息

const sendMsg = (e) => {


    let now = Date.now()
    // 上一次的和这次的一样
    // 如果不想要 q，其他键连续两次就可以，把 && event.keyCode === COD 去掉
    if (preKeyCode === e.keyCode && e.keyCode === CODE) {
        // 小于300ms算双击
        if (now - preTime < 300) {
            let value = str.value
            if (!value) return false
            socket.send(`${loginInfo.value.userName}-${value}`)
            str.value = ''
        }
    }
    //给之前记录的时间和键码重新赋值
    preTime = now
    preKeyCode = e.keyCode

}
const sendMsgMouse = () => {
    let value = str.value
    if (!value) return false
    socket.send(`${loginInfo.value.userName}-${value}`)
    str.value = ''
}
// 4. message:收到服务器返回的数据触发
socket.addEventListener('message', function (event) {

    let result = JSON.parse(event.data)
    count.value = result.countNum ? result.countNum : count.value

    console.log(result);
    msgData.msg = result.msg
    msgData.time = result.time
    let div = document.createElement("div")
    let ppDiv = document.getElementById('pDiv')
    ppDiv.appendChild(div)
    div.style.display = 'flex'
    if (result.name === loginInfo.value.userName) {
        div.style.flexDirection = 'row-reverse'
    }



    let p = document.createElement("p")
    let h3 = document.createElement("h3")
    let img = document.createElement('img')
    let span = document.createElement('span')

    h3.innerHTML = result.time

    span.innerHTML = result.msg

    // if (result.special===0) {
    //     span.style.color = '#67C23A'
    // }else if(result.special===1){
    //     span.style.color = '#F56C6C'
    // }
    img.src = result.img
    img.style.width = 32 + 'px'
    img.style.height = 32 + 'px'
    img.style.borderRadius = '50%'
    div.appendChild(h3)
    h3.appendChild(p)

    if (result.name === loginInfo.value.userName) {
        h3.style.textAlign = 'right'
        p.appendChild(span)

        p.appendChild(img)
        span.style.verticalAlign = 'top'
        span.classList.add('ii')
        span.classList.add('spanL')
        img.style.marginLeft = 12 + 'px'
    } else {
        span.classList.add('i')
        span.classList.add('spanL')
        img.style.marginRight = 12 + 'px'
        p.appendChild(img)

        p.appendChild(span)
        span.style.verticalAlign = 'top'
    }
    eDiv.value.setScrollTop(step.value += 68)


})

// 5.close:服务已断开
socket.addEventListener('close', function () {
    console.log('服务断开');
})

onBeforeRouteLeave((to,from)=>{
    socket.close(1000)
})

const load = () => {
    //   count.value += 2
    let div = document.getElementById('pDiv')
    console.log(div.getBoundingClientRect());
}

</script>
<style lang="less" scoped>
.box-card {
    .card-header{
        display: flex;
        span{
            flex: 1;
        }
        span:nth-child(2){
            color: rgba(64,158,255,1);
        }
    }
    .infinite-list {
        height: 500px;
        padding: 0;
        margin: 0;
        overflow-y: auto;
        list-style: none;
    }

    .infinite-list .infinite-list-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        background: var(--el-color-primary-light-9);
        margin: 10px;
        color: var(--el-color-primary);
    }

    .infinite-list .infinite-list-item+.list-item {
        margin-top: 10px;
    }

    color: #fefefe;
    background-color: rgba(0, 0, 0, .6);

    .card-body {
        min-height: 500px;
        margin-bottom: 2px;

    }

    .card-footer {
        min-height: 160px;

    }

    .el-button {
        position: absolute;
        right: 20px;
        bottom: 22px;
    }
}
</style>