<template>
  <div id="app">
<!--    <img src="./assets/logo.png">-->
<!--    <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div">-->
<!--      <transition :name="transitionName">-->
    <keep-alive>
          <router-view class="Router"></router-view>
    </keep-alive>
<!--      </transition>-->
<!--    </v-touch>-->
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      transitionName: 'slideleft'
    }
  },
  methods: {
    onSwipeLeft () {
      console.log('向左滑动')
    },
    onSwipeRight () {
      console.log('向右滑动')
      this.$router.goBack()
    }
  },
  watch: {
    $route () { // 监听路由变化重新赋值
      if (this.$router.isleft) {
        this.transitionName = 'slideleft'
      }
      if (this.$router.isright) {
        this.transitionName = 'slideright'
      }
    }
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
  transition: all .5s ease;
  -webkit-transition: all .5s ease;
  -moz-transition: all .5s ease;
}
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
