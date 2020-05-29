import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import FindMusic from '../components/findMusic.vue'
import RecommendMusic from '../components/recommendMusic.vue'
import NewMusic from '../components/newMusic.vue'
import NewMV from '../components/newMV.vue'
import SearchRes from '../components/searchRes.vue'
import PlayList from '../components/playList.vue'
import MV from '../components/mv.vue'
Vue.use(VueRouter)

// 定义路由规则
const routes = [
  {
    path: '/',
    redirect: '/findMusic',
    component: Home,
    children: [
      { path: '/findMusic', component: FindMusic },
      { path: '/recommendMusic', component: RecommendMusic },
      { path: '/newMusic', component: NewMusic },
      { path: '/newMV', component: NewMV },
      { path: '/searchRes', component: SearchRes },
      { path: '/playList', component: PlayList },
      { path: '/mv', component: MV }
    ]
  }
]
// 解决 Uncaught(in promise)问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes
})

export default router
