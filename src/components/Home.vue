<template>
    <el-container class="home_container">
        <el-header class="top-container">
            <div class="left-box">
                <div class="icon-wrapper">
                    <span class="iconfont icon-home" @click="backToHome"></span>
                    <span class="iconfont icon-sami-select"></span>
                    <span class="iconfont icon-full-screen"></span>
                </div>
                <div class="history-wrapper">
                    <span class="iconfont icon-arrow-lift" @click="back"></span>
                    <span class="iconfont icon-arrow-right" @click="go"></span>
                </div>
            </div>
            <div class="right-box">
                <div class="el-input el-input--small el-input--prefix">
                    <input
                    type="text"
                    autocomplete="off"
                    placeholder="搜索"
                    class="el-input__inner" v-model="searchInput" @keyup.enter="search"/>
                    <span class="el-input__prefix">
                    <i class="el-input__icon el-icon-search"></i>
                    </span>
                </div>
            </div>
        </el-header>
        <el-container class="index-container">
            <el-aside width="200px">
                <el-menu
                :default-active="activeName"
                background-color="#ededed"
                text-color="#000"
                active-text-color="#DD6D60"
                router
                @select="activeChange">
                    <el-menu-item index="findMusic">
                        <span class="iconfont icon-find-music"></span>
                        <span slot="title" class="navTitle">发现音乐</span>
                    </el-menu-item>
                    <el-menu-item index="recommendMusic">
                        <span class="iconfont icon-music-list"></span>
                        <span slot="title" class="navTitle">推荐歌单</span>
                    </el-menu-item>
                    <el-menu-item index="newMusic">
                        <span class="iconfont icon-music"></span>
                        <span slot="title" class="navTitle">最新音乐</span>
                    </el-menu-item>
                    <el-menu-item index="newMV">
                        <span class="iconfont icon-mv"></span>
                        <span slot="title" class="navTitle">最新MV</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view ref="son" :key="$route.fullPath"></router-view>
            </el-main>
        </el-container>
        <el-footer class="player">
            <audio :src="audioURL" controls autoplay loop></audio>
        </el-footer>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      searchInput: '',
      activeName: 'findMusic',
      audioURL: ''
    }
  },
  methods: {
    activeChange (index) {
      this.activeName = index
    },
    search () {
      this.searchInput = this.searchInput.trim()
      if (this.searchInput.length === 0) {
        return this.$message.error('请输入内容')
      }
      // 不在搜索页则跳转到搜索歌曲页面
      if (this.$route.path !== '/searchRes') {
        this.$router.push('/searchRes?song=' + this.searchInput)
      } else {
        // console.log('当前在搜索页！')
        this.$router.push('/searchRes?song=' + this.searchInput)
        // 改变子组件的搜索值searchName，然后子组件监听到变化则调用相应的
        this.$refs.son.searchName = this.searchInput
        // console.log(this.$refs.son)
      }
    },
    backToHome () {
      this.$router.push('/findMusic')
    },
    back () {
      history.go(-1)
    },
    go () {
      history.go(1)
    }
  }
}
</script>

<style scoped>
.home_container {
  height: 100%;
}
.el-header {
    position: fixed;
    top: 0;
    height: 60px;
    width: 100%;
    background-color: #f9f9f9;
    z-index: 100;
}
/* .el-aside {
    height: 100%;
    background-color: #ededed;
} */
.el-footer {
    height: 60px !important;
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: #f1f3f4;
    padding: 0;
}
.goandback {
    line-height: 60px;
}
.goandback .el-col {
    border: none;
}
.el-menu-item {
    font-size: 18px;
}
.search {
    line-height: 60px;
    float: right;
}
.el-main{
    padding: 10px 20px;
}
.player audio {
    width: 100%;
    height: 60px;
    border-radius: none;
}
.navTitle {
    padding-left: 10px;
}
</style>
