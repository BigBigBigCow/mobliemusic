<template>
  <div class="">
    <div class="login_bg"></div>
    <div class="title">"登录您的网易云账号"</div>
    <div class="boay">
      <div class="has-error" style="padding: 0 20px;font-size: 12px;width: 100%;text-align: center;transition: height .2s;">
        <span>{{errMsg}}</span>
      </div>
      <div :class="hasID">
        <input class="form-control" type="tel" placeholder="手机号" v-model="mobilePhone" maxlength="11">
      </div>
      <div :class="hasPsw">
        <input class="form-control" type="password" placeholder="密码" v-model="password" @keyup.enter="login()">
      </div>
    </div>
    <div class="login" @click="login">
      <div :style="(isMobilePhone && password.length>5 && !errMsg) ? 'backgroundColor:#3c763d;' : 'backgroundColor:#ccc;'">
        <i class="iconfont big-denglu1" v-if="!isRequset"></i>
        <mt-spinner type="triple-bounce" v-else></mt-spinner>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      mobilePhone: '',
      password: '',
      hasID: 'has-success', // 文本框样式
      hasPsw: 'has-success', // 文本框样式
      errMsg: '',
      isRequset: false
    }
  },
  computed: {
    isMobilePhone: function () {
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/
      // return
      if (!reg.test(this.mobilePhone)) {
        return false
      } else {
        document.querySelector('input[type=password]').focus()
        return true
      }
    }
  },
  mounted () {
    let loginBg = new Image()
    loginBg.src = `https://music.163.com/api/img/blur/109951164080257118.jpg?param=${window.innerHeight}y${window.innerHeight}`
    // console.log(loginBg)
    loginBg.onload = function () {
      document.getElementsByClassName('login_bg')[0].style.backgroundImage = `url(${loginBg.src})`
      // console.log('加载完成！！！')
      document.getElementsByClassName('login_bg')[0].style.opacity = 1
      document.getElementsByClassName('title')[0].style.color = '#fff'
    }
    document.getElementsByTagName('input')[0].oninput = () => {
      this.hasID = 'has-success'
      this.hasPsw = 'has-success'
      this.errMsg = ''
    }
    document.getElementsByTagName('input')[1].oninput = () => {
      this.hasID = 'has-success'
      this.hasPsw = 'has-success'
      this.errMsg = ''
    }
    if (this.$parent.profile.userId) {
      this.$router.replace('/')
    }
  },
  methods: {
    login () {
      document.activeElement.blur()
      if (this.isMobilePhone && this.password.length > 5) {
        this.hasID = 'has-success'
        this.hasPsw = 'has-success'
        this.isRequset = true // 正在请求
        this.$get(`${this.domin}/api/login?phone=${this.mobilePhone}&password=${this.password}`, {}, false)
          .then(response => {
            // console.log(response.body.msg.indexOf('帐号') > -1)
            if (response.body.code !== 200) {
              if (response.body.msg.indexOf('帐号') > -1) this.hasID = 'has-error'
              if (response.body.msg.indexOf('密码') > -1) this.hasPsw = 'has-error'
              this.errMsg = response.body.msg
              setTimeout(() => {
                this.isRequset = false
              }, 500)
            } else if (response.body.profile) {
              console.log(response.body.profile)
              this.$parent.profile = response.body.profile
              // this.$parent.getLoginStatus()
              setTimeout(() => {
                this.$router.replace('/')
              }, 1000)
            }
          }).catch(() => {
            this.errMsg = '未知错误'
            setTimeout(() => {
              this.isRequset = false
            }, 500)
          })
      }
    }
  }
}
</script>

<style scoped>
.login_bg{
  background-color: #808080;
  background-position-x: 50%;
  background-repeat: no-repeat;
  transform-origin: center top;
  -webkit-transform-origin: center top;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
  overflow: hidden;
  transition: all .5s;
  opacity: 0;
  filter:brightness(50%);
  z-index: -1;
  /*background-image: url(https://music.163.com/api/img/blur/109951164080257118.jpg?param=667y667);*/
}
.title{
  text-align: center;
  padding: 50px 0;
  font-size: 24px;
  transition: all .5s;
}
.boay{
  box-sizing: border-box;
}
.boay>div{
  padding: 20px;
  box-sizing: border-box;
  transition: color .2s;
}
.boay>div>input{
  height: 56px;
  box-sizing: border-box;
  -web-kit-appearance:none;
  -moz-appearance: none;
  outline: none;
  border-radius: 40px;
}
.login{
  padding-top: 20px;
  /*text-align: center;*/
  display: -webkit-flex;
  -webkit-justify-content: center;
  -webkit-align-items: center;
}
.login>div{
  width: 90px;
  height: 90px;
  /*margin: 0 auto;*/
  border-radius: 50%;
  overflow: hidden;
  line-height: 90px;
  text-align: center;
  transition: background-color .3s;
}
.login>div>i{
  font-size: 30px;
  color: #fff;
}
</style>
