import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  NProgress.start()
  config.headers.Authorization=sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})
Vue.prototype.$http=axios

Vue.use(VueQuillEditor, /* { default global options } */)

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

Vue.filter('timeFormat',function(val){
  let dt = new Date(val)
  let y = dt.getFullYear()
  let m = (dt.getMonth()+1+'').padStart(2,'0')
  let d = (dt.getDate()+'').padStart(2,'0')
  let hh=(dt.getHours()+'').padStart(2,'0')
  let mm=(dt.getMinutes()+'').padStart(2,'0')
  let ss=(dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
