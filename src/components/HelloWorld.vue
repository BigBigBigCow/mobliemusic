<template>
  <div class="hello">
    <div style="height: 40px;width: 100%;background-color:#d43c33;text-align: center;position: fixed;z-index: 9;" @click="$parent.isShow = true">
<!--      <img src="../../static/img/format.png" class="autImg" style="cursor: pointer;">-->
      <span class="text">Cloudmusic</span>
    </div>
    <div class="nevaBar">
      <div @click="nevaBarFun(1)"><span :class="nevaBarId === 1?'action':''">推荐歌单</span></div>
      <div @click="nevaBarFun(2)"><span :class="nevaBarId === 2?'action':''">热歌榜</span></div>
      <div @click="nevaBarFun(3)"><span :class="nevaBarId === 3?'action':''">搜索</span></div>
    </div>
    <div class="nevaBerBorder"></div>
    <div class="nevaBarPage" v-show="nevaBarId === 1">
<!--      推荐歌单<i class="iconfont big-sousuo3"></i>-->
      <div style="height: 20px;line-height: 20px;padding: 20px 0;">
        <span style="border-left: 2px solid #C20C0C;padding: 2px 0 2px 10px;font-size: 16px;font-weight: 600;">推荐歌单</span>
      </div>
<!--      歌单列表-->
      <div class="ream-ul">
        <div class="ream-li" v-for="(item, index) in playList" :key="index" :style="index%3 === 0?'margin-left:0;':''" v-if="index < 3" @click="playListDetail(item.id)">
          <div>
            <img :src="item.picUrl+'?param=30y30'" alt="" class="picImg">
            <span><i class="iconfont big-icon-test15"></i>{{(item.playCount/10000)>10000?(item.playCount/100000000).toFixed(1)+'亿':(item.playCount/10000).toFixed(1)+'万'}}</span>
          </div>
          <span class="remd_text">{{item.name}}</span>
        </div>
      </div>
      <div class="ream-ul">
        <div class="ream-li" v-for="(item, index) in playList" :key="index" :style="index%3 === 0?'margin-left:0;':''" v-if="index >= 3" @click="playListDetail(item.id)">
          <div>
            <img :src="item.picUrl+'?param=30y30'" alt="" class="picImg">
            <span><i class="iconfont big-icon-test15"></i>{{(item.playCount/10000)>10000?(item.playCount/100000000).toFixed(1)+'亿':(item.playCount/10000).toFixed(1)+'万'}}</span>
          </div>
          <span class="remd_text">{{item.name}}</span>
        </div>
      </div>
<!--      最新音乐-->
      <div style="height: 20px;line-height: 20px;padding: 20px 0;">
        <span style="border-left: 2px solid #C20C0C;padding: 2px 0 2px 10px;font-size: 16px;font-weight: 600;">最新音乐</span>
      </div>
      <!--         歌曲显示固定格式-->
      <div class="newSong">
        <div class="newSong_li" v-for="(item, index) in newSongs" :key="index" @click="goPlayInfo(item.songId)">
          <div class="newSong_li_title ellips" v-html="item.title"></div>
          <div class="newSong_li_author"><i class="big-big-icon-test2 iconfont" style="font-size: 27px;"></i></div>
          <div class="newSong_li_icon ellips"><i class="iconfont big-sq1" style="margin-right: 4px;color: #eea375;"></i>{{item.author}}-{{item.special}}</div>
        </div>
      </div>
    </div>
    <div class="nevaBarPage" v-show="nevaBarId === 2">
      <!--<div class="hotop">
        <div class="hotop-r"></div>
      </div>-->
      <div class="hotop">
        <div class="hotopct">
          <div class="u-hmsprt hoticon"></div>
          <div class="hottime">更新日期：{{update}}</div>
        </div>
      </div>
      <div class="newSong">
        <div class="newSong_li" v-for="(item, index) in hotSong" :key="index" @click="goPlayInfo(item.songId)">
          <div class="newSong_li_img newSong_li_hot" :style="index<3?'color: #df3436;':''">{{index &lt; 9 ? '0' + (index + 1) : index + 1}}</div>
          <div class="newSong_li_title ellips" style="padding-left: 46px;" v-html="item.title"></div>
          <div class="newSong_li_author"><i class="big-big-icon-test2 iconfont" style="font-size: 27px;"></i></div>
          <div class="newSong_li_icon ellips" style="padding-left: 46px;"><i class="iconfont big-sq1" style="margin-right: 4px;color: #eea375;"></i>{{item.author}}-{{item.special}}</div>
        </div>
      </div>
    </div>
    <div class="nevaBarPage" v-show="nevaBarId === 3" @scroll="scrollToEnd">
      <search v-model="searchName" :keyEnter="search" ref="input"></search>
      <div class="search-i" v-show="!showSonglist">
        热门搜索
        <div class="search-hot">
          <span  v-for="(item, index) in hotSearch" :key="index" @click="search(item.first)">{{item.first}}</span>
        </div>
        <div class="search-log" style="margin-top: 6px;" v-if="searchLog.length>0">
          <div v-for="(item, index) in searchLog" :key="index" v-if="item">
            <span @click="search(item)" style="display: inline-block;width: 90%;">
              <i class="iconfont big-jilu" style="color: #ccc;font-size: 18px;float: left;margin-right: 10px;"></i>
              {{item}}
            </span>
            <i class="iconfont big-cha1" style="font-size: 16px;float: right;width: 10%;text-align: right;" @click.prevent="closeLog(item)"></i>
          </div>
        </div>
      </div>
      <div class="search-l" v-show="showSonglist">
<!--         歌曲显示固定格式-->
        <div class="newSong">
          <div class="newSong_li" v-for="(item, index) in SongList" :key="index" @click="goPlayInfo(item.songId)">
            <div class="newSong_li_img" ><img :src="item.pic + '?param=50y50'" style="width: 30px;height: 30px;"></div>
            <div class="newSong_li_title ellips" style="padding-left: 46px;" v-html="item.title"></div>
            <div class="newSong_li_author"><i class="big-big-icon-test2 iconfont" style="font-size: 27px;"></i></div>
            <div class="newSong_li_icon ellips" style="padding-left: 46px;" v-html="item.author+'-'+item.special" ><i class="iconfont big-sq1" style="margin-right: 4px;color: #eea375;"></i></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from './search'
export default {
  name: 'HelloWorld',
  components: {Search},
  data () {
    return {
      nevaBarId: 0, // topbar
      searchName: [], // 搜索框内容
      searchPage: 0, // 搜索页码
      searchLog: [], // 搜索记录
      playList: [], // 歌单
      newSongs: [], // 最新音乐
      hotSearch: [], // 热门搜索词
      showSonglist: false, //  是否显示歌曲列表
      SongList: [], // 歌曲列表
      hotSong: [], // 热门歌曲
      classArr: [],
      update: '04月25日'
    }
  },
  mounted () {
    this.nevaBarId = 1
    this.getPersonalized() // 获取推荐歌单
    // this.getNewSong() // 获取最新歌曲
    this.getHotSearch() // 获得热搜关键词
    this.searchLog = this.common.getStorage('searchLog') || []
    if (this.searchLog.length > 0) this.searchLog = this.searchLog.split(',')
    let date = new Date()
    // console.log(date.getDay(), date.getDate(), date.getMonth())
    let nowTime = date.getTime()
    let oneDayLong = 24 * 60 * 60 * 1000
    let today = date.getDate()
    if (date.getDay() === 4) {
      let Month = date.getMonth() + 1
      if (today < 10) today = '0' + today
      if (Month < 10) Month = '0' + Month
      this.update = `${Month}月${today}日`
    } else {
      let Thursday = ''
      if (date.getDay() > 4) {
        Thursday = nowTime - (date.getDay() - 4) * oneDayLong
      } else {
        Thursday = nowTime - (date.getDay() + 7 - 4) * oneDayLong
      }
      let orDate = new Date(Thursday)
      let Month = orDate.getMonth() + 1
      let today = orDate.getDate()
      if (today < 10) today = '0' + today
      if (Month < 10) Month = '0' + Month
      this.update = `${Month}月${today}日`
    }
  },
  methods: {
    scrollToEnd (e) {
      // console.log(e)
      // 变量scrollTop是滚动条滚动时，距离顶部的距离
      let scrollTop = e.target.scrollTop
      // 变量windowHeight是可视区的高度
      let windowHeight = e.target.clientHeight
      // 变量scrollHeight是滚动条的总高度
      let scrollHeight = e.target.scrollHeight
      // 滚动条到底部的条件
      // console.log('距顶部' + scrollTop + '可视区高度' + windowHeight + '滚动条总高度' + scrollHeight)
      /* if (scrollTop + windowHeight > scrollHeight) {
        // console.log('到达底部')
        this.mint.Toast({
          message: '到底'
        })
      } */
      if (scrollTop + windowHeight === scrollHeight) {
        console.log('到达底部')
        if (this.showSonglist) {
          this.searchPage++
          this.search(this.searchName)
        }
      }
    },
    playListDetail (id) {
      this.$router.push(`/playList?id=${id}`)
    },
    nevaBarFun (index) {
      this.nevaBarId = index
      // let that = this
      setTimeout(function () {
        document.getElementById('input').focus()
      }, 400)
    },
    // 去歌曲播放页
    goPlayInfo (id) {
      // this.$router.push(`/play?id=${id}`)
      this.$parent.isShow = true
      setTimeout(() => {
        this.$parent.changePlayId(id)
      }, 800)
    },
    // 获得热门歌曲
    getHotSong () {
      this.$get(`${this.domin}/api/top/list?idx=1`, {}).then(response => {
        // alert('成功！')
        // console.log(response)
        let data = response.body.result
        let item = []
        for (let i = 0; i < 100; i++) {
          item.push(data[i])
        }
        this.hotSong = item
        // this.hotSearch = response.body.result.hots
      })
    },
    // 获得热门搜索
    getHotSearch () {
      this.$get(`${this.domin}/api/search/hot`, {}, false).then(response => {
        // alert('成功！')
        // console.log(response.body.result)
        this.hotSearch = response.body.result.hots
        // console.log(this.$refs.input)
        // this.$refs.input.focus()
      })
    },
    // 获得最新音乐
    getNewSong () {
      this.$get(`${this.domin}/api/personalized/newsong`, {}).then(response => {
        // alert('成功！')
        // console.log(response.body.result)
        this.newSongs = response.body.result
      })
    },
    // 获得推荐歌单
    getPersonalized () {
      this.$get(`${this.domin}/api/personalized?limit=6`, {}).then(response => {
        // alert('成功！')
        // console.log(response)
        this.playList = response.body.result
        // 更换成更加清晰的图片
        setTimeout(() => {
          let picImg = document.getElementsByClassName('picImg')
          // console.log(picImg)
          for (let i = 0; i < picImg.length; i++) {
            // console.log(picImg[i].complete)
            if (picImg[i].complete) {
              picImg[i].src = picImg[i].src.split('?')[0] + '?param=300y300'
              continue
            }
            picImg[i].onload = function (e) {
              console.log('111111111111111', e)
              e.target.src = e.target.src.split('?')[0] + '?param=300y300'
              e.target.onload = function () {}
            }
          }
        }, 200)
      })
    },
    // 歌曲搜索
    search (name) {
      this.$refs.input.overFocus()
      if (!name) {
        name = this.searchName
        this.SongList = []
        this.searchPage = 0
      } else {
        this.searchName = name
      }
      if (name === '') return
      // console.log(name)
      this.$get(`${this.domin}/api/search?name=${name}&offset=${this.searchPage}`, {}).then(response => {
        // alert('成功！')
        if (this.searchLog.includes(name)) {
          for (let i in this.searchLog) {
            if (this.searchLog[i] === name) {
              this.searchLog.splice(i, 1)
            }
          }
        }
        this.searchLog.unshift(name)
        this.common.setStorage('searchLog', this.searchLog.join(','))
        // this.poemDetails.content = poemData[0].content.replace(/\|/g, '<br>').replace(new RegExp(this.poem.content, 'g'), "<span style='color: #F56C6C;'>$&</span>")
        this.showSonglist = true
        // console.log(response)
        let SongList = response.body.result.songs
        for (let i in SongList) {
          SongList[i].title = SongList[i].title.replace(/\|/g, '<br>').replace(new RegExp(name, 'g'), "<span style='color: #507daf;'>$&</span>")
          SongList[i].special = SongList[i].special.replace(/\|/g, '<br>').replace(new RegExp(name, 'g'), "<span style='color: #507daf;'>$&</span>")
          SongList[i].author = SongList[i].author.replace(/\|/g, '<br>').replace(new RegExp(name, 'g'), "<span style='color: #507daf;'>$&</span>")
        }
        this.SongList = [...this.SongList, ...SongList]
      })
    },
    closeLog (name) {
      // console.log(name)
      for (let i in this.searchLog) {
        if (this.searchLog[i] === name) {
          // this.classArr[i] = true
          // this.$set(this.classArr, i, true)
          this.searchLog.splice(i, 1)
          break
        }
      }
      this.common.setStorage('searchLog', this.searchLog.join(','))
    }
  },
  watch: {
    nevaBarId: function (newVal) {
      // console.log(newVal)
      let wid = document.getElementsByClassName('nevaBar')
      let Client = wid[0].children[newVal - 1].children[0].getBoundingClientRect()
      console.log(Client)
      document.getElementsByClassName('nevaBerBorder')[0].style.width = Client.width + 'px'
      document.getElementsByClassName('nevaBerBorder')[0].style.left = Client.x + 'px'
      console.log(document.getElementsByClassName('nevaBerBorder')[0])
      if (newVal === 1 && this.newSongs.length < 1) this.getNewSong() // 获取最新歌曲
      else if (newVal === 2 && this.hotSong.length < 1) this.getHotSong() // 获取最新歌曲
      else if (newVal === 3) {
        this.getHotSearch() // 获得热搜关键词
        // this.$refs.input.getFocus()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes delete {
  0% {
    position: relative;
    left: 0;
  }
  99% {
    position: relative;
    left: -100%;
  }
  100% {
    display: none;
  }
}
.deleteA{
  animation:delete 300ms ease-in 0.2s;
}
.hello{
  font-size: 12px;
}
.action{
  color:#C20C0C;
}
.nevaBar{
  z-index: 8;
  background-color: #fff;
  width: 100%;
  height: 40px;
  line-height: 30px;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  position: fixed;
  top: 40px;
}
.nevaBerBorder{
  background-color: #C20C0C;
  width: 100px;
  height: 2px;
  position: fixed;
  top: 78px;
  z-index: 9;
  transition: all .3s;
}
.nevaBar div{
  width: 32%;
  display: inline-block;
  text-align: center;
  height: 40px;
  line-height: 40px;
  padding-bottom: 2px;
  box-sizing: border-box;
}
.nevaBar div span{
  display: inline-block;
  height: 100%;
  padding: 0 10px;
  transition:color 300ms;
}
.nevaBarPage{
  position: absolute;
  top: 80px;
  width: 100%;
  height: calc(100% - 81px);
  background-color: #fbfcfd;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  overflow-y: scroll;
  /*touch-action: none;*/
}
.ream-ul{
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.ream-ul .ream-li{
  display: inline-block;
  position: relative;
  width: 32%;
  /*float: left;*/
  margin-left: 2px;
  box-sizing: border-box;
  /*padding-right: 2px;*/
}
.ream-ul .ream-li div img{
  min-height: 120px;
}
.ream-ul .ream-li div span{
  position: absolute;
  top: 2px;
  right: 2px;
  color: #fff;
  text-shadow: 1px 0 0 rgba(0,0,0,.15);
}
.ream-ul .remd_text{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  padding: 6px 2px 8px 6px;
  line-height: 1.2;
  font-size: 13px;
  mergin-top: 0;
}
.ream-ul div img{
  width: 100%;
  height: 100%;
  /*padding-bottom: 100%;!* padding百分比相对父元素宽度计算 *!*/
  /*margin-: 2%;*/
}
.newSong_li{
  position: relative;
  margin-bottom: 8px;
}
.newSong_li_img{
  position: absolute;top: 4px;left: 6px;float: left;display: inline-block;width: 30px;
}
.newSong_li_hot{
  font-size: 18px;
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.newSong_li_title{
  padding-left:6px;font-size: 17px;padding-right: 30px;box-sizing: border-box;
}
.newSong_li_author{
  float: right;height: 100%;position: absolute;top: 0;right: 6px;line-height: 39px;
}
.newSong_li_icon{
  padding-right: 30px;box-sizing: border-box;padding-left:6px;color:#888;font-size: 12px;
}
.search-i{
  color: #333;
  /*border-top: 1px solid #ccc;*/
  /*border-bottom: 1px solid #ccc;*/
  padding: 10px 8px 0 8px;
  font-size: 14px;
}
.search-hot span{
  font-size: 14px;
  display: inline-block;
  border: 1px solid #ccc;
  padding: 6px;
  margin: 6px;
  /* border-radius: 12%; */
  border-radius: 16px;
}
.search-log>div{
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
}
.hotop {
  position: relative;
  padding-top: 38.9%;
  overflow: hidden;
  background: url(//s3.music.126.net/m/s/img/hot_music_bg_2x.jpg?f01a252…) no-repeat;
  background-size: contain;
}
.hotopct {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-pack: center;
  justify-content: center;
  z-index: 2;
  padding-left: 20px;
  box-sizing: border-box;
}

.hotop:after, .hotopct {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.u-hmsprt {
  background: url(//s3.music.126.net/m/s/img/index_icon_2x.png?5207a28…) no-repeat;
  background-size: 166px 97px;
}
.hoticon {
  width: 142px;
  height: 67px;
  background-position: -24px -30px;
}
.hottime {
  margin-top: 10px;
  color: hsla(0,0%,100%,.8);
  font-size: 12px;
  transform: scale(.91);
  transform-origin: left top;
}
</style>
