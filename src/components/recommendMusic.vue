<template>
  <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card" v-if="highquality">
      <div class="icon-wrap">
        <img :src="highquality.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">
          {{highquality.name}}
        </div>
        <div class="info">
          {{highquality.description}}
        </div>
      </div>
      <img src="../assets/listCover.jpg" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar" @click="changeTab">
        <span class="item active">全部</span>
        <span class="item">欧美</span>
        <span class="item">华语</span>
        <span class="item">流行</span>
        <span class="item">说唱</span>
        <span class="item">摇滚</span>
        <span class="item">民谣</span>
        <span class="item">电子</span>
        <span class="item">轻音乐</span>
        <span class="item">影视原声</span>
        <span class="item">ACG</span>
        <span class="item">怀旧</span>
        <span class="item">治愈</span>
        <span class="item">旅行</span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="(item,index) in playList" :key="index" @click="toPlaylist(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount}} {{item.id}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.description}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="20"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'recommend',
  data () {
    return {
      // 当前选中的
      // 总条数
      total: 0,
      // 页码
      page: 1,
      activeName: '全部',
      highquality: {},
      playList: []
    }
  },
  created () {
    this.getHighqualityPlay()
    this.getPlayList()
    const path = this.$route.path.substr(1)
    this.$parent.$parent.$parent.$parent.activeName = path
  },
  methods: {
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.page = val
      this.getPlayList()
    },
    // 获取精品歌单
    async getHighqualityPlay () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/top/playlist/highquality', { params: { limit: 1, cat: this.activeName } })
      if (res.code !== 200) return this.$message.error('请求精品歌单失败')
      // console.log(res)
      this.highquality = res.playlists[0]
    },
    // 获取歌单
    async getPlayList () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/top/playlist/', { params: { limit: 10, offset: this.offset, cat: this.activeName } })
      if (res.code !== 200) return this.$message.error('请求歌单失败')
      this.playList = res.playlists
      this.total = res.total
    },
    changeTab (event) {
      // 1.给当前触发的span设置active属性
      if (event.target.className === 'item') {
        this.page = 1
        const spans = event.target.parentNode.children
        spans.forEach(element => {
          element.className = 'item'
        })
        event.target.className += ' active'
        // 2.获取当前span的内容
        this.activeName = event.target.innerText
        this.getHighqualityPlay()
        this.getPlayList()
      }
    },
    toPlaylist (id) {
      this.$router.push('/playList?id=' + id)
    }
  },
  computed: {
    offset () {
      return (this.page - 1) * 10
    }
  }
}
</script>

<style >
.playlists-container {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
