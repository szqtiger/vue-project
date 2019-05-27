<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="tuichu">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px" :style="{width:isshow?'65px':'200px'}">
        <div class="toggle_bar" @click="isshow=!isshow">|||</div>

        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isshow"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu
            :index="item.id+''"
            style="width:200px"
            :style="{width:isshow?'65px':'200px'}"
            v-for="(item,k) in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="'iconfont icon-'+iconList[k]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item v-for="item2 in item.children" :key="item2.id" :index="item2.path">
              <i class="el-icon-menu"></i>
              <span>{{ item2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList();
  },

  methods: {
    tuichu() {
      this.$confirm("您确定要退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //清除token  重定向到登录页
          window.sessionStorage.removeItem("token");
          this.$router.push("/login");
        })
        .catch(() => {});
    },

    //发送ajax接收左侧导航栏信息
    async getMenuList() {
      const { data: dt } = await this.$http.get("/menus");
      // console.log(dt);
      // 此时显示 无效token 所以设置拦截器 给ajax请求带上token

      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      this.menuList = dt.data;
      //    console.log(dt.data)
    }
  },
  data() {
    return {
      iconList: ["user", "tijikongjian", "shangpin", "danju", "baobiao"],
      //左侧导航数据
      menuList: [],
      // 折叠开关
      isshow: false
    };
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    color: aliceblue;
    display: flex;
    align-items: center;
    padding: 0;
    padding-right: 20px;
    justify-content: space-between;
    .logo-box {
      color: aliceblue;
      font-size: 22px;
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle_bar {
      color: #eaedf1;
      text-align: center;
      background-color: #4a5064;
      letter-spacing: 0.1em;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
