import axios from "axios";
import { ElMessageBox } from "element-plus";

const ajax = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL + '/api',
    timeout: 5000
})

//请求拦截器，携带token到后台认证
ajax.interceptors.request.use((config) => {
    let localObj = JSON.parse(sessionStorage.getItem('main'))

    if (localObj) {
        if (config.url != '/login' && config.url != '/register' && config.url != '/userinfo' && config.url != '/exit') {

            config.headers.uname = encodeURI(localObj.loginInfo.userName)
            config.headers.Authorization = localObj.loginInfo.token

        }
    }

    return config
})

//响应拦截器
ajax.interceptors.response.use((config) => {
    let localObj = JSON.parse(sessionStorage.getItem('main'))

    if (config.data.code === 2) {  //状态码为2说明重复登录了
        sessionStorage.setItem('main', JSON.stringify({
            "loginInfo": {
                "adminName": "",
                "adminToken": "",
                "userName": "",
                "userId": "",
                "imgUrl": "",
                "status": false,
                "token": ""
            }
        }))
        //    localObj.loginInfo
        ElMessageBox({
            type: 'error',
            message: config.data.message,
            beforeClose: () => {
                location.reload()
            }
        })


    }else if (config.data.code === 403) {   //后台返回403说明token过期
        sessionStorage.setItem('main', JSON.stringify({
            "loginInfo": {
                "adminName": "",
                "adminToken": "",
                "userName": "",
                "userId": "",
                "imgUrl": "",
                "status": false,
                "token": ""
            }
        }))
        ElMessageBox({
            type: 'error',
            message: config.data.message,
            beforeClose: () => {
                location.reload()
            }
        })
    }
    
    return config
})

export default ajax;