<template>
    <div style="-webkit-overflow-scrolling: touch;overflow-scrolling: touch;background-color: #f8f8f8;">
<!--      {{id}}-->
      <div class="playlist-aut" >
        <div class="playlist_bg" style="background-image: url(//music.163.com/api/img/blur/109951164029082706?param=170y170);"></div>
        <div class="playlist-l">
          <span class="playlist-hd">歌单</span>
          <img :src="playlist.coverImgUrl + '?param=30y30'" class="picImg">
          <span class="playlist-icon" v-if="playlist.playCount"><i class="iconfont big-icon-test15"></i>{{(playlist.playCount/10000)>10000?(playlist.playCount/100000000).toFixed(1)+'亿':(playlist.playCount/10000).toFixed(1)+'万'}}</span>
        </div>
        <div class="playlist-r">
          <span>{{playlist.name}}</span>
          <div style="margin-top: 20px;" v-if="playlist.creator">
            <div class="r-img"><img :src="playlist.creator.avatarUrl+'?param=30y30'"></div>
            <div class="r-text">{{playlist.creator.nickname}}</div>
          </div>
        </div>
      </div>
      <div class="playlist-intro">
        <div class="intro-tag" v-if="playlist.tags">
          标签：
          <span v-for="(item, index) in playlist.tags" :key="index">{{item}}</span>
        </div>
        <div class="intro-textr" v-if="playlist.description" :style="isShowDescription ? 'height:auto;display: inline-block;' : ''">
          简介：
          <span v-html="playlist.description"></span>
        </div>
      </div>
      <div style="text-align: right;padding: 0 10px;" @click="showDescription()"><i class="iconfont big-xia1" style="display: inline-block;" :class="isShowDescription ? 'rotate180' : ''"></i></div>
      <div style="height: 20px;line-height: 20px;padding: 0 0 20px 0;">
        <span style="border-left: 2px solid #C20C0C;padding: 2px 0 2px 10px;font-size: 16px;font-weight: 600;">歌曲列表
          <i style="font-size: 15px;color: #ccc" v-if="playlist.tracks">({{playlist.tracks.length || ''}})</i>
        </span>
      </div>
      <div class="newSong" style="background-color: #f8f8f8;">
        <div class="newSong_li" v-for="(item, index) in playlist.tracks" :key="index" @click="goPlayInfo(index)">
          <div class="newSong_li_title ellips">{{item.name}}{{item.alia[0]?`(${item.alia[0]})`:''}}</div>
          <div class="newSong_li_author"><i class="big-big-icon-test2 iconfont" style="font-size: 27px;"></i></div>
          <div class="newSong_li_icon ellips"><i class="iconfont big-sq1" style="margin-right: 4px;color: #eea375;"></i>{{item.ar[0].name}}--{{item.al.name}}</div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'playListDetail',
  data () {
    return {
      id: this.$route.query.id,
      playlist: {},
      privileges: {},
      isShowDescription: false
    }
  },
  activated () {
    // console.log(this.$route.query.id, this.id)
    if (this.$route.query.id === this.id) {
      document.title = this.playlist.name ? this.playlist.name : '--'
      return
    }
    this.id = this.$route.query.id
    this.getPlaylistDetail()
  },
  mounted () {
    this.getPlaylistDetail()
  },
  methods: {
    goPlayInfo (index) {
      let id = this.playlist.trackIds[index].id
      // this.$router.push(`/play?id=${id}`)
      this.$parent.isShow = true
      setTimeout(() => {
        this.$parent.changePlayId(id)
      }, 800)
    },
    getPlaylistDetail () {
      // if (!this.id) this.id = this.$route.query.id
      this.$get(`${this.domin}/api/playlist/detail?id=${this.id}`, {}).then(response => {
        // console.log(response)
        document.title = response.body.playlist.name
        console.log(response.body.playlist.description)
        while (response.body.playlist.description.indexOf('\n') >= 0) {
          response.body.playlist.description = response.body.playlist.description.replace('\n', '<br/>')
        }
        // console.log(response.body.playlist.description.indexOf('\r\n'), response.body.playlist.description.indexOf('\n'), response.body.playlist.description.indexOf('\r'))
        this.playlist = response.body.playlist
        this.privileges = response.body.privileges
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
        // this.songComment = response.body.hotComments
      })
    },
    showDescription () {
      this.isShowDescription = !this.isShowDescription
    }
  },
  watch: {
    '$route' (to, from) {
      // console.log(to, from)
      if (from.query.id !== to.query.id) {
        this.id = to.query.id
        this.getPlaylistDetail()
      }
    }
  }
}
</script>

<style scoped>
.playlist-aut{
  position: relative;
  padding: 30px 10px 30px 15px;
  overflow: hidden;
}
.playlist_bg{
  filter: blur(20px);
  transform: scale(1.5);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}
.playlist-l{
  display: inline-block;
  position: relative;
  float: left;
  width: 126px;
  height: 126px;
}
.playlist-l>.playlist-hd{
  position: absolute;
  z-index: 3;
  top: 10px;
  left: 0;
  padding: 0 8px;
  height: 17px;
  color: #fff;
  font-size: 9px;
  text-align: center;
  line-height: 17px;
  background-color: rgba(217,48,48,.8);
  border-top-right-radius: 17px;
  border-bottom-right-radius: 17px;
}
.playlist-l img{
  width: 100%;
  height: 100%;
}
.playlist-l .playlist-icon{
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 13px;
  color: #fff;
  text-shadow: 1px 0 0 rgba(0,0,0,.15);
}
.playlist-r{
  display: inline-block;
  position: relative;
  font-size: 16px;
  width: calc(100% - 146px);
  height: 126px;
  margin-left: 20px;
}
.playlist-r>span{
  width: 100%;
  display: inline-block;
  text-overflow: ellipsis;
  padding-top: 1px;
  font-size: 17px;
  line-height: 1.3;
  color: #fefefe;
  height: 44px;
  display: -webkit-box;
  -webkit-box-pack: center;
}
  .r-img{
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    vertical-align: middle;
    overflow: hidden;
  }
  .r-text{
    display: inline-block;
    color: #fff;
  }
  .r-img img{
    width: 100%;
    height: 100%;
    color: #999;
  }
  .playlist-intro{
    font-size: 14px;
    padding: 6px 20px 0;
  }
  .playlist-intro .intro-tag span{
    border: 1px solid #ccc;
    font-size: 12px;
    border-radius: 15px;
    padding: 5px;
    margin-left: 6px;
  }
  .playlist-intro .intro-textr{
    display: inline-block;
    margin-top: 10px;
    line-height: 1.6;
    font-size: 15px;
    height: 70px;
    min-height: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
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
</style>
