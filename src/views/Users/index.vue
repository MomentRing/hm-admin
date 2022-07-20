<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="inputUser"
            class="input-with-select"
            clearable
            @clear="getUsers()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUser"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="isAddUserDialogShow = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userData" style="width: 100%" stripe border>
        <el-table-column prop="index" label="#" width="50">
          <template v-slot="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              @change="changeUserStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 表格操作 -->
        <el-table-column prop="role_name" label="操作" width="180">
          <template v-slot="scope">
            <!-- 编辑用户按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="
                isEditorUserDialogShow = true;
                editorForm.username = scope.row.username;
                editorForm.email = scope.row.email;
                editorForm.phone = scope.row.phone;
                editorForm.id = scope.row.id;
              "
            >
            </el-button>
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(scope.row.id)"
            >
            </el-button>
            <!-- 分配角色按钮 -->
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              size="mini"
              @click="assignRole(scope.$index, scope.row)"
            >
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
    <!-- 添加用户弹出层 -->
    <el-dialog title="添加用户对话框" :visible.sync="isAddUserDialogShow">
      <el-form :model="form" label-width="80px" :rules="rules" ref="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.trim="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addUsers"> 确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户提交弹出层 -->
    <el-dialog title="编辑用户" :visible.sync="isEditorUserDialogShow">
      <el-form
        :model="editorForm"
        label-width="80px"
        :rules="editorRules"
        ref="editorForm"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model.trim="editorForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="editorForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.trim="editorForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="editorUsers"> 确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 分配角色弹出层 -->
    <el-dialog title="分配角色" :visible.sync="isAssignRoleDialogShow">
      <el-form
        :model="editorForm"
        label-width="80px"
        :rules="editorRules"
        ref="editorForm"
      >
      </el-form>
      当前的用户：{{ currentName }}<br />
      当前的角色：{{ currentRole }}<br />
      分配新角色
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAssignRoleDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="onAssignRole"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, addUsers, changeUserStatus, editorUser, delUser, assignUserRole } from '@/api/user'
import { getRoles } from '@/api/roles'
export default {
  name: 'Users',
  created () {
    this.getUsers()
  },
  data () {
    return {
      currentName: '',
      currentRole: '',
      currentId: 0,
      inputUser: '',
      pagenum: 1,
      pagesize: 5,
      total: 0,
      currentPage: 1,
      // 添加用户弹出层是否显示
      isAddUserDialogShow: false,
      // 编辑用户信息弹出层是否显示
      isEditorUserDialogShow: false,
      // 分配角色弹出层是否显示
      isAssignRoleDialogShow: false,
      userData: [],
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editorForm: {
        username: '',
        id: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ],
        email: [
          { pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/, message: '手机号格式不正确', trigger: 'blur' }
        ]
      },
      // 编辑用户表单验证规则
      editorRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/, message: '手机号格式不正确', trigger: 'blur' }
        ]
      },
      options: [],
      value: ''
    }
  },
  methods: {
    // 获取用户数据列表
    async getUsers () {
      try {
        const res = await getUsers({
          query: this.inputUser,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        console.log(res)
        this.userData = res.data.data.users
        this.total = res.data.data.total
      } catch (err) {
        console.log(err)
      }
    },
    // 添加用户
    addUsers () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const res = await addUsers(this.form)
            console.log(res)
            this.isAddUserDialogShow = false
            if (res.data.meta.status === 400) {
              return this.$message.error('创建失败,用户名已存在')
            }
            this.getUsers()
            this.form = {
              username: '',
              password: '',
              email: '',
              mobile: ''
            }
            this.$message.success('创建成功')
          } catch (err) {
            console.log(err)
            this.$message.error('创建失败')
          }
        } else {
          return false
        }
      })
    },
    // 修改用户状态
    async changeUserStatus (obj) {
      try {
        const res = await changeUserStatus(obj.id, obj.mg_state)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    // 条件查询用户
    searchUser () {
      this.getUsers({
        query: this.inputUser,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
    },
    // 编辑用户资料
    async editorUsers () {
      try {
        const res = await editorUser(this.editorForm)
        console.log(res)
        this.isEditorUserDialogShow = false
        this.getUsers()
      } catch (err) {
        console.log(err)
      }
    },
    // 删除单个用户
    delUser (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await delUser(id)
          // console.log(res)
          this.getUsers()
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
    },
    // 分配用户角色
    assignRole (index, row) {
      this.isAssignRoleDialogShow = true
      this.currentName = row.username
      this.currentRole = row.role_name
      this.currentId = row.id
      this.getRoles()
    },
    // 获取角色列表
    async getRoles () {
      try {
        const res = await getRoles()
        console.log(res)
        this.options = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 分配用户角色
    async onAssignRole () {
      try {
        const res = await assignUserRole(this.currentId, this.value)
        if (res.data.meta.status === 200) {
          this.$message.success('分配成功')
        } else {
          this.$message.error(res.data.meta.msg)
        }

        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUsers()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUsers()
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
