<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editUserDialog" width="50%">
      <el-form ref="editUserRef" :model="editUser" :rules="editUserRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="xiugai()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%" @close="resetForm()">
      <el-form ref="addUserRef" :model="addUser" :rules="addUserRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="querycdt.query"
            class="input-with-select"
            clearable
            @clear="search()"
            @keyup.enter.native="search()"
          >
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addUserDialog =true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="140"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="160"></el-table-column>

        <el-table-column prop="mg_state" label="状态">
          <!-- info是自定义的名称  通过v-model="info.row"可以获得每一行的信息 -->
          <el-switch v-model="fo.row.mg_state" slot-scope="fo" @change="changeState(fo.row,fo.row.mg_state)" ></el-switch>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="info">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                class="el-icon-edit"
                size="small"
                @click="showEditDialog(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                class="el-icon-delete"
                size="small"
                @click="del(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                class="el-icon-setting"
                size="small"
                @click="showRoleDialog(info.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>

      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="setRoleDialog" width="50%">
        <el-form ref="setRoleRef" :model="setRole" label-width="120px" :rules="setRoleRules">
          <el-form-item label="当前用户:" prop="username">{{ setRole.username }}</el-form-item>
          <el-form-item label="当前角色:" prop="role_name">{{ setRole.role_name }}</el-form-item>
          <el-form-item label="分配新角色" prop="rid">
            <el-select v-model="setRole.rid" placeholder="请选择活动区域">
              <el-option v-for="v in roleList" :key="v.id" :label="v.roleName" :value="v.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="fenRole()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  methods: {
    async changeState(user,state){
        const {data :dt} = await this.$http.put(`users/${user.id}/state/${state}`)
        if(dt.meta.status !==200){
          return this.$message.error(dt.meta.msg)
        }
        this.$message.success(dt.meta.msg)
        this.getUserList()
    },
    fenRole() {
      this.$refs.setRoleRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.put(
            `users/${this.setRole.id}/role`,
            { rid: this.setRole.rid }
          );
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg);
          }
          this.$message.success(dt.meta.msg);
          this.setRoleDialog = false;
          this.getUserList();
        }
      });
    },
    //   fenrole() {
    //   // 表单校验
    //   this.$refs.setRoleRef.validate(async valid => {
    //     if (valid === true) {
    //       const { data: dt } = await this.$http.put(
    //         `users/${this.setRole.id}/role`,
    //         { rid: this.setRole.rid }
    //       )
    //       console.log(dt)
    //       if (dt.meta.status !== 200) {
    //         return this.$message.error(dt.meta.msg)
    //       }
    //       // 分配角色成功
    //       // 提示、关闭对话框、刷新
    //       this.$message.success(dt.meta.msg)
    //       this.setRoleDialog = false
    //       this.getUserList()
    //     }
    //   })
    // },

    //展开角色对话框
    async showRoleDialog(user) {
      const { data: dt } = await this.$http.get("roles");
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      this.roleList = dt.data;
      this.setRole = user;
      this.setRoleDialog = true;
    },

    xiugai() {
      this.$refs.editUserRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.put(
            "users/" + this.editUser.id,
            this.editUser
          );
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg);
          }
          this.$message.success(dt.meta.msg);
          this.editUserDialog = false;
          this.getUserList();
        }
      });
    },

    async showEditDialog(id) {
      this.editUserDialog = true;
      const { data: dt } = await this.$http.get("users/" + id);
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      this.editUser = dt.data;
    },

    del(id) {
      this.$confirm("确定要删除此用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete("users/" + id);
          console.log(dt);
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg);
          }
          this.$message.success(dt.meta.msg);

          // 小补充 如果当前页吗有一条数据 页吗减1(前提：当前页码大于1)
          if (this.userList.length === 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--;
          }
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //点击确定按钮 添加数据
    add() {
      //表单验证通过 才发送ajax
      this.$refs.addUserRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.post("users", this.addUser);
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg);
          }
          // 关闭弹框
          this.addUserDialog = false;
          this.$message.success(dt.meta.msg);
          this.getUserList();
        }
      });
    },

    // 关闭对话框 重置表单数据
    resetForm() {
      this.$refs.addUserRef.resetFields();
    },
    search() {
      this.getUserList();
    },
    //数据分页1
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.querycdt.pagesize = val;
      //发送ajax重新获取页面数据
      this.getUserList();
    },
    //数据分页2
    handleCurrentChange(val) {
      this.querycdt.pagenum = val;
      this.getUserList();
    },

    async getUserList() {
      const { data: dt } = await this.$http.get("/users", {
        params: this.querycdt
      });
      console.log(dt);
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      this.userList = dt.data.users;
      this.tot = dt.data.total;
    }
  },
  data() {
    //自定义校验手机号码
    var checkMobile = (rule, value, callback) => {
      // 手机号码规则：1开始,后接3|5|8|9|7,再后边跟9位数字
      // 正则表达式校验
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 校验失败(请给页面提示错误信息)
        return callback(new Error("手机号码格式不正确"));
      }
      // 校验成功，继续执行
      callback();
    };

    return {
      // 分配角色
      roleList: [],
      setRoleDialog: false,
      setRoleRules: {
        rid: [{ required: true, message: "角色必填", trigger: "change" }]
      },
      setRole: {
        username: "",
        rid: 0
      },

      //添加用户
      editUser: {
        username: "",
        mobile: "",
        email: ""
      },
      //添加用户的校验表单
      editUserRules: {
        mobile: [
          { required: true, message: "手机号码必填", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        email: [{ required: true, message: "邮箱必填", trigger: "blur" }]
      },
      editUserDialog: false,

      //添加数据的验证规则
      addUserRules: {
        username: [{ required: true, message: "用户名必填", trigger: "blur" }],
        password: [{ required: true, message: "密码必填", trigger: "blur" }],
        mobile: [
          { required: true, message: "手机号码必填", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        email: [{ required: true, message: "邮箱必填", trigger: "blur" }]
      },

      // 添加用户相关1
      addUser: {
        username: "",
        password: "",
        mobile: "",
        email: ""
      },

      addUserDialog: false,
      // 数据总条数
      tot: 0,
      userList: [],
      querycdt: {
        query: "",
        pagenum: 1,
        pagesize: 3
      }
    };
  }
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>
