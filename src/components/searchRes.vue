<template>
   <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{searchName}}</h2>
      <span class="sub-title">找到{{songTotal}}个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item,index) in songList" :key="item.id" @dblclick="playSong(item.id)">
              <td>{{index+1}}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <span class="iconfont icon-mv" v-if="item.mvid!==0" @click="goMV(item.mvid)"></span>
                  </div>
                  <span v-if="item.alias.length!==0">{{item.alias[0]}}</span>
                </div>
              </td>
              <td>{{item.artists[0].name}}</td>
              <td>{{item.album.name}}</td>
              <td>{{item.duration | dateFormate}}</td>
            </tr>
          </tbody>
        </table>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="15"
          layout="prev, pager, next"
          :total="songTotal">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" v-for="item in playList" :key="item.id" @click="toplaylist(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="15"
          layout="prev, pager, next"
          :total="songTotal">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="item in mvList" :key="item.id" @click="goMV(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount}}</div>
              </div>
              <span class="time">{{item.duration | dateFormate}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="8"
          layout="prev, pager, next"
          :total="songTotal">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: 'songs',
      searchName: '',
      songTotal: 0,
      songList: [],
      playList: [],
      mvList: [],
      currentpage: 1
    }
  },
  created () {
    this.searchName = this.$route.query.song
    // console.log('进入搜索结果页面')
    // console.log('搜索页面的route:', this.$route)
    // this.getRes()
    this.$parent.$parent.$parent.$parent.activeName = ''
    this.activeIndex = window.sessionStorage.getItem('ResTabName') ? window.sessionStorage.getItem('ResTabName') : 'songs'
    window.sessionStorage.removeItem('ResTabName')
  },
  methods: {
    async getRes () {
      // 调用查找单曲结果的接口
      const { data: res } = await this.$http.get('https://autumnfish.cn/search', { params: { keywords: this.searchName, limit: this.limit, offset: this.offset, type: this.type } })
      if (res.code !== 200) return this.$message.error('请求单曲失败')
      if (this.activeIndex === 'songs') {
        this.songList = res.result.songs
        // console.log(res)
        this.songTotal = this.songList.length
      } else if (this.activeIndex === 'lists') {
        this.playList = res.result.playlists
        this.songTotal = res.result.playlistCount
      } else {
        this.mvList = res.result.mvs
        this.songTotal = res.result.mvCount
      }
    },
    // 播放歌曲
    async playSong (id) {
    //   console.log(id)
      this.$parent.$parent.$parent.$parent.audioURL = ''
      // 调用接口
      const { data: res } = await this.$http.get('https://autumnfish.cn/song/url', { params: { id: id } })
      if (res.code !== 200) return this.$message.error('请求歌曲播放地址失败')
      const url = res.data[0].url
      // console.log(url)
      this.$parent.$parent.$parent.$parent.audioURL = url
    },
    handleCurrentChange (page) {
      this.currentpage = page
      this.getRes()
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
  },
  computed: {
    limit () {
      if (this.activeIndex === 'mv') {
        return 8
      } else {
        return 15
      }
    },
    offset () {
      return (this.currentpage - 1) * 15
    },
    type () {
      if (this.activeIndex === 'songs') {
        return 1
      } else if (this.activeIndex === 'lists') {
        return 1000
      } else {
        return 1004
      }
    }
  },
  watch: {
    searchName (newInput, oldInput) {
      this.getRes()
    },
    activeIndex () {
      this.getRes()
    }
  }
}
</script>

<style>
.result-container {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
