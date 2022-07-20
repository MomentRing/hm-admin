<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>
      <div style="margin: 10px 0px">
        选择商品分类:
        <el-cascader
          v-model="value"
          :options="categoriesList"
          :props="{
            expandTrigger: 'hover',
            label: 'cat_name',
            value: 'cat_id',
          }"
          @change="handleChange"
        ></el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <el-button
            type="primary"
            :disabled="value.length !== 3"
            @click="dialogFormVisible = true"
          >
            {{ activeName === "first" ? "添加参数" : "添加属性" }}
          </el-button>
          <el-table :data="manyCategories" style="width: 100%" border>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染Tag标签 -->
                {{ scope.row }}
                <el-tag
                  :key="tag.attr_id"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="true"
                >
                  {{ tag }}
                </el-tag>
                <!-- 添加标签Tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="48px">
            </el-table-column>
            <el-table-column prop="attr_name" label="分类名称">
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <!-- 编辑用户按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini">
                  编辑
                </el-button>
                <!-- 删除用户按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" :disabled="value.length !== 3">
            {{ activeName === "first" ? "添加参数" : "添加属性" }}
          </el-button>
          <el-table :data="onlyCategories" style="width: 100%" border>
            <el-table-column type="expand"></el-table-column>

            <el-table-column type="index" label="#" width="48px">
            </el-table-column>
            <el-table-column prop="attr_name" label="分类名称">
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <!-- 编辑用户按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini">
                  编辑
                </el-button>
                <!-- 删除用户按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数弹出框 -->
    <el-dialog title="添加动态参数" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="addForm">
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="form.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCategories, getParamsList, editSubmitParams, addParams } from '@/api/categories'
export default {
  created () { this.getGoodsCategories() },
  data () {
    return {
      categoriesList: [],
      value: [],
      activeName: 'first',
      manyCategories: [],
      onlyCategories: [],
      inputVisible: false,
      inputValue: '',
      dialogFormVisible: false,
      form: { attr_name: '' },
      rules: {
        attr_name: [{ required: true, message: '请填写参数名', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getGoodsCategories () {
      try {
        const res = await getGoodsCategories()
        this.categoriesList = res.data.data
        console.log(this.categoriesList)
      } catch (err) {
        console.log(err)
      }
    },
    // 级联选择事件
    handleChange (value) {
      console.log(value)
      if (this.activeName === 'first') {
        this.getManyParams(this.value[2])
      } else {
        this.getOnlyParams(this.value[2])
      }
    },
    // 导航栏转换点击事件
    handleClick (tab, event) {
      console.log(tab, event)
      if (this.value.length !== 3) {
        this.$message.error('请选择三级分类')
      }
      if (this.activeName === 'first') {
        this.getManyParams(this.value[2])
      } else {
        this.getOnlyParams(this.value[2])
      }
    },

    async getManyParams (id) {
      try {
        const res = await getParamsList(id, 'many')
        res.data.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        this.manyCategories = res.data.data
        console.log(res)
        return res
      } catch (err) {
        console.log(err)
      }
    },
    async getOnlyParams (id) {
      try {
        const res = await getParamsList(id, 'only')
        res.data.data.forEach(item => { item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [] })
        this.onlyCategories = res.data.data
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    // 标签添加按下回车与失去焦掉都触发
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      try {
        const res = await editSubmitParams({
          id: this.value[2],
          attrId: row.attr_id,
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    // 按下按钮输入框显示
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 添加动态参数
    onClick () {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await addParams(this.value[2], this.form.attr_name, 'many')
            console.log(res)
            this.dialogFormVisible = false
          } catch (err) {
            console.log(err)
          }
        } else {
          this.$message.error('请填写必要数据')
          return false
        }
      })
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
.el-tag {
  margin: 5px;
}
/deep/.el-table__expanded-cell {
  padding: 20px 50px;
}
.input-new-tag {
  width: 120px;
}
</style>
