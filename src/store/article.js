import { defineStore,acceptHMRUpdate } from "pinia";
import { getArticleList,delArticle,updateArticle } from '@/api'
export const articleStores = defineStore('article',{
    state:()=>{
        return{
            articleListArr:[],
            showArticle:{}
        }
    },
    actions:{
        async getArticleList(){
            let res = await getArticleList()
            if (res.data.code===0) {
                this.articleListArr = res.data.data
            }
        },
        async delArticleFn(id){
            let res = await delArticle(id)
            if (res.data.code===0) {
                console.log(res);
            }
        },
        async updArticle(obj){
            console.log(obj);
            let res = await updateArticle(obj)
            if (res.data.code===0) {
                getArticleList()
            }
        }
    },
    persist: {  //浏览器缓存配置项
        enabled: true,
        strategies: [
            {
                // key: 'user',//设置存储的key
                storage: sessionStorage,
                paths: ['articleListArr'],//指定要长久化的字段
            }
        ]
    }
    
})

// 确保传递正确的 store 声明，本例中为 `useAuth`
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(articleStores, import.meta.hot))
}