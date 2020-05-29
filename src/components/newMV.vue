<template>
  <div class="mvs-container">
    <div class="filter-wrap">
      <div class="seciton-wrap">
        <span class="section-type">地区:</span>
        <ul class="tabs-wrap" @click="changeSettionTab">
          <li class="tab">
            <span class="title active">全部</span>
          </li>
          <li class="tab">
            <span class="title">内地</span>
          </li>
          <li class="tab">
            <span class="title">港台</span>
          </li>
          <li class="tab">
            <span class="title">欧美</span>
          </li>
          <li class="tab">
            <span class="title">日本</span>
          </li>
          <li class="tab">
            <span class="title">韩国</span>
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap" @click="changeTypeTab">
          <li class="tab">
            <span class="title active">全部</span>
          </li>
          <li class="tab">
            <span class="title">官方版</span>
          </li>
          <li class="tab">
            <span class="title">原声</span>
          </li>
          <li class="tab">
            <span class="title">现场版</span>
          </li>
          <li class="tab">
            <span class="title">网易出品</span>
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap" @click="changeOrderTab">
          <li class="tab">
            <span class="title active">上升最快</span>
          </li>
          <li class="tab">
            <span class="title">最热</span>
          </li>
          <li class="tab">
            <span class="title">最新</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- mv容器 -->
    <!-- 推荐MV -->
    <div class="mvs">
      <div class="items">
        <div class="item" v-for="(item,index) in newMVs" :key="index" @click="toMv(item.id)" >
          <div class="img-wrap">
            <img :src="item.cover" alt="" />
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{item.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="singer">{{item.artistName}}</div>
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
        :page-size="limit"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mvs',
  data () {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 页容量
      limit: 12,
      settionActive: '全部',
      typeActive: '全部',
      orderActive: '上升最快',
      newMVs: []
    }
  },
  created () {
    this.getNewMVs()
    const path = this.$route.path.substr(1)
    this.$parent.$parent.$parent.$parent.activeName = path
  },
  methods: {
    toMv (id) {
      this.$router.push(`/mv?id=${id}`)
    },
    handleCurrentChange (val) {
      this.page = val
      this.getNewMVs()
    },
    changeSettionTab (event) {
      // 1.给当前触发的span设置active属性
      if (event.target.className === 'title') {
        this.page = 1
        // 让当前点的为active，其他的不要
        event.target.parentNode.parentNode.children.forEach(item => {
          item.children[0].className = 'title'
        })
        event.target.className += ' active'
        this.settionActive = event.target.innerText
        this.getNewMVs()
      }
    },
    changeOrderTab (event) {
      // 1.给当前触发的span设置active属性
      if (event.target.className === 'title') {
        this.page = 1
        // 让当前点的为active，其他的不要
        event.target.parentNode.parentNode.children.forEach(item => {
          item.children[0].className = 'title'
        })
        event.target.className += ' active'
        this.orderActive = event.target.innerText
        this.getNewMVs()
      }
    },
    changeTypeTab (event) {
      // 1.给当前触发的span设置active属性
      if (event.target.className === 'title') {
        this.page = 1
        // 让当前点的为active，其他的不要
        event.target.parentNode.parentNode.children.forEach(item => {
          item.children[0].className = 'title'
        })
        event.target.className += ' active'
        this.typeActive = event.target.innerText
        this.getNewMVs()
      }
    },
    async getNewMVs () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/mv/all', { params: { area: this.settionActive, type: this.typeActive, order: this.orderActive, limit: this.limit, offset: this.offset } })
      if (res.code !== 200) return this.$message.error('请求歌曲播放地址失败')
      this.newMVs = res.data
      if (res.count) {
        this.total = res.count
      }
    }
  },
  computed: {
    offset () {
      return (this.page - 1) * this.limit
    }
  }
}
</script>

<style >

</style>
