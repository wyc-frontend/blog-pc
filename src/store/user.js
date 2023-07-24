import { defineStore, acceptHMRUpdate } from "pinia"
import { updateUser } from '@/api';

export const useMainStore = defineStore('main', {
    state: () => {
        return {
            loginInfo: {
                adminName: "",
                adminToken: "",
                userName: "", //用户名
                userId: "",
                imgUrl: "", //图片url
                status: false, //登录状态
                token: ""
            },
            dialog: {
                values: ""
            },

        }

    },
    actions: {
        async updateUserInfoData(obj) {
            let res = await updateUser(obj)
            if (res.data.code === 0) {
                // this.loginInfo.userName = res.data.data.username
                this.loginInfo.userName = ''
                this.loginInfo.token = ''
                this.loginInfo.imgUrl = ''

                console.log(res);

            }
        }
    },
    getters: {},
    persist: {
        enabled: true,
        strategies: [
            {
                // key: 'user',//设置存储的key
                storage: sessionStorage,
                paths: ['loginInfo'],//指定要长久化的字段
            }
        ]
    }
})
// 确保传递正确的 store 声明，本例中为 `useAuth`
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}