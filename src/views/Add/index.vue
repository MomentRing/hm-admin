<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form label-position="top" ref="form" :model="form" :rules="rules">
        <el-tabs tab-position="left" style="height: 200px" @tab-click="onClick">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="form.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="form.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="form.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="form.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
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
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数">
            <el-form-item
              v-for="item in dynamicCategories"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                  :label="item1"
                  border
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性">
            <el-form-item
              v-for="item in StaticCategories"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片">
            <el-upload
              class="upload-demo"
              action="http://liufusong.top:8899/api/private/v1/upload"
              :file-list="fileList"
              list-type="picture"
              :headers="tokenObj"
              :on-success="successOnload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容">
            <div class="fuwenben">
              <quill-editor v-model="form.goods_introduce" ref="myQuillEditor">
              </quill-editor>
            </div>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getGoodsCategories, getParamsList } from '@/api/categories'
import { addGoods } from '@/api/goods'
export default {
  created () {
    this.getGoodsCategories()
    this.getParamsList('many')
    this.getStaticParamsList('only')
  },
  data () {
    return {
      tokenObj: { Authorization: this.$store.state.user.token },
      fileList: [],
      checkList: [],
      categoriesId: 0,
      dynamicCategories: [],
      StaticCategories: [],
      active: 0,
      categoriesList: [],
      value: [],
      form: {
        goods_name: '',
        goods_cat: '',
        goods_price: '0',
        goods_number: '0',
        goods_weight: '0',
        goods_introduce: '',
        attrs: [],
        pics: []
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onClick (tab) {
      this.active = tab.index - 0
    },
    handleChange (value) {
      console.log(value)
      this.form.goods_cat = value.join(',')
      this.categoriesId = value[2]
      this.getParamsList('many')
      this.getStaticParamsList('only')
    },
    async getGoodsCategories () {
      try {
        const res = await getGoodsCategories()
        console.log(res)
        this.categoriesList = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    async getParamsList (type) {
      try {
        const res = await getParamsList(this.categoriesId, type)
        console.log(res.data.data)
        this.dynamicCategories = res.data.data
        console.log(this.dynamicCategories)
        this.dynamicCategories.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
        })
      } catch (err) {
        console.log(err)
      }
    },
    async getStaticParamsList (type) {
      try {
        const res = await getParamsList(this.categoriesId, type)
        console.log(res)
        this.StaticCategories = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    successOnload (response) {
      console.log(response)
      this.form.pics.push({
        pic: response.data.tmp_path
      })
    },
    addGoods () {
      this.dynamicCategories.forEach(item => {
        this.form.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_value
        })
      })
      this.StaticCategories.forEach(item => {
        this.form.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_value
        })
      })
      console.log(this.form)
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const res = await addGoods(this.form)
            console.log(res)
            this.$router.push('/goods')
          } catch (err) {
            console.log(err)
            this.$message.error('添加失败')
          }
          this.$message.success('添加商品成功')
        } else {
          this.$message.error('请填写必要数据')
          return false
        }
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
.el-steps {
  margin: 15px 0;
}

.el-checkbox {
  margin: 0 0 0 10px;
}
.fuwenben {
  height: 366px;
  margin: 10px 0;
}
.quill-editor {
  height: 366px;
  /deep/.ql-toolbar {
    height: 66px;
  }
  /deep/.ql-container {
    height: 300px;
  }
}
/deep/.el-tabs {
  height: 100% !important;
}
</style>
