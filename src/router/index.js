import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 需要左方向动画的路由用this.$router.to('****')
Router.prototype.togo = function (path) {
  this.isleft = true
  this.isright = false
  this.push(path)
}
// 需要右方向动画的路由用this.$router.goRight('****')
Router.prototype.goRight = function (path) {
  this.isright = true
  this.isleft = false
  this.push(path)
}
// 需要返回按钮动画的路由用this.$router.goBack()，返回上一个路由
Router.prototype.goBack = function () {
  this.isright = true
  this.isleft = false
  this.go(-1)
}
// 点击浏览器返回按钮执行，此时不需要路由回退
Router.prototype.togoback = function () {
  this.isright = true
  this.isleft = false
}
export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: (resolve) => require(['@/components/HelloWorld'], resolve)
    }, {
      path: '/Home',
      name: 'Home',
      component: (resolve) => require(['@/pages/Home'], resolve)
    }, {
      path: '/play',
      name: 'play',
      component: (resolve) => require(['@/pages/play'], resolve)
    }, {
      path: '/playList',
      name: 'playList',
      component: (resolve) => require(['@/pages/playListDetail'], resolve)
    }
  ]
})
