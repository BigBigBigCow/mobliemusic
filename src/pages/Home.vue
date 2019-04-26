<template>
    <div>
      {{num}}
    </div>
</template>

<script>
// import * as homeApi from 'api/home-api' // 引入api
// import { ERR_OK } from 'config/index' // 引入请求成功状态
import {mapMutations, mapState} from 'vuex' // 引入map方法
import {fetch} from '../apiconfig/index'
export default {
  data () {
    return {
      num: 0
    }
  },
  mounted () {
    this.login()
  },
  methods: {
    login () {
      let params = {}
      const url = `http://localhost:8000/api/search?name=心安理得&type=1&limit=10&offset=0`
      fetch(url, params).then((res) => {
        console.log(res)
        /* let {data} = res
        if (data.success === ERR_OK) {
          // 请求成功操作，存储token
          localStorage.setItem('token', data.value.token)
        } else {
        } */
      }).catch(() => {
      })
    },
    ...mapMutations({ // 调用setNum方法
      setNum: 'SET_NUM'
    }),
    increase () {
      this.num++
      this.setNum(this.num) // 将this.num转入setNum
    }
  },
  computed: {
    // ...mapGetters([           // 通过getters获取state数据
    //   'number'
    // ]),
    ...mapState({ // 通过state获取state数据
      number: state => state.home.number
    })
  }
}
</script>

<style scoped>

</style>
