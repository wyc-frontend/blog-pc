import { createRouter, createWebHistory } from 'vue-router'

import Admin from "@/views/backGround/Admin.vue"
import { ElMessageBox } from 'element-plus'
import { reqPhotoWall } from '@/api'
// import { useMainStore } from '@/store/user'
// // import  loginFn  from '@/components/Header.vue'
// const store = useMainStore()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/',
      redirect: { name: 'home' }
    },
    {
      path: '/article/:id',
      component: () => import('@/views/acticleDetails.vue')
    },
    {
      path: '/admin',
      // component: ()=> import("@/views/backGround/Admin.vue"),
      component: Admin,

      children: [
        {
          path: 'login',
          component: () => import("@/views/backGround/Login.vue"),
          beforeEnter: (to, from, next) => {
            // reject the navigation
            let localObj = JSON.parse(sessionStorage.getItem('main'))
            if (localObj && localObj.loginInfo.userName) {
              if (localObj && localObj.loginInfo.adminToken) {
                next('/admin/index')
              }
              next()
            } else {
              ElMessageBox({
                type: 'error',
                message: '请先登录'
              })
              next(from.path)
            }

          },

        },
        {
          path: 'index',
          component: () => import("@/views/backGround/Index.vue")
        },
        {
          path: 'register',
          component: () => import("@/views/backGround/Register.vue")

        },
        {
          path: 'bloghome',
          component: () => import("@/views/backGround/BlogHome.vue"),
          children: [
            {
              path:'',
              redirect:'bloghome/articlemanagement'
            },
            {
              path: 'writeblog',
              component: () => import("@/views/backGround/WriteBlog.vue")
            },
            {
              path: 'addclassify',
              component: () => import("@/views/backGround/ArticleClassify.vue")
            },
            {
              path: 'articlemanagement',
              component: () => import("@/views/backGround/ArticleManagement.vue")
            },
            {
              path: 'modifyarticle/:id',
              component: () => import("@/views/backGround/ModifyArticle.vue")
            }
          ]
        },
      ]
    },
    {
      path: '/photowall',
      component: () => import("@/views/photowall.vue"),
      name: 'photowall'
    },
    {
      path: '/messageboard',
      component: () => import("@/views/Messageboard.vue"),
      name: 'messageboard'
    },
    {
      path: '/chatroom',
      component: () => import("@/views/Chatroom.vue"),
      name: 'chatroom',
      beforeEnter: async (to, from, next) => {
        let res = await reqPhotoWall()
        if (res.data.code === 0) {
          let localObj = JSON.parse(sessionStorage.getItem('main'))

          if (!localObj || !localObj.loginInfo.token) {
            ElMessageBox({
              type: 'error',
              message: '你必须先登录才能进入聊天室'
            })
            next(from.path)
          }
          next()
        }
        // reject the navigation

      },
    },
    {
      path: '/userinfo',
      component: () => import('@/views/UserInfo.vue'),
      name: 'userinfo',
      beforeEnter: async (to, from, next) => {
        let res = await reqPhotoWall()
        if (res.data.code === 0) {
          let localObj = JSON.parse(sessionStorage.getItem('main'))

          if (!localObj || !localObj.loginInfo.token) {
            ElMessageBox({
              type: 'error',
              message: '你还没有登录'
            })
            next(from.path)
          }
          next()
        }
        // reject the navigation

      },
    },
    {
      path: '/classifylistshow',
      component: () => import('@/views/ClassifyListShow.vue')
    },
    {
      path: '/searchshow',
      component: () => import('@/views/SearchShow.vue')
    }
  ]
})

//全局前置守卫
// router.beforeEach((to,from,next)=>{
//   if (!store.loginInfo.token){
//     // loginFn('login')
//     next()
//   }else{
//     next()
//   }
// })

export default router
