<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" style="margin-bottom: 10px" @click="onAdd"
        >添加分类</el-button
      >
      <table-tree
        style="margin-bottom: 10px"
        :data="tableData"
        :columns="columns"
        :show-row-hover="false"
        :show-index="true"
        index-text="#"
        border
        :selection-type="false"
        :expand-type="false"
      >
        <template slot="cat_deleted" scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="cat_level" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">
            二级
          </el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="handle">
          <el-button type="primary" icon="el-icon-edit" size="mini">
            编辑
          </el-button>
          <!-- 删除用户按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini">
            删除
          </el-button>
        </template>
      </table-tree>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 2, 4, 6, 10]"
          :page-size="4"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogAddFormVisible">
      <el-form :model="form" label-width="80px" :rules="rules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="value"
            :options="options"
            :props="{
              checkStrictly: true,
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              children: 'children',
            }"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCategories, addSort } from '@/api/categories'
export default {
  created () { this.getGoodsCategories() },
  data () {
    return {
      dialogAddFormVisible: false,
      form: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      tableData: [],
      pagenum: 1,
      pagesize: 4,
      currentPage: 1,
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'cat_deleted'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'cat_level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'handle'
        }
      ],
      rules: {
        cat_name: [
          { required: true, message: '分类名不能为空', trigger: 'blur' }
        ]
      },
      options: [],
      value: []
    }
  },
  methods: {
    async getGoodsCategories () {
      try {
        const res = await getGoodsCategories(3, this.pagenum, this.pagesize)
        console.log(res)
        this.total = res.data.data.total
        this.tableData = res.data.data.result
      } catch (err) {
        console.log(err)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getGoodsCategories()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsCategories()
    },
    async onAdd () {
      this.dialogAddFormVisible = true
      const res = await getGoodsCategories(2)
      console.log(res)
      this.options = res.data.data
    },
    async addFn () {
      this.form.cat_pid = this.value[this.value.length - 1]
      this.form.cat_level = this.value.length
      try {
        const res = await addSort(this.form)
        console.log(res)
        this.getGoodsCategories()
        this.dialogAddFormVisible = false
        this.$message.success('添加成功')
      } catch (err) {
        console.log(err)
      }
    }
  },
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
  .el-col {
    padding: 0 10px 0 0;
  }
  .el-table {
    margin: 15px 0;
  }
}
</style>
