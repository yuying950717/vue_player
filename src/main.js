import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
// 导入全局样式表
import './assets/index.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

Vue.prototype.$http = axios
Vue.config.productionTip = false
// 歌曲时长
Vue.filter('dateFormate', function (orignal) {
  const dt = new Date(orignal)
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return mm + ':' + ss
})
// 年月日
Vue.filter('dateFormate2', function (orignal) {
  // var val = JSON.parse(orignal)
  const dt = new Date(orignal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  return y + '-' + m + '-' + d
})
// 年月日时分秒
Vue.filter('dateFormate3', function (orignal) {
  const dt = new Date(orignal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
})
// 播放量大于10万就只显示十万位
Vue.filter('PlayCountFormate', function (platCount) {
  if (platCount > 100000) {
    return parseInt(platCount / 10000) + '万'
  }
  return platCount
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
