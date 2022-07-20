<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button
        class="addbtn"
        type="primary"
        @click="isAddRoleDialogShow = true"
      >
        添加角色
      </el-button>
      <!-- 表格 -->
      <el-table :data="roleData" style="width: 100%" stripe border>
        <el-table-column label="#" width="50" type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdBottom', index === 0 ? 'bdTop' : '']"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              style="padding: 20px 50px"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index1) in item1.children"
                  :key="item2.id"
                  :class="index1 === 0 ? '' : 'bdTop'"
                >
                  <el-col :span="6">
                    <el-tag type="warning">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级标签 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      :disable-transitions="false"
                      @close="delRight(scope.row.id, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" width="50">
          <template v-slot="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 编辑用户按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini">
              编辑
            </el-button>
            <!-- 删除用户按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini">
              删除
            </el-button>
            <!-- 分配角色按钮 -->
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              size="mini"
              @click="assignRoleRights(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹出层 -->
    <el-dialog title="添加角色对话框" :visible.sync="isAddRoleDialogShow">
      <el-form :model="form" label-width="80px" :rules="rules" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addRoles"> 确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 确认删除权限对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹出层 -->
    <el-dialog title="分配权限" :visible.sync="isAssignRightShow">
      <el-tree
        :data="rightData"
        show-checkbox
        node-key="id"
        ref="tree"
        :props="defaultProps"
        :default-expand-all="true"
        :default-checked-keys="checkedKey"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAssignRightShow = false">取 消</el-button>
        <el-button type="primary" @click="assignRight"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, addRoles, delRoleRight, setRoleRight } from '@/api/roles'
import { getAllRights } from '@/api/rights'
export default {
  created () {
    this.getRoles()
  },
  data () {
    return {
      roleId: '',
      checkedKey: [],
      roleData: [],
      rightData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      isAddRoleDialogShow: false,
      isAssignRightShow: false,
      dialogVisible: false,
      form: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 获取所有角色
    async getRoles () {
      try {
        const res = await getRoles()
        console.log(res)
        this.roleData = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 添加角色
    async addRoles () {
      try {
        const res = await addRoles(this.form)
        console.log(res)
        this.isAddRoleDialogShow = false
        this.getRoles()
        this.$message.success('添加成功')
      } catch (err) {
        console.log(err)
      }
    },
    // 删除权限
    delRight (roleId, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delRoleRight(roleId, rightId)
          console.log(res)
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
    // 分配权限
    assignRoleRights (row) {
      this.getAllRights()
      this.isAssignRightShow = true
      console.log(row)
      this.roleId = row.id
      // console.log(row.children)
      // 三层循环将已选中的第三层权限的id放入checkedKey数组中
      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.checkedKey.push(item3.id)
          })
        })
      })

      // this.rightData = row.children
    },
    // 获取所有权限
    async getAllRights () {
      try {
        const res = await getAllRights('tree')
        console.log(res)
        this.rightData = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 分配权限
    async assignRight () {
      try {
        console.log('分配权限')
        this.isAssignRightShow = false
        console.log(...this.$refs.tree.getCheckedKeys())
        const res = await setRoleRight(this.roleId, this.$refs.tree.getCheckedKeys().join(','))
        console.log(res)
        this.getRoles()
        this.$message.success('更新成功')
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
}
.el-tag {
  margin: 7px;
}
.addbtn {
  margin-bottom: 10px;
}
.bdTop {
  border-top: 1px solid #eee;
}
.bdBottom {
  border-bottom: 1px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
