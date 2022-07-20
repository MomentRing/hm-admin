<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column prop="date" label="#" width="50">
          <template v-slot="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">
              等级二
            </el-tag>
            <el-tag type="warning" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getAllRights } from '@/api/rights'
export default {
  async created () {
    const res = await getAllRights('list')
    console.log(res)
    this.tableData = res.data.data
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {},
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.box-card {
  width: 100%;
  margin: 15px 0;
}
</style>
