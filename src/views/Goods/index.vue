<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="inputGoods"
            class="input-with-select"
            clearable
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="$router.push('goods/add')">
            添加商品
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsData" style="width: 100%" stripe border>
        <el-table-column prop="index" label="#" width="48">
          <template v-slot="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="600">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          min-width="127"
        >
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" min-width="127">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" min-width="127">
        </el-table-column>
        <!-- 表格操作 -->
        <el-table-column prop="role_name" label="操作" width="190">
          <template v-slot="scope">
            <!-- 编辑用户按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="isEditorGoodsDialogShow = true"
            >
              编辑
            </el-button>
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoods(scope.row.goods_id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 编辑商品提交弹出层 -->
    <el-dialog title="编辑商品" :visible.sync="isEditorGoodsDialogShow">
      <el-form :model="editorForm" label-width="80px" ref="editorForm">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model.trim="editorForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model.trim="editorForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model.trim="editorForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model.trim="editorForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="goods_introduce">
          <el-input v-model.trim="editorForm.goods_introduce"></el-input>
        </el-form-item>
        <el-form-item label="上传的图片临时路径" prop="pics">
          <el-input v-model.trim="editorForm.pics"></el-input>
        </el-form-item>
        <el-form-item label="商品的参数" prop="attrs">
          <el-input v-model.trim="editorForm.attrs"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditorGoodsDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="editorGoods"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, delGoods, editorGoods } from '@/api/goods'
export default {
  name: 'Users',
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      inputGoods: '',
      pagenum: 1,
      pagesize: 5,
      total: 0,
      currentPage: 1,
      // 编辑商品弹出层是否显示
      isEditorGoodsDialogShow: false,
      goodsData: [],
      editorForm: {
        id: '',
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: '',
        attrs: ''
      }
    }
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList () {
      try {
        const res = await getGoodsList({
          query: this.inputGoods,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        console.log(res)
        this.goodsData = res.data.data.goods
        this.total = res.data.data.total
      } catch (err) {
        console.log(err)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsList()
    },

    // 条件查询用户
    searchGoods () {
      this.getGoodsList({
        query: this.inputGoods,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
    },
    // 编辑用户资料
    async editorGoods () {
      try {
        const res = await editorGoods(this.editorForm)
        console.log(res)
        this.isEditorGoodsDialogShow = false
        this.getGoodsList()
      } catch (err) {
        console.log(err)
      }
    },
    // 删除单个用户
    delGoods (id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await delGoods(id)
          this.getGoodsList()
        } catch (err) {
          console.log(err)
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
* {
  font-size: 12px;
}
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
/deep/.el-table .el-table__cell {
  padding: 12px 0;
}
</style>
