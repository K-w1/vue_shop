<template>
  <el-container class="wrap">
    <el-header>
      <img src="../assets/heima.png" alt="">
      <span>电商管理后台</span>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左边侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-btn" @click="collapseMenu">|||</div>
        <el-menu
          :default-active="activePath"
          :router="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          background-color="#373d41"
          text-color="#fff"
          active-text-color="#409eff">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+each.path" v-for="each in item.children" :key="each.id" @click="saveNavState('/'+each.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{each.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data(){
      return{
        menuList:[],
        iconsObj:{
          '125':'iconfont icon-user',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao'
        },
        isCollapse:false,
        activePath:''
      }
    },
    created(){
      this.getMenuList()
      this.activePath=sessionStorage.getItem('activePath')
    },
    methods:{
      logOut(){
        sessionStorage.clear()
        this.$router.push('/')
      },
      async getMenuList(){
        let {data:res}=await this.$http.get('menus')
        console.log(res)
        if(res.meta.status!=200) return this.$message.error(res.meta.msg)
        this.menuList=res.data
      },
      collapseMenu(){
        this.isCollapse=!this.isCollapse
      },
      saveNavState(activePath){
        sessionStorage.setItem('activePath',activePath)
        this.activePath=activePath
      }
    }
  }
</script>

<style lang="less" scoped>
.wrap{
  height: 100%;
  .el-header{
    background-color: #373d41;
    display: flex;
    align-items: center;
    img{
      height: 70%;
    }
    span{
      color: #fff;
      font-size: 18px;
      margin: 0 auto 0 20px;
    }
  }
  .el-container{
    .el-aside{
      background-color: #333744;
      .toggle-btn{
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
      }
      .el-menu{
        border-right: none;
      }
    }
    .el-main{
      background-color: #eaedf1;
    }
  }
}
.iconfont{
  margin-right: 10px;
}
</style>