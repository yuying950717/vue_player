<template>
  <div class="songs-container">
    <div class="tab-bar"  @click="changeTab">
      <span class="item active">全部</span>
      <span class="item">华语</span>
      <span class="item">欧美</span>
      <span class="item">日本</span>
      <span class="item">韩国</span>
    </div>
    <!-- 底部的table -->
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
        <tr class="el-table__row" v-for="(item,index) in newSongs" :key="index">
          <td>{{index + 1 }}</td>
          <td>
            <div class="img-wrap">
              <img :src="item.album.picUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{item.name}}</span>
                <span class="iconfont icon-mv" v-if="item.mvid!==0" @click="goMV(item.mvid)"></span>
              </div>
              <span></span>
            </div>
          </td>
          <td>{{item.artists[0].name}}</td>
          <td>{{item.album.name}}</td>
          <td>{{item.duration | dateFormate}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'songs',
  data () {
    return {
      newSongs: [],
      activeName: '全部'
    }
  },
  created () {
    this.getNewSongs()
    const path = this.$route.path.substr(1)
    this.$parent.$parent.$parent.$parent.activeName = path
  },
  methods: {
    async getNewSongs () {
      const { data: res } = await this.$http.get('https://autumnfish.cn/top/song', { params: { type: this.type } })
      if (res.code !== 200) return this.$message.error('请求最新音乐失败')
      this.newSongs = res.data
      // console.log(this.newSongs)
    },
    changeTab (event) {
      // 1.给当前触发的span设置active属性
      if (event.target.className === 'item') {
        const spans = event.target.parentNode.children
        spans.forEach(element => {
          element.className = 'item'
        })
        event.target.className += ' active'
        // 2.获取当前span的内容
        this.activeName = event.target.innerText
        // console.log(this.activeName)
        this.getNewSongs()
      }
    },
    goMV (id) {
      // console.log('去mv详情页')
      this.$router.push('/mv?id=' + id)
    }
  },
  computed: {
    type () {
      if (this.activeName === '全部') {
        return 0
      } else if (this.activeName === '华语') {
        return 7
      } else if (this.activeName === '欧美') {
        return 96
      } else if (this.activeName === '日本') {
        return 8
      } else {
        return 16
      }
    }
  }
}
</script>

<style >

</style>
