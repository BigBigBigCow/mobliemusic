<template>
    <div class="play" >
<!--      {{id}}-->
      <div class="play_bg" :style="bgStyle"></div>
      <div class="play_content">
        <audio :src="`http://music.163.com/song/media/outer/url?id=${id}.mp3`" id="audio" controls preload="auto" style="position:absolute;z-index: 100;">支持吗？</audio>
        <div class="play_body">
          <div class="play_body_b">
            <div class="play_body_img" @click="play">
    <!--          {{song[0].al.picUrl}}-->
              <div :style="styleObj" class="play_body_img_rotate rotate">
                <img :src="this.song[0]?song[0].al.picUrl+'?param=300y300':''" style="width: 100%;height: 100%;">
              </div>
<!--              <i class="iconfont big-Play" style="" v-show="!isPlay"></i>-->
              <span class="playIcon" v-show="!isPlay"></span>
            </div>
          </div>
        </div>
        <div class="play_songInfo ellips" v-if="song[0]">{{song[0].name}} - {{song[0].author}}</div>
        <div class="play_lyric" :style="{height:lyricHeight>36?'210px':''}">
          <div id="lyric" style="position: relative;" :style="lyricIndex>0?'bottom:'+lyricHeight * (lyricIndex - 1) + 'px':''">
              <span v-for="(item, index) in lyric" :key="index" :class="lyricIndex == index?'fff':''" style="box-sizing: border-box;transition: color 300ms ease-in-out;" :style="{'height':lyricHeight+'px'}">
                {{item.c}}<br>
                {{tlyric[index]?tlyric[index].c:''}}
              </span>
          </div>
        </div>
        <div style="height: 20px;line-height: 20px;padding: 20px 0;">
          <span style="border-left: 2px solid #C20C0C;padding: 2px 0 2px 10px;font-size: 16px;font-weight: 600;color: #fff">包含这首歌的歌单</span>
        </div>
        <div class="ream-ul">
          <div class="ream-li" v-for="(item, index) in incoludPlayList" :key="index" :style="index%3 === 0?'margin-left:0;':''" @click="playListDetail(item.id)">
            <div>
              <img :src="item.coverImgUrl+'?param=300y300'" alt="">
              <span><i class="iconfont big-icon-test15"></i>{{(item.playCount/10000)>10000?(item.playCount/100000000).toFixed(1)+'亿':(item.playCount/10000).toFixed(1)+'万'}}</span>
            </div>
            <span class="remd_text ellips">{{item.name}}</span>
            <span class="remd_text ellips" style="color: hsla(0,0%,100%,.6);">by {{item.creator.nickname}}</span>
          </div>
        </div>
        <div style="height: 20px;line-height: 20px;padding: 20px 0;">
          <span style="border-left: 2px solid #C20C0C;padding: 2px 0 2px 10px;font-size: 16px;font-weight: 600;color: #fff">精彩评论</span>
        </div>
        <div class="cmt">
          <div class="cmt_item" v-for="(item, index) in songComment" :key="index">
            <div class="cmt_head">
              <img :src="item.user.avatarUrl + '?param=100y100'">
              <span v-if="item.user.userType === 4"></span>
            </div>
            <div class="cmt_wrap">
              <div class="cmt_wrap_head">
                <div style="color: hsla(0,0%,100%,.7);font-size: 14px;">{{item.user.nickname}}<i class="icon-vip" v-if="item.user.vipType !== 0"></i><span style="float: right;padding-right: 10px;" @click="item.liked?'':item.likedCount++;item.liked=true;">{{item.likedCount > 100000 ? (item.likedCount/10000).toFixed(1)+'万' : item.likedCount}}<i style="margin-left: 4px;transition:color 100ms linear;" class="iconfont big-zan" :style="item.liked?'color:red;':''" ></i></span></div>
                <div style="color:hsla(0,0%,100%,.3);font-size: 12px;">{{common.format(item.time)}}</div>
              </div>
              <div class="cmt_wrap_bd">
                <span v-if="item.beReplied[0]">回复<span style='color: #507daf;'>@{{item.beReplied[0].user.nickname}}：</span></span>
                {{item.content}}
              </div>
              <div class="cmt_wrap_bd cmt_wrap_re"  v-if="item.beReplied[0]">
                @{{item.beReplied[0].user.nickname}}：{{item.beReplied[0].content}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'play',
  data: function () {
    return {
      id: this.$route.query.id,
      song: [],
      isPlay: false,
      audio: '',
      incoludPlayList: [],
      songComment: [],
      lyric: [],
      tlyric: [],
      lyricIndex: 0,
      lyricHeight: 36
    }
  },
  activated () {
    // console.log(this.$route.query.id === this.id)
    this.isPlay = false
    this.lyricIndex = 0
    if (this.$route.query.id === this.id) {
      document.title = this.song[0].name + '--' + this.song[0].author
      return
    }
    this.id = this.$route.query.id
    this.incoludPlayList = []
    this.songComment = []
    this.getSongDetails()
    this.getSongComments()
    this.getSimiPlaylist()
    this.getLyric()
  },
  mounted () {
    // console.log(456)
    this.audio = document.querySelector('#audio')
    this.getSongDetails()
    this.getSongComments()
    this.getSimiPlaylist()
    this.getLyric()
    // console.log(document.querySelector('#audio'))
    let that = this
    this.audio.addEventListener('play', () => {
      console.log('播放')
      this.isPlay = true
    })
    this.audio.addEventListener('pause', () => {
      console.log('暂停')
      this.isPlay = false
    })
    this.audio.addEventListener(`error`, function (error) {
      console.log(`播放错误!可能是没有版权！！！${error}`)
      that.mint.Toast({
        message: '播放错误!可能是没有版权！！！' + error,
        position: 'bottom'
      })
    })
    this.audio.addEventListener(`canplay`, function () {
      console.log('加载完成！！！')
      /* that.mint.Toast({
        message: '加载完成！！！',
        position: 'bottom'
      }) */
      that.audio.addEventListener(`timeupdate`, function () {
        // console.log('加载完成！！！')
        if (that.audio.currentTime >= that.audio.duration) {
          that.isPlay = false
        }
        // console.log(that.audio.currentTime)
        that.getLyricText()
      })
    })
  },
  computed: {
    styleObj: function () {
      /* let url = ''
      if (this.song[0]) url = this.song[0].al.picUrl || '' */
      return {
        // 'background': 'url(' + url + '?param=200y200) no-repeat #C20C0C',
        'animation-play-state': this.isPlay ? 'running' : 'paused'
      }
    },
    bgStyle: function () {
      let str = ''
      if (this.song[0]) str = this.song[0].al.pic_str || ''
      return {
        'backgroundImage': `url(https://music.163.com/api/img/blur/${str}.jpg?param=600y600)`,
        'opacity': this.song[0] ? 0.9 : 1
      }
    }
  },
  methods: {
    playListDetail (id) {
      // this.$router.go(-1)
      // console.log(this.$router)
      // console.log(this.$parent.$route, this.$route)
      this.$router.push(`/playList?id=${id}`)
    },
    getLyricText () {
      let ct = this.audio.currentTime
      let lyricIndex = this.lyricIndex
      // console.log(ct, lyricIndex)
      if (ct === 0) return
      // console.log(parseInt(this.lyric[0].t), parseInt(ct))
      for (let i in this.lyric) {
        if (parseInt(this.lyric[i].t) === parseInt(ct)) {
          lyricIndex = i
        }
        /* if (parseFloat(this.lyric[i].t).toFixed(1) === ct.toFixed(1)) {
          lyricIndex = i
          console.log(parseFloat(this.lyric[i + 1].t).toFixed(1), ct.toFixed(1))
          /!* if (parseFloat(this.lyric[i + 1].t).toFixed(1) === ct.toFixed(1)) {
            setTimeout(function () {
              lyricIndex = i + 1
            }, 100)
          } *!/
          break
        }
        console.log(this.lyric)
        if (parseFloat(this.lyric[i + 1].t).toFixed(1) === ct.toFixed(1)) {
          setTimeout(function () {
            lyricIndex = i + 1
          }, 100)
        } */
      }
      this.lyricIndex = lyricIndex
      // console.log(lyricIndex)
      // let du = audio
    },
    play () {
      /* console.log(this.audio)
       if (true) {
        this.lyric[0].c = this.audio
      }
      this.audio = new Audio(`http://music.163.com/song/media/outer/url?id=${this.id}.mp3`) */
      if (!this.audio.error) {
        this.isPlay = !this.isPlay
        if (this.isPlay) {
          this.audio.play()
        } else {
          this.audio.pause()
        }
      } else {
        this.mint.Toast({
          message: '播放错误!可能是没有版权！！！'
        })
      }
    },
    // 获得歌曲详细信息
    getSongDetails () {
      if (!this.id) this.id = this.$route.query.id
      this.$get(`${this.domin}/api/song/detail?ids=${this.id}`, {}).then(response => {
        this.song = response.body.songs
        let data = response.body.songs[0]
        let author = ''
        for (let j = 1; j < data.ar.length; j++) {
          author = author + '/' + data.ar[j].name
        }
        document.title = response.body.songs[0].name + '--' + data.ar[0].name + author
        this.song[0].author = data.ar[0].name + author
        // console.log(response.body.songs[0].al.picUrl)
        /* this.styleObj = {
          'color': `#ccc`
        } */
      })
    },
    // 获得歌曲评论
    getSongComments () {
      if (!this.id) this.id = this.$route.query.id
      this.$get(`${this.domin}/api/song/comment?id=${this.id}`, {}, false).then(response => {
        // console.log(response)
        this.songComment = response.body.hotComments
      })
    },
    // 获得歌曲歌词
    getLyric () {
      if (!this.id) this.id = this.$route.query.id
      this.$get(`${this.domin}/api/lyric?id=${this.id}`, {}, false).then(response => {
        // console.log(response.body.lrc.lyric)
        let lyric = response.body.lrc.lyric.split('\n')
        let tlyric = response.body.tlyric.lyric ? response.body.tlyric.lyric.split('\n') : [] // 翻译
        // console.log(lyric)
        // console.log(lyric.split(']'))
        let wordArr = []
        let TwordArr = []
        for (let i in lyric) {
          let t = lyric[i].substring(lyric[i].indexOf('[') + 1, lyric[i].indexOf(']'))
          wordArr.push({
            t: (t.split(':')[0] * 60 + parseFloat(t.split(':')[1])).toFixed(3),
            c: lyric[i].substring(lyric[i].indexOf(']') + 1, lyric[i].length)
          })
        }
        for (let i in tlyric) {
          let t = tlyric[i].substring(tlyric[i].indexOf('[') + 1, tlyric[i].indexOf(']'))
          TwordArr.push({
            t: (t.split(':')[0] * 60 + parseFloat(t.split(':')[1])).toFixed(3),
            c: tlyric[i].substring(tlyric[i].indexOf(']') + 1, tlyric[i].length)
          })
        }
        // console.log(TwordArr)
        this.lyric = wordArr
        if (TwordArr.length > 0) {
          this.tlyric = TwordArr
          this.lyricHeight = 72
        }
        // this.lyric = response.body.lrc.lyric
      })
    },
    // 获得包含这首歌的歌单
    getSimiPlaylist () {
      // if (!this.id) this.id = this.$route.query.id
      this.$get(`${this.domin}/api/simi/playlist?id=${this.id}`, {}).then(response => {
        // this.song = response.body.songs
        // console.log(response)
        this.incoludPlayList = response.body.playlists
        /* this.styleObj = {
          'color': `#ccc`
        } */
      })
    }
  }
}
</script>

<style scoped>
@keyframes changDeg {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fff{
  color:#fff !important;
}
.play{
  height: 100%;
  width: 100%;
}
.play_content{
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  overflow-y: scroll;
}
.play_bg{
  background-color: #5a5a5a;
  background-position-x: 50%;
  background-repeat: no-repeat;
  /*background-size: auto 100%;*/
  transform: scale(1.5);
  transform-origin: center top;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
  overflow: hidden;
  transition: opacity .3s linear;
  z-index: -11;
  filter:brightness(50%);
}
.play_body{
  height: 360px;
  align-items: flex-end !important;
  /*background: red;*/
}
.play_songInfo{
  color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  text-align: center;
  font-size: 18px;
}
.play_body_b,.play_body,.play_body_img_rotate{
  display: flex;
  justify-content: center;
  align-items: center;
}
.play_body_b{
  position: relative;
  width: 330px;
  height: 330px;
}
.play_body_img{
  width: 200px;
  height: 200px;
  /*padding: 50px 0;*/
  /*background: #000;*/
  border-radius: 50%;
  background-size: contain;
}
.rotate{
  animation:changDeg 18s linear 0.2s infinite;
}
.play_body_img_rotate{
  width: 200px;
  height: 200px;
  /*background: #000;*/
  border-radius: 50%;
  background-size: contain;
  position: absolute;
}
.play_body_img:after{
  content: " ";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  background: url(//s3.music.126.net/m/s/img/disc.png?d3bdd1080a72129346aa0b4b4964b75f) no-repeat;
  background-size: contain;
}
.play_lyric{
  width: 100%;
  height: 108px;
  overflow: hidden;
  /*background-color: #4caf50;*/
}
#lyric{
  transition: bottom 300ms linear;
}
.play_lyric span{
  font-size: 18px;
  display: block;
  width: 100%;
  text-align: center;
  color: hsla(0,0%,100%,.6);
  padding: 6px 0;
}
.ream-ul{
  width: 100%;
  display: flex;
  justify-content: space-around;
  height: 160px;
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
  font-size: 14px;
  text-shadow: 1px 0 0 rgba(0,0,0,.15);
}
.ream-ul .remd_text{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  box-sizing: border-box;
  padding:0 6px;
  line-height: 1.2;
  font-size: 13px;
  display: block;
  mergin-top: 0;
  color: #fff;
}
.ream-ul div img{
  width: 100%;
  height: 100%;
  /*padding-bottom: 100%;!* padding百分比相对父元素宽度计算 *!*/
  /*margin-: 2%;*/
}
.cmt{
  font-size: 16px;
  color: #fff;
}
.cmt_item{
  margin: 6px 0;
}
.cmt_head{
  position: absolute;
  left: 6px;
}
.cmt_head span{
  position: absolute;
  right: -5px;
  bottom: 0;
  width: 12px;
  height: 12px;
  background-image: url(//p4.music.126.net/l0FkWHfIqLav4I1oYHIyVQ==/19013854579518977.jpg);
  background-repeat: no-repeat;
  background-size: 75px auto;
  background-position: -20px 0;
}
.cmt_head img{
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.cmt_wrap{
  padding-left: 42px;
  /*border-bottom: 1px solid #656b79;*/
}
.cmt_wrap_bd{
  padding: 6px 6px 6px 0;
  font-size: 15px;
  line-height: 22px;
}
.cmt_wrap_re{
  color: hsla(0,0%,100%,.6);
  background-color: hsla(0,0%,100%,.05);
  margin: 5px 0;
  padding: 10px;
  color: #888;
  font-size: 14px;
  line-height: 21px;
}
.icon-vip{
  width: 21px;
  height: 11px;
  background: url(//p1.music.126.net/OeOahPin96CFyHmEnH2grA==/109951163446555771.png) 0 0/contain no-repeat;
  flex: 0 0 auto;
  display: inline-block;
  margin: 0 5px;
}
.playIcon{
  display: inline-block;
  transition:all 300ms linear;
  position: relative;
  top: 70px;
  left: 70px;
  width: 60px;
  height: 60px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAMAAABDlVWGAAABJlBMVEUAAAAAAAD////l5eX///9iYmKDg4Pn5+f///9YWFj////09PT////4+Pjt7e3///////9oaGhBQUH////////////////CwsIaGhr///8xMTEkJCT////7+/vp6en///////////////+srKyoqKienp58fHz////y8vKTk5P///8EBAT////////////////V1dW3t7f////////////////////v7++jo6N9fX3///////+UlJT////s7Oz////Nzc3///////+RkZGPj495eXkTExP////////29vb////k5OTPz882Njb////////////c3Nz///////9ycnJsbGz///9dXV3////////Q0ND///9QUFD///////////////////9FeiN6AAAAYXRSTlNmAP3c+oWT3ueB9vA19ealRId5EQbuurpu83RxD/nh05dfAquooo+M7JtzaSolE+vMspJ3Wj7w6KSQj6ucKeXNxLWnmpmObVYd8t3axXZRSt7TvbKLideCeSzHnn4V3Nh6YarbPAAABlRJREFUeNrU14lWEmEYh/GXcdj3HQTZRCkS913UNE2zbLd9Oc/930Q2LmVpwPAC03MD/M5835n/IC6dkqHnzcVoZvdkLp2HfHruZDcTXWw+DyVdOilAt6uNjI8782Ua1W2XjTShtdDSmzRdlH6zFKq5bKQBTS5H57gqXJrP1tsb7kShkBPJFQoJ90a7np0vhblqLrrc8R7oQ4vVPZOLIp8mp8flzsanJ59FuMjcqxZdHVKFxvYDWK1lPQXpooInu4ZVYD/m6pAWNLn0DSvvekJ6KLHuxerb0qyrQwrQViV/oZzKSc/lpi6sgUrLdSN16MyWARBcOBWbnS4EAYytj67r1KGtqMUseaSvPCWLGr14u+pDZysmwFhc+i4+BmBWZgcATTXTFvO9qOS3qOlmShu68g7A6xa13F6A7yuq0ORnA9jZENU2dgDjc1IPGvMB4QNR7+AJ4IspQVObBjDmF+Wur6qxmdKAbpeBoEcGlCcIlLf7hx7lOzxOlYeaP+oTmmoYQFsGWhswGql+oMUMEInLgItHgEzRPvS43OHYVY+/fGwXGvIBkzKU6oAvZA8aywOPZEg9AvIxO9AXAZg4lKF1OAGBF71DX5jw5EyG2NkTMJ/3Co2ZcM8tQ819D8xYb9CVgA2nijSw0gs0tArBzk59aRBWQ91Dj30QjssIiofBd9wttFiGiTMZSWcTUC52B629Bg5lRB0Cr2tdQRvAfRlZ94FGN9AjA+oywupgHHWGzuRhTEbaGORnOkFTZYj4ZaT5I1BOdYBuAnEZcXFg89/QmAFtGXltMGL/ghZ9I7+g19fUV/wHtAJBvzggfxAqd0NXDPCII/KAsXIXNPXOIQd/efjvUndAmxB2xMH/zB+G5u3Qr2k4EMd0AOmvt0IrsCMOagcqt0FbJkyLg5oGs3ULNApecVReiP4NnTHALY7KDcbHv6BbDno1XTUGW39CWwa8F4flB6P1B3TRgQ/UeqSLN6GzAQd83f1dHAKzN6AfoCQOrARLN6Andr9GpiITT9/KwPLAye/QGATFTusAxsOCDKogxH6D7sOC2GkNq+B9GVALsP8LWgzAqdjJ4LJXCRlIpxAoXkOrtteT6yYmH8gg8kL1GroHU/1CoTSQBZ6CvSto0oRc/1DM7GNRLwdm8hK6DF5RgMI9j6jnheVLaBTWdaAwPy7KrUP0Alqbg4QWlPCU6JaAuZoFDcGaqEHh6RdRLQIhC/oBsppQzAXVN1UWlixoBjyqUIhozr8H3vyE1lYhpwnVnv8CpH9CZyAi2lAIPtK8pDPn0Cp8UoWqz/8zqJ5DGzCpCdWf/0lonEMzMK0J1Z//acicQ30wrgnVn/9x8LkkCWFRherPfxiSEgKvLlR//r0QkmWY14Xqz/88LEsTsqpQ/fm3RlQWoa4L1Z//OixKFNq6UP35vw9RycDGMKAYD3P9vEhlF9y6UP35d8OuvISELlR//hPwUqxh0oTqz781TbIKueFB4em4rb/Mq5IfMpRn0nOPIS+ADBUatvcz/w/0B/X2VgMACMNQ9AMnWOADKwT/QuahyZYcDcte7e146X9W+vFmWmEzOeOJGfjMCmWOEubMYw7no7wizHPHvMuMAMFIOo5IxsiOjJDLSOOM2cDYN44hxliMjGnL2OAOWMCgGgz84uBEDKDFIG8ORLhzLPO2Y5kK6PpMdJiBsR28nQkMOBEMJtTixISY4JUTZWPCgVXevesgCINhGG7dZPLEIg7GRRsMTsaoMTEOnmLUuBgn+e//JuTHGt0aKT3y3QIFpj6vO9ctnbnAmr9PIysefn0E0PfhkjW92HFtnQHULn5AAG9aISZGF3NaQYxVrInRrcVYBW4H5vkPEPIfuIV5UGXhClHT8Qv9oXQ/MckoTfb+wVTGqK8ZUl9+4mmUnpGj03pOmzlH5y/w5w6ZiAil+G9qA0KpkfWMTxKsJ6530wel3try9CwjSscg27BTDcw321gHjzyuEjj9IbwP1hPeDqHo2abP0pn5XMR/NhTB/fyo2gv3q0gh1JSkEHCrUuMSG1VxCdxDOtfR1ZDr4AGUwIUACi5JJZMyx1RHUgY3kIn0LBuFQk2EFlv7J3t0+id7JPi86wlJsfm9FUVbQrZR1LrPmQ0hKZfSXC7Fzr5LeD7uGoYBQBCGV56PS2g5ewGy+NkUNbjr9gAAAABJRU5ErkJggg==) 0 0 no-repeat;
  background-size: contain;
}
</style>
