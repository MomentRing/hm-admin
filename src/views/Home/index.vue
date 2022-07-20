<template>
  <div>
    <el-container class="container">
      <!-- header -->
      <el-header>
        <div class="left">
          <img src="@/assets/852ffb9ae6ce369824f8018f9748f64b.jpg" alt="" />
          <h1>听党指挥,能打胜仗,作风优良,纪律严明</h1>
        </div>

        <el-button
          @click="
            $router.push('/login');
            $store.commit('setUserMsg', {});
          "
          >退出</el-button
        >
      </el-header>

      <el-container>
        <!-- aside -->
        <el-aside width="200px" id="aside">
          <el-button @click="change">| | |</el-button>
          <el-menu
            background-color="#373d41"
            text-color="#fff"
            active-text-color="red"
            unique-opened
            router
            :collapse="isCollapse"
          >
            <el-submenu index="1">
              <template #title>
                <i class="el-icon-user-solid"></i>
                <span slot="title">用户管理</span>
              </template>
              <el-menu-item index="/users">
                <i class="el-icon-menu"></i> 用户列表
              </el-menu-item>
            </el-submenu>

            <el-submenu index="2">
              <template #title>
                <i class="el-icon-bank-card"></i>
                <span slot="title">权限管理</span>
              </template>
              <el-menu-item index="/roles">
                <i class="el-icon-menu"></i>角色列表
              </el-menu-item>
              <el-menu-item index="/rights">
                <i class="el-icon-menu"></i>权限列表
              </el-menu-item>
            </el-submenu>

            <el-submenu index="3">
              <template #title>
                <i class="el-icon-s-goods"></i>
                <span slot="title">商品管理</span>
              </template>
              <el-menu-item index="/goods">
                <i class="el-icon-menu"></i>商品列表
              </el-menu-item>
              <el-menu-item index="/params">
                <i class="el-icon-menu"></i>分类参数
              </el-menu-item>
              <el-menu-item index="/categories">
                <i class="el-icon-menu"></i>商品分类
              </el-menu-item>
            </el-submenu>

            <el-submenu index="4">
              <template #title>
                <i class="el-icon-document"></i>
                <span slot="title">订单管理</span>
              </template>
              <el-menu-item index="/orders">
                <i class="el-icon-menu"></i>订单列表
              </el-menu-item>
            </el-submenu>

            <el-submenu index="5">
              <template #title>
                <i class="el-icon-data-line"></i>
                <span slot="title">数据统计</span>
              </template>
              <el-menu-item index="5-1">
                <i class="el-icon-menu"></i>数据报表
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- main -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  created () { },
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    change () {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        document.getElementById('aside').style.width = '64px'
        document.getElementById('aside').style.transition = '.5s'
      } else {
        document.getElementById('aside').style.width = '200px'
      }
    }
  },
  computed: {

  },
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.container {
  height: 100vh;
  .el-header {
    background-color: red;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      img {
        width: 61px;
        height: 56px;
        margin-right: 15px;
      }
      h1 {
        font-size: 22px;
        color: white;
        font-weight: 400;
      }
    }

    .el-button {
      width: 70px;
      height: 40px;
    }
  }
  .el-aside {
    background-color: #373d41;
    .el-button {
      width: 100%;
      height: 40px;
      background-color: #033d09;
      border: none;
      color: white;
      border-radius: 0;
    }
  }
  .el-main {
    background-color: #eaedf1;
    max-height: 700px;
    overflow: auto;
  }
}
.el-menu {
  border-right: none;
}
</style>
