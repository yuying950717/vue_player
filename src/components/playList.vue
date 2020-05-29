<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="playDetail.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <p class="title">{{playDetail.name}}</p>
        <div class="author-wrap">
          <img class="avatar" :src="playDetail.creator.avatarUrl" alt="" />
          <span class="name">{{playDetail.creator.nickname}}</span>
          <span class="time">{{playDetail.createTime | dateFormate2}} 创建</span>
        </div>
<!--         <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div> -->
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item,index) in playDetail.tags" :key="index">{{item}}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc"
            >{{playDetail.creator.signature}}</span
          >
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex" @tab-click="handleClick">
      <el-tab-pane label="歌曲列表" name="1">
        <table class="el-table playlit-table">
          <thead>
            <th></th>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item,index) in playDetail.tracks" :key="item.id" @dblclick="playSong(item.id)">
              <td>{{index+1}}</td>
              <td>
                <div class="img-wrap">
                  <img :src="item.al.picUrl" alt="" />
                  <span class="iconfont icon-play"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <span class="iconfont icon-mv" v-if="item.mv !== 0" @click="goMV(item.mv)"></span>
                  </div>
                  <span></span>
                </div>
              </td>
              <td>{{item.ar[0].name}}</td>
              <td>{{item.al.name}}</td>
              <td>{{item.dt | dateFormate}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane :label="'评论(' + total + ')'" name="2">
        <!-- 精彩评论 -->
        <div class="comment-wrap" v-if="Hottotal !== 0">
          <p class="title">精彩评论<span class="number">({{Hottotal}})</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="(item,index) in hotComment" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{item.user.nickname}}：</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <div class="re-content" v-if="item.parentCommentId !== 0">
                  <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <div class="date">{{item.time | dateFormate3}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">最新评论<span class="number">({{Newtotal}})</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="(item,index) in newComment" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{item.user.nickname}}：</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <div class="re-content" v-if="item.parentCommentId !== 0">
                  <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <div class="date">{{item.time | dateFormate3}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="Newtotal"
          :current-page="page"
          :page-size="5"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'playlist',
  data () {
    return {
      playDetail: {
        creator: {}
      },
      activeIndex: '1',
      // 总条数
      Newtotal: 0,
      Hottotal: 0,
      // 页码
      page: 1,
      limit: 5,
      hotComment: [],
      newComment: []
    }
  },
  created () {
    this.getplaydetail()
    this.getHotComment()
    this.getNewComment()
    this.$parent.$parent.$parent.$parent.activeName = ''
  },
  computed: {
    total () {
      return this.Newtotal + this.Hottotal
    },
    offset () {
      return (this.page - 1) * this.limit
    }
  },
  methods: {
    handleClick () {
      this.page = 1
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.page = val
      this.getNewComment()
    },
    async getplaydetail () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/playlist/detail', { params: { id: this.$route.query.id } })
      if (res.code !== 200) return this.$message.error('请求歌单详情失败')
      this.playDetail = res.playlist
      // console.log(this.playDetail)
    },
    async getHotComment () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/comment/hot', { params: { id: this.$route.query.id, type: 2 } })
      if (res.code !== 200) return this.$message.error('请求歌单热门评论失败')
      this.hotComment = res.hotComments
      this.Hottotal = this.hotComment.length
      // console.log(this.hotComment)
    },
    async getNewComment () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/comment/playlist', { params: { id: this.$route.query.id, limit: this.limit, offset: this.offset } })
      if (res.code !== 200) return this.$message.error('请求歌单最新评论失败')
      this.newComment = res.comments
      // console.log(res)
      this.Newtotal = res.total
    },
    // 播放音乐
    async playSong (id) {
      // 调用接口
      this.$parent.$parent.$parent.$parent.audioURL = ''
      const { data: res } = await this.$http.get('https://autumnfish.cn/song/url', { params: { id: id } })
      if (res.code !== 200) return this.$message.error('请求播放音乐地址失败')
      const url = res.data[0].url
      this.$parent.$parent.$parent.$parent.audioURL = url
    },
    timer (orignal) {
      // var val = JSON.parse(orignal)
      const dt = new Date(orignal)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      return y + '-' + m + '-' + d
    },
    goMV (id) {
      // console.log('去mv详情页')
      this.$router.push('/mv?id=' + id)
    }
  }
}
</script>

<style >
.playlist-container {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
