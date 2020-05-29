<template>
  <div class="discovery-container">
      <!-- 轮播图区域 -->
      <el-carousel :interval="4000" type="card">
        <el-carousel-item v-for="(item,index) in pics" :key="index" @dblclick.native="playSong (item.targetId)">
            <img :src="item.imageUrl">
        </el-carousel-item>
      </el-carousel>
      <!-- 推荐歌单 -->
      <div class="recommend">
        <h3 class="title">
            推荐歌单
        </h3>
        <div class="items">
            <div class="item" v-for="item in recommendSong" :key="item.id" @click="toplaylist(item.id)">
                <div class="img-wrap">
                    <div class="desc-wrap">
                        <span class="desc">{{item.copywriter}}</span>
                    </div>
                    <img :src="item.picUrl" alt="" />
                    <span class="iconfont icon-play"></span>
                </div>
                <p class="name">{{item.name}}</p>
            </div>
        </div>
      </div>
      <!-- 最新音乐 -->
      <div class="news">
        <h3 class="title">
            最新音乐
        </h3>
        <div class="items">
            <div class="item" v-for="item in newSongs" :key="item.id" @click="playSong(item.id)">
                <div class="img-wrap">
                    <img :src="item.picUrl" alt="" />
                    <span class="iconfont icon-play"></span>
                </div>
                <div class="song-wrap">
                    <div class="song-name">{{item.name}}</div>
                    <div class="singer">{{item.song.artists[0].name}}</div>
                </div>
            </div>
        </div>
      </div>
      <!-- 推荐MV -->
      <div class="mvs">
        <h3 class="title">推荐MV</h3>
        <div class="items">
            <div class="item" v-for="item in MVs" :key="item.id" @click="goMV(item.id)">
                <div class="img-wrap">
                    <img :src="item.picUrl" alt="" />
                    <span class="iconfont icon-play"></span>
                    <div class="num-wrap">
                        <div class="iconfont icon-play"></div>
                        <div class="num">{{item.playCount}}</div>
                    </div>
                </div>
                <div class="info-wrap">
                    <div class="name">{{item.copywriter}}</div>
                    <div class="singer">{{item.artistName}}</div>
                </div>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pics: [],
      recommendSong: [],
      newSongs: [],
      MVs: []
    }
  },
  created () {
    this.getpics()
    this.getNewSongs()
    this.getRecommendSongs()
    this.getMVs()
    const path = this.$route.path.substr(1)
    this.$parent.$parent.$parent.$parent.activeName = path
  },
  methods: {
    async getpics () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/banner')
      if (res.code !== 200) return this.$message.error('请求轮播图失败')
      this.pics = res.banners
      // console.log(this.pics)
    },
    async getRecommendSongs () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/personalized', { params: { limit: 10 } })
      if (res.code !== 200) return this.$message.error('请求推荐歌单失败')
      this.recommendSong = res.result
    //   console.log(this.recommendSong)
    },
    async getNewSongs () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/personalized/newsong')
      if (res.code !== 200) return this.$message.error('请求最新音乐失败')
      this.newSongs = res.result
      // console.log(this.newSongs)
    },
    async getMVs () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/personalized/mv')
      if (res.code !== 200) return this.$message.error('请求最新MV失败')
      this.MVs = res.result
      // console.log(this.MVs)
    },
    async playSong (id) {
      // 调用接口
      // console.log(id)
      this.$parent.$parent.$parent.$parent.audioURL = ''
      const { data: res } = await this.$http.get('https://autumnfish.cn/song/url', { params: { id: id } })
      if (res.code !== 200) return this.$message.error('请求播放音乐地址失败')
      // console.log(res)
      const url = res.data[0].url
      this.$parent.$parent.$parent.$parent.audioURL = url
    },
    toplaylist (id) {
      // console.log('去歌单详情页')
      this.$router.push('/playList?id=' + id)
      // 存储当前的tab便签名
      window.sessionStorage.setItem('ResTabName', this.activeIndex)
    }, // 去mv详情页面
    goMV (id) {
      // console.log('去mv详情页')
      this.$router.push('/mv?id=' + id)
      // 存储当前的tab便签名
      window.sessionStorage.setItem('ResTabName', this.activeIndex)
    }
  }
}
</script>

<style>
</style>
