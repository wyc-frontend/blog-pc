import { defineStore, acceptHMRUpdate } from "pinia";
import { addMsgBoard, replyMsgBoard } from "@/api";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store/user"

const main = useMainStore()
const { loginInfo } = storeToRefs(main)

export const messageBoard = defineStore('msgBoard', {
    state: () => {
        return {

        }
    },
    actions: {
        async addMsgBoardFn(m) {
            let data = {
                uName: loginInfo.value.userName,
                msg: m.iptV,
                time: m.time,
                img: loginInfo.value.imgUrl
            }
            let res = await addMsgBoard(data)
            if (res.data.code === 0) {
                console.log(res,'数据');
                return {
                    sts: true
                }
            }
        },
        async replyMsgFn(m, i) {
            let data = {
                uName: loginInfo.value.userName,
                msg: m.replyV,
                time: m.time,
                img: loginInfo.value.imgUrl,
                id: i
            }
            
            let res = await replyMsgBoard(data)
            if (res.data.code === 0) {
                console.log(res);
            }
        }

    },
    persist: {  //浏览器缓存配置项
        enabled: true,
        strategies: [
            {
                // key: 'user',//设置存储的key
                storage: localStorage,
                paths: ['loginInfo'],//指定要长久化的字段
            }
        ]
    }
})

// 确保传递正确的 store 声明，本例中为 `useAuth`
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(messageBoard, import.meta.hot))
}