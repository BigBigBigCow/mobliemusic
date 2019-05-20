<template>
  <div id="app">
<!--    <img src="./assets/logo.png">-->
<!--    <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div">-->
<!--      <transition :name="transitionName">-->
    <keep-alive include="HelloWorld">
          <router-view class="Router"></router-view>
    </keep-alive>
<!--    <router-view name="play" ></router-view>-->
<!--      </transition>-->
<!--    </v-touch>-->
    <transition name="slide-fade">
      <play ref="play" id="play" class="Router" style="z-index:20;position: fixed;" v-show="isShow"></play>
    </transition>
  </div>
</template>

<script>
import Play from './pages/play'
export default {
  name: 'App',
  data () {
    return {
      transitionName: 'slideleft',
      isShow: false
    }
  },
  mounted () {
    /* let app = document.getElementById('play')
    let first = app.getBoundingClientRect()
    app.classList.add('app-to-end')
    let last = app.getBoundingClientRect()
    let invert = first.top - last.top
    // 使元素看起来好像在起始点
    app.style.transform = `translateY(${invert}px)`
    requestAnimationFrame(function () {
      // 启用tansition，并移除翻转的改变
      app.classList.add('animate-on-transforms')
      app.style.transform = ''
    })
    app.addEventListener('transitionend', () => {
      app.classList.remove('animate-on-transforms')
    }) */
  },
  methods: {
    onSwipeLeft () {
      // console.log('向左滑动')
    },
    onSwipeRight () {
      // console.log('向右滑动')
      this.$router.goBack()
    },
    changePlayId (id) {
      this.$refs.play.id = id
    }
  },
  watch: {
    animation (newval) {
      console.log(newval)
    },
    isShow (newval) {
      // console.log(this.$refs.play.song[0].author)
      if (newval) document.title = this.$refs.play.song[0].name + '-' + this.$refs.play.song[0].author
    },
    $route () { // 监听路由变化重新赋值
      if (this.$router.isleft) {
        this.transitionName = 'slideleft'
      }
      if (this.$router.isright) {
        this.transitionName = 'slideright'
      }
    }
  },
  components: {
    Play
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /*color: #2c3e50;*/
  margin-top: 60px;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
}
.Router {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 100ms ease-out;
}
.slide-fade-enter,
.slide-fade-leave-to{
  top: 120%;
}
/*.slide-fade-enter{
  top: 150%;
  opacity: 0;
}
.slide-fade-leave{
  top: 0;
  opacity: 1;
}*/
.slideleft-enter,
.slideright-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}
.slideleft-leave-active,
.slideright-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}
</style>
