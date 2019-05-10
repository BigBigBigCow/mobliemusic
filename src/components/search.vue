<template>
    <div class="searchbar">
      <div class="searchbar-inner">
        <i class="big-sousuo1 iconfont searchbar-icon"></i>
        <form  id="myForm" action="" onsubmit="return false;">
          <input type="search" id="input" :value="value" :placeholder="placeholder" @input="handleInput" class="searchbar-core" @keyup.enter="keyEnter()">
        </form>
        <i class="big-jinakangbaoicons18 iconfont close-icon" @click="eventClose" v-show="value.length>0"></i>
      </div>
    </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {}
  },
  props: {
    keyEnter: {
      type: Function
    },
    value: {
      type: null
    },
    placeholder: {
      type: String,
      default: '搜索'
    }
  },
  methods: {
    eventClose () {
      // this.value = ''
      this.$parent.searchName = ''
      // this.$emit('input', this.value) // 触发 input 事件，并传入新值
      this.$parent.showSonglist = false
      this.$parent.SongList = []
      this.$parent.searchPage = 0
      // TagName('input').focus()
      this.getFocus()
    },
    overFocus () {
      setTimeout(function () {
        document.getElementById('input').blur()
      }, 300)
    },
    getFocus () {
      // console.log('123')
      setTimeout(function () {
        document.getElementById('input').focus()
      }, 300)
    },
    handleInput (event) {
      // let value = event.target.value
      this.$parent.searchName = event.target.value
      // this.$emit('input', value) // 触发 input 事件，并传入新值
    }
  }
}
</script>

<style scoped>
.searchbar{
  padding: 10px;
}
.searchbar-inner{
  width: 100%;
  position: relative;
  /*border-radius: 20px;*/
}
.searchbar-inner input{
  width: 100%;
  background-color: #f0f0f0;
  border-radius:16px;
  border: 0;
  padding: 5px 5px 5px 25px;
  outline:none;
}
.searchbar-inner input:focus{
  border-radius:16px;
  border: 0;
}
.searchbar-icon{
  position: absolute;
  font-size: 12px;
  top: 10px;
  left: 8px;
}
.searchbar-core{
  height: 32px;
  font-size: 14px;
  line-height: 16px;
}
.close-icon{
  position: absolute;
  font-size: 12px;
  top: 10px;
  right: 8px;
}
input[type=search]::-ms-clear{
  display: none;
}
input::-webkit-search-cancel-button{
  display: none;
}
</style>
