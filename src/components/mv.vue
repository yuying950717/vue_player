<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video
          controls
          :src="mvUrl"
        ></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="mvDetail.cover" alt="" />
          </div>
          <span class="name">{{mvDetail.artistName}}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{mvDetail.name}}</h2>
          <span class="date">发布：{{mvDetail.publishTime}}</span>
          <span class="number">播放：{{mvDetail.playCount | PlayCountFormate}}次</span>
          <p class="desc">
            {{mvDetail.desc}}
          </p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap" v-if="hotTotal !== 0">
        <p class="title">精彩评论<span class="number">({{hotTotal}})</span></p>
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
        <p class="title">最新评论<span class="number">({{total}})</span></p>
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
              <div class="re-content" v-if="item.parentCommentId !==0">
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
        :total="total"
        :current-page="page"
        :page-size="5"
        :limit="limit"
      >
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item,index) in recommentMV" :key="index" @click="toMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount | PlayCountFormate}}</div>
              </div>
              <span class="time">{{item.duration | dateFormate}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mv',
  data () {
    return {
      // 总条数
      total: 20,
      hotTotal: 0,
      // 页码
      page: 1,
      // 页容量
      limit: 10,
      mvId: 0,
      mvUrl: '',
      mvDetail: {},
      newComment: [],
      hotComment: [],
      recommentMV: [],
      hotFlag: true
    }
  },
  created () {
    this.mvId = this.$route.query.id
    this.getMVurl()
    this.getMvDetail()
    this.GetnewComment()
    this.getRecommentMV()
    // console.log(this.hotComment.length)
    this.$parent.$parent.$parent.$parent.activeName = ''
  },
  methods: {
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.page = val
      this.GetnewComment()
    }, // 获取mv的地址
    async getMVurl () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/mv/url', { params: { id: this.mvId } })
      if (res.code !== 200) return this.$message.error('请求mv地址失败')
      this.mvUrl = res.data.url
    },
    async getMvDetail () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/mv/detail', { params: { mvid: this.mvId } })
      if (res.code !== 200) return this.$message.error('请求mv详情失败')
      this.mvDetail = res.data
      // console.log(this.mvDetail)
    },
    async GetnewComment () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/comment/mv', { params: { id: this.mvId, limit: 5, offset: this.offset } })
      if (res.code !== 200) return this.$message.error('请求mv最新评论失败')
      this.newComment = res.comments
      if (this.hotFlag) {
        this.hotComment = res.hotComments
        this.hotTotal = this.hotComment.length
      }
      this.total = res.total
      this.hotFlag = false
      // console.log(this.hotComment)
    },
    async getRecommentMV () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/simi/mv', { params: { mvid: this.mvId } })
      if (res.code !== 200) return this.$message.error('请求mv的相关推荐mv失败')
      this.recommentMV = res.mvs
    },
    toMv (id) {
      this.$router.push(`/mv?id=${id}`)
    }
  },
  computed: {
    offset () {
      return (this.page - 1) * 5
    }
  }
}
</script>

<style>
.mv-container {
    max-width: 1100px;
    margin: 0 auto;
}
</style>
