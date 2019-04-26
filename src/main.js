// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import store from './store'
import router from './router'
import '../static/js/flexible'
import FastClick from 'fastclick'
import VueTouch from 'vue-touch'
import {beasUrl, fetch} from './apiconfig'
import Main from '../static/js/common'

Vue.config.productionTip = false
Vue.prototype.domin = beasUrl
Vue.prototype.$get = fetch
Vue.prototype.common = Main
Vue.prototype.mint = Mint
/* eslint-disable no-new */
Vue.use(Vuex)
Vue.use(Mint)
Vue.prototype.mint = Mint
Vue.use(VueTouch, {name: 'v-touch'})
VueTouch.config.swipe = {
  threshold: 100 // 手指左右滑动距离
}
FastClick.attach(document.body)
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
window.addEventListener('popstate', function (e) {
  router.togoback() // router已经在上面import进来
}, false)
